/**
 * Created by shaishab on 2/18/16.
 */

'use strict';

/**
 * Module dependencies.
 */
var  _ = require("lodash");

var settings = {
    production: {
        dbUrl:'mongodb://username:password@host:port/databaseName',
        secretKey: 'shaishab',
        tokenLifeTime:300
    },
    development: {
        dbUrl:'mongodb://localhost:27017/devUserReg',
        secretKey: 'shaishab',
        tokenLifeTime:300
    }
};

var env = process.env.NODE_ENV;
var config = _.includes(["production"], env) ? settings[env] : settings["development"];

exports.config = config;