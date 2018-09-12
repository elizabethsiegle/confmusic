//call +17172971757 configured with /joinconference , hear a welcome msg, redirect to /soundparticipant, get rickrolled
'use strict';
var dotenv = require('dotenv');
dotenv.load();
const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const fs = require('fs')
const path = require('path');
var urllib = require('urllib');
var url = require('url');
const VoiceResponse = require('twilio').twiml.VoiceResponse
const app = express();
const twilio = require('twilio');
let twiml2 = new twilio.twiml.VoiceResponse();
let okgobass = 'audio/okgo-demo-bass.wav' 
let classic = 'https://demo.twilio.com/docs/classic.mp3'
let cowbell = 'https://api.twilio.com/cowbell.mp3'
let okgodrum = 'audio/okgo-demo-drum.wav'
let okgosound1 = 'audio/okgo-demo-sound1.wav'


const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
const fromNumber = process.env.TWILIO_NUMBER
const toNumber = process.env.OKGO_CONF_NUMBER
const callbackURL = process.env.CALLBACK_URL

// configuring middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.raw({ type: 'audio/wav', limit: '50mb' }));
app.use(bodyParser.json());
app.use(express.static('audio/*')) //static 

// don't need jsdom because we can just make a request to our soundparticipant url from the client

app.post('/rickroll', (req, res) => {
  //twiml play classic
  let twiml2 = new twilio.twiml.VoiceResponse(); 
  console.log("rickroll")
  twiml2.play(classic); //classic url for now, need to work on okgo .wav files
  res.type('text/xml').send(twiml2.toString());
});

app.post('/cowbell', (req, res) => {
  let twiml2 = new twilio.twiml.VoiceResponse(); 
  console.log("cowbell")
  twiml2.play(cowbell); //classic url for now, need to work on okgo .wav files
  res.type('text/xml').send(twiml2.toString());
});

// configure routes
//right now: hear welcome message
app.post('/joinconference', (req, res) => {
  let twiml = new twilio.twiml.VoiceResponse(); 
  twiml.say('Welcome to the conference!');
  let dial = twiml.dial();
  dial.conference('okgoconference1', {
    startConferenceOnEnter: true, //run once
  });
  res.type('text/xml').send(twiml.toString());
})

//TODO: add if button clicked (in html file), be listener, edit callsid
// RIGHT NOW: attendees call in to +17172971757, configured with /soundparticipant 
//curl or function to make music on command, do once
//no one ever calls this number, request happens in background
app.post('/soundparticipant', (req, res) => {
  console.log(req.body.button); //print in terminal, ngrok
  if(req.body.button == "oh-yeah") {
    console.log("oh-yeah clicked, nodejs");
    client.calls
    .create({
      url: callbackURL, //TODO currently rickrolls should instead point to listener for button click
      to: toNumber, //num configured to /joinconference +17172971757
      from: fromNumber // any verified or twilio number
    })
    .then(call => {
      console.log(call.sid);
        res.type('text/xml').send(call.sid);
    }).catch(err => console.log(err))
  } //if "oh-yeah"
  else if(req.body.button == "bass") {
    console.log("oh-yeah clicked, nodejs");
    client.calls
    .create({
      url: 'http://lizzie.ngrok.io/cowbell', //TODO currently rickrolls should instead point to listener for button click
      to: toNumber, //num configured to /joinconference +17172971757
      from: fromNumber // any verified or twilio number
    })
    .then(call => {
      console.log(call.sid);
        res.type('text/xml').send(call.sid);
    }).catch(err => console.log(err))
  }
  
  // create call from ghost participant
  
});

//make static wav file public to play
//DOESN'T WORK ATM
app.post('/audio/okgo-demo-sound1.wav', (req, res) => {
  twiml2.play(okgosound1);
  res.type('audio/x-wav').send(twiml2.toString());
});

//serve up pad.html
app.get('/', function(req, res){
  res.sendFile('assets/pad.html', { root : __dirname});
});
app.use(express.static('assets')); //display background

//latency of updating live-call?
//unmuting ghost caller?
//update call with sid
//each conf call = button
//effects, volume = connect inputs to right asset

// start server
app.listen(3000, () => console.log('started server'));

  