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
    var expires = moment().add(serverConfig.config.tokenLifeTime, 'seconds').valueOf(); // Token lifetime set 5 mins (300 seconds)
    var token = jwt.encode({
        username: username,
        expire: expires
    }, serverConfig.config.secretKey);

    return token;
};

/**
 * Signup function
 */
exports.signup = function(req, res) {
    // For security measurement we remove the roles from the req.body object
    delete req.body.roles;

    var newUser = new User(req.body);
    var message = null;

    // Add missing user fields
    newUser.provider = 'local';
    newUser.displayName = newUser.firstName + ' ' + newUser.lastName;
    newUser.token = tokenGenerator(newUser.username);

    // Then save the user
    newUser.save(function(err, user) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        user.password = undefined;
        user.salt = undefined;

        return res.status(200).send(user);
    });
};

/**
 * Signin function
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
 * Signout function
 */
exports.signout = function(req, res) {
    res.redirect('/'); // just redirect because I assume reset token from client side
};

/**
 * get user info
 */

exports.getUserInfo = function(req, res) {
    return res.status(200).send({status:'ok',message:'Yes you hit my profile', user: {firstName: "Shaishab", lastName: "Roy"}});
};