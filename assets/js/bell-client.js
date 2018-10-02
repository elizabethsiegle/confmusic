$(function () {
  log('Requesting Capability Token...');
  $.getJSON('https://abundant-team-2743.twil.io/capability-token')
    .done(function (data) {
      log('Got a token.');
      console.log('Token: ' + data.token);

      // Setup Twilio.Device
      Twilio.Device.setup(data.token);

      Twilio.Device.ready(function (device) {
        log('Twilio.Device Ready!');
        $('#call-controls').removeClass('hidden');
      });

      Twilio.Device.error(function (error) {
        log('Twilio.Device Error: ' + error.message);
      });

      Twilio.Device.connect(function (conn) {
        log('Successfully established call!');
        $('#button-call').addClass('hidden');
        console.log('CONNECTED !!!!!!!!!!!!!!!!!!!!!!!!!!')
        $('.action').addClass('live');
        $('#button-hangup').removeClass('hidden');
        // volumeIndicators.style.display = 'block';
        // bindVolumeIndicators(conn);
      });

      Twilio.Device.disconnect(function (conn) {
        log('Call ended.');
        $('#button-call').removeClass('hidden');
        $('.action').removeClass('live');
        $('#button-hangup').addClass('hidden');
      });

      Twilio.Device.incoming(function (conn) {
        console.log('Incoming connection from ' + conn.parameters.From);
        var archEnemyPhoneNumber = '+12093373517';

        if (conn.parameters.From === archEnemyPhoneNumber) {
          conn.reject();
          console.log('It\'s your nemesis. Rejected call.');
        } else {
          // accept the incoming connection and start two-way audio
          conn.accept();
        }
      });

      console.log(data.identity);

      Twilio.Device.audio.on('deviceChange', updateAllDevices);

      // Show audio selection UI if it is supported by the browser.
      // if (Twilio.Device.audio.isSelectionSupported) {
      //   document.getElementById('output-selection').style.display = 'block';
      // }
      // document.getElementById('output-selection').style.display = 'block';
    })
    .fail(function () {
      log('Could not get a token from server!');
    });

  // document.getElementById('get-devices').onclick = function() {
  //   navigator.mediaDevices.getUserMedia({ audio: true })
  //     .then(updateAllDevices);
  // };

  // speakerDevices.addEventListener('change', function() {
  //   var selectedDevices = [].slice.call(speakerDevices.children)
  //     .filter(function(node) { return node.selected; })
  //     .map(function(node) { return node.getAttribute('data-id'); });
    
  //   Twilio.Device.audio.speakerDevices.set(selectedDevices);
  // });

  // ringtoneDevices.addEventListener('change', function() {
  //   var selectedDevices = [].slice.call(ringtoneDevices.children)
  //     .filter(function(node) { return node.selected; })
  //     .map(function(node) { return node.getAttribute('data-id'); });
    
  //   Twilio.Device.audio.ringtoneDevices.set(selectedDevices);
  // });

  // function bindVolumeIndicators(connection) {
  //   connection.volume(function(inputVolume, outputVolume) {
  //     var inputColor = 'red';
  //     if (inputVolume < .50) {
  //       inputColor = 'green';
  //     } else if (inputVolume < .75) {
  //       inputColor = 'yellow';
  //     }

  //     // inputVolumeBar.style.width = Math.floor(inputVolume * 300) + 'px';
  //     // inputVolumeBar.style.background = inputColor;

  //     var outputColor = 'red';
  //     if (outputVolume < .50) {
  //       outputColor = 'green';
  //     } else if (outputVolume < .75) {
  //       outputColor = 'yellow';
  //     }

  //     // outputVolumeBar.style.width = Math.floor(outputVolume * 300) + 'px';
  //     // outputVolumeBar.style.background = outputColor;
  //   });
  // }

  function updateAllDevices() {
    updateDevices('speakerDevices', Twilio.Device.audio.speakerDevices.get());
    updateDevices('ringtoneDevices', Twilio.Device.audio.ringtoneDevices.get());
  }
});

// Update the available ringtone and speaker devices
function updateDevices(selectEl, selectedDevices) {
  Twilio.Device.audio.availableOutputDevices.forEach(function(device, id) {
    var isActive = (selectedDevices.size === 0 && id === 'default');
    selectedDevices.forEach(function(device) {
      if (device.deviceId === id) { isActive = true; }
    });
    console.log(`////////////////////// DEVICE ID = ${id}`)
    console.log(device.label);
  });
}

// Activity log
function log(message) {
  var logDiv = document.getElementById('log');
  logDiv.innerHTML += '<p>&gt;&nbsp;' + message + '</p>';
  logDiv.scrollTop = logDiv.scrollHeight;
}

function dialClient() {
  Twilio.Device.connect("+15556505813");
}

function hangupClient() {
  Twilio.Device.disconnectAll();
}