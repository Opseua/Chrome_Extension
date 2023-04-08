let ApiNovaInformacao;
import('./src/gatilhos/ApiNovaInformacao.js').then(module => {
  ApiNovaInformacao = module.default;
});

let AtalhoPressionado;
import('./src/gatilhos/AtalhoPressionado.js').then(module => {
  AtalhoPressionado = module.default;
});

let VariavelGlobal;
import('./src/recursos/VariavelGlobal.js').then(module => {
  VariavelGlobal = module.default;
});

// *******************************************************

// ######################### CONEXAO: ONLINE
const socket = new WebSocket('wss://ntfy.sh/OPSEUA/ws');
socket.addEventListener('message', async function (event) {

  const background = JSON.parse(event.data)
  if (background.event == 'open') {
    //console.log('BACKGROUND: CONEXAO ESTABELECIDA');
    VariavelGlobal();
  }
  else
    if (background.event == 'message') {
      console.log('BACKGROUND: NOVA MENSAGEM');
      ApiNovaInformacao(background)
    }
    else {
      console.log('BACKGROUND: OUTRO EVENTO');
      return
    }

});

// ######################### CONEXAO: OFFLINE
socket.addEventListener('close', async function (event) {
  console.log('BACKGROUND: CONEXAO INTERROMPIDA');
});

// ######################### CLICK NO ICONE
chrome.browserAction.onClicked.addListener(async function () {
  console.log('BACKGROUND: ICONE PRESSIONADO');
});

// ######################### ATALHO PRESSIONADO
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
  const background_atalho = await new Promise(function (resolve, reject) {
    getShortcutForCommand(command, function (shortcut) {
      resolve(shortcut);
    });
  });
  const background_comando = command;

  const atalho_comando =
  {
    atalho: background_atalho,
    comando: background_comando
  }
  //console.log('BACKGROUND: ATALHO PRESSIONADO ' + atalho_comando.atalho);
  AtalhoPressionado(atalho_comando);

});





