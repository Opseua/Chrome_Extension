globalThis.eng = (typeof globalThis.alert !== 'undefined'); // [true] CHROME | [false] NODEJS

function all2() { } globalThis['all2'] = all2; // ******************************************************** NÃO USAR !!!

if (!globalThis.all1) {
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
let qtd2 = 0; async function importLibs(libs) {
    for (let lib of libs) {
        try {
            qtd2++; if (qtd2 > 30) { console.log(`IMPORTANDO BIBLIOTECA [${eng && lib !== '_WebSocket' ? 'NÃO' : 'SIM'}]...`, lib); } if (eng && lib !== '_WebSocket') { globalThis[lib] = true; return; }
            // NATIVA
            if (lib === '_http') { let { default: http, } = await import('http'); globalThis[lib] = http; }
            else if (lib === '_path') { let path = await import('path'); globalThis[lib] = path; }
            else if (lib === '_parse') { let { parse, } = await import('url'); globalThis[lib] = parse; }
            else if (lib === '_net') { let net = await import('net'); globalThis[lib] = net; }
            else if (lib === '_url') { let _url = await import('url'); globalThis[lib] = _url; }
            else if (lib === '_util') { let _util = await import('util'); globalThis[lib] = _util; }
            else if (lib === '_crypto') { let { createHash, } = await import('crypto'); globalThis[lib] = createHash; }
            else if (lib === '_exec') { let { exec, } = await import('child_process'); globalThis[lib] = exec; }
            else if (lib === '_spawn') { let { spawn, } = await import('child_process'); globalThis[lib] = spawn; }

            // INSTALADAS
            else if (lib === '_googleapisAuth') { let { auth, } = await import('@googleapis/sheets'); globalThis[lib] = auth; }
            else if (lib === '_googleapisSheets') { let { sheets, } = await import('@googleapis/sheets'); globalThis[lib] = sheets; }
            else if (lib === '_cheerio') { let cheerio = await import('cheerio'); globalThis[lib] = cheerio; }
            else if (lib === '_clipboardy') { let { default: clipboard, } = await import('clipboardy'); globalThis[lib] = clipboard; }
            else if (lib === '_puppeteer') { let puppeteer = await import('puppeteer'); globalThis[lib] = puppeteer; }
            else if (lib === '_WebSocket') { if (!eng) { let { default: WebSocket, } = await import('ws'); globalThis[lib] = WebSocket; } else { globalThis[lib] = globalThis.WebSocket; } }
            else if (lib === '_WebSocketServer') { let { WebSocketServer, } = await import('ws'); globalThis[lib] = WebSocketServer; }

        } catch (catchErr) { console.error(`FUN LIBRARY IMPORT: ERRO AO IMPORTAR '${lib}`); return; }
    }
} globalThis['importLibs'] = importLibs;

// FUNÇÕES DESSE PROJETO
globalThis['regexE'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './regexE.js', inf, }); };  // MANTER COMO 1º IMPORT
globalThis['file'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './file.js', inf, }); }; // MANTER COMO 2º IMPORT
globalThis['api'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './api.js', inf, }); };
globalThis['chat'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './chat.js', inf, }); };
globalThis['chromeActions'] = (inf) => { let fun = (eng) ? funImport : funGeneric; return fun({ 'path': './chromeActions.js', inf, }); };
globalThis['chromeActionsNew'] = (inf) => { let fun = (eng) ? funImport : funGeneric; return fun({ 'path': './chromeActionsNew.js', inf, }); };
globalThis['client'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './client.js', inf, }); };
globalThis['clipboard'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './clipboard.js', inf, }); };
globalThis['commandLine'] = (inf) => { let fun = (!eng) ? funImport : funGeneric; return fun({ 'path': './commandLine.js', inf, }); };
globalThis['configStorage'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './configStorage.js', inf, }); };
globalThis['dateHour'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './dateHour.js', inf, }); };
globalThis['devFun'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './devFun.js', inf, }); };
// globalThis['getPath'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './getPath.js', 'inf': inf }); }; // IMPORTADO NO TOPO
globalThis['googleSheets'] = (inf) => { let fun = (!eng) ? funImport : funGeneric; return fun({ 'path': './googleSheets.js', inf, }); };
globalThis['googleTranslate'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './googleTranslate.js', inf, }); };
globalThis['htmlToJson'] = (inf) => { let fun = (!eng) ? funImport : funGeneric; return fun({ 'path': './htmlToJson.js', inf, }); };
globalThis['log'] = (inf) => { let fun = (!eng) ? funImport : funGeneric; return fun({ 'path': './log.js', inf, }); };
globalThis['logConsole'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './logConsole.js', inf, }); };
globalThis['notification'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './notification.js', inf, }); };
globalThis['objFilter'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './objFilter.js', inf, }); };
globalThis['messageReceived'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './messageReceived.js', inf, }); };
globalThis['messageSend'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './messageSend.js', inf, }); };
globalThis['regex'] = (inf) => { let fun = (eng || !eng) ? funImport : funGeneric; return fun({ 'path': './regex.js', inf, }); };
globalThis['tabAction'] = (inf) => { let fun = (eng) ? funImport : funGeneric; return fun({ 'path': './tabAction.js', inf, }); };

// SCRIPTS DESSE PROJETO
globalThis['command1'] = (inf) => { let fun = (eng) ? funImport : funGeneric; return fun({ 'path': '../scripts/command1.js', inf, }); };
globalThis['command2'] = (inf) => { let fun = (eng) ? funImport : funGeneric; return fun({ 'path': '../scripts/command2.js', inf, }); };
globalThis['tryRatingComplete'] = (inf) => { let fun = (eng) ? funImport : funGeneric; return fun({ 'path': '../scripts/tryRatingComplete.js', inf, }); };
globalThis['tryRatingSet'] = (inf) => { let fun = (eng) ? funImport : funGeneric; return fun({ 'path': '../scripts/tryRatingSet.js', inf, }); };

// AGUARDAR IMPORT DE FUNÇÕES NÃO ASYNC **************
let e = import.meta.url, ee = e; await dateHour('Wed Jan 11 2024 22:33:44 GMT-0300 (Horário Padrão de Brasília)'); await regex({ e, 'pattern': `UM(.*?)TRES`, 'text': `UMDOISTRES`, });
//  **************


