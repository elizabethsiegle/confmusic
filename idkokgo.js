'use strict';
const bodyParser = require('body-parser');
const urlencoded = require('body-parser').urlencoded;
const express = require('express');
const http = require('http');
const path = require('path');
var urllib = require('urllib');
var url = require('url');
const VoiceResponse = require('twilio').twiml.VoiceResponse
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const MODERATOR = '+15558675310';

let okgobass = './audio/okgo-demo-bass.wav' 
let classic = 'https://demo.twilio.com/docs/classic.mp3'
let okgodrum = './audio/okgo-demo-drum.wav'
let okgosound1 = '/audio/okgo-demo-sound1.wav'
// configuring middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(urlencoded({ extended: false }));

// configure routes
app.post('/joinconference', (req, res) => {
  const twilio = require('twilio');
  let twiml = new twilio.twiml.VoiceResponse(); 
  const dial = twiml.dial();
  twiml.say('Welcome to the conference!');
  if (req.body.From == MODERATOR) {
    dial.conference('okgoconference1', {
      startConferenceOnEnter: true,
      endConferenceOnExit: true,
    });
  } 
  else {
    // Otherwise have the caller join as a regular participant
    dial.conference('okgoconference1', {
      startConferenceOnEnter: false,
    });
  }
  require('dotenv').load();

  var client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_TOKEN);
  // Generate a TwiML response
  // //client starts call to okgoconference1
  // Play over the phone.
  var call = client.calls
  .create({
    url: '/joinconference', //join conf? 
    to: '+17172971757', //num in /joinconference
    from: '+15612200834', //num in /soundparticipant 
  })
  .then(call => console.log(call.sid));
  twiml.play(classic) //okgodrum
  res.type('text/xml').send(twiml.toString());
});  

//later on: be listener, edit callsid
//if button clicked (in html file)
app.post('/soundparticipant', (req, res) => {
  //create rest client
  require('dotenv').load();
  //not sure why this code doesn't play
  var client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_TOKEN);
  // Generate a TwiML response
  // //client starts call to okgoconference1
  // Play over the phone.
  var call = client.calls
  .create({
    url: '/joinconference', //join conf? 
    to: '+17172971757', //num in /joinconference
    from: '+15612200834', //num in /soundparticipant 
  })
  .then(call => console.log(call.sid));
  twiml.play(okgodrum) //classic
  
  res.type('audio/x-wav').send(twiml.toString());
  //later update call with callsid
});


// start server
server.listen(port, () => {
  console.log('listening on port 3000');
});

  