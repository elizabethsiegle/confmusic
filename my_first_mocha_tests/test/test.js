var assert = require('assert')
var firstTest = require("./myFirstTests.js")
describe("Test", function() {
  describe("#testMocha", function() {
    it("should return string 'It's alive!!!'", function() {
      assert.equal(firstTest._mochaTest.testMocha(), "It's alive!!!")
    })
  })
})
