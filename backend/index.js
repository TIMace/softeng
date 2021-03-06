'use strict'

const express = require('express')
    , https = require('https')
    , bodyParser = require('body-parser')
    , app = express()
    , elasticsearch = require('elasticsearch')
    , client = new elasticsearch.Client({
        host: 'localhost:9200',
        log: 'info'
    })

    , nodemailer = require('nodemailer')
    , sha256 = require('sha256')

    , fs = require('fs')
    , lazy = require('lazy.js')
    , { spawn } = require('child_process')

    , config = require('./config').config

    , elasticfun = require('./elasticfun').elasticfun

    , models = require('./models')
    , sequelize = models.sequelize
    , User = models.User
    , Provider = models.Provider
    , Transaction = models.Transaction
    , Evnt = models.Evnt
    , Category = models.Category
    , EventCategory = models.EventCategory

    // Helper function for flattening array
    , flatten = arr => arr.reduce((acc, next) => acc.concat(Array.isArray(next) ? flatten(next) : next.category), [])

    , writeFile = (path, buffer, permission) => {
        permission = permission || 438; // 0666
        var fileDescriptor;

        try {
            fileDescriptor = fs.openSync(path, 'w', permission);
        } catch (e) {
            fs.chmodSync(path, permission);
            fileDescriptor = fs.openSync(path, 'w', permission);
        }

        if (fileDescriptor) {
            fs.writeSync(fileDescriptor, buffer, 0, buffer.length, 0);
            fs.closeSync(fileDescriptor);
        }
    }

    , createRandomPassword = () => {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    }

    , options = {
        key: fs.readFileSync( '/etc/ssl/private/apache-selfsigned.key' ),
        cert: fs.readFileSync( '/etc/ssl/certs/apache-selfsigned.crt' ),
        requestCert: false,
        rejectUnauthorized: false
    }


// Middleware
// Support JSON encoded bodies
// Support extended URL encoded bodies
app.use(bodyParser.json())
app.use(bodyParser.urlencoded( { limit : '10mb', extended : true } ))
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})


/**
 * * * * * * * * * * * * * * * * * * * * ROUTES * * * * * * * * * * * * * * * * * * * *
 *
 * - DBSchema
 *      - GET (Get all Schemas in DB)
 *
 * - USER
 *      - GET (Get all data for respective user. Use for login)
 *      - POST (Create user giving required parameters)
 *      - PUT (Update user giving required parameters)
 *
 * - PROVIDER
 *      - GET (Get all data for respective provider. Use for login)
 *      - POST (Create provider giving required parameters)
 *      - PUT (Update provider giving required parameters)
 * * * * * * * * * * * * * * * * * * * ** * * * * * * * * * * * * * * * * * * * * * * */

app.get('/DBSchema', (req, res) => {
    res.json({
        User : Object.keys(User.attributes),
        Provider : Object.keys(Provider.attributes),
        Transaction : Object.keys(Transaction.attributes),
        Evnt : Object.keys(Evnt.attributes),
        Category : Object.keys(Category.attributes),
        EventCategory : Object.keys(EventCategory.attributes),
    })
})


/**
 * SEARCH
 */
app.get('/search/:term', (req, res) => {
    elasticfun.searchEvent(client, res, { term : req.params.term } )
})



/**
 * USER
 */
app.get('/user/:username/:password', (req, res) => {
    User
        .findOne( { where : { username : req.params.username, user_password : req.params.password, user_active : true } } ).then((user) => {
            res.json(user)
        })
        .catch((err) => {
            res.json( { error : err } )
        })
})

app.get('/user/events/:username/:password', (req, res) => {
    User
        .findOne( { where : { username : req.params.username, user_password : req.params.password, user_active : true } } ).then((user) => {
            if (user === null)
                res.json(user)
            else {
                Transaction
                    .findAll( {
                        where : { transaction_user_id : user.user_id },
                        include : [ { model : Evnt } ]
                    } ).then((transactions) => {
                        res.json(transactions)
                    })
            }
        })
        .catch((err) => {
            res.json( { error : err } )
        })
})


app.get('/user/event/:username/:password/:event_id', (req, res) => {
    User
        .findOne( { where : { username : req.params.username, user_password : req.params.password, user_active : true } } ).then((user) => {
            if (user === null)
                res.json(user)
            else {
                Transaction
                    .findAll( {
                        where : { transaction_user_id : user.user_id, transaction_event_id : req.params.event_id },
                        include : [ { model : Evnt } ]
                    } ).then((transactions) => {
                        res.json(transactions)
                    })
            }
        })
        .catch((err) => {
            res.json( { error : err } )
        })
})


// USER GET (BUY) NEW TICKET
app.get('/user/buy/:username/:password/:event_id', (req, res) => {
    User
        .findOne( { where : { username : req.params.username, user_password : req.params.password, user_active : true } } ).then((user) => {
            if (user === null)
                res.json(user)
            else {
                Evnt
                    .findOne( { where : { event_id : req.params.event_id } } ).then((evnt) => {
                        if (evnt === null)
                            res.json(evnt)
                        else if (user.user_credits < evnt.event_price)
                            res.json( { 'error' : 'Οι πόντοι του χρήστη δεν επαρκούν.' } )
                        else if ((new Date(evnt.event_date)) < (new Date()))
                            res.json( { 'error' : 'Το event έχει λήξει' } )
                        else {
                            if (evnt.event_price >= 2000)
                                user.user_credits -= evnt.event_price - 100
                            else
                                user.user_credits -= evnt.event_price
                            user.save( { fields : ['user_credits'] } )
                            evnt.event_available_tickets -= 1;
                            evnt.save( { fields : ['event_available_tickets'] } )
                            Transaction
                                .create( { transaction_event_id : evnt.event_id, transaction_user_id : user.user_id,
                                    transaction_points : evnt.event_price }).then((trans) => {
                                        res.json( { user : user, event : evnt, transaction : trans } )
                                })
                                .catch((err) => {
                                    res.json( { error : err } )
                                })
                        }
                    })
                    .catch((err) => {
                        res.json( { error : err } )
                    })
            }
        })
        .catch((err) => {
            res.json( { error : err } )
        })
})

app.get('/user_reset/:email', (req, res) => {
    const new_passwd = createRandomPassword()
    User
        .findOne( { where : { user_email : req.params.email, user_active : true } } ).then((user) => {
            if (user === null)
                res.json(null)
            else {
                res.json(true)
                user.user_password = sha256(new_passwd)
                user.save( { fields : ['user_password'] } )
                nodemailer.createTestAccount((err, account) => {
                    let transporter = nodemailer.createTransport({
                        service : 'gmail',
                        auth: {
                            user: 'me.kourazeis.poly@gmail.com',
                            pass: config.db_pass
                        }
                    })
                    let mailOptions = {
                        from: '"Leonidas o 300os" <me.kourazeis.poly@gmail.com>',
                        to: req.params.email,
                        subject: 'Password reset ✔',
                        text: 'Your password has been reset to : ' + new_passwd,
                        html: 'Your password has been reset to : <b>' + new_passwd + '</b>'
                    }
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) { return console.log(error) }
                        console.log('Message sent: %s', info.messageId)
                        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
                    })
                })
            }
        })
})


// USER UPDATE (PUT) CREDITS
app.post('/user/add_credits', (req, res) => {
    const uname = req.body.username
        , passwd = req.body.password
        , amount = parseInt(req.body.amount)

    User
        .findOne( { where : { username : uname, user_password : passwd, user_active : true } } ).then((user) => {
            if (user === null)
                res.json(user)
            else {
                user.user_credits += amount
                user.save( { fields : ['user_credits'] } )
                res.json(user)
            }
        })
})


// USER CREATE (POST)
app.post('/user', (req, res) => {
    const uname = req.body.username
        , passwd = req.body.password
        , email = req.body.email
        , fname = req.body.fname
        , lname = req.body.lname
        , addr = req.body.address
        , phnum = req.body.phone_num

    User
        .findOrCreate( {
            where : { username : uname, user_password : passwd },
            defaults : { user_email : email, user_first_name : fname, user_last_name : lname, user_address : addr, user_phone_num : phnum } } )
        .spread((user, created) => {
            if (created)
                res.json(user.get( {plain : true }))
            else
                res.json(null)
        })
        .catch((err) => {
            res.json( { error : err } )
        })
})


// USER UPDATE (PUT) DATA
app.post('/user/update', (req, res) => {
    const uname = req.body.username
        , passwd = req.body.password
        , new_passwd = req.body.new_password
        , email = req.body.email
        , addr = req.body.address
        , phnum = req.body.phone_num

    User
        .findOne( { where : { username : uname, user_password : passwd, user_active : true } } ).then((user) => {
            if (user === null)
                res.json(user)
            else {
                user.user_password = new_passwd
                user.user_email = email
                user.user_address = addr
                user.user_phone_num = phnum
                user.save( { fields : ['user_password', 'user_email', 'user_address', 'user_phone_num'] } )
                res.json(user)
            }
        })
})


/**
 * PROVIDER
 */
app.get('/provider/:username/:password', (req, res) => {
    Provider
        .findOne( { where : { provider_username : req.params.username, provider_password : req.params.password, provider_active : true } } ).then((provider) => {
            res.json(provider)
        })
        .catch((err) => {
            res.json( { error : err } )
        })
})


app.get('/provider/events/:username/:password/', (req, res) => {
    Provider
        .findOne( { where : { provider_username : req.params.username, provider_password : req.params.password, provider_active : true } } ).then((provider) => {
            if (provider === null)
                res.json(provider)
            else {
                Evnt
                    .findAll( { where : { event_provider_id : provider.provider_id } } ).then((evnts) => {
                        res.json(evnts)
                    })
                    .catch((err) => {
                        res.json( { error : err } )
                    })
            }
        })
        .catch((err) => {
            res.json( { error : err } )
        })
})


app.get('/provider/credits/:username/:password/', (req, res) => {
    Provider
        .findOne( { where : { provider_username : req.params.username, provider_password : req.params.password, provider_active : true } } ).then((provider) => {
            if (provider === null)
                res.json(provider)
            else {
                provider.provider_credits = 0
                provider.save( { fields : ['provider_credits'] } )
                res.json(provider)
            }
        })
        .catch((err) => {
            res.json( { error : err } )
        })
})


app.get('/provider/event/:username/:password/:event_id', (req, res) => {
    Provider
        .findOne( { where : { provider_username : req.params.username, provider_password : req.params.password, provider_active : true } } ).then((provider) => {
            if (provider === null)
                res.json(provider)
            else {
                Transaction
                    .findAll( {
                        where : { transaction_event_id : req.params.event_id },
                        include : [ { model : User, attributes: ['user_email', 'user_first_name','user_last_name', 'user_phone_num'] } ]
                    } ).then((transactions) => {
                        res.json(transactions)
                    })
                    .catch((err) => {
                        res.json( { error : err } )
                    })
            }
        })
        .catch((err) => {
            res.json( { error : err } )
        })
})


app.post('/provider', (req, res) => {
    const uname = req.body.username
        , passwd = req.body.password
        , email = req.body.email
        , fname = req.body.fname
        , lname = req.body.lname
        , cname = req.body.cname
        , addr = req.body.address
        , phnum = req.body.phone_num
        , ssn = req.body.ssn
        , baccount = req.body.baccount

    Provider
        .findOrCreate( {
            where : { provider_username : uname, provider_password : passwd },
            defaults : { provider_email : email, provider_first_name : fname, provider_last_name : lname, provider_comp_name : cname,
                provider_address : addr, provider_phone_num : phnum, provider_ssn : ssn, provider_bank_account : baccount } } )
        .spread((provider, created) => {
            if (created)
                res.json(provider.get( {plain : true }))
            else
                res.json(null)
        })
        .catch((err) => {
            res.json( { error : err } )
        })
})


app.post('/provider/update', (req, res) => {
    const uname = req.body.username
        , passwd = req.body.password
        , new_passwd = req.body.new_password
        , email = req.body.email
        , addr = req.body.address
        , phnum = req.body.phone_num
        , baccount = req.body.baccount

    Provider
        .findOne( { where : { provider_username : uname, provider_password : passwd, provider_active : true } } ).then((provider) => {
            if (provider === null)
                res.json(provider)
            else {
                provider.provider_password = new_passwd
                provider.provider_email = email
                provider.provider_address = addr
                provider.provider_phone_num = phnum
                provider.provider_bank_account = baccount
                provider.save( { fields : ['provider_password', 'provider_email', 'provider_address', 'provider_phone_num', 'provider_bank_account'] } )
                res.json(provider)
                Evnt.findAll( { where : { event_provider_id : provider.provider_id } } ).then((evnts) => {
                    lazy(evnts)
                        .each((evnt) => {
                            elasticfun.updateEvent(client, {
                                event_id : evnt.event_id,
                                body : {
                                    provider_email : provider.provider_email,
                                    provider_address : provider.provider_address,
                                    provider_phone_num : provider.provider_phone_num
                                }
                            } )
                        })
                })
            }
        })
        .catch((err) => {
            res.json( { error : err } )
        })
})



/**
 * Event
 */
// GET ALL EVENTS
app.get('/event', (req, res) => {
    Evnt
        .findAll().then((evnts) => {
            res.json(evnts)
        })
        .catch((err) => {
            res.json( { error : err } )
        })
})

// GET EVENT WITH id
app.get('/event/:id', (req, res) => {
    Evnt
        .findOne( {
            where : { event_id : parseInt(req.params.id) },
            include : [ { model : Provider } ]
        } ).then((evnt) => {
            if (evnt === null)
                res.json(evnt)
            else {
                EventCategory
                    .findAll( {
                        where : { ev_cat_event_id : evnt.event_id },
                        include : [ { model : Category } ]
                    } ).then((ev_cat) => {
                        const categories = flatten(ev_cat)
                            , ret_evnt = {
                                event_id : evnt.event_id, event_price : evnt.event_price, event_name : evnt.event_name,
                                event_description : evnt.event_description, event_date : evnt.event_date, event_provider_id : evnt.event_provider_id,
                                event_available_tickets : evnt.event_available_tickets, event_lattitude : evnt.event_lattitude, event_longtitude : evnt.event_longtitude,
                                event_minimum_age : evnt.event_minimum_age, event_maximum_age : evnt.event_maximum_age, event_map_data : evnt.event_map_data,
                                event_is_paid : evnt.event_is_paid, createdAt : evnt.createdAt
                            }
                            , provider = { provider_email : evnt.provider.provider_email,
                                provider_first_name : evnt.provider.provider_first_name,
                                provider_last_name : evnt.provider.provider_last_name,
                                provider_comp_name : evnt.provider.provider_comp_name,
                                provider_address : evnt.provider.provider_address,
                                provider_phone_num : evnt.provider.provider_phone_num }
                        res.json( { event : ret_evnt, categories : categories, provider : provider } )
                    })
                    .catch((err) => {
                        res.json( { error : err } )
                    })
            }
        })
        .catch((err) => {
            res.json( { error : err } )
        })
})


// CREATE NEW EVENT
app.post('/event', (req, res) => {
    const uname = req.body.username
        , passwd = req.body.password
        , ev_price = req.body.ev_price
        , ev_name = req.body.ev_name
        , ev_descr = req.body.ev_descr
        , ev_date = req.body.ev_date
        , ev_avail_tick = req.body.ev_avail_tick
        , ev_latt = req.body.ev_latt
        , ev_long = req.body.ev_long
        , ev_min_age = req.body.ev_min_age
        , ev_max_age = req.body.ev_max_age
        , ev_mdata = req.body.ev_mdata
        , ev_cats = req.body.ev_cats
        , ev_base64 = req.body.ev_base64

    Provider
        .findOne( { where : { provider_username : uname, provider_password : passwd, provider_active : true } } ).then((provider) => {
            if (provider === null)
                res.json(provider)
            else {
                Evnt
                    .create( { event_price : ev_price, event_name : ev_name, event_description : ev_descr, event_date : ev_date,
                        event_provider_id : provider.provider_id, event_available_tickets : ev_avail_tick, event_lattitude : ev_latt,
                        event_longtitude : ev_long, event_minimum_age : ev_min_age, event_maximum_age : ev_max_age,
                        event_map_data : ev_mdata } ).then((evnt) => {
                            // Send response. No need to wait
                            res.json(evnt)
                            // Add event to ElasticSearch
                            Category
                                .findAll( { where : { category_id : ev_cats } } ).then((categories) => {
                                    elasticfun.addEvent(client, { evnt : evnt, categories : categories, provider : provider } )
                                })
                                .catch((err) => {
                                    console.log( { 'EventCategory Creation Error' : err } )
                                })
                            const buf = Buffer.from(ev_base64.replace(/ /g, '+'), 'base64')
                                , filename = config.image_dir + evnt.event_id + '.image.png'
                            writeFile(filename, buf)
                            let image_creation = spawn('python3', [ config.binary_dependence, filename, filename, config.image_dir ])
                            image_creation.stdout.on('data', (data) => { console.log(`stdout: ${data}`) })
                            image_creation.stderr.on('data', (data) => { console.log(`stderr: ${data}`) })
                            image_creation.on('close', (code) => { console.log(`child process exited with code ${code}`) })
                            // Create category associations
                            ev_cats
                                .forEach((ec) => {
                                    EventCategory
                                        .create( { ev_cat_event_id : evnt.event_id, ev_cat_category_id : ec })
                                        .catch((err) => {
                                            console.log( { 'EventCategory Creation Error' : err } )
                                        })
                                })
                    })
            }
        })
        .catch((err) => {
            res.json( { error : err } )
        })

})

app.post('/event/update', (req, res) => {
    const uname = req.body.username
        , passwd = req.body.password
        , ev_id = req.body.ev_id
        , ev_price = req.body.ev_price
        , ev_name = req.body.ev_name
        , ev_descr = req.body.ev_descr
        , ev_date = req.body.ev_date
        , ev_min_age = req.body.ev_min_age
        , ev_max_age = req.body.ev_max_age

    Provider
        .findOne( { where : { provider_username : uname, provider_password : passwd, provider_active : true } } ).then((provider) => {
            if (provider === null)
                res.json(provider)
            else {
                Evnt
                    .findOne( { where : { event_id : ev_id } } ).then((evnt) => {
                        evnt.event_price = ev_price
                        evnt.event_name = ev_name
                        evnt.event_description = ev_descr
                        evnt.event_date = ev_date
                        evnt.event_minimum_age = ev_min_age
                        evnt.event_maximum_age = ev_max_age
                        evnt.save( { fields : ['event_price', 'event_name', 'event_description', 'event_date', 'event_minimum_age', 'event_maximum_age'] } )
                        res.json(evnt)
                        elasticfun.updateEvent(client, {
                            event_id : evnt.event_id,
                            body : {
                                event_price : evnt.event_price,
                                event_name : evnt.event_name,
                                event_description : evnt.event_description,
                                event_date : evnt.event_date,
                                event_minimum_age : evnt.event_minimum_age,
                                event_maximum_age : evnt.event_maximum_age
                            }
                        } )
                    })
                    .catch((err) => {
                        res.json( { error : err } )
                    })
            }
        })
        .catch((err) => {
            res.json( { error : err } )
        })

})



/**
 * Category
 */
// GET ALL CATEGORIES
app.get('/category', (req, res) => {
    Category
        .findAll().then((category) => {
            res.json(category)
        })
        .catch((err) => {
            res.json( { error : err } )
        })
})

// GET ALL EVENTS IN CATEGORY
app.get('/category/events/:cat_id', (req, res) => {
    EventCategory
        .findAll( {
            where : { ev_cat_category_id : req.params.cat_id },
            include : [ { model : Evnt } ]
        } ).then((evnts) => {
            res.json(evnts)
        })
        .catch((err) => {
            res.json( { error : err } )
        })
})

// CREATE NEW CATEGORY
app.post('/category', (req, res) => {
    const cat_name = req.body.cat_name
        , cat_descr = req.body.cat_descr
    Category
        .create( { category_name : cat_name, category_descr : cat_descr } ).then((cat) => {
            res.json(cat)
        })
        .catch((err) => {
            res.json( { error : err } )
        })
})


/**
 * ADMIN
 */
app.get('/admin/:username/:password', (req, res) => {
    if (req.params.username === 'Leonidas' && req.params.password === 'Gorgo')
        res.json(true)
    else
        res.json(false)
})


app.post('/admin/pr_activate', (req, res) => {
    const uname = req.body.username
        , passwd = req.body.password
        , pr_uname = req.body.provider_username
    if (uname === 'Leonidas' && passwd === 'Gorgo')
        Provider
            .findOne( { where : { provider_username : pr_uname } } ).then((provider) => {
                if (provider === null)
                    res.json(provider)
                else {
                    provider.provider_active = true
                    provider.save( { fields : ['provider_active'] } )
                    res.json(provider)
                }
            })
            .catch((err) => {
                res.json( { error : err } )
            })
    else
        res.json(null)
})


app.post('/admin/pr_deactivate', (req, res) => {
    const uname = req.body.username
        , passwd = req.body.password
        , pr_uname = req.body.provider_username
    if (uname === 'Leonidas' && passwd === 'Gorgo')
        Provider
            .findOne( { where : { provider_username : pr_uname } } ).then((provider) => {
                if (provider === null)
                    res.json(provider)
                else {
                    provider.provider_active = false
                    provider.save( { fields : ['provider_active'] } )
                    res.json(provider)
                }
            })
            .catch((err) => {
                res.json( { error : err } )
            })
    else
        res.json(null)
})


app.post('/admin/usr_activate', (req, res) => {
    const uname = req.body.username
        , passwd = req.body.password
        , username = req.body.user_username
    if (uname === 'Leonidas' && passwd === 'Gorgo')
        User
            .findOne( { where : { username : username } } ).then((user) => {
                if (user === null)
                    res.json(user)
                else {
                    user.user_active = true
                    user.save( { fields : ['user_active'] } )
                    res.json(user)
                }
            })
            .catch((err) => {
                res.json( { error : err } )
            })
    else
        res.json(null)
})


app.post('/admin/usr_deactivate', (req, res) => {
    const uname = req.body.username
        , passwd = req.body.password
        , username = req.body.user_username
    if (uname === 'Leonidas' && passwd === 'Gorgo') {
        User
            .findOne( { where : { username : username } } ).then((user) => {
                if (user === null)
                    res.json(user)
                else {
                    user.user_active = false
                    user.save( { fields : ['user_active'] } )
                    res.json(user)
                }
            })
            .catch((err) => {
                res.json( { error : err } )
            })
        } else
        res.json(null)
})


app.post('/admin/pay_event', (req, res) => {
    const uname = req.body.username
        , passwd = req.body.password
        , ev_id = parseInt(req.body.ev_id)
    if (uname === 'Leonidas' && passwd === 'Gorgo') {
        Evnt
            .findOne( {
                where : { event_id : ev_id, event_is_paid : false },
                include : [ { model : Provider } ]
            } ).then((evnt) => {
                if (evnt === null)
                    res.json(evnt)
                else {
                    Transaction
                        .sum('transaction_points', { where : { transaction_event_id : evnt.event_id } } ).then((sum) => {
                            if (isNaN(sum)) sum = 0
                            const paid_sum = Math.round(sum * 0.9)
                            evnt.event_is_paid = true;
                            evnt.provider.provider_credits += sum;
                            evnt.save()
                            evnt.provider.save()
                            res.json( { 'amount_paid' : paid_sum, 'amount_earned' : sum - paid_sum } )
                            elasticfun.deleteEvent(client, { event_id : ev_id } )
                        })
                        .catch((err) => {
                            res.json( { error : err } )
                        })
                }
            })
            .catch((err) => {
                res.json( { error : err } )
            })
    } else
        res.json(null)
})


// Gotta Catch 'Em All
app.all('/*', (req, res) => {
    console.log('Leonida ena alogo')
    console.log(req.params)
    console.log(req.body)
    console.log(req.protocol)
    console.log(req.method)
    console.log(req.originalUrl)
    console.log('Leonida ena alogo')
    res.json( { 'ΛΕΩΝΙΔΑ ΕΝΑ ΑΛΟΓΟ' : 'ΜΕ ΚΟΥΡΑΖΕΙΣ ΠΟΛΥ' } )
})


// Extra DB setup
sequelize.sync()
Transaction.belongsTo(Evnt, { targetKey : 'event_id', foreignKey : 'transaction_event_id' } )
Transaction.belongsTo(User, { targetKey : 'user_id', foreignKey : 'transaction_user_id' } )
Transaction.sync()
Evnt.belongsTo(Provider, { targetKey : 'provider_id', foreignKey : 'event_provider_id' } )
Evnt.sync()
EventCategory.belongsTo(Evnt, { targetKey : 'event_id', foreignKey : 'ev_cat_event_id' } )
EventCategory.belongsTo(Category, { targetKey : 'category_id', foreignKey : 'ev_cat_category_id' } )
EventCategory.sync()


// Initialize ElasticSearch Indices
elasticfun.initElasticSearchIndices(client)


const server = https.createServer(options, app).listen(config.port, () => {
    console.log(`Listening on ${server.address().address} : ${server.address().port}`)
})


