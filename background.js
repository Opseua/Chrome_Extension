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
let socket;
/* async function connect() {
  socket = new WebSocket('wss://ntfy.sh/OPSEUA/ws');

  // CONEXAO: ONLINE
  socket.addEventListener('open', async function (event) {
    console.log('BACKGROUND: CONEXAO ESTABELECIDA');
    VariavelGlobal();
  });

  // CONEXAO: NOVA MENSAGEM
  socket.addEventListener('message', async function (event) {
    const background = JSON.parse(event.data)
    if (background.event == 'message') {
      console.log('BACKGROUND: CONEXAO NOVA MENSAGEM');
      ApiNovaInformacao(background)
    }
  });

  // CONEXAO: OFFLINE, TENTAR NOVAMENTE
  socket.addEventListener('close', async function (event) {
    console.log('BACKGROUND: RECONEXAO EM 30 SEGUNDOS');
    setTimeout(connect, 30000);
  });
}
connect(); */

// ######################### CLICK NO ICONE
chrome.browserAction.onClicked.addListener(async function () {
  console.log('BACKGROUND: ICONE PRESSIONADO');
});

// ######################### ATALHO PRESSIONADO
chrome.commands.onCommand.addListener(async function (command) {


  chamar()

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






















function chamar() {

  /* chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
      if(details.type === "xmlhttprequest") {
        const requestInfo = {
          url: details.url,
          method: details.method,
          headers: details.requestHeaders,
          body: details.requestBody ? details.requestBody.formData : ''
        };
        console.log(requestInfo);
      }
    },
    { urls: ["<all_urls>"] },
    ["requestBody"]
  );
  
  chrome.webRequest.onCompleted.addListener(
    function(details) {
      if(details.type === "xmlhttprequest") {
        const responseInfo = {
          url: details.url,
          status: details.statusCode,
          statusText: details.statusText,
          headers: details.responseHeaders,
          body: details.responseBody
        };
        console.log(responseInfo);
      }
    },
    { urls: ["<all_urls>"] },
    ["responseHeaders"]
  ); */




  /* function injectScript(tabId) {
    chrome.tabs.executeScript(tabId, {
      code: `
        const origWebSocket = WebSocket;
        const newWebSocket = function(url, protocols) {
          console.log("WebSocket conectado em", url);
          const socket = new origWebSocket(url, protocols);
          socket.addEventListener("message", function(event) {
            console.log("Mensagem recebida:", event.data);
          });
          return socket;
        };
        WebSocket = newWebSocket;
      `
    });
  }
  
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (tabs && tabs.length > 0) {
      const tabId = tabs[0].id;
      injectScript(tabId);
    } else {
      console.log("Nenhuma aba ativa encontrada");
    }
  });
   */


  /* function injectScript(tabId) {
    chrome.tabs.executeScript(tabId, {

        const origWebSocket : WebSocket;
        const newWebSocket = function(url, protocols) {
          console.log("WebSocket conectado em", url);
          const socket = new origWebSocket(url, protocols);
          socket.addEventListener("message", function(event) {
            console.log("Mensagem recebida:", event.data);
          });
          return socket;
        };
        WebSocket = newWebSocket;
      
    });
  }
  
  chrome.tabs.query({}, function(tabs) {
    tabs.forEach(function(tab) {
      if (tab.url && !tab.url.startsWith("chrome://") && !tab.url.startsWith("chrome-extension://")) {
        injectScript(tab.id);
      }
    });
  }); */






}


