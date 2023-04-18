async function Network(inf) {

// Obtém a guia ativa
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

  // Verifica se existe uma guia ativa
  if (tabs.length > 0) {

    // Obtém o ID da guia ativa
    var tabId = tabs[0].id;

    // Conecta-se ao processo de depuração da guia selecionada
    chrome.debugger.attach({ tabId: tabId }, "1.1", function () {

      // Habilita a captura de eventos de rede
      chrome.debugger.sendCommand({ tabId: tabId }, "Network.enable", {}, function () {

        // Registra um listener de evento para as solicitações de rede
        chrome.debugger.onEvent.addListener(function (debuggeeId, message, params) {
          if (message == "Network.requestWillBeSent") {
            console.log(params.request.url);
          }
        });

        // Começa a capturar eventos de rede
        chrome.debugger.sendCommand({ tabId: tabId }, "Network.enable");

      });

    });

  } else {
    console.log("Não há guias ativas");
  }

});




}

export default Network