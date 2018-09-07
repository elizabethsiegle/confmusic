'use strict';
const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const path = require('path');
var urllib = require('urllib');
var url = require('url')
const VoiceResponse = require('twilio').twiml.VoiceResponse

const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);

// configuring middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const twilio = require('twilio');


// configure routes
app.post('/joinconference', (req, res) => {
    const twilio = require('twilio');
    let twiml = new twilio.twiml.VoiceResponse(); //VoiceResponse()
    const dial = twiml.dial();
    twiml.say('Welcome to the conference!');
    dial.conference('okgoconference1', {
      startConferenceOnEnter: true
    });
    res.type('text/xml').send(twiml.toString());
  });

//later on: be listener, edit callsid
//if button clicked (in html file)
app.post('/soundparticipant', (req, res) => {
  //create rest client

  //client starts call to okgoconference1

  //play sound

  //later update call with callsid
})

//app.post('/playurl') -> twiml play: send this url as url, + from ,to

// endpoint Twilio will call when you answer the phone
app.post("/voice2", function(req, res, next) {
  //var conferenceName = req.query.id;

  // We return TwiML to enter the same conference
  var twiml = new twilio.TwimlResponse();
  twiml.dial(function(node) {
    node.conference('myConference', {
      waitUrl: 'http://twimlets.com/holdmusic?Bucket=com.twilio.music.ambient'
    });
  });
  res.set('Content-Type', 'text/xml');
  res.send(twiml.toString());
});

// start server
server.listen(port, () => {
  console.log('listening on port 3000');
});

  