let ApiNovaInformacao;
import('./src/gatilhos/ApiNovaInformacao').then(module => {
  ApiNovaInformacao = module.default;
});

let ApiConexaoInterrompida;
import('./src/gatilhos/ApiConexaoInterrompida').then(module => {
  ApiConexaoInterrompida = module.default;
});

let AtalhoPressionado;
import('./src/gatilhos/AtalhoPressionado').then(module => {
  AtalhoPressionado = module.default;
});

let ClickNoIcone;
import('./src/gatilhos/ClickNoIcone').then(module => {
  ClickNoIcone = module.default;
});






let fun_api;
import('./2_api.js').then(module => {
  fun_api = module.default;
});

let fun_clipboard;
import('./2_clipboard.js').then(module => {
  fun_clipboard = module.default;
});

let fun_notificacao;
import('./2_notificacao.js').then(module => {
  fun_notificacao = module.default;
});

let fun_prompt;
import('./2_prompt.js').then(module => {
  fun_prompt = module.default;
});

// ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ IMPORTAR COMANDOS AQUI ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
let fun_comando_1;
import('./3_comando_1.js').then(module => {
  fun_comando_1 = module.default;
});

let fun_comando_2;
import('./3_comando_2.js').then(module => {
  fun_comando_2 = module.default;
});


// ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
// monitorar api
const socket = new WebSocket('wss://ntfy.sh/OPSEUA/ws');
socket.addEventListener('message', function (event) {

  const json = JSON.parse(event.data);
  if (json.title === undefined) {
    var inf1 = "ntf";
    var inf2 = "gal";
    var inf3 = null;
  } else {
    if (json.title.match(/\]/)) {
      var split = json.title.replace("[", "").split("]")
      var inf3 = split[1];
      var split = split[0].split(">")
      var inf1 = split[0];
      var inf2 = split[1];
    }
    if (!json.title.match(/\]/)) {
      var inf1 = "ntf";
      var inf2 = "gal";
      var inf3 = json.title;
    }
  }
  const inf4 = (json.message === undefined) ? null : `${json.message}`;

  if (inf4) {
    console.log(`COMANDO RECEBIDO: [${inf1}>${inf2}]\n${inf3}\n${inf4}`);
    if (inf2.match(/chr/)) {
      fun_comando_2(`${inf1}`, `${inf2}`, `${inf3}`, `${inf4}`)
    }
  }

});

// conexao caiu
socket.addEventListener('close', function (event) {
  alert('A conexão com o servidor foi interrompida.');
});

// click no icone
chrome.browserAction.onClicked.addListener(function () {
  alert("ICONE DA EXTENSAO 3")
});

// atalho pressionado
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
  var background_atalho = await new Promise(function (resolve, reject) {
    getShortcutForCommand(command, function (shortcut) {
      resolve(shortcut);
    });
  });
  var background_comando = command;
  // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ EXECUTAR COMANDOS AQUI ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

  // ########## ATALHO_1 ##########
  if (background_comando.match(/atalho_1/)) {
    const text = fun_prompt(`GALAXY`);
    if (text) {
      fun_comando_1(`chr`, `gal`, `TITULO`, `https://ntfy.sh/OPSEUA`, text)
    }
  }








  // ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
});



