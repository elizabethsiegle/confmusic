var fs = require('fs');
var request = require('request');
require('dotenv').load();
const client = require('twilio')(process.env.TWILIO_DOITLIVE_SID, process.env.TWILIO_DOITLIVE_AUTH_TOKEN);
var tito_api_key = process.env.TITO_API_KEY;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
function readJSON(path, callback) {
  fs.readFile(path, 'utf-8', function(err, data) {
    if(err) {callback(err, null);}
    try {
      result = JSON.parse(data).split(" ");
      console.log("result ", result);
      result.forEach(function(entry) {
        client.calls.create({
          url: 'https://okgo-demo.herokuapp.com/joinconference',
          to: entry,
          from: '+18503320435'
        }).then(call => console.log(call.sid))
          .catch(err => console.log(err))
      });
    }
    catch (rejection) {
      return callback(rejection);
    } //catch
  });
}

var generateNumsFromTitoAPI = () => {
  var numsToCall = [];
  request.get('https://api.tito.io/v2/signal/signal-2017-sf/tickets', {
    headers:{
      'Authorization': `Token token=${tito_api_key}`, 
      'Accept': 'application/vnd.api+json'
    }}, 
    function(err, response, body) {
      if (err) { return response.status(500).end('Error'); } //res
      var tickets = JSON.parse(response.body).data;
      for (var i = tickets.length - 1; i >= 0; i--) {
        if(tickets[i].attributes['phone-number']) {
          numsToCall.push(tickets[i].attributes["phone-number"]);
        } //if
      } //for
      //check for duplicates
      var numsToCallNoDuplicates = [];
      numsToCall.forEach(function(item) {
        if(numsToCallNoDuplicates.indexOf(item) < 0) {
          numsToCallNoDuplicates.push(item);
        }
      });
      numsToCallNoDuplicates.toString().split(",");
      var myjson = '"' + numsToCallNoDuplicates.join(' ') + '"';
      console.log(myjson);
      fs.writeFile("phonenumstocall.json", myjson, 'utf8', (error) => {
        if(error) {
          return console.log(error);
        }
        console.log("file saved!");
      }); //writeFile
      readJSON('phonenumstocall.json');
    });
}


generateNumsFromTitoAPI();
