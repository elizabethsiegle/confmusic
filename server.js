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
var weightedRandom = require('weighted-random');
const app = express();
const twilio = require('twilio');
const soundRouter = require('./routers/sound-router')

const soundDict = require('./sound-dict.js')

const client = require('twilio')(process.env.TWILIO_DOITLIVE_SID, process.env.TWILIO_DOITLIVE_AUTH_TOKEN);
const fromNumber = "+14153635682";
const toNumber = process.env.OKGO_CONF_NUMBER;
const baseURL = process.env.BASE_URL;

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

// creates Twiml for the routes
let getSoundTwiml = (sound) => {
  let twiml = new twilio.twiml.VoiceResponse(); 
  let soundObj = _.findWhere(soundDict, {sound: sound});
  console.log(`Play the file ${soundObj.file}`)
  twiml.play(soundObj.file);
  twiml.redirect(`${baseURL}/hold`);
  return twiml.toString();
}

let loadBalance = () => {
  
}

// configure routes
var numCallersArr = [];
var numCallers = 0;
app.post('/joinconference', (req, res) => {  
  numCallers += 1;
  let twiml = new twilio.twiml.VoiceResponse();
  let rand = 0; //init
  let maxLines = soundDict.length - 1;
  //rand = randomIntFromInterval(0,maxLines);
  console.log(`Max Lines allowed: ${maxLines}`)
  //not random but even, even if bulk call all at once
  if(numCallers % 5 == 0) {
    rand = 0;
  }
  else if(numCallers % 5 == 1) {
    rand = 1;
  }
  else if(numCallers % 5 == 2) {
    rand = 2;
  }
  else if(numCallers % 5 == 3) {
    rand = 3;
  }
  else if (numCallers % 5 == 4) {
    rand = 4;
  }
  soundDict[rand].num += 1; //another person added to conference
  //console.log("num in conf ", soundDict[rand].num);
  twiml.say(`Get ready to be amazed by Okay Go. Welcome to ${soundDict[rand].conference}!`);
  if(req.body.From != fromNumber && !numCallersArr.includes(req.body.From)) { //fromNumber is the ghost caller, tends to call a lot lmao
    let caller = req.body.From;
    numCallersArr.push(caller); //total callers
    soundDict[rand].members.push(caller); //don't add ghostnumber, only real audience numbers
    console.log("caller", caller);
  }
  let dial = twiml.dial();

  //loadBalance();
  console.log(`/////////////////////////////// CALLER JOINED -------------------------->> ${soundDict[rand]['conference']}.`);
  dial.conference(soundDict[rand]['conference'], {
    startConferenceOnEnter: true //run once
    // muted: true //yolo
  });
  console.log("soundDict ", soundDict);
  res.type('text/xml').send(twiml.toString());
});

let injectAudio = (sid, url, func) => {
  client.calls(sid)
  .update({method: 'POST', url: url})
  .then(call => console.log(call.to))
  .catch(err => console.log(err))
  .done(func())
}

let endCalls = () => {
  _.each(soundDict, (obj, i) => {
    console.log("ending Ghost Caller i "+i)
    client.calls(obj.sid)
      .update({status: 'completed'})
      .then(call => console.log(call.status))
      .catch(err => console.log(err))
      .done();
  })
}

let createGhostCallers = () => {
  // iterate through collection, create call and assign sid to each object "sound" key
  _.each(soundDict, (obj, i) => {
    console.log("creating Ghost Caller i "+i)
    client.calls
    .create({
      record: true,
      url: `${baseURL}/hold`, //TODO currently rickrolls should instead point to listener for button click
      to: obj.phoneNumber, //num configured to /joinconference +17172971757
      from: fromNumber // any verified or twilio number
    })
    .then(call => {
      obj.sid = call.sid;
      console.log(`updating ${obj.conference} with call sid: ${call.sid}`)
      console.log(`Call status: ${call.status}`)
      // console.log("obj ", obj)
    }).catch(err => console.log(err))
  })
}

// The route that executes the injectAudio function
app.post('/soundparticipant', (req, res) => {
  let note = req.body.note;
  let soundObj = _.find(soundDict, (channel) => {
    return _.contains(channel.notes, note)
  });
  injectAudio(soundObj.sid, `${baseURL}/playnote?note=${note}`, function() {
    res.status(200).send('completed request')
  });
});


//serve up pad.html
app.get('/', function(req, res){
  createGhostCallers()
  res.sendFile('assets/pad.html', { root : __dirname});
}).get('/wand', function(req, res){
  res.sendFile('assets/wand.html', { root : __dirname});
}).get('/client', function(req, res){
  res.sendFile('assets/client-test.html', { root : __dirname});
});
app.use(express.static('assets')); //display background
app.use(soundRouter);




// Cleanup
process.stdin.resume();//so the program will not close instantly

function exitHandler(options, exitCode) {
    endCalls();
    if (options.cleanup) console.log('clean');
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

// start server
app.listen(3000, () => console.log('started server'));

  