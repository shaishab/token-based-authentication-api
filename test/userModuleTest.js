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
    request = require('supertest');

var app = require('../app');


describe('User', function() {

    beforeEach(function(done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbUri, done);
    });

    describe('#save()', function() {
        it('should save without error', function(done) {
            var user = new User({
                firstName:"test",
                lastName: "complete",
                displayName: "test complete",
                email:"test@gmail.com",
                username: 'srt1',
                password: "123465g6",
                provider: 'local'});
            user.save(function() {
                console.log('success');
                done();
            });
        });
    });
});

describe('GET /user/me', function() {
    beforeEach(function(done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbUri, done);
    });

    it('should return single user info', function(done) {
       request(app)
           .get('/user/me')
           .set('Accept', 'application/json')
           .expect(200)
           .end(function(err, res){
               if (err) return done(err);
               done();
           });
    });
});