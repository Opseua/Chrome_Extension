const { regex, fileRead, fileWrite, configStorage } = await import('./functions.js');
const { api } = await import('./api.js');

import http from 'http';
import fs from 'fs';

// URL do fluxo TS
const url = 'http://pfsv.io:80/3915212198/88760/310.ts';

// Caminho onde o arquivo será salvo
const filePath = './fluxo.ts';

function saveFirstTenSeconds() {
  // Inicia uma solicitação GET para obter os dados do fluxo TS
  const request = http.get(url, (response) => {
    let dataBuffer = Buffer.alloc(0);

    // Lida com cada pedaço de dados recebidos no stream
    response.on('data', (chunk) => {
      dataBuffer = Buffer.concat([dataBuffer, chunk]);

      // Verifica se já passaram 10 segundos (em bytes)
      if (dataBuffer.length >= response.socket.bytesRead + 10000) {
        const firstTenSecondsData = dataBuffer.slice(0, response.socket.bytesRead + 10000);

        // Grava os primeiros dez segundos no arquivo
        fs.writeFile(filePath, firstTenSecondsData, (err) => {
          if (err) throw err;
          console.log(`Os primeiros dez segundos foram salvos em ${filePath}`);

          // Encerra a conexão HTTP após salvar os dados necessários
          request.abort();
        });
      }
    });

    // Lida com erros na solicitação HTTP
    response.on('error', (err) => {
      console.error(`Ocorreu um erro durante a solicitação: ${err.message}`);
    });
  });

  // Lida com erros na solicitação HTTP
  request.on('error', (err) => {
    console.error(`Ocorreu um erro durante a solicitação: ${err.message}`);
  });
}

// Inicia o processo de salvar os primeiros dez segundos assim que o servidor estiver ativo
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Servidor ativo');
});

server.listen(8080, () => {
  console.log('Servidor iniciado na porta 8080');

  // Aguarda dois segundos antes de iniciar a captura dos dados do fluxo TS
  setTimeout(saveFirstTenSeconds, 2000);
});