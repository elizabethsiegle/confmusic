'use strict';
var dotenv = require('dotenv');
dotenv.load();
const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const fs = require('fs')
const path = require('path');
const _ = require('underscore');
var urllib = require('urllib');
var url = require('url');
const app = express();
const twilio = require('twilio');
let okgobass = '' 
let c5 = 'http://jardiohead.s3.amazonaws.com/c5.mp3'
let b5 = 'http://jardiohead.s3.amazonaws.com/b5.mp3'
let f5 = 'http://jardiohead.s3.amazonaws.com/f5.mp3'
let c6 = 'http://jardiohead.s3.amazonaws.com/c6.mp3'
let d5 = 'http://jardiohead.s3.amazonaws.com/d5.mp3'


const client = require('twilio')(process.env.TWILIO_DOITLIVE_SID, process.env.TWILIO_DOITLIVE_AUTH_TOKEN)
const fromNumber = "+14153635682"
const toNumber = process.env.OKGO_CONF_NUMBER
const baseURL = process.env.BASE_URL

function randomIntFromInterval(min,max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}
// configuring middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.raw({ type: 'audio/x-wav'})); //vnd.wave
app.use(bodyParser.json());

app.post('/sound1', (req, res) => {
  let twiml = getSoundTwiml("sound1");
  res.type('text/xml').send(twiml);
});

app.post('/sound2', (req, res) => {
  let twiml = getSoundTwiml("sound2");
  res.type('text/xml').send(twiml);
});

app.post('/bass', (req, res) => {
  let twiml = getSoundTwiml("bass");
  res.type('text/xml').send(twiml);
});

app.post('/drum', (req, res) => {
  let twiml = getSoundTwiml("sound1");
  res.type('text/xml').send(twiml);
});

app.post('/ohyeah', (req, res) => {
  let twiml = getSoundTwiml("oh-yeah");
  res.type('text/xml').send(twiml);
});

app.post('/hold', (req, res) => {
  let twiml = new twilio.twiml.VoiceResponse(); 
  twiml.play("http://jardiohead.s3.amazonaws.com/silence-5.mp3");
  res.type('text/xml').send(twiml.toString());
  //res.type('audio/wav').send(twiml2.toString());
});


const soundDict = [{
    sound: "oh-yeah",
    file: b5,
    url: baseURL+"/ohyeah",
    conference: "okgoconferenceA",
    sid : "",
    active: 'false'
  }, {
    sound: "bass",
    file: c5,
    url: baseURL+"/bass",
    conference: "okgoconferenceB",
    sid : "",
    active: 'false'
  }, {
    sound: "drum",
    file: d5,
    url: baseURL+"/drum",
    conference: "okgoconferenceC",
    sid : "",
    active: 'false'
  }, {
    sound: "sound1",
    file: c6,
    url: baseURL+"/sound1",
    conference: "okgoconferenceD",
    sid: "",
    active: 'false'
  }, {
    sound: "sound2",
    file: f5,
    url: baseURL+"/sound2",
    conference: "okgoconferenceE",
    sid: "",
    active: 'false'
  }
]

// creates Twiml for the routes
let getSoundTwiml = (sound) => {
  let twiml = new twilio.twiml.VoiceResponse(); 
  let soundObj = _.findWhere(soundDict, {sound: sound});
  console.log(`Play the file ${soundObj.file}`)
  twiml.play(soundObj.file);
  twiml.redirect(`${baseURL}/hold`);
  return twiml.toString();
}

// configure routes
var numCallers = [];
app.post('/joinconference', (req, res) => {
  if (numCallers.length < 1) createGhostCallers();
  if(req.body.From != fromNumber && !numCallers.includes(req.body.From)) { //fromNumber is the ghost caller, tends to call a lot lmao
    let caller = req.body.From;
    numCallers.push(caller); //don't add ghostnumber, only real audience numbers
    console.log("caller", caller);
  }
  console.log("numCallers arr ", numCallers); 
  
  let twiml = new twilio.twiml.VoiceResponse();

  let rand = randomIntFromInterval(0,4) //number of conference channels
  console.log(`conf group ${rand}`)
  
  twiml.say(`Get ready to be amazed by Okay Go. Welcome to conference ${soundDict[rand].conference}!`);

  let dial = twiml.dial();

  let robot = req.body.From == fromNumber;
  console.log(`Is this a robot? ${robot}`)
  // If it's from the fromNumber let's join a specific conference otherwise join a random conference
  if (req.body.From == fromNumber) {
    console.log("Looks like we have a bot.");
    console.log(soundDict);
    let emptyConference = _.findWhere(soundDict, {active: 'false'});
    console.log(emptyConference);
    emptyConference.active = 'true';
    dial.conference(emptyConference.conference, {
      startConferenceOnEnter: true //run once
    })
  } else {
    dial.conference(soundDict[rand]['conference'], {
      startConferenceOnEnter: false //run once
      // muted: true //yolo
    });
  }
  
  res.type('text/xml').send(twiml.toString());
})


let injectAudio = (sid, url) => {
  client.calls(sid)
  .update({method: 'POST', url: url})
  .then(call => console.log(call.to))
  .done()
}

// The function that starts all of the ghost calls
// and updates the soundDict
let createGhostCallers = () => {
  // iterate through collection, create call and assign sid to each object "sound" key
  _.each(soundDict, (obj, i) => {
    console.log(obj, i)
    client.calls
    .create({
      url: `${baseURL}/hold`, //TODO currently rickrolls should instead point to listener for button click
      to: toNumber, //num configured to /joinconference +17172971757
      from: fromNumber // any verified or twilio number
    })
    .then(call => {
      obj.sid = call.sid;
      console.log(`updating ${obj.sound} with call sid: ${call.sid}`)
      console.log(obj)
    }).catch(err => console.log(err))
  })
}

// The route that executes the injectAudio function
app.post('/soundparticipant', (req, res) => {
  console.log(req.body.button); //print in terminal, ngrok
  let soundObj = _.findWhere(soundDict, {sound: req.body.button});
  console.log(`Play the file ${soundObj.file}`);
  injectAudio(soundObj.sid, soundObj.url)
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

  