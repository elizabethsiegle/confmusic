const baseURL = process.env.BASE_URL;

let c5 = 'http://jardiohead.s3.amazonaws.com/c5.mp3'
let b5 = 'http://jardiohead.s3.amazonaws.com/b5.mp3'
let f5 = 'http://jardiohead.s3.amazonaws.com/f5.mp3'
let c6 = 'http://jardiohead.s3.amazonaws.com/c6.mp3'
let d5 = 'http://jardiohead.s3.amazonaws.com/d5.mp3'

const noteMap = {
}

module.exports = [{
    notes: ['D33', 'G34', 'EF4', 'C25'],
    conference: "ok-go-conference-A",
    phoneNumber: "+18596006546",
    sid : "",
    active: 'false',
    num: 0, //should be same as members.length
    members: [] //init
  }, {
    notes: ['A35', 'A3min', 'G4', 'D24'],
    conference: "ok-go-conference-B",
    phoneNumber: "+15406666546",
    sid : "",
    num: 0, //should be same as members.length
    members: [] //init
  }, {
    notes: ['G35', 'A4', 'C4', 'E24'],
    conference: "ok-go-conference-C",
    phoneNumber: "+16175536546",
    sid : "",
    num: 0, //should be same as members.length
    members: [] //init
  }, {
    notes: ['F33', 'DG3', 'D4', 'F24'],
    conference: "ok-go-conference-D",
    phoneNumber: "+16307556546",
    sid: "",
    num: 0, //should be same as members.length
    members: [] //init
  }, {
    notes: ['A34', 'GF4', 'E4', 'drone'],
    conference: "ok-go-conference-E",
    phoneNumber: "+16194576546",
    sid: "",
    num: 0, //should be same as members.length
    members: [] //init
  }
  // , { 
  //   sound: "g4",
  //   file: b5,
  //   url: baseURL+"/ohyeah",
  //   conference: "okgo-conference-F",
  //   sid : "",
  //   active: 'false',
  //   num: 0, //should be same as members.length
  //   members: [] //init
  // }, {
  //   sound: "a5",
  //   file: c5,
  //   url: baseURL+"/bass",
  //   conference: "okgo-conference-G",
  //   sid : "",
  //   active: 'false',
  //   num: 0, //should be same as members.length
  //   members: [] //init
  // }, {
  //   sound: "b5",
  //   file: d5,
  //   url: baseURL+"/drum",
  //   conference: "okgo-conference-H",
  //   sid : "",
  //   active: 'false',
  //   num: 0, //should be same as members.length
  //   members: [] //init
  // }, {
  //   sound: "c5",
  //   file: c6,
  //   url: baseURL+"/sound1",
  //   conference: "okgo-conference-I",
  //   sid: "",
  //   active: 'false',
  //   num: 0, //should be same as members.length
  //   members: [] //init
  // }, {
  //   sound: "d5",
  //   file: f5,
  //   url: baseURL+"/sound2",
  //   conference: "okgo-conference-J",
  //   sid: "",
  //   active: 'false',
  //   num: 0, //should be same as members.length
  //   members: [] //init
  // }
]