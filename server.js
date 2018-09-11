//call +17172971757 configured with /joinconference , hear a welcome msg, redirect to /soundparticipant, get rickrolled
//I think this works
'use strict';
const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const fs = require('fs')
const path = require('path');
var urllib = require('urllib');
var url = require('url');
const VoiceResponse = require('twilio').twiml.VoiceResponse
const port = process.env.PORT || 3000;
const app = express();
const twilio = require('twilio');
let twiml2 = new twilio.twiml.VoiceResponse();
let okgobass = 'audio/okgo-demo-bass.wav' 
let classic = 'https://demo.twilio.com/docs/classic.mp3'
let okgodrum = 'audio/okgo-demo-drum.wav'
let okgosound1 = 'audio/okgo-demo-sound1.wav'

const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// configuring middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.raw({ type: 'audio/wav', limit: '50mb' }));
app.use(express.static('audio/*')) //static 


// configure routes
//right now: hear welcome message
app.post('/joinconference', (req, res) => {
  let twiml = new twilio.twiml.VoiceResponse(); 
  twiml.say('Welcome to the conference!');
  let dial = twiml.dial();
  dial.conference('okgoconference1', {
    startConferenceOnEnter: true,
  });
  //twiml.redirect('/soundparticipant') //don't stay in conference
  res.type('text/xml').send(twiml.toString());
})

//TODO: add if button clicked (in html file), later on: be listener, edit callsid
// RIGHT NOW: attendees call in to +17172971757, configured with /soundparticipant 
//curl or function to make music on command, do once
//no one ever calls this number, request happens in background
app.post('/soundparticipant', (req, res) => {

  //client starts call to okgoconference, play over the phone.
  client.calls
  .create({
    //NOT SURE ABOUT THESE the url and to
    url: 'http://jreyes.ngrok.io/rickroll', //point to twiml that rickrolls
    to: '+18654019875', //num configured to /joinconference +17172971757
    from: '+12066505813', //ghost number, 2nd num, configured to /soundparticipant
  })
  .then(call => {
    console.log(call.sid);
    res.type('text/xml').send(call.sid);
  })
  .catch(err => console.log(err))
});

app.post('/rickroll', (req, res) => {
  //twiml play classic
  let twiml2 = new twilio.twiml.VoiceResponse(); 
  console.log("hurr2")
  twiml2.play(classic); //classic url for now, need to work on okgo .wav files
  res.type('text/xml').send(twiml2.toString());
})


//make static wav file public to play
//DOESN'T WORK ATM
app.post('/audio/okgo-demo-sound1.wav', (req, res) => {
  twiml2.play(okgosound1);
  res.type('audio/x-wav').send(twiml2.toString());
});


//latency of updating live-call?
//unmuting ghost caller?
//update call with sid
//each conf call = button
//effects, volume = connect inputs to right asset

// start server
app.listen(3000, () => console.log('started server'));

  