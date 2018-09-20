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
let okgobass = '' 
let c5 = 'http://jardiohead.s3.amazonaws.com/c5.mp3'
let b5 = 'http://jardiohead.s3.amazonaws.com/b5.mp3'
let f5 = 'http://jardiohead.s3.amazonaws.com/f5.mp3'
let c6 = 'http://jardiohead.s3.amazonaws.com/c6.mp3'
let d5 = 'http://jardiohead.s3.amazonaws.com/d5.mp3'


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


const soundDict = [{
    sound: "oh-yeah",
    file: b5,
    url: baseURL+"/ohyeah",
    conference: "okgo-conference-A",
    sid : "",
    active: 'false',
    num: 0, //should be same as members.length
    members: [], //init
    weight: 10,
    confNum: 0
  }, {
    sound: "bass",
    file: c5,
    url: baseURL+"/bass",
    conference: "okgo-conference-B",
    sid : "",
    active: 'false',
    num: 0, //should be same as members.length
    members: [], //init
    weight: 10,
    confNum: 1
  }, {
    sound: "drum",
    file: d5,
    url: baseURL+"/drum",
    conference: "okgo-conference-C",
    sid : "",
    active: 'false',
    num: 0, //should be same as members.length
    members: [], //init
    weight: 10,
    confNum: 2
  }, {
    sound: "sound1",
    file: c6,
    url: baseURL+"/sound1",
    conference: "okgo-conference-D",
    sid: "",
    active: 'false',
    num: 0, //should be same as members.length
    members: [], //init
    weight: 10,
    confNum: 3
  }, {
    sound: "sound2",
    file: f5,
    url: baseURL+"/sound2",
    conference: "okgo-conference-E",
    sid: "",
    active: 'false',
    num: 0, //should be same as members.length
    members: [], //init
    weight: 10,
    confNum: 4
  }, { 
    sound: "oh-yeah-2",
    file: b5,
    url: baseURL+"/ohyeah",
    conference: "okgo-conference-F",
    sid : "",
    active: 'false',
    num: 0, //should be same as members.length
    members: [], //init
    weight: 10,
    confNum: 5
  }, {
    sound: "bass-2",
    file: c5,
    url: baseURL+"/bass",
    conference: "okgo-conference-G",
    sid : "",
    active: 'false',
    num: 0, //should be same as members.length
    members: [], //init
    weight: 10,
    confNum: 6
  }, {
    sound: "drum-2",
    file: d5,
    url: baseURL+"/drum",
    conference: "okgo-conference-H",
    sid : "",
    active: 'false',
    num: 0, //should be same as members.length
    members: [], //init
    weight: 10,
    confNum: 7
  }, {
    sound: "sound1-2",
    file: c6,
    url: baseURL+"/sound1",
    conference: "okgo-conference-I",
    sid: "",
    active: 'false',
    num: 0, //should be same as members.length
    members: [], //init
    weight: 10,
    confNum: 8
  }, {
    sound: "sound2-2",
    file: f5,
    url: baseURL+"/sound2",
    conference: "okgo-conference-J",
    sid: "",
    active: 'false',
    num: 0, //should be same as members.length
    members: [], //init
    weight: 10,
    confNum: 9
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

let loadBalance = () => {
  
}
let median = values => {
    values.sort(function(a,b) {
      return a-b;
  });

  if(values.length ===0) return 0

  var half = Math.floor(values.length / 2);

  if (values.length % 2)
    return values[half];
  else
    return (values[half - 1] + values[half]) / 2.0;
}
let findMode = arr => {
  var numMapping = {};
  var greatestFreq = 0;
  var mode;
  arr.forEach(function findMode(number) {
    numMapping[number] = (numMapping[number] || 0) + 1;

    if (greatestFreq < numMapping[number]) {
      greatestFreq = numMapping[number];
      mode = number;
    }
  });
  return +mode;
}

// configure routes
var numCallersArr = [];
app.post('/joinconference', (req, res) => {
  if (numCallersArr.length < 1) createGhostCallers(); 
  
  let twiml = new twilio.twiml.VoiceResponse();
  var maxArr = []; //array of number of people
  //loop through soundDict to check number of people in conference calls
  let rand = 0; //init
  _.each(soundDict, (obj, i) => {
    maxArr[i] = obj.num;
    maxArr.forEach(function (el) {
      if(el == i) {
        maxArr[el] = i;
      }
      maxArr[el] = 0;
    });
    console.log("here maxArr ", maxArr);
    if(obj.num !== -1) maxArr.splice(obj.num, 1); //remove from maxArr
    var min = Math.min.apply(Math, maxArr),
    max = Math.max.apply(Math, maxArr),
    med = median(maxArr),
    mode = findMode(maxArr);
    console.log("min, max, med, mode ", min, max, med, mode);
    console.log("obj.num ", obj.num);
    console.log("maxArr ", maxArr);
    if(obj.num == min) {
      obj.weight = 20;
    } 
    else if(obj.num == max) {
      obj.weight = 2;
    }
    else if(obj.num == med) {
      obj.weight = 8;
    }
    obj.weight = 10;
  }); //_each
  var weights = soundDict.map(function(conf) {
    return conf.weight;
  });
  rand = weightedRandom(weights);
  
  console.log(`conf group ${rand}`)
  soundDict[rand].num += 1; //another person added to conference
  //console.log("num in conf ", soundDict[rand].num);
  twiml.say(`Get ready to be amazed by Okay Go. Welcome to conference ${soundDict[rand].conference}!`);
  if(req.body.From != fromNumber && !numCallersArr.includes(req.body.From)) { //fromNumber is the ghost caller, tends to call a lot lmao
    let caller = req.body.From;
    numCallersArr.push(caller); //total callers
    soundDict[rand].members.push(caller); //don't add ghostnumber, only real audience numbers
    console.log("caller", caller);
    console.log("soundDict[rand].members ", soundDict[rand].members);
  }
  //console.log("numCallers arr ", numCallersArr);
  let dial = twiml.dial();

  let robot = req.body.From == fromNumber;
  console.log(`Is this a robot? ${robot}`)
  // If it's from the fromNumber let's join a specific conference otherwise join a random conference
  if (req.body.From == robot) { //robot used to be fromNumber and would return a 500 error after a while of running. robot returned 1 500 error
    console.log("Looks like we have a bot.");
    console.log(soundDict);
    let emptyConference = _.findWhere(soundDict, {active: 'false'});
    console.log(emptyConference); //returned undefined?
    emptyConference.active = 'true'; //used to/sometimes error: can't set property 'active' of undefined
    dial.conference(emptyConference.conference, {
      startConferenceOnEnter: true //run once
    })
  } else {
    //loadBalance();
    dial.conference(soundDict[rand]['conference'], {
      startConferenceOnEnter: false //run once
      // muted: true //yolo
    });
    console.log("conf ", soundDict[rand].conference); //conference room
  }
  
  res.type('text/xml').send(twiml.toString());
});


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
    client.calls
    .create({
      url: `${baseURL}/hold`, //TODO currently rickrolls should instead point to listener for button click
      to: toNumber, //num configured to /joinconference +17172971757
      from: fromNumber // any verified or twilio number
    })
    .then(call => {
      obj.sid = call.sid;
      console.log(`updating ${obj.sound} with call sid: ${call.sid}`)
      console.log("obj ", obj)
    }).catch(err => console.log(err))
  })
}

// The route that executes the injectAudio function
app.post('/soundparticipant', (req, res) => {
  // console.log("button clicked", req.body.button); //print in terminal, ngrok
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

  