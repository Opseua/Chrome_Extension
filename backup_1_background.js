const WebSocket = require('ws');

let api;
import('./2_api.js').then(module => {
  api = module.default;
});

let clipboard;
import('./2_clipboard.js').then(module => {
  clipboard = module.default;
});

let notificacao;
import('./2_notificacao.js').then(module => {
  notificacao = module.default;
});

// ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ IMPORTAR COMANDOS AQUI ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
/* let comando_1;
import('./2_comando_1.js').then(module => {
  comando_1 = module.default;
}); */



// ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
// monitorar api
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

// click no icone
chrome.browserAction.onClicked.addListener(function () {
  alert("ICONE DA EXTENSAO 3")
});

// atalho pressionado
chrome.commands.onCommand.addListener(async function (command) {
  // identificar comando do atalho
  function getShortcutForCommand(commandName, callback) {
    chrome.commands.getAll(function (commands) {
      for (var i = 0; i < commands.length; i++) {
        if (commands[i].name === commandName) {
          callback(commands[i].shortcut);
          return;
        }
      } callback(null);
    });
  }
  // identificar teclas pressionadas
  var bac_ata = await new Promise(function (resolve, reject) {
    getShortcutForCommand(command, function (shortcut) {
      resolve(shortcut);
    });
  });
  var bac_com = command;
  // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ EXECUTAR COMANDOS AQUI ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓



/* prompt("Digite o seu comando") */
  alert("ATALHO");



  // ########## ATALHO_1 ##########
  /*   if (bac_com.match(/atalho_1/)) {
      comando_1(bac_com, bac_ata);
    } */








  // ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
});



