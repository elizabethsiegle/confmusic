'use strict';
require('dotenv').load();
const bodyParser = require('body-parser');
const express = require('express');
const sassMiddleware = require('node-sass-middleware');
const http = require('http');
const fs = require('fs')
const path = require('path');
const _ = require('underscore');
const urllib = require('urllib');
const url = require('url');
const app = express();
const twilio = require('twilio');
const soundRouter = require('./routers/sound-router')

// const soundDict = require('./sound-dict.js')
const soundDict = require('./sound-dict-test.js')

const client = require('twilio')(process.env.TWILIO_DOITLIVE_SID, process.env.TWILIO_DOITLIVE_AUTH_TOKEN);
const fromNumber = "+14153635682";
const toNumber = process.env.OKGO_CONF_NUMBER;
const baseURL = process.env.BASE_URL;

function randomIntFromInterval(min,max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}
// configuring middleware
app.set('port', (process.env.PORT || 3000));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.raw({ type: 'audio/x-wav'})); //vnd.wave
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(sassMiddleware({
    /* Options */
    src: path.join(__dirname, 'sass'),
    dest: path.join(__dirname, 'assets/css'),
    debug: true,
    outputStyle: 'compressed',
    prefix:  '/css'  // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
}));

let loadBalance = () => {
  
}

// configure routes
var numCallers = 0;

app.post('/joinconference', (req, res) => {  
  numCallers += 1;
  let twiml = new twilio.twiml.VoiceResponse();
  let maxLines = soundDict.length - 1;

  // Load balancing - idea use _.min to just add the caller to the room with the least people?
  let minConference = _.min(soundDict, (obj) => {
    return obj.num;
  })
  minConference.num += 1; //another person added to conference
  // Some logging for testing
  console.log(`/////////////////////////////// CALLER JOINED -------------------------->> ${minConference.conference}.`);

  twiml.say(`Get ready to be amazed by Okay Go. Welcome to conference ${minConference.conference}!`);
  let dial = twiml.dial();
  dial.conference(minConference.conference, {
    startConferenceOnEnter: true //run once
    // muted: true //yolo
  });
  
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
}).get('/bell/:note', function(req, res){
  console.log(req.params.note);
  res.render('phone-bell', {note: req.params.note});
}).get('/touch/:note', function(req, res){
  console.log(req.params.note);
  res.render('touch-bell', {note: req.params.note});
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
// process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
// process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

// start server
app.listen(app.get('port'), () => console.log('started server'));

  