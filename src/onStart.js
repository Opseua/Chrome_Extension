await import('./clearConsole.js');
import { shortcutPressed } from './actions/shortcutPressed.js';
import { notification } from './resources/notification.js';
import { oraAi } from './resources/chatGpt.js';
const { getCookies } = await import('./resources/getCookies.js');
import { storageSet, storageGet, storageDel } from './resources/storage.js';

// *******************************************************

// ######################### CLICK NO ICONE
chrome.browserAction.onClicked.addListener(async function () {
  console.log('BACKGROUND: ICONE PRESSIONADO');
});

// ######################### ATALHO PRESSIONADO
chrome.commands.onCommand.addListener(async function (command) {

  // identificar comando do atalho
  function getShortcutForCommand(commandName, callback) {
    chrome.commands.getAll(function (commands) {
      for (let i = 0; i < commands.length; i++) {
        if (commands[i].name === commandName) {
          callback(commands[i].shortcut);
          return;
        }
      } callback(null);
    });
  }
  // identificar teclas pressionadas
  const shortcutKey = await new Promise(function (resolve, reject) {
    getShortcutForCommand(command, function (shortcut) {
      resolve(shortcut);
    });
  });

  const infShortcutPressed =
  {
    'atalho': shortcutKey,
    'command': command
  }
  //console.log('BACKGROUND: ATALHO PRESSIONADO ' + infShortcutPressed.atalho);

  shortcutPressed(infShortcutPressed);

});

// *************************

let WebS;
if (typeof window === 'undefined') { // NODEJS
  const { default: WebSocket } = await import('isomorphic-ws');
  WebS = WebSocket;
} else { // CHROME
  WebS = window.WebSocket;
}

async function client(inf) {

  const port = 8888;
  let ws1;
  async function web1() {
    ws1 = new WebS(`wss://ntfy.sh/OPSEUA/ws`);
    ws1.addEventListener('open', async function (event) { // CONEXAO: ONLINE - WS1
      console.log(`BACKGROUND: CONEXAO ESTABELECIDA - WS1`);
      // setTimeout(function () {
      //   ws1.send('Chrome: mensagem de teste');
      // }, 3000);
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
    ws1.addEventListener('error', async function (error) { // CONEXAO: ERRO - WS1
      console.error(`BACKGROUND: ERRO W1 | ${error.message}`);
    });
  }
  //web1();

  let ws2;
  async function web2() {
    ws2 = new WebS(`ws://18.119.140.20:${port}`);
    //ws2 = new WebS(`ws://18.119.140.20:${port}`);
    ws2.addEventListener('open', async function (event) { // CONEXAO: ONLINE - WS2
      console.log(`BACKGROUND: CONEXAO ESTABELECIDA - WS2`)
      // setTimeout(function () {
      //   ws2.send('Chrome: mensagem de teste');
      // }, 3000);
    });
    ws2.addEventListener('message', async function (event) { // CONEXAO: NOVA MENSAGEM - WS2
      //console.log('→ ' + event.data);
      const infNotificar =
      {
        duration: 1,
        type: 'basic',
        title: 'TITULO',
        message: event.data,
        iconUrl: undefined,
        buttons: [],
      };
      notification(infNotificar)
    });
    ws2.addEventListener('close', async function (event) { // CONEXAO: OFFLINE, TENTAR NOVAMENTE - WS2
      console.log(`BACKGROUND: RECONEXAO EM 10 SEGUNDOS - WS2`)
      setTimeout(web2, 10000);
    });
    ws2.addEventListener('error', async function (error) { // CONEXAO: ERRO - WS2
      console.error(`BACKGROUND: ERRO W2`);
    });
  }
  web2();

}
client()


// const infOraAi = { 'input': `Quando nasceu Albert Eistein?` }
// const retOraAi = await oraAi(infOraAi)
// console.log(retOraAi)

import { tabSearch } from './resources/tabSearch.js';
async function tabOpen() {

  const infTabSearch = { 'search': 'TODAS' }
  const retTabSearch = await tabSearch(infTabSearch)
  console.log(retTabSearch)
  // chrome.tabs.create({ url: 'https://bing.com', active: false }, (novaAba) => {
  //   chrome.tabs.update(novaAba.id, { pinned: true });
  // });

}
tabOpen()