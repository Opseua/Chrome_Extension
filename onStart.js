let Api;
import('./src/recursos/Api.js').then(module => {
  Api = module.default;
});

if (typeof process !== 'undefined' && process.release && process.release.name === 'node') {
  // RODANDO NO NODE
  const { default: ws } = require('ws');
  onStart()
}
// ############################################################################

async function onStart(inf) {

  let ws1;
  async function web1() {
    ws1 = new WebSocket('wss://ntfy.sh/OPSEUA/ws');
    ws1.addEventListener('open', async function (event) { // CONEXAO: ONLINE - WS1
      console.log(`BACKGROUND: CONEXAO ESTABELECIDA - WS1`)
    });
    ws1.addEventListener('message', async function (event) { // CONEXAO: NOVA MENSAGEM - WS1
      const background = JSON.parse(event.data)
      if (background.event == 'message') {
        console.log(`BACKGROUND: CONEXAO NOVA MENSAGEM - WS1`)
      }
    });
    ws1.addEventListener('close', async function (event) { // CONEXAO: OFFLINE TENTAR NOVAMENTE - WS1
      console.log(`BACKGROUND: RECONEXAO EM 30 SEGUNDOS - WS1`)
      setTimeout(web1, 30000);
    });
  }
  web1();

  let ws2;
  async function web2() {
    ws2 = new WebSocket('ws://127.0.0.1:8888');
    ws2.addEventListener('open', async function (event) { // CONEXAO: ONLINE - WS2
      console.log(`BACKGROUND: CONEXAO ESTABELECIDA - WS2`)
      setTimeout(function () {
        ws2.send("Chrome: mensagem de teste");
      }, 3000);
    });
    ws2.addEventListener('message', async function (event) { // CONEXAO: NOVA MENSAGEM - WS2
      console.log('→ ' + event.data);
    });
    ws2.addEventListener('close', async function (event) { // CONEXAO: OFFLINE, TENTAR NOVAMENTE - WS2
      console.log(`BACKGROUND: RECONEXAO EM 10 SEGUNDOS - WS2`)
      setTimeout(web2, 10000);
    });
  }
  web2();

}
export default onStart


