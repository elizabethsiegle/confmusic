require('dotenv').load();
const expect = require('chai').expect
const client = require('twilio')(process.env.TWILIO_DOITLIVE_SID, process.env.TWILIO_DOITLIVE_AUTH_TOKEN);
const baseURL = process.env.BASE_URL;
var assert = require('assert');
var app = require("../server.js").app;
var server = require('../server.js').server;
var twilio = require('twilio');
var supertest = require("supertest")
var request = supertest.agent(app.listen()); //(app)
var async = require('async');
var should = require('should');
var cheerio = require('cheerio');
var createGhostCallers = require('../server.js').createGhostCallers;
var testingOptions = { autostart : false, log : false }
// var makecalls = require('../makecalls.js');
// var soundDict = require('../sound-dict.js');
var http = require('http');
describe('Test', () => {
it('checks client in createGhostCallers', async function() {
  let result = await createGhostCallers;  
  expect(result.success).to.equal(true);
  expect(result.twilioMessageSid).to.be.a('string');
  expect(result.twilioMessageSid).to.have.length.within(1, 100);
  expect(result.status).to.equal(200);
  });
  after(function (done) {
    //server.close();
    done();
  });
  it ('renders the index page', function(done) {
    //supertest(app)
    request
    .get('/')
    .expect(200)
    .end(function (err, res) {
      res.should.be.ok();
      var $ = cheerio.load(res.body);
      expect(res.statusCode).to.equal(200);
      // res.should.have.status(200);
      // $('.drum-pad').each(function() {
      //   var idk = $(this);
      //   title = data.find('key').text();
      //   console.log("title ", title);
      // })
      //console.log("res.body ", res.body);
      should.exist(res.body);
      should.not.exist(err);
      //(res.body).should.be.a('array');
      (err === null).should.be.true;
      var header = $('#div');
      console.log("header ", header);
      //header.should.be.a('array');
      // header.should.equal('drum-pad');
      done();
    }); //index
  });
  it ('renders the client page', function(done) {
    //supertest(app)
    request
    .get('/client')
    .expect(200)
    .end(function (err, res) {
      res.should.be.ok();
      var $ = cheerio.load(res.body);
      expect(res.statusCode).to.equal(200);
      //console.log("res.body ", res.body);
      should.exist(res.body);
      should.not.exist(err);
      //(res.body).should.be.a('array');
      (err === null).should.be.true;
      done();
    }); //client
  });
  it ('renders the touch/f4 page', function(done) {
    //supertest(app)
    request
    .get('/touch/f4')
    .expect(200)
    .end(function (err, res) {
      res.should.be.ok();
      //console.log("res.body ", res.body);
      should.exist(res.body);
      //should.not.exist(err);
      (err === null).should.be.true;
      done();
    }); //client
  });
  it ('server test', function() {
    before(function() {
      server.listen(3000, () => {
        console.log('JSON Server is running');
      });
    });

    // The function passed to after() is called after running the test cases.
    // after(function() {
    //   server.close(() => {
    //     console.log('Closed out remaining connections');
    //     process.exit(0);
    //   });

    //   setTimeout(() => {
    //     console.error('Could not close connections in time, forcefully shutting down');
    //     process.exit(1);
    //   }, 30000);
    // });
  });
  // it('check client', function(done) {
  //   var sentMsg = createGhostCallers(function(err, data) {
  //     request
  //     .post(`${baseURL}/hold`)
  //     .expect(data.sentMsg).toBe('Obj.sid') //vs toBe?
  //     done();
  //   });
  //   //this.timeout(500);
  //   setTimeout(done, 300);
  // })
});
