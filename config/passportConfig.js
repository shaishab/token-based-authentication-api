/**
 * Created by shaishab on 2/18/16.
 */

'use strict';

/**
 * Module dependencies.
 */
require('../app/models/userModel');
var passport = require('passport'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    jwt = require('jwt-simple'),
    BearerStrategy = require('passport-http-bearer').Strategy,
    serverConfig = require('../config/serverConfig');

/**
 * Module init function.
 */

module.exports = function() {
    passport.use(new BearerStrategy(
        function(token, done) {
            User.findOne({ token: token }, function (err, user) {
                if (err) { return done(err); }
                if (!user) { return done({errors:[{message: "Invalid token provide"}]}, false); }

                var decoded = jwt.decode(token, serverConfig.config.secretKey);

                if (decoded.expire <= Date.now()) {
                    return done({errors:[{message: "Token expired"}]}, false, {message: "Token expire"});
                }

                return done(null, user, { scope: 'read' });
            });
        }
    ));
};