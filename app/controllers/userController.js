/**
 * Created by shaishab on 2/19/16.
 */

'use strict';

/**
 * Module dependencies.
 */
require('../models/userModel');
var _ = require('lodash'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    User = mongoose.model('User'),
    errorHandler = require('../helpers/errorHandler'),
    jwt = require('jwt-simple'),
    serverConfig = require('../../config/serverConfig'),
    moment= require('moment');


/**
 * Token generator function
 */

var tokenGenerator = function(username) {
    var expires = moment().add(serverConfig.config.tokenLifeTime, 'seconds').valueOf();
    var token = jwt.encode({
        username: username,
        expire: expires
    }, serverConfig.config.secretKey);

    return token;
};

/**
 * Signup
 */
exports.signup = function(req, res) {
    // For security measurement we remove the roles from the req.body object
    delete req.body.roles;

    var user = new User(req.body);
    var message = null;

    // Add missing user fields
    user.provider = 'local';
    user.displayName = user.firstName + ' ' + user.lastName;
    user.token = tokenGenerator(user.username);

    // Then save the user
    user.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            // Remove sensitive data before login
            user.password = undefined;
            user.salt = undefined;

            req.login(user, function(err) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    res.json(user);
                }
            });
        }
    });
};

/**
 * Signin
 */
exports.signin = function(req, res, next) {
    User.findOne({username: req.body.username}, function(error, user) {
        if(error) {
            return res.status(401).send({message: errorHandler.getErrorMessage(error)});
        }
        if(!user) {
            return res.status(401).send({message: 'invalid credential'});
        }
        user.authenticate(req.body.password, user.password, function (valid) {
            /// if the password is invalid return that 'Invalid Password' to the user
            if (!valid) {
                return res.status(401).send({message: 'invalid password'});
            }
            var token = tokenGenerator(user.username);
            User.update({_id: user._id}, {$set: { token: token }}, function(err, updateUser) {
                if(err) {
                    return res.status(400).send({message: 'Update error'});
                }
                user.token = token;
                user.password = undefined;
                user.salt = undefined;
                return res.status(200).send(user);
            });

        });
    });
};

/**
 * Signout
 */
exports.signout = function(req, res) {
    req.logout();
    res.redirect('/');
};

/**
 * get user info
 */

exports.getUserInfo = function(req, res) {
    console.log('get user info', req);
    return res.status(200).send({status:'ok',message:'Yes you hit the user route'});
};