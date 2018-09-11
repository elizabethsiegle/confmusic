//call +17172971757 configured with /joinconference , hear a welcome msg, redirect to /soundparticipant, get rickrolled
//I think this works
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
const MODERATOR = '+16507878004';
const twilio = require('twilio');
let twiml2 = new twilio.twiml.VoiceResponse();
let okgobass = 'audio/okgo-demo-bass.wav' 
let classic = 'https://demo.twilio.com/docs/classic.mp3'
let okgodrum = 'audio/okgo-demo-drum.wav'
let okgosound1 = 'audio/okgo-demo-sound1.wav'
// configuring middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.raw({ type: 'audio/wav', limit: '50mb' }));
app.use(express.static('audio/*')) //static 


// configure routes
//right now: hear welcome message
app.post('/joinconference', (req, res) => {
  let twiml = new twilio.twiml.VoiceResponse(); 
  twiml.say('Welcome to the conference!');
  twiml.redirect('/soundparticipant')
  res.type('text/xml').send(twiml.toString());
})

//TODO: add if button clicked (in html file), later on: be listener, edit callsid
// RIGHT NOW: attendees call in to +17172971757, configured with /soundparticipant 
app.post('/soundparticipant', (req, res) => {
  require('dotenv').load();
  //create rest client
  var client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_TOKEN);
  
  // Generate a TwiML response
  //client starts call to okgoconference, play over the phone.
  var call = client.calls
  .create({
    //NOT SURE ABOUT THESE the url and to
    url: 'okgoconference1', //join conf call (okgoconference1)
    to: 'okgoconference1', //num configured to /joinconference +17172971757
    from: '+15612200834', //ghost number, 2nd num, configured to /soundparticipant
  })
  .then(call => console.log(call.sid));
  let twiml2 = new twilio.twiml.VoiceResponse(); 
  console.log("hurr2")
  // const dial2 = twiml2.dial();
  //  dial2.conference('okgoconference1', {
  //   startConferenceOnEnter: false,
  // });
 
  twiml2.play(classic); //classic url for now, need to work on okgo .wav files
  res.type('text/xml').send(twiml2.toString());
});

//make static wav file public to play
//DOESN'T WORK ATM
app.post('/audio/okgo-demo-sound1.wav', (req, res) => {
  twiml2.play(okgosound1)
  res.type('audio/x-wav').send(twiml2.toString());
});

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}
//latency of updating live-call?
//unmuting ghost caller?
//update call with sid
//each conf call = button
//effects, volume = connect inputs to right asset

// start server
server.listen(port, () => {
  console.log('listening on port 3000');
});

  