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
let okgobass = 'http://jardiohead.s3.amazonaws.com/okgo-demo-bass.wav' 
let classic = 'https://demo.twilio.com/docs/classic.mp3'
let cowbell = 'https://api.twilio.com/cowbell.mp3'
let okgodrum = 'http://jardiohead.s3.amazonaws.com/okgo-demo-drum.wav'
let okgosound1 = 'http://jardiohead.s3.amazonaws.com/okgo-demo-sound1.wav'
let okgosound2 = 'http://jardiohead.s3.amazonaws.com/okgo-demo-sound2.wav'


// const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
// const fromNumber = process.env.TWILIO_NUMBER
// const toNumber = process.env.OKGO_CONF_NUMBER
// const callbackURL = process.env.CALLBACK_URL

const client = require('twilio')("ACd7546b9ed2055fe55ee4209bb3043591", "5fbdc4855c2343dbe8a295bb10635871")
const fromNumber = "+15612200834" 
const toNumber = "+17172971757"
const callbackURL = "http://lizzie.ngrok.io/rickroll"

function randomIntFromInterval(min,max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}
var twiml = new twilio.twiml.VoiceResponse;
// configuring middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.raw({ type: 'audio/x-wav'})); //vnd.wave
app.use(bodyParser.json());

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

app.post('/bass', (req, res) => {
  let twiml2 = new twilio.twiml.VoiceResponse(); 
  console.log("bass")
  twiml2.play(okgobass); //classic url for now, need to work on okgo .wav files
  res.type('audio/x-wav').send(twiml2.toString()); //vnd.wave
});

app.post('/drum', (req, res) => {
  let twiml2 = new twilio.twiml.VoiceResponse(); 
  console.log("drum")
  twiml2.play(okgodrum); //classic url for now, need to work on okgo .wav files
  console.log(twiml2.toString());
  //res.type('audio/wav').send(twiml2.toString());
});

app.post('/sound1', (req, res) => {
  let twiml2 = new twilio.twiml.VoiceResponse(); 
  console.log("sound1")
  twiml2.play(okgosound1); //classic url for now, need to work on okgo .wav files
  console.log(twiml2.toString());
  //res.type('audio/wav').send(twiml2.toString());
});
app.post('/sound2', (req, res) => {
  let twiml2 = new twilio.twiml.VoiceResponse(); 
  console.log("sound2")
  twiml2.play(okgosound2); //classic url for now, need to work on okgo .wav files
  console.log(twiml2.toString());
  //res.type('audio/wav').send(twiml2.toString());
});

let injectAudio = url = sid => {
  client.calls(sid)
  .update({method: 'POST', url: 'http://lizzie.ngrok.io/cowbell'})
  .then(call => console.log(call.to))
  .done()
}

const soundDict = [{
    sound: "oh-yeah",
    sid : ""
  }, {
    sound: "bass",
    sid : ""
  }, {
    soind: "drum",
    sid : ""
  }, {
    sound: "sound1",
    sid: ""
  }, {
    sound: "sound2",
    sid: ""
  }
]

const conferenceLines = ["+17172971757", "+12722073026", "+15866666294"] //diff twilio nums, each conf
// The function that starts all of the ghost calls
// and updates the soundDict
let createGhostCallers = () => {

  // iterate through collection, create call and assign sid to each object "sound" key
  soundDict.forEach(function(obj, iterator) {
    client.calls
    .create({
      url: "http://lizzie.ngrok.io/rickroll", //TODO currently rickrolls should instead point to listener for button click
      to: conferenceLines[iterator], //num configured to /joinconference +17172971757
      from: fromNumber // any verified or twilio number
    })
    .then(call => {
      console.log(call.sid);
      obj[iterator]['sid'] = call.sid;
      res.type('text/xml').send(call.sid);
    }).catch(err => console.log(err))
  }); 
  console.log(soundDict)
  
}

// configure routes
var numCallers = [];
app.post('/joinconference', (req, res) => {
  if(req.body.From != fromNumber && !numCallers.includes(req.body.From)) { //fromNumber is the ghost caller, tends to call a lot lmao
    var caller = req.body.From;
    numCallers.push(caller); //don't add ghostnumber, only real audience numbers
    console.log("caller", caller);
  }
  createGhostCallers();
  console.log("numCallers arr ", numCallers); 
  var rand = randomIntFromInterval(1,2); //number of conference channels
  console.log("rand ", rand);
  let twiml = new twilio.twiml.VoiceResponse;

  console.log(`conf group ${rand}`)
  
  let dial = twiml.dial();
  twiml.say(`Get ready to be amazed by Okay Go. Welcome to conference ${rand}!`); //doesn't say 
  dial.conference(`okgoconference${rand}`, {
    startConferenceOnEnter: true //run once
    // muted: true //yolo
  });
  injectAudio();
  res.type('text/xml').send(twiml.toString());
})


// The route that executes the injectAudio function
app.post('/soundparticipant', (req, res) => {
  console.log(req.body.button); //print in terminal, ngrok

  //update soundDict 

  if(req.body.button == "oh-yeah") {
    console.log("oh-yeah clicked, rickroll, nodejs");
    
  } //if "oh-yeah"
  else if(req.body.button == "bass") {
    console.log("bass clicked, nodejs");
    client.calls
    .create({
      url: 'http://lizzie.ngrok.io/bass', //TODO currently rickrolls should instead point to listener for button click
      to: toNumber, //num configured to /joinconference +17172971757
      from: fromNumber // any verified or twilio number
    })
    .then(call => {
      console.log(call.sid);
        res.type('text/xml').send(call.sid);
    }).catch(err => console.log(err))
  }
  else if(req.body.button == "drum") {
    console.log("drum clicked, nodejs");
    client.calls
    .create({
      url: 'http://lizzie.ngrok.io/drum', //TODO currently rickrolls should instead point to listener for button click
      to: toNumber, //num configured to /joinconference +17172971757
      from: fromNumber // any verified or twilio number
    })
    .then(call => {
      console.log(call.sid);
        res.type('text/xml').send(call.sid);
    }).catch(err => console.log(err))
  }
  else if(req.body.button == "sound-1") {
    console.log("sound-1 clicked, nodejs");
    client.calls
    .create({
      url: 'http://lizzie.ngrok.io/sound1', //TODO currently rickrolls should instead point to listener for button click
      to: toNumber, //num configured to /joinconference +17172971757
      from: fromNumber // any verified or twilio number
    })
    .then(call => {
      console.log(call.sid);
        res.type('text/xml').send(call.sid);
    }).catch(err => console.log(err))
  }
  else if(req.body.button == "sound-2") {
    console.log("sound-2 clicked, nodejs");
    client.calls
    .create({
      url: 'http://lizzie.ngrok.io/sound2', //TODO currently rickrolls should instead point to listener for button click
      to: toNumber, //num configured to /joinconference +17172971757
      from: fromNumber // any verified or twilio number
    })
    .then(call => {
      console.log(call.sid);
        res.type('text/xml').send(call.sid);
    }).catch(err => console.log(err))
  }
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

  