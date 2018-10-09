require('dotenv').load();
const client = require('twilio')(process.env.TWILIO_DOITLIVE_SID, process.env.TWILIO_DOITLIVE_AUTH_TOKEN);
const baseURL = process.env.BASE_URL;
var assert = require('assert');
var app = require("../server.js").app;
var server = require('../server.js').server;
var twilio = require('twilio');
var request = require("supertest").agent(app.listen()); //(app)
var async = require('async');
var createGhostCallers = require('../server.js').createGhostCallers;
// var makecalls = require('../makecalls.js');
// var soundDict = require('../sound-dict.js');
var http = require('http');
describe('Test', () => {
  after(function (done) {
    //server.close();
    done();
  });
  it('check client', function(done) {
    var sentMsg = createGhostCallers(function(err, data) {
      request
      .post(`${baseURL}/hold`)
      .expect(data.sentMsg).toBe('Obj.sid') //vs toBe?
      done();
    });
    //this.timeout(500);
    setTimeout(done, 300);
  })
  // describe('#confcall1', function() {
  //   it('should return -1 when conf calls not even', function(){
  //     assert.equal(_.each(soundDict, (obj, i) => {
  //       currnum = obj.num 
  //       obj.num 
  //     }, 3*3));
  //   });
  // });
//   var request = require('supertest');
// describe('loading express', function () {
//   // var server;
//   beforeEach(function () {
//     // server = require('../server.js');
//   });
//   afterEach(function () {
//     server.close();
//   });
//   it('responds to /', function testSlash(done) {
//   request(server)
//     .get('/')
//     .expect(200, done);
//   });
//   it('404 everything else', function testPath(done) {
//     request(server)
//       .get('/foo/bar')
//       .expect(404, done);
//   });
// });
});
