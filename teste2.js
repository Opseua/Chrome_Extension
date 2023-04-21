// Definir a função para interceptar as solicitações WebSocket
function interceptarWebSocket(socket) {
  console.log('Interceptando WebSocket:', socket);
  // Substituir o método 'send' do objeto WebSocket para interceptar todas as solicitações WebSocket
  socket.originalSend = socket.send;
  socket.send = function(data) {
    console.log('WebSocket request:', data);
    this.originalSend.apply(this, arguments);
  };

  // Adicionar um listener ao evento 'message' para ouvir as mensagens WebSocket recebidas
  socket.originalOnMessage = socket.onmessage;
  socket.onmessage = function(event) {
    console.log('WebSocket response:', event.data);
    this.originalOnMessage.apply(this, arguments);
  };
}

// Obter a aba ativa
chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
  // Injetar o código na aba ativa
  chrome.tabs.executeScript(tabs[0].id, {
    code: `
      // Substituir o construtor 'WebSocket' para interceptar todas as solicitações WebSocket
      const origWebSocket = WebSocket;
      const newWebSocket = function(url, protocols) {
        console.log("WebSocket conectado em", url);
        const socket = new origWebSocket(url, protocols);
        interceptarWebSocket(socket); // interceptar a solicitação WebSocket
        return socket;
      };
      WebSocket = newWebSocket;
    `
  });
});
