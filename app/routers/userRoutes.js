/**
 * Created by shaishab on 2/18/16.
 */

'use strict';

/**
 * Module dependencies.
 */
var userController = require('../controllers/userController'),
    authentication = require('../helpers/authenticationHelper');

module.exports = function(router) {
    router.route('/user/me')
        .get(authentication.bearerAuthentication, userController.getUserInfo);

    router.route('/signup')
        .post(userController.signup);

    router.route('/signin')
        .post(userController.signin);

    router.route('/signout')
        .get(userController.signout);
};
