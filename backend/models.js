'use strict';

const Sequelize = require('sequelize')
    , sequelize = new Sequelize('database', 'username', 'password', {
        host: 'localhost',
        dialect: 'postgres',
  
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        },

        define : {
            timestamps : true
        }
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
        user_phone_num : { type : Sequelize.STRING, allowNull : false },
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
        provider_phone_num : { type : Sequelize.STRING, allowNull : false },
        provider_ssn : { type : Sequelize.STRING, allowNull : false, unique : true }, // Should use a custom validator
        provider_bank_account : { type : Sequelize.STRING, allowNull : false }, // Should use a custom validator
        provider_credits : { type : Sequelize.INTEGER, validate : { min : 0 } },
        provider_active : { type : Sequelize.BOOLEAN, allowNull : false, defaultValue : false }
    })

    , Evnt = sequelize.define('event', {
        event_id : { type : Sequelize.BIGINT, autoIncrement : true, primaryKey : true },
        event_price : { type : Sequelize.INTEGER, validate : { min : 0 } },
        event_name : Sequelize.STRING,
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
