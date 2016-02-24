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


describe('Create new user', function() {

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

var token = '';

describe('Sign in for given user', function() {

    it('should return user after signin', function(done) {
        request(app)
            .post('/signin')
            .send({ username: 'shaishabr', password: 'shaishab' })
            .expect(200)
            .end(function(err, res){
                if (err) return done(err);
                if (!res && !res.body) return done({message: 'user not found'});
                token = res.body.token;
                done();
            });
    });
});

describe('Get signed in user information', function() {

    it('should return signed in user info', function(done) {
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