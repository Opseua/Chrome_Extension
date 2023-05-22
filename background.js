import('./onStart.js').then(module => module.default());

let Comando1;
import('./src/scripts/Comando1.js').then(module => {
  Comando1 = module.default;
});

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

let Network;
import('./src/recursos/Network.js').then(module => {
  Network = module.default;
});

// *******************************************************

// ######################### CONEXÃO | WEBSOCKET
async function connect() {
  let ws1;
  let ws2;
  let ws1On = false;
  let ws2On = false;
  function msg(txt) {
    console.log(txt);
  }

  if (!ws1On) {
    ws1 = new WebSocket('wss://ntfy.sh/OPSEUA/ws');

    // CONEXAO: ONLINE - WS 1
    ws1.addEventListener('open', async function (event) {
      msg('BACKGROUND: CONEXÃO ESTABELECIDA - WS 1');
      ws1On = true;
    });

    // CONEXAO: NOVA MENSAGEM - WS 1
    ws1.addEventListener('message', async function (event) {
      if (JSON.parse(event.data).event == 'message') {
        msg('BACKGROUND: CONEXAO NOVA MENSAGEM - WS 1');
        //ApiNovaInformacao(background)
      }
    });

    // CONEXAO: OFFLINE, TENTAR NOVAMENTE - WS 1
    ws1.addEventListener('close', async function (event) {
      msg('BACKGROUND: RECONEXÃO EM 30 SEGUNDOS - WS 1');
      ws1On = false;
      setTimeout(connect, 30000);
    });
  }

  if (!ws2On) {
    ws2 = new WebSocket('ws://localhost:8887');

    // CONEXAO: ONLINE - WS 2
    ws2.addEventListener('open', async function (event) {
      msg('BACKGROUND: CONEXÃO ESTABELECIDA - WS 2');
      ws2On = true;
      setTimeout(function () {
        ws2.send("Chrome: mensagem de teste");
      }, 3000);
    });

    // CONEXAO: NOVA MENSAGEM - WS 2
    ws2.addEventListener('message', async function (event) {
      msg('BACKGROUND: CONEXAO NOVA MENSAGEM - WS 2');
      msg('→ ' + event.data);
    });

    // CONEXAO: OFFLINE, TENTAR NOVAMENTE - WS 2
    ws2.addEventListener('close', async function (event) {
      msg('BACKGROUND: RECONEXÃO EM 30 SEGUNDOS - WS 2');
      ws2On = false;
      setTimeout(connect, 30000);
    });
  }

}
connect();

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


























