await import('./clearConsole.js');
console.log('onStart');
await import('./resources/functions.js');
await import('./resources/savePage.js');

await savePage()

// const { shortcutPressed } = await import('./actions/shortcutPressed.js');
// const { notification } = await import('./resources/notification.js');
// const { oraAi } = await import('./resources/chatGpt.js');
// const { getCookies } = await import('./resources/getCookies.js');
// const { storageSet, storageGet, storageDel } = await import('./resources/storage.js');
// const { nodeOrBrowser } = await import('./resources/functions.js');
// const { sniffer } = await import('./resources/sniffer.js');
// const { api } = await import('./resources/api.js');

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
const retNodeOrBrowser = await nodeOrBrowser();
if (retNodeOrBrowser.res == 'node') { // NODEJS
    const { default: WebSocket } = await import('isomorphic-ws');
    WebS = WebSocket;
} else if (retNodeOrBrowser.res == 'chrome') { // CHROME
    WebS = window.WebSocket;
}

async function client(inf) {

    const port = 8888;
    let ws1;
    const retConfigJson = await fetch('./src/config.json');
    const config = await retConfigJson.json();
    async function web1() {
        ws1 = new WebS(`${config.ws1}`);
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
        ws2 = new WebS(`${config.ws2}:${port}`);
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
//client()

const infTabSearch = { 'search': 'ATIVA', 'openIfNotExist': false, 'active': true, 'pinned': false, 'url': 'https://www.google.com/' } // 'ATIVA', 'TODAS', '*google*' ou 12345678 (ID)
// setTimeout(async function () {
//   const retTabSearch = await tabSearch(infTabSearch)
//   console.log(retTabSearch)
//   const infSavePage = { 'id': retTabSearch.res.id, 'title': retTabSearch.res.title }
//   savePage(infSavePage)
// }, 3000)

async function savePage(inf) {
    chrome.pageCapture.saveAsMHTML({ 'tabId': inf.id }, async function (data) {
        if (data) {
            console.log('OK')
            try {
                const blob = new Blob([data], { type: 'application/x-mimearchive' });
                const reader = new FileReader();
                reader.onloadend = async function () {
                    const textContent = reader.result;
                    const infFileWrite = {
                        'file': `${inf.title}.html`,
                        'rewrite': false, // 'true' adiciona no MESMO arquivo, 'false' cria outro em branco
                        'text': textContent
                    };
                    const retFileWrite = await fileWrite(infFileWrite);
                    console.log(retFileWrite);
                };
                reader.readAsText(blob);
            } catch (e) {
                console.log('ERRO 1')
            }
        } else {
            console.log('ERRO 2')
        }
    });
}


let infNotification =
{
    'duration': 5,
    'type': 'basic',
    'title': 'ERRO: Na área de transferência',
    'message': `texto`,
    'iconUrl': undefined,
    'buttons': [{ 'title': 'BOTÃO 1' }, { 'title': 'BOTÃO 2' }],
};
// setTimeout(function () {
//   notification(infNotification)
// }, 3000)

const infFileWrite = {
    'file': `PASTAS 1/PASTA 2/arquivo[KEE].txt`,
    'rewrite': true, // 'true' adiciona no MESMO arquivo, 'false' cria outro em branco
    'text': 'LINHA 1\nLINHA 2\nLINHA 3\n'
};
//const retFileWrite = await fileWrite(infFileWrite);
//console.log(retFileWrite);

// setTimeout(async function () {
//   //const retFileWrite = await fileWrite(infFileWrite);
//   //console.log(retFileWrite);
// }, 3000)




