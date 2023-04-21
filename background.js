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



/* chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if(details.type === "xmlhttprequest") {
      const requestInfo = {
        url: details.url,
        method: details.method,
        headers: details.requestHeaders,
        //body: details.requestBody ? new TextDecoder("utf-8").decode(new Uint8Array(details.requestBody.raw[0].bytes)) : ''
      };
      console.log(details.requestBody);
      //console.log(requestInfo);
    }
  },
  { urls: ["<all_urls>"] },
  ["requestBody", "extraHeaders"]
); */







/* chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    try {
      if (details.type === "xmlhttprequest" && details.requestBody !== undefined) {
        const requestInfo = {
          url: details.url,
          method: details.method,
          headers: details.requestHeaders,
          body: details.requestBody ? details.requestBody.formData : ''
        };
        console.log(requestInfo);
      }
    } catch (error) {
      console.error(error);
    }
  },
  { urls: ["<all_urls>"] },
  ["requestBody"]
);
 */





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
);  */









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
  
*/











}


