chrome.tabs.executeScript(tabId, {
    
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
    
  });