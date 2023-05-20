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

chamar()

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

  console.log("OK")







// Criar uma função para interceptar e modificar a requisição
function interceptarRequisicao(details) {
  // Extrair as informações relevantes da requisição
  const { url, method, requestHeaders } = details;

  // Exibir as informações da requisição original no console
  console.log('Requisição original:');
  console.log('URL:', url);
  console.log('Método:', method);
  console.log('Cabeçalhos:', requestHeaders);

  // Cancelar a requisição original
  return { cancel: true };
}

// Adicionar um listener para o evento 'onBeforeRequest' da API 'webRequest'
chrome.webRequest.onBeforeRequest.addListener(
  interceptarRequisicao,
  { urls: ["<all_urls>"] },
  ["requestHeaders", "blocking"]
);








  return




  let requestInfo = {};
  let onBeforeRequestListener;
  let onBeforeSendHeadersListener;

  function iniciarMonitoramento() {

    onBeforeRequestListener = function (details) {
      var tipo = "";
      if (details.type === "xmlhttprequest") {
        let requestBody = "";
        if (details.requestBody) {
          if (details.requestBody.formData) { // BODY TIPO: formData
            requestBody = JSON.stringify(details.requestBody.formData);
            tipo = "formData";
          }
          else if (details.requestBody.raw) { // BODY TIPO: raw
            const rawBytes = new Uint8Array(details.requestBody.raw[0].bytes);
            requestBody = String.fromCharCode.apply(null, rawBytes);
            tipo = "raw";
          }
          else if (details.requestBody.urlencoded) { // BODY TIPO: urlencoded
            const params = new URLSearchParams();
            for (const key in details.requestBody.urlencoded) {
              if (details.requestBody.urlencoded.hasOwnProperty(key)) {
                params.append(key, details.requestBody.urlencoded[key]);
              }
            }
            requestBody = params.toString();
            tipo = "urlencoded";
          }
        }
        requestInfo = {
          body: requestBody,
          tipo: tipo,
          documentId: details.documentId
        };
      }
    };

    onBeforeSendHeadersListener = function (details) {
      requestInfo = {
        x: "ETAPA: 2",
        method: details.method,
        url: details.url,
        headers: details.requestHeaders,
        ...requestInfo,
      };
      console.log(requestInfo);
      if (requestInfo.body.includes("CASA")) {
        console.log("REQUISICAO CANCELADA");
        return { cancel: true };
      } else {
        console.log("REQUISICAO ENVIADA");
        return { cancel: false };
      }
    };

    chrome.webRequest.onBeforeRequest.addListener(
      onBeforeRequestListener,
      { urls: ["<all_urls>"] },
      ["requestBody"]
    );

    chrome.webRequest.onBeforeSendHeaders.addListener(
      onBeforeSendHeadersListener,
      { urls: ["<all_urls>"] },
      ["requestHeaders", "blocking"]
    );
  }

  function pararMonitoramento() {
    chrome.webRequest.onBeforeRequest.removeListener(onBeforeRequestListener);
    chrome.webRequest.onBeforeSendHeaders.removeListener(onBeforeSendHeadersListener);
  }

  function alterarMonitoramento(valor) {
    if (valor) {
      iniciarMonitoramento();
    } else {
      console.log("REMOVENDO LISTENER");
      pararMonitoramento();
    }
  }

  async function concluido(inf) {

    let requisicaoCancelar = '';
    let listenerRemover = '';
    console.log(inf);

    if (inf.body.includes("CASA")) {
      requisicaoCancelar = true
      listenerRemover = true
    } else {
      requisicaoCancelar = false
      listenerRemover = false
    }

    return requisicaoCancelar

  }

  alterarMonitoramento(true);




















  /* TUDO OK
  
  
  let requestInfo = {};
    chrome.webRequest.onBeforeRequest.addListener(
      async function (details) {
        var tipo = "";
        if (details.type === "xmlhttprequest") {
          let requestBody = '';
          if (details.requestBody) {
            if (details.requestBody.formData) { // BODY TIPO: formData
              requestBody = JSON.stringify(details.requestBody.formData);
              tipo = "formData";
            }
            else if (details.requestBody.raw) { // BODY TIPO: raw
              const rawBytes = new Uint8Array(details.requestBody.raw[0].bytes);
              requestBody = String.fromCharCode.apply(null, rawBytes);
              tipo = "raw";
            }
            else if (details.requestBody.urlencoded) { // BODY TIPO: urlencoded
              const params = new URLSearchParams();
              for (const key in details.requestBody.urlencoded) {
                if (details.requestBody.urlencoded.hasOwnProperty(key)) {
                  params.append(key, details.requestBody.urlencoded[key]);
                }
              }
              requestBody = params.toString();
              tipo = "urlencoded";
            }
          }
          requestInfo = {
            x: "ETAPA: 1",
            url: details.url,
            method: details.method,
            body: requestBody,
            tipo: tipo,
          };
          if (requestInfo.headers) {
            displayRequestInfo();
          }
        }
      },
      { urls: ["<all_urls>"] },
      ["requestBody"]
    );
    
    chrome.webRequest.onBeforeSendHeaders.addListener(
      function (details) {
        const method = details.method;
        const url = details.url;
        const headers = details.requestHeaders;
        // Adiciona o novo cabeçalho "TESTE: VALOR"
        headers.push({ name: 'TESTE', value: 'VALOR' });
        requestInfo = {
          ...requestInfo,
          x: "ETAPA: 2",
          url: url,
          method: method,
          headers: headers,
        };
        if (requestInfo.body) {
          displayRequestInfo();
        }
        return { requestHeaders: headers };
      },
      { urls: ["<all_urls>"] },
      ["requestHeaders", "blocking"]
    );
    
    // Função para exibir as informações no console
    function displayRequestInfo() {
      console.log(requestInfo);
    }
  
  
  
  
  
  
  /*
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
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


