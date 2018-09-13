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
//call initiated

// configure routes
var numCallers = [];
app.post('/joinconference', (req, res) => {
  if(req.body.From != fromNumber && !numCallers.includes(req.body.From)) { //fromNumber is the ghost caller, tends to call a lot lmao
    var caller = req.body.From;
    numCallers.push(caller); //don't add ghostnumber, only real audience numbers
    console.log("caller", caller);
  }
  console.log("numCallers arr ", numCallers); 
  var rand = randomIntFromInterval(1,2); //number of conference channels
  console.log("rand ", rand);

  var twiml2ret = null;
  if(rand == 1) { //1
    console.log("conf group 1")
    let twiml1 = new twilio.twiml.VoiceResponse;
    let dial = twiml.dial();
    twiml1.say('Get ready to be amazed by Okay Go. Welcome to conference 1!'); //doesn't say 
    dial.conference('okgoconference1', {
      startConferenceOnEnter: true //run once
    // muted: true //yolo
    });
    twiml2ret = twiml1;
  }
  else if (rand == 2) {  //2
    let twiml2 = new twilio.twiml.VoiceResponse;
    let dial2 = twiml.dial();
    twiml2.say('Get ready to be amazed by Okay Go. Welcome to conference 2!'); //doesn't say
    console.log("conf 2");
    dial2.conference('okconference2', {
      startConferenceOnEnter: true //run once
      // muted: true //yolo
    });
    twiml2ret = twiml2;
  }
  // else if (rand == 3) { //(numCallers.length == 3) {
  //   console.log("conf 3");
  //   twiml.say('Welcome to conference 3!');
  //   dial.conference('okconference3', {
  //     startConferenceOnEnter: true //run once
  //     // muted: true //yolo
  //   });
  //   //twiml2ret = twiml3;
  // }
  // else if(rand == 4) {
  //   console.log("conf 4");
  //   twiml.say('Welcome to the conference 4!');
  //   dial.conference('okconference4', {
  //     startConferenceOnEnter: true //run once
  //     // muted: true //yolo
  //   });
  //   // twiml2ret = twiml4;
  // }  
  // else if(rand == 5) {
  //   console.log("conf 5");
  //   twiml.say('Welcome to the conference 5!');
  //   dial.conference('okconference5', {
  //     startConferenceOnEnter: true //run once
  //     // muted: true //yolo
  //   });
  //   // twiml2ret = twiml5;
  // }
  // else if(rand == 6) {
  //   console.log("conf 6");
  //   twiml.say('Welcome to the conference 6!');
  //   dial.conference('okconference6', {
  //     startConferenceOnEnter: true //run once
  //     // muted: true //yolo
  //   });
  //   // twiml2ret = twiml6;
  // }
  // else if(rand == 7) {
  //   console.log("conf 7");
  //   twiml.say('Welcome to the conference 7!');
  //   dial.conference('okconference7', {
  //     startConferenceOnEnter: true //run once
  //     // muted: true //yolo
  //   });
  //   // twiml2ret = twiml7;
  // }
  // else if(rand == 8) {
  //   console.log("conf 8");
  //   twiml.say('Welcome to the conference 8!');
  //   dial.conference('okconference8', {
  //     startConferenceOnEnter: true //run once
  //     // muted: true //yolo
  //   });
  //   // twiml2ret = twiml8;
  // }

  // else if(rand == 9) {
  //   console.log("conf 9");
  //   twiml.say('Welcome to the conference 9!');
  //   dial.conference('okconference9', {
  //     startConferenceOnEnter: true //run once
  //     // muted: true //yolo
  //   });
  //   // twiml2ret = twiml8;
  // }
  // else if(rand == 10) {
  //   console.log("conf 10");
  //   twiml.say('Welcome to the conference 10!');
  //   dial.conference('okconference10', {
  //     startConferenceOnEnter: true //run once
  //     // muted: true //yolo
  //   });
  //   // twiml2ret = twiml8;
  // }
  res.type('text/xml').send(twiml2ret.toString());
})

//TODO: add if button clicked (in html file), be listener, edit callsid
// RIGHT NOW: attendees call in to +17172971757, configured with /soundparticipant 
//curl or function to make music on command, do once
//no one ever calls this number, request happens in background
app.post('/soundparticipant', (req, res) => {
  console.log(req.body.button); //print in terminal, ngrok
  if(req.body.button == "oh-yeah") {
    console.log("oh-yeah clicked, rickroll, nodejs");
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
      url: 'http://lizzie.ngrok.io/sound-2', //TODO currently rickrolls should instead point to listener for button click
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

  