async function getConfig() {
    const url = chrome.extension.getURL('path/to/config.json');
    
    try {
      const response = await fetch(url);
      const config = await response.json();
      
      // Aqui você pode acessar as chaves do 'config.json'
      console.log(config.key1);
      console.log(config.key2);
      
      // Restante do seu código...
    } catch (error) {
      console.error('Erro ao ler o arquivo JSON:', error);
    }
  }
  
  getConfig();