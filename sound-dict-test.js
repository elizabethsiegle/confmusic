const baseURL = process.env.BASE_URL;

let c5 = 'http://jardiohead.s3.amazonaws.com/c5.mp3'
let b5 = 'http://jardiohead.s3.amazonaws.com/b5.mp3'
let f5 = 'http://jardiohead.s3.amazonaws.com/f5.mp3'
let c6 = 'http://jardiohead.s3.amazonaws.com/c6.mp3'
let d5 = 'http://jardiohead.s3.amazonaws.com/d5.mp3'

const noteMap = {
}

module.exports = [{
    notes: ['D33', 'G34', 'EF4', 'C25', '50', '55', '60', '65', '70'],
    conference: "okgo-conference-A",
    phoneNumber: "+18596006546",
    sid : "",
    active: 'false',
    num: 0, //should be same as members.length
    members: [] //init
  }
]