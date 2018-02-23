'use strict'

const express = require('express')
    // , https = require('https')
    , bodyParser = require('body-parser')
    , app = express()

    , fs = require('fs')
    , lazy = require('lazy.js')

    , config = require('./config').config

    , models = require('./models')
    , sequelize = models.sequelize
    , User = models.User
    , Provider = models.Provider
    , Transaction = models.Transaction
    , Evnt = models.Evnt
    , Category = models.Category
    , EventCategory = models.EventCategory

    // , options = {
    //     key: fs.readFileSync('./ssl/key.pem'),
    //     cert: fs.readFileSync('./ssl/cert.pem'),
    //     password : 'S0ft3ng.2018'
    // }


// Middleware
// Support JSON encoded bodies
// Support extended URL encoded bodies
app.use(bodyParser.json())
app.use(bodyParser.urlencoded( { extended : true } ))
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


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
 * USER
 */

app.get('/user/:username/:password', (req, res) => {
    User
        .findOne( { where : { username : req.params.username, user_password : req.params.password } } ).then((user) => {
            res.json(user)
        })
        .catch((err) => {
            res.json( { error : err } )
        })
})

app.get('/user/events/:username/:password', (req, res) => {
    User
        .findOne( { where : { username : req.params.username, user_password : req.params.password } } ).then((user) => {
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


/**
 * PROVIDER
 */

app.get('/provider/:username/:password', (req, res) => {
    Provider
        .findOne( { where : { provider_username : req.params.username, provider_password : req.params.password } } ).then((provider) => {
            res.json(provider)
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
        .findOne( { where : { event_id : parseInt(req.params.id) } }  ).then((evnt) => {
            res.json(evnt)
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

    Provider
        .findOne( { where : { provider_username : uname, provider_password : passwd } } ).then((provider) => {
            if (provider === null)
                res.json(provider)
            else {
                Evnt
                    .create( { event_price : ev_price, event_name : ev_name, event_description : ev_descr, event_date : ev_date,
                        event_provider_id : provider.provider_id, event_available_tickets : ev_avail_tick, event_lattitude : ev_latt,
                        event_longtitude : ev_long, event_minimum_age : ev_min_age, event_maximum_age : ev_max_age, event_map_data : ev_mdata } ).then((evnt => {
                            // Send response. No need to wait
                            res.json(evnt)
                            // Create category associations
                            lazy(ev_cats)
                                .each((ec) => {
                                    EventCategory
                                        .create( { ev_cat_event_id : evnt.event_id, ev_cat_category_id : ec })
                                        .catch((err) => {
                                            console.log( { 'EventCategory Creation Error' : err } )
                                        })
                                })
                    }))
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


// Gotta Catch 'Em All
app.all('/*', (req, res) => {
    console.log('Leonida ena alogo')
    res.json( { 'ΛΕΩΝΙΔΑ ΕΝΑ ΑΛΟΓΟ' : 'ΜΕ ΚΟΥΡΑΖΕΙΣ ΠΟΛΥ' } )
})


// Extra DB setup
sequelize.sync()
Transaction.belongsTo(Evnt, { targetKey : 'event_id', foreignKey : 'transaction_event_id' })
// Transaction.belongsTo(Evnt, { targetKey : 'user_id', foreignKey : 'transaction_user_id' })
Transaction.sync()
Evnt.belongsTo(Provider, { targetKey : 'provider_id', foreignKey : 'event_provider_id' })
Evnt.sync()
EventCategory.belongsTo(Evnt, { targetKey : 'event_id', foreignKey : 'ev_cat_event_id' } )
EventCategory.sync()



// const server = https.createServer(options, app).listen(config.port, () => {
//     console.log(`Listening on ${server.address().address} : ${server.address().port}`)
// });

const server = app.listen(config.port, () => {
    console.log(`Listening on ${server.address().address} : ${server.address().port}`)
})


