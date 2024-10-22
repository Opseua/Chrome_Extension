let eng = (typeof window !== 'undefined'); (eng ? window : global)['eng'] = eng; let gloWin = eng ? window : global // [true] CHROME | [false] NODEJS

function all2() { }; gloWin['all2'] = all2; // ******************************************************** NÃO USAR !!!

if (!(eng ? window.all1 : global.all1)) {
    // DEFINIR O 'devChildren' → [CHROME] EMAIL DO USUÁRIO | [NODEJS] PRIMEIRO ARQUIVO A SER EXECUTADO (NA MAIORIA DOS CASOS 'server')
    let devC = new Error().stack.split('\n'); devC = devC[devC.length - 1]; let devChildren = devC.includes('.js:') ? devC.match(/\/([^/]+)\.[^/]+$/)[1] : false
    if (eng) { devChildren = await new Promise((resolve) => { chrome.identity.getProfileUserInfo(function (u) { resolve(u.email) }) }) }

    // @functions
    await import('./@functions.js');

    // DEFINIR → LETTER | ROOT | FUNCTION | PROJECT | FILE | LINE
    await getPath({ 'e': new Error(), 'devChildren': devChildren })

    // console.log(eng, '-', engName, '-', letter); console.log("#################"); console.log('securityPass:', globalWindow.securityPass);
    // console.log('portWeb:', globalWindow.portWeb, '|', 'serverWeb:', globalWindow.serverWeb); console.log('portLoc:', globalWindow.portLoc, '|', 'serverLoc:', globalWindow.serverLoc);
    // console.log('devMaster:', globalWindow.devMaster, '|', 'devSlave:', globalWindow.devSlave, '|', 'devChildren:', globalWindow.devChildren);
    // console.log('devSend:', globalWindow.devSend); console.log('devGet:', globalWindow.devGet); console.log('conf:', globalWindow.conf);
    // console.log('root:', globalWindow.root); console.log('functions:', globalWindow.functions); console.log('project:', globalWindow.project);
}

// IMPORTAR BIBLIOTECAS [NODE] DINAMICAMENTE QUANDO NECESSÁRIO 
let qtd2 = 0; async function funLibrary(infOk) {
    let lib = infOk.lib; qtd2++; if (qtd2 > 30) { console.log(`IMPORTANDO BIBLIOTECA [${eng && lib !== '_WebSocket' ? 'NÃO' : 'SIM'}]...`, lib); }; if (eng && lib !== '_WebSocket') { gloWin[lib] = true; return }; // IGNORAR [CHROME*]
    // NATIVA
    if (lib == '_http') { const { default: http } = await import('http'); gloWin[lib] = http; }
    else if (lib == '_path') { let path = await import('path'); gloWin[lib] = path; }
    else if (lib == '_crypto') { const { createHash } = await import('crypto'); gloWin[lib] = createHash; }
    else if (lib == '_exec') { const { exec } = await import('child_process'); gloWin[lib] = exec; }
    else if (lib == '_net') { let net = await import('net'); gloWin[lib] = net; }
    else if (lib == '_parse') { const { parse } = await import('url'); gloWin[lib] = parse; }
    // INSTALADAS
    else if (lib == '_googleapisAuth') { const { auth } = await import('@googleapis/sheets'); gloWin[lib] = auth; }
    else if (lib == '_googleapisSheets') { const { sheets } = await import('@googleapis/sheets'); gloWin[lib] = sheets; }
    else if (lib == '_cheerio') { let cheerio = await import('cheerio'); gloWin[lib] = cheerio; }
    else if (lib == '_clipboard') { const { default: clipboard } = await import('clipboardy'); gloWin[lib] = clipboard; }
    else if (lib == '_puppeteer') { let puppeteer = await import('puppeteer'); gloWin[lib] = puppeteer; }
    else if (lib == '_WebSocket') { if (!eng) { const { default: WebSocket } = await import('ws'); gloWin[lib] = WebSocket; } else { gloWin[lib] = window.WebSocket; } }
    else if (lib == '_WebSocketServer') { const { WebSocketServer } = await import('ws'); gloWin[lib] = WebSocketServer; }
    else if (lib == '_getFolderSize') { const { default: getFolderSize } = await import('get-folder-size'); gloWin[lib] = getFolderSize; }

}; gloWin['funLibrary'] = funLibrary

// FUNÇÕES DESSE PROJETO
gloWin['regexE'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './regexE.js', 'inf': inf }); };  // MANTER COMO 1º IMPORT
gloWin['file'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './file.js', 'inf': inf }); }; // MANTER COMO 2º IMPORT
gloWin['api'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './api.js', 'inf': inf }); };
gloWin['chat'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './chat.js', 'inf': inf }); };
gloWin['chromeActions'] = (inf) => { let fun = (eng) ? funImport : funGeneric; return fun({ 'path': './chromeActions.js', 'inf': inf }); };
gloWin['chromePrompt'] = (inf) => { let fun = (eng) ? funImport : funGeneric; return fun({ 'path': './chromePrompt.js', 'inf': inf }); };
gloWin['client'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './client.js', 'inf': inf }); };
gloWin['clipboard'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './clipboard.js', 'inf': inf }); };
gloWin['commandLine'] = (inf) => { let fun = (!eng) ? funImport : funGeneric; return fun({ 'path': './commandLine.js', 'inf': inf }); };
gloWin['configStorage'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './configStorage.js', 'inf': inf }); };
gloWin['dateHour'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './dateHour.js', 'inf': inf }); };
gloWin['devFun'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './devFun.js', 'inf': inf }); };
// gloWin['cookie'] = (inf) => { let fun = (eng ) ? funImport : funGeneric; return fun({ 'path': './cookie.js', 'inf': inf }); };
// gloWin['getPath'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './getPath.js', 'inf': inf }); }; // IMPORTADO NO TOPO
gloWin['googleSheets'] = (inf) => { let fun = (!eng) ? funImport : funGeneric; return fun({ 'path': './googleSheets.js', 'inf': inf }); };
gloWin['googleTranslate'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './googleTranslate.js', 'inf': inf }); };
gloWin['htmlToJson'] = (inf) => { let fun = (!eng) ? funImport : funGeneric; return fun({ 'path': './htmlToJson.js', 'inf': inf }); };
gloWin['log'] = (inf) => { let fun = (!eng) ? funImport : funGeneric; return fun({ 'path': './log.js', 'inf': inf }); };
gloWin['logConsole'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './logConsole.js', 'inf': inf }); };
gloWin['logsDelOld'] = (inf) => { let fun = (!eng) ? funImport : funGeneric; return fun({ 'path': './logsDelOld.js', 'inf': inf }); };
gloWin['notification'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './notification.js', 'inf': inf }); };
gloWin['objFilter'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './objFilter.js', 'inf': inf }); };
gloWin['messageReceived'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './messageReceived.js', 'inf': inf }); };
gloWin['messageSend'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './messageSend.js', 'inf': inf }); };
gloWin['rawText'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './rawText.js', 'inf': inf }); };
gloWin['regex'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './regex.js', 'inf': inf }); };
gloWin['tabSearch'] = (inf) => { let fun = (eng) ? funImport : funGeneric; return fun({ 'path': './tabSearch.js', 'inf': inf }); };

// SCRIPTS DESSE PROJETO
gloWin['command1'] = (inf) => { let fun = (eng) ? funImport : funGeneric; return fun({ 'path': '../scripts/command1.js', 'inf': inf }); };
gloWin['command2'] = (inf) => { let fun = (eng) ? funImport : funGeneric; return fun({ 'path': '../scripts/command2.js', 'inf': inf }); };
gloWin['tryRatingComplete'] = (inf) => { let fun = (eng) ? funImport : funGeneric; return fun({ 'path': '../scripts/tryRatingComplete.js', 'inf': inf }); };

// AGUARDAR IMPORT DE FUNÇÕES NÃO ASYNC **************
let e = import.meta.url, ee = e; let infTest
infTest = 'Wed Jan 11 2024 22:33:44 GMT-0300 (Horário Padrão de Brasília)'; await dateHour(infTest); // console.log(dateHour(infTest));
infTest = { 'e': e, 'pattern': `UM(.*?)TRES`, 'text': `UMDOISTRES`, }; await regex(infTest); // console.log(regex(infTest))
//  **************

// CHAT → https://github.com/zachey01/gpt4free.js
await import('./chat/providers.js');

