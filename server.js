//call +17172971757 configured with /joinconference , hear a welcome msg, redirect to /soundparticipant, get rickrolled
'use strict';
var dotenv = require('dotenv');
dotenv.load();
const bodyParser = require('body-parser'), 
express = require('express'),
http = require('http'),
qs = require('querystring'),
fs = require('fs'),
path = require('path'),
VoiceResponse = require('twilio').twiml.VoiceResponse,
app = express(),
twilio = require('twilio'),
client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN),
urllib = require('urllib'),
cheerio = require('cheerio'),
url = require('url'),
twiml2 = new twilio.twiml.VoiceResponse(),
okgobass = 'audio/okgo-demo-bass.wav',
classic = 'https://demo.twilio.com/docs/classic.mp3',
okgodrum = 'audio/okgo-demo-drum.wav',
okgosound1 = 'audio/okgo-demo-sound1.wav';

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
    startConferenceOnEnter: true, //run once
  });
  res.type('text/xml').send(twiml.toString());
});

//TODO: add if button clicked (in html file), be listener, edit callsid
// RIGHT NOW: attendees call in to +17172971757, configured with /soundparticipant 
//curl or function to make music on command, do once
//no one ever calls this number, request happens in background

app.post('/soundparticipant', (req, res) => {
  console.log(req.body.button);
  if (req.body.button = "oh-yeah") {
    client.calls
    .create({
      url: 'https://lizzie.ngrok.io/rickroll', //point to twiml that rickrolls
      to: '+17172971757', //num configured to /joinconference +17172971757
      from: '+15612200834' //'+12066505813', //ghost number, 2nd num, configured to /soundparticipant
      }) //create 
    .then(call => {
      console.log(call.sid);
      res.type('text/xml').send(call.sid);
    }).catch(err => console.log(err))
  }
  else {
    console.log("sent button that wasn't oh-yeah")
  }
});

app.post('/rickroll', (req, res) => {
  //twiml play classic

  let twiml2 = new twilio.twiml.VoiceResponse();
  console.log("rickroll");
  twiml2.play(classic); //classic url for now, need to work on okgo .wav files
  res.type('text/xml').send(twiml2.toString());
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

  