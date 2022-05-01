// app.js

process.env.NODE_ENV = 'test';

let url = require('../server/models/url');
let chaiHttp = require('chai-http');
let app = require('../app')
const { expect } = require('chai');
const express = require('express');
const request = require('chai-http');
const { urlencoded } = require('express');

function createApp() {
    app = express();

    const router = express.Router();
    router.route('/').get(function(req, res) {
        return res.json({goodCall: true});
    });

    app.use(router);
    return app;
}

describe('Our server', function() {
    var app;

   before(function(done) {
       app = createApp();
       app.listen(function(err) {
           if (err) { return done(err); }
           done();
       });
   });

   it('should send back a JSON object with goodCall set to true', function(done) {
       request(app)
       .get('/index')
       .set('Content-Type', 'application/json')
       // .send({ email: 'email', password: 'password' })
       .expect('Content-Type', /json/)
       .expect(200, function(err, res) {
           if (err) { return done(err); }
           callStataus = res.body.goodCall;
           expect(callStatus).to.equal(true);
           done();
       });
   });

   

});