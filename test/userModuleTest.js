/**
 * Created by shaishab on 2/23/16.
 */
'use strict';

/**
 * Module dependencies
 */
require('../app/models/userModel');
var dbUri = 'mongodb://localhost/tokenTestDB'

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    request = require('supertest'),
    jwt = require('jwt-simple'),
    serverConfig = require('../config/serverConfig'),
    moment= require('moment');

var app = require('../app');
var tokenGenerator = function(username) {
    var expires = moment().add(serverConfig.config.tokenLifeTime, 'seconds').valueOf(); // Token lifetime set 5 mins (300 seconds)
    var token = jwt.encode({
        username: username,
        expire: expires
    }, serverConfig.config.secretKey);

    return token;
};


describe('User', function() {

    //beforeEach(function(done) {
    //    if (mongoose.connection.db) return done();
    //    mongoose.connect(dbUri, done);
    //
    //});

    describe('#save()', function() {
        it('should save without error', function(done) {
            var user = new User({
                firstName:"shaishab",
                lastName: "roy",
                displayName: "shaishab roy",
                email:"test@gmail.com",
                username: 'shaishabr',
                password: "shaishab",
                provider: 'local'});
            user.token = tokenGenerator(user.username);
            user.save(function() {
                done();
            });
        });
    });
});

describe('GET /user/me', function() {
    var token = '';
    before(function(done) {
        User.findOne({username: 'shaishabr'}, function(err, user) {
            if(err || !user) { return done(err);}
            token = user.token;
            done();
        })
    });

    it('should return single user info', function(done) {
        request(app)
            .get('/user/me')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer '+token)
            .expect(200)
            .end(function(err, res){
                if (err) return done(err);
                done();
            });
    });
});