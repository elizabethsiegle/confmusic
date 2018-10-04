var assert = require('assert');
var server = require('../server.js').app;
var request = require('supertest');
// var makecalls = require('../makecalls.js');
// var soundDict = require('../sound-dict.js');
var http = require('http');
describe('Test', function() {
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
  
  describe('HTTP Server Test', function() {
    var server;
    // The function passed to before() is called before running the test cases.
    beforeEach(function() {
      server.listen(3000);
    });

    // The function passed to after() is called after running the test cases.
    after(function() {
      server.close();
    });

    describe('/', function() {
      it('should be Hello, Mocha!', function(done) {
        http.get('http://127.0.0.1:4040', function(response) {
          // Assert the status code.
          assert.equal(response.statusCode, 200);
          var body = '';
          response.on('data', function(d) {
            body += d;
          });
          response.on('end', function() {
            // Let's wait until we read the response, and then assert the body
            // is 'Hello, Mocha!'.
            assert.equal(body, 'Hello, Mocha!');
            done();
          });
        });
      });
    });
  });
});
