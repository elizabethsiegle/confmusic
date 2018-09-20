const express = require('express');
const soundRouter = express.Router();
const twilio = require('twilio');
const _ = require('underscore');
const baseURL = process.env.BASE_URL;

// creates Twiml for the routes
let getSoundTwiml = (note) => {
  let twiml = new twilio.twiml.VoiceResponse(); 
  console.log(`Playing a ${note} at ${baseURL}/audio/${note}.mp3`)
  twiml.play(`${baseURL}/audio/${note}.mp3`);
  twiml.redirect(`${baseURL}/hold`);
  return twiml.toString();
}

soundRouter.post('/playnote', (req, res) => {
  let twiml = getSoundTwiml(req.query.note);
  res.type('text/xml').send(twiml);
});

soundRouter.post('/hold', (req, res) => {
  let twiml = new twilio.twiml.VoiceResponse();
  twiml.play("http://jardiohead.s3.amazonaws.com/silence-45.mp3");
  res.type('text/xml').send(twiml.toString());
  //res.type('audio/wav').send(twiml2.toString());
});

module.exports = soundRouter;