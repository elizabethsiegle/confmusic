var dotenv = require('dotenv');
dotenv.load();
const client = require('twilio')(process.env.TWILIO_DOITLIVE_SID, process.env.TWILIO_DOITLIVE_AUTH_TOKEN);

client.calls.create({
	url: 'http://demo.twilio.com/docs/voice.xml',
    to: '+12243130660',
    from: '+19787889905'
})
.then(call => console.log(call.sid))
.done();
// client.calls.create({
// 	url: 'http://demo.twilio.com/docs/voice.xml',
//     to: '+12243130660',
//     from: '+14159939321'
// })
// .then(call => console.log(call.sid))
// .done();
// client.calls.create({
// 	url: 'http://demo.twilio.com/docs/voice.xml',
//     to: '+12243130660',
//     from: '+16103475323'
// })
// .then(call => console.log(call.sid))
// .done();
// client.calls.create({
// 	url: 'http://demo.twilio.com/docs/voice.xml',
//     to: '+12243130660',
//     from: '+16174465939'
// })
// .then(call => console.log(call.sid))
// .done();
// client.calls.create({
// 	url: 'http://demo.twilio.com/docs/voice.xml',
//     to: '+12243130660',
//     from: '+19787889902'
// })
// .then(call => console.log(call.sid))
// .done();
// client.calls.create({
// 	url: 'http://demo.twilio.com/docs/voice.xml',
//     to: '+12243130660',
//     from: '+14357408791'
// })
// .then(call => console.log(call.sid))
// .done();
// client.calls.create({
// 	url: 'http://demo.twilio.com/docs/voice.xml',
//     to: '+12243130660',
//     from: '+14159939372'
// })
// .then(call => console.log(call.sid))
// .done();
// client.calls.create({
// 	url: 'http://demo.twilio.com/docs/voice.xml',
//     to: '+12243130660',
//     from: '+17178961457'
// })
// .then(call => console.log(call.sid))
// .done();
// client.calls.create({
// 	url: 'http://demo.twilio.com/docs/voice.xml',
//     to: '+12243130660',
//     from: '+14072888223'
// })
// .then(call => console.log(call.sid))
// .done();
// client.calls.create({
// 	url: 'http://demo.twilio.com/docs/voice.xml',
//     to: '+12243130660',
//     from: '+16182382187'
// })
// .then(call => console.log(call.sid))
// .done();
// client.calls.create({
// 	url: 'http://demo.twilio.com/docs/voice.xml',
//     to: '+12243130660',
//     from: '+15866666294'
// })
// .then(call => console.log(call.sid))
// .done();
// client.calls.create({
// 	url: 'http://demo.twilio.com/docs/voice.xml',
//     to: '+12243130660',
//     from: '+61385955464'
// })
// .then(call => console.log(call.sid))
// .done();
// client.calls.create({
// 	url: 'http://demo.twilio.com/docs/voice.xml',
//     to: '+12243130660',
//     from: '+17652484839'
// })
// .then(call => console.log(call.sid))
// .done();
// client.calls.create({
// 	url: 'http://demo.twilio.com/docs/voice.xml',
//     to: '+12243130660',
//     from: '+14154814916'
// })
// .then(call => console.log(call.sid))
// .done();
// client.calls.create({
// 	url: 'http://demo.twilio.com/docs/voice.xml',
//     to: '+12243130660',
//     from: '+12722073026'
// })
// .then(call => console.log(call.sid))
// .done();
// client.calls.create({
// 	url: 'http://demo.twilio.com/docs/voice.xml',
//     to: '+12243130660',
//     from: '+17192248740'
// })
// .then(call => console.log(call.sid))
// .done();
// client.calls.create({
// 	url: 'http://demo.twilio.com/docs/voice.xml',
//     to: '+12243130660',
//     from: '+17182150930'
// })
// .then(call => console.log(call.sid))
// .done();
// client.calls.create({
// 	url: 'http://demo.twilio.com/docs/voice.xml',
//     to: '+12243130660',
//     from: '+61390710124'
// })
// .then(call => console.log(call.sid))
// .done();
// //fromNum -> returns undefined 
// // client.calls.create({
// // 	url: 'http://demo.twilio.com/docs/voice.xml',
// //     to: '+12243130660',
// //     from: '+14153635682'
// // })
// // .then(call => console.log(call.sid))
// // .done();
// client.calls.create({
// 	url: 'http://demo.twilio.com/docs/voice.xml',
//     to: '+12243130660',
//     from: '+16414501934'
// })
// .then(call => console.log(call.sid))
// .done();
// client.calls.create({
// 	url: 'http://demo.twilio.com/docs/voice.xml',
//     to: '+12243130660',
//     from: '+15867855675'
// })
// .then(call => console.log(call.sid))
// .done();
// client.calls.create({
// 	url: 'http://demo.twilio.com/docs/voice.xml',
//     to: '+12243130660',
//     from: '+15705369476'
// })
// .then(call => console.log(call.sid))
// .done();
// client.calls.create({
// 	url: 'http://demo.twilio.com/docs/voice.xml',
//     to: '+12243130660',
//     from: '+17162717716'
// })
// .then(call => console.log(call.sid))
// .done();
// client.calls.create({
// 	url: 'http://demo.twilio.com/docs/voice.xml',
//     to: '+12243130660',
//     from: '+18507808112'
// })
// .then(call => console.log(call.sid))
// .done();