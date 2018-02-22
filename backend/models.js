'use strict';

const Sequelize = require('sequelize')
    , config = require('./config').config
    , Op = Sequelize.Op
    , operatorsAliases = {
        $eq: Op.eq,
        $ne: Op.ne,
        $gte: Op.gte,
        $gt: Op.gt,
        $lte: Op.lte,
        $lt: Op.lt,
        $not: Op.not,
        $in: Op.in,
        $notIn: Op.notIn,
        $is: Op.is,
        $like: Op.like,
        $notLike: Op.notLike,
        $iLike: Op.iLike,
        $notILike: Op.notILike,
        $regexp: Op.regexp,
        $notRegexp: Op.notRegexp,
        $iRegexp: Op.iRegexp,
        $notIRegexp: Op.notIRegexp,
        $between: Op.between,
        $notBetween: Op.notBetween,
        $overlap: Op.overlap,
        $contains: Op.contains,
        $contained: Op.contained,
        $adjacent: Op.adjacent,
        $strictLeft: Op.strictLeft,
        $strictRight: Op.strictRight,
        $noExtendRight: Op.noExtendRight,
        $noExtendLeft: Op.noExtendLeft,
        $and: Op.and,
        $or: Op.or,
        $any: Op.any,
        $all: Op.all,
        $values: Op.values,
        $col: Op.col
    }
    , sequelize = new Sequelize(config.database, config.db_user, config.db_pass, {
        host: config.db_host,
        dialect: 'postgres',

        pool: {
            max: 10,
            min: 1,
            acquire: 30000,
            idle: 10000
        },

        define : {
            timestamps : true
        },

        operatorsAliases
    })

    , User = sequelize.define('user', {
        user_id	: { type : Sequelize.BIGINT, autoIncrement : true, primaryKey : true },
        username : { type : Sequelize.STRING, unique : true, allowNull : false },
        user_password : { type : Sequelize.STRING, allowNull : false },
        user_email : { type : Sequelize.STRING, validate : { isEmail : true }, unique : true },
        user_join_date : Sequelize.DATEONLY,
        user_first_name : { type : Sequelize.STRING, allowNull : false },
        user_last_name : { type : Sequelize.STRING, allowNull : false },
        user_address : { type : Sequelize.STRING, allowNull : false },
        user_phone_num : {
            type : Sequelize.STRING, allowNull : false,
            validate : { isPhoneNum : function(value) { value.match(/\d{10}/g) !== null } }
        },
        user_credits : { type : Sequelize.INTEGER, validate : { min : 0 } },
        user_active : { type : Sequelize.BOOLEAN, allowNull : false, defaultValue : true }
    })

    , Provider = sequelize.define('provider' , {
        provider_id : { type : Sequelize.BIGINT, autoIncrement : true, primaryKey : true },
        provider_username : { type : Sequelize.STRING, unique : true, allowNull : false },
        provider_password : { type : Sequelize.STRING, allowNull : false },
        provider_email : { type : Sequelize.STRING, validate : { isEmail : true } },
        provider_join_date : Sequelize.DATEONLY,
        provider_first_name : { type : Sequelize.STRING, allowNull : false },
        provider_last_name : { type : Sequelize.STRING, allowNull : false },
        provider_comp_name : { type : Sequelize.STRING, allowNull : false },
        provider_address : Sequelize.STRING,
        provider_phone_num : {
            type : Sequelize.STRING, allowNull : false,
            validate : { isPhoneNum : function(value) { value.match(/\d{10}/g) !== null } }
        },
        provider_ssn : {
            type : Sequelize.STRING, allowNull : false, unique : true,
            validate : { isSSN : function(value) { value.match(/\d{9}/g) !== null } }
        },
        provider_bank_account : {
            type : Sequelize.STRING, allowNull : false,
            validate : {
                isIBAN : function(value) { value.match(/\d{25}/g) !== null && value.startsWith('GR') },
                isUppercase : true,
                len : [27, 27]
            }
        },
        provider_credits : { type : Sequelize.INTEGER, validate : { min : 0 } },
        provider_active : { type : Sequelize.BOOLEAN, allowNull : false, defaultValue : false }
    })

    , Evnt = sequelize.define('event', {
        event_id : { type : Sequelize.BIGINT, autoIncrement : true, primaryKey : true },
        event_price : { type : Sequelize.INTEGER, validate : { min : 0 } },
        event_name : { type : Sequelize.STRING, allowNull : false },
        event_description : Sequelize.TEXT,
        event_date : { type : Sequelize.DATE, allowNull : false },
        event_provider_id : { type : Sequelize.BIGINT, references : { model : Provider, key : 'provider_id', deferrable : Sequelize.Deferrable.INITIALLY_IMMEDIATE } },
        event_available_tickets : { type : Sequelize.INTEGER, validate : { min : 1 } },
        event_lattitude : Sequelize.STRING,
        event_longtitude : Sequelize.STRING,
        event_minimum_age : { type : Sequelize.INTEGER, defaultValue : 0 },
        event_maximum_age : { type : Sequelize.INTEGER, defaultValue : 99 },
        event_map_data : Sequelize.STRING,
        event_is_paid : { type : Sequelize.BOOLEAN, allowNull : false, defaultValue : false }
    })

    , Transaction = sequelize.define('transaction', {
        transaction_id : { type : Sequelize.BIGINT, autoIncrement : true, primaryKey : true },
        transaction_date : Sequelize.DATE,
        transaction_event_id : { type : Sequelize.BIGINT, references : { model : Evnt, key : 'event_id', deferrable : Sequelize.Deferrable.INITIALLY_IMMEDIATE } },
        transaction_user_id : { type : Sequelize.BIGINT, references : { model : User, key : 'user_id', deferrable : Sequelize.Deferrable.INITIALLY_IMMEDIATE } },
        transaction_points : { type : Sequelize.INTEGER, allowNull : false, validate : { min : 1 } }
    })

    , Category = sequelize.define('category', {
        category_id : { type : Sequelize.BIGINT, autoIncrement : true, primaryKey : true },
        category_name : { type : Sequelize.STRING, allowNull : false , unique : true },
        category_descr : { type : Sequelize.TEXT, allowNull : false }
    })

    , EventCategory = sequelize.define('ev_cat', {
        ev_cat_id : { type : Sequelize.BIGINT, autoIncrement : true, primaryKey : true },
        ev_cat_event_id : { type : Sequelize.BIGINT, references : { model : Evnt, key : 'event_id', deferrable : Sequelize.Deferrable.INITIALLY_IMMEDIATE } },
        ev_cat_category_id : { type : Sequelize.BIGINT, references : { model : Category, key : 'category_id', deferrable : Sequelize.Deferrable.INITIALLY_IMMEDIATE } }
    })


exports.sequelize = sequelize
exports.User = User
exports.Provider = Provider
exports.Transaction = Transaction
exports.Evnt = Evnt
exports.Category = Category
exports.EventCategory = EventCategory
