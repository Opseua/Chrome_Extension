let eng = (typeof window !== 'undefined'); (eng ? window : global)['eng'] = eng; let gloWin = eng ? window : global; // [true] CHROME | [false] NODEJS

function all2() { } gloWin['all2'] = all2; // ******************************************************** NÃO USAR !!!

if (!(eng ? window.all1 : global.all1)) {
    // DEFINIR O 'devChildren' → [CHROME] EMAIL DO USUÁRIO | [NODEJS] PRIMEIRO ARQUIVO A SER EXECUTADO (NA MAIORIA DOS CASOS 'server')
    let devC = new Error().stack.split('\n'); devC = devC[devC.length - 1]; let devChildren = devC.includes('.js:') ? devC.match(/\/([^/]+)\.[^/]+$/)[1] : false;
    if (eng) { devChildren = await new Promise((resolve) => { chrome.identity.getProfileUserInfo(function (u) { resolve(u.email); }); }); }

    // @functions
    await import('./@functions.js');

    // DEFINIR → LETTER | ROOT | FUNCTION | PROJECT | FILE | LINE
    await getPath({ 'e': new Error(), devChildren, });

    // console.log(`${eng} | ${engName} | ${letter}\n${fileProjetos} | ${fileWindows}`); console.log('\n'); console.log('securityPass:', gW.securityPass);
    // console.log('portWeb:', gW.portWeb, '|', 'serverWeb:', gW.serverWeb); console.log('portLoc:', gW.portLoc, '|', 'serverLoc:', gW.serverLoc);
    // console.log(`devMaster: ${gW.devMaster}\ndevSlave: ${gW.devSlave}\ndevChildren: ${gW.devChildren}`); console.log(`devSend:\n${gW.devSend}`);
    // console.log(`devGet:\n${gW.devGet[0]}\n${gW.devGet[1]}`); console.log('conf:', gW.conf); console.log('root:', gW.root); console.log('functions:', gW.functions); console.log('project:', gW.project);

}

// IMPORTAR BIBLIOTECAS [NODE] DINAMICAMENTE QUANDO NECESSÁRIO 
let qtd2 = 0; async function funLibrary(infOk) {
    let lib = infOk.lib; qtd2++; if (qtd2 > 30) { console.log(`IMPORTANDO BIBLIOTECA [${eng && lib !== '_WebSocket' ? 'NÃO' : 'SIM'}]...`, lib); } if (eng && lib !== '_WebSocket') { gloWin[lib] = true; return; }
    // NATIVA
    if (lib === '_http') { let { default: http, } = await import('http'); gloWin[lib] = http; }
    else if (lib === '_path') { let path = await import('path'); gloWin[lib] = path; }
    else if (lib === '_parse') { let { parse, } = await import('url'); gloWin[lib] = parse; }
    else if (lib === '_net') { let net = await import('net'); gloWin[lib] = net; }
    else if (lib === '_url') { let _url = await import('url'); gloWin[lib] = _url; }
    else if (lib === '_util') { let _util = await import('util'); gloWin[lib] = _util; }
    else if (lib === '_crypto') { let { createHash, } = await import('crypto'); gloWin[lib] = createHash; }
    else if (lib === '_exec') { let { exec, } = await import('child_process'); gloWin[lib] = exec; }
    else if (lib === '_spawn') { let { spawn, } = await import('child_process'); gloWin[lib] = spawn; }

    // INSTALADAS
    else if (lib === '_googleapisAuth') { let { auth, } = await import('@googleapis/sheets'); gloWin[lib] = auth; }
    else if (lib === '_googleapisSheets') { let { sheets, } = await import('@googleapis/sheets'); gloWin[lib] = sheets; }
    else if (lib === '_cheerio') { let cheerio = await import('cheerio'); gloWin[lib] = cheerio; }
    else if (lib === '_clipboardy') { let { default: clipboard, } = await import('clipboardy'); gloWin[lib] = clipboard; }
    else if (lib === '_puppeteer') { let puppeteer = await import('puppeteer'); gloWin[lib] = puppeteer; }
    else if (lib === '_WebSocket') { if (!eng) { let { default: WebSocket, } = await import('ws'); gloWin[lib] = WebSocket; } else { gloWin[lib] = window.WebSocket; } }
    else if (lib === '_WebSocketServer') { let { WebSocketServer, } = await import('ws'); gloWin[lib] = WebSocketServer; }

} gloWin['funLibrary'] = funLibrary;

// FUNÇÕES DESSE PROJETO
gloWin['regexE'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './regexE.js', inf, }); };  // MANTER COMO 1º IMPORT
gloWin['file'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './file.js', inf, }); }; // MANTER COMO 2º IMPORT
gloWin['api'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './api.js', inf, }); };
gloWin['chat'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './chat.js', inf, }); };
gloWin['chromeActions'] = (inf) => { let fun = (eng) ? funImport : funGeneric; return fun({ 'path': './chromeActions.js', inf, }); };
gloWin['chromeActionsNew'] = (inf) => { let fun = (eng) ? funImport : funGeneric; return fun({ 'path': './chromeActionsNew.js', inf, }); };
gloWin['client'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './client.js', inf, }); };
gloWin['clipboard'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './clipboard.js', inf, }); };
gloWin['commandLine'] = (inf) => { let fun = (!eng) ? funImport : funGeneric; return fun({ 'path': './commandLine.js', inf, }); };
gloWin['configStorage'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './configStorage.js', inf, }); };
gloWin['dateHour'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './dateHour.js', inf, }); };
gloWin['devFun'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './devFun.js', inf, }); };
// gloWin['getPath'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './getPath.js', 'inf': inf }); }; // IMPORTADO NO TOPO
gloWin['googleSheets'] = (inf) => { let fun = (!eng) ? funImport : funGeneric; return fun({ 'path': './googleSheets.js', inf, }); };
gloWin['googleTranslate'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './googleTranslate.js', inf, }); };
gloWin['htmlToJson'] = (inf) => { let fun = (!eng) ? funImport : funGeneric; return fun({ 'path': './htmlToJson.js', inf, }); };
gloWin['log'] = (inf) => { let fun = (!eng) ? funImport : funGeneric; return fun({ 'path': './log.js', inf, }); };
gloWin['logConsole'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './logConsole.js', inf, }); };
gloWin['notification'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './notification.js', inf, }); };
gloWin['objFilter'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './objFilter.js', inf, }); };
gloWin['messageReceived'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './messageReceived.js', inf, }); };
gloWin['messageSend'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './messageSend.js', inf, }); };
gloWin['regex'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './regex.js', inf, }); };
gloWin['tabAction'] = (inf) => { let fun = (eng) ? funImport : funGeneric; return fun({ 'path': './tabAction.js', inf, }); };

// SCRIPTS DESSE PROJETO
gloWin['command1'] = (inf) => { let fun = (eng) ? funImport : funGeneric; return fun({ 'path': '../scripts/command1.js', inf, }); };
gloWin['command2'] = (inf) => { let fun = (eng) ? funImport : funGeneric; return fun({ 'path': '../scripts/command2.js', inf, }); };
gloWin['tryRatingComplete'] = (inf) => { let fun = (eng) ? funImport : funGeneric; return fun({ 'path': '../scripts/tryRatingComplete.js', inf, }); };
gloWin['tryRatingSet'] = (inf) => { let fun = (eng) ? funImport : funGeneric; return fun({ 'path': '../scripts/tryRatingSet.js', inf, }); };

// AGUARDAR IMPORT DE FUNÇÕES NÃO ASYNC **************
let e = import.meta.url, ee = e; await dateHour('Wed Jan 11 2024 22:33:44 GMT-0300 (Horário Padrão de Brasília)'); await regex({ e, 'pattern': `UM(.*?)TRES`, 'text': `UMDOISTRES`, });
//  **************


