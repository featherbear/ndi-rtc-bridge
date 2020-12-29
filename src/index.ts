// import grandiose from 'grandiose'

//   ; (async function () {
//     let devices = await grandiose.find({ showLocalSources: true }, 10 * 1000)
//     let stream = devices.find(o => o.name === 'FEATHERNET-PC (Test Pattern)') || devices[0]

//     console.log(stream);

//     let receiver = await grandiose.receive({ source: stream })
//     console.log(receiver);

//     try {
//       let i = 0
//       while (true) {
//         let videoFrame = await receiver.video();
//         console.log(++i, videoFrame);
//       }
//     } catch (e) { console.error(e); }
//   })();

// Load required modules
import http from 'http';
// var http = require("http");              // http server core module
var express = require("express");           // web framework external module
var io = require("socket.io");         // web socket external module
var easyrtc = require("open-easyrtc");           // EasyRTC external module

// Setup and configure Express http server. Expect a subfolder called "static" to be the web root.
var httpApp = express();

console.log(__dirname);
httpApp.use(express.static(__dirname + "/static/"));

// Start Express http server on port 8080
var webServer = http.createServer(httpApp).listen(8080);

// Start Socket.io so it attaches itself to Express server
// var socketServer = io(webServer);

var socketServer = io.listen(webServer, { "log level": 1 });

// Overriding the default easyrtcAuth listener, only so we can directly access its callback
easyrtc.events.on("easyrtcAuth", function (socket, easyrtcid, msg, socketCallback, callback) {
  easyrtc.events.defaultListeners.easyrtcAuth(socket, easyrtcid, msg, socketCallback, function (err, connectionObj) {
    if (err || !msg.msgData || !msg.msgData.credential || !connectionObj) {
      callback(err, connectionObj);
      return;
    }

    connectionObj.setField("credential", msg.msgData.credential, { "isShared": false });

    console.log("[" + easyrtcid + "] Credential saved!", connectionObj.getFieldValueSync("credential"));

    callback(err, connectionObj);
  });
});

// To test, lets print the credential to the console for every room join!
easyrtc.events.on("roomJoin", function (connectionObj, roomName, roomParameter, callback) {
  console.log("Connection from", connectionObj.getEasyrtcid());
  console.log(connectionObj);
  // connectionObj.getFieldValueSync("credential");

  // console.log(connectionObj.socket.id, connectionObj.socket);
  easyrtc.events.defaultListeners.roomJoin(connectionObj, roomName, roomParameter, callback);
});



// Start EasyRTC server
var easyrtcServer = easyrtc.listen(httpApp, socketServer, null, function (err, rtcRef) {
  console.log("Initiated");

  rtcRef.events.on("roomCreate", function (appObj, creatorConnectionObj, roomName, roomOptions, callback) {
    console.log("roomCreate fired! Trying to create: " + roomName);

    appObj.events.defaultListeners.roomCreate(appObj, creatorConnectionObj, roomName, roomOptions, callback);
  });
});



// import a from 'open-easyrtc/api/easyrtc'
// console.log(a);

/*, {
   // appAutoCreateEnable: false,
   // roomAutoCreateEnable: false,
  //  demosEnable: false,
  //  apiPublicFolder: '/rtc-assets'
});


*/