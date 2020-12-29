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

