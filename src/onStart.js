await import('./clearConsole.js');
import { shortcutPressed } from './actions/shortcutPressed.js';
import { fileWrite } from './resources/fileWrite.js';
import { fileRead } from './resources/fileRead.js';

// *******************************************************
const retFileRead = await fileRead('D:/ARQUIVOS/BIBLIOTECAS/1_PROJETOS/Chrome_Extension/src/teste.txt')
const resultList = JSON.parse(retFileRead).tasks[0].taskData.resultSet.resultList;
const testQuestionInformation = JSON.parse(retFileRead).tasks[0].taskData.testQuestionInformation.answer.serializedAnswer

const res = resultList.map((v, index) => {
  const idTask = [v.surveyKeys['193']];

  return {
    '1_RESULTADO': index + 1,
    '2_NOME': v.value.name,
    '3_ENDERECO': v.value.address[0],
    '4_FECHADO': testQuestionInformation['Closed-DNE'][idTask].closed_dne.value ? 'SIM' : 'NAO',
    '5_Relevance': testQuestionInformation.Relevance[idTask].Relevance[0].label,
    '6_Name_Accurracy': testQuestionInformation.Data[idTask].Name[0].value,
    '7_Address_Accurracy': testQuestionInformation.Data[idTask].Address[0].value,
    '8_Pin_Accurracy': testQuestionInformation.Data[idTask].Pin[0].value,
    '9_COMENTARIO': resultList[index].comments,
  };
});


console.log(res);


//        object►tasks►0►taskData►resultSet►resultList►1►value►address





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

  shortcutPressed(atalho_comando);

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
  web1();

  let ws2;
  async function web2() {
    ws2 = new WebS(`ws://127.0.0.1:${port}`);
    //ws2 = new WebS(`ws://18.119.140.20:${port}`);
    ws2.addEventListener('open', async function (event) { // CONEXAO: ONLINE - WS2
      console.log(`BACKGROUND: CONEXAO ESTABELECIDA - WS2`)
      // setTimeout(function () {
      //   ws2.send('Chrome: mensagem de teste');
      // }, 3000);
    });
    ws2.addEventListener('message', async function (event) { // CONEXAO: NOVA MENSAGEM - WS2
      console.log('→ ' + event.data);
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
//client()

