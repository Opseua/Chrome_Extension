const WebSocket = require('ws');

const socket = new WebSocket('wss://ntfy.sh/OPSEUA/ws');
socket.addEventListener('message', function (event) {

  const json = JSON.parse(event.data);
  const inf1 = json.message;
  if (inf1) {
    console.log(inf1);
  }

});
socket.addEventListener('close', function (event) {
  alert('A conexão com o servidor foi interrompida.');
});