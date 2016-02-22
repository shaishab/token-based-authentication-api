/**
 * Created by shaishab on 2/22/16.
 */

'use strict';

/**
 * Module dependencies
 */

var passport = require('passport'),
    errorHandler = require('../helpers/errorHandler');

/**
 * Check bearer authentication
 */
exports.bearerAuthentication = function(req, res, next){
    passport.authenticate('bearer', { session: false }, function(err, user) {
        if (err) {
            return res.status(400).send({message: errorHandler.getErrorMessage(err)});
        }

        return next();

    })(req, res, next)
}
