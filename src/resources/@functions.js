// await new Promise(resolve => { setTimeout(resolve, 2000) })

// process.exit();

// let array = ['A', 'B', 'C', 'D', 'E', 'F'];
// for (let [index, value] of array.entries()) {
//     console.log('INDEX', index, 'VALUE', value);
//     await new Promise(resolve => setTimeout(resolve, 1000));
// }
// console.log('FIM');

// // ## LOG ## retApi
// let err = `$ [leadChangeStatus] LOG retApi`
// infLog = {'e':e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retApi }
// retLog = await log(infLog);

// LOOP DE REPETIÇÃO
// setInterval(() => {
//     console.log('OK');
//   }, 2000);

// ESPERAR E MOSTRAR UMA VEZ (timeout)
// setTimeout(() => {
//     console.log('OK');
// }, 2000);

// let timeout = setTimeout(() => {
//     console.log('OK');
// }, 2000);
// clearTimeout(timeout);

// let data = 'CASAMENTO'
// // QUALQUER → BASE64
// let qualquerParaBase64 = Buffer.from(data).toString('base64')
// console.log(`qualquerParaBase64 ${qualquerParaBase64}`)
// // BASE64 → UTF8
// let base64ParaUtf8 = Buffer.from(qualquerParaBase64, 'base64').toString('utf8')
// console.log(`base64ParaUtf8 ${base64ParaUtf8}`)

// cd /d D:\ARQUIVOS\PROJETOS\URA_Reversa

// [1] CHROME [c] | [2] NODEJS [n] | [3] GOOGLE [g]  
let cng = typeof window !== 'undefined' ? 1 : typeof UrlFetchApp !== 'undefined' ? 3 : 2
// ###### true CHROME / GOOGLE | false NODEJS
if (cng == 1) {
    window['eng'] = true
    window['engName'] = 'CHROME'
    window['cng'] = 1
} else if (cng == 2) {
    global['eng'] = false
    global['engName'] = 'NODEJS'
    global['cng'] = 2
} else if (cng == 3) {
    global['eng'] = true
    global['engName'] = 'GOOGLE'
}

let _fs, _path, _cheerio, _clipboard, _WebSocket, _http, _exec, _google, _crypto, _puppeteer, _net, _util, _getFolderSize, _parse, cs

// DEFINIR O 'conf' / 'letter' / 'project'
await import('./getPath.js')
await getPath({ 'e': new Error(), 'mode': 1, 'keep': true });

if (eng) { // CHROME
    _WebSocket = window.WebSocket
} else { // NODEJS
    _fs = await import('fs');
    _path = await import('path');
    _cheerio = await import('cheerio');
    const { default: WebSocket } = await import('ws'); _WebSocket = WebSocket;
    const { default: clipboard } = await import('clipboardy'); _clipboard = clipboard;
    const { default: http } = await import('http'); _http = http;
    const { exec } = await import('child_process'); _exec = exec
    const { google } = await import('googleapis'); _google = google
    const { createHash } = await import('crypto'); _crypto = createHash
    _puppeteer = await import('puppeteer');
    _net = await import('net');
    _util = await import('util');
    const { default: getFolderSize } = await import('get-folder-size'); _getFolderSize = getFolderSize
    const { parse } = await import('url'); _parse = parse;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// ############### GLOBAL OBJECT [NOVO] ###############
// gOList(async function () {
//     console.log('globalObject [import] ALTERADO →', gO.inf);
// })
// gO.inf['NovaChave'] = { 'a': 'b' }
// gO.inf['NovaChave'] = ['a', 'b', 'c',]
// console.log(gO.inf)

let gOListener = []; let gOObj = {};
function gOList(listener) { gOListener.push(listener) }
function notificarListeners(prop, value) {
    if (gO.inf.alert) { console.log('globalObject [export] ALTERADO →', gO.inf) };
    for (let listener of gOListener) { listener(prop, value); }
}; let gO = new Proxy(gOObj, {
    set(target, prop, value) { target[prop] = value; notificarListeners(prop, value); return true; }
}); gO.inf = {}
// ##########################################################

// let cs = await configStorage([''])
// console.log(cs)

// ############### GLOBAL OBJECT [SNIFFER CHROME] ###############
let data = { inf: '' }; let listenersGoSniffer = new Set();
let gOSniffer = new Proxy(data, {
    set(target, key, value) { target[key] = value; globalChanged(value); listenersGoSniffer.forEach(listener => listener(target)); return true }
});
function gOAddSniffer(listener) { listenersGoSniffer.add(listener) }; function gORemSniffer(listener) { listenersGoSniffer.delete(listener) }
async function globalChanged(i) {
    if (i.alert !== false) { console.log('globalObject ALTERADO →', i) }
}

// ############### RATE LIMIT ###############
// let rate = rateLimiter({ 'max': 3, 'sec': 5 });
// function testRate() {
//     console.log(rate.check())
//     console.log(rate.check())
//     console.log(rate.check())
//     console.log(rate.check())
// };
// testRate();

function rateLimiter(inf) {
    let max = inf.max; let sec = inf.sec * 1000; let old = []; function check() {
        let now = Date.now(); let recent = old.filter(timestamp => timestamp >= now - sec);
        if (recent.length < max) { old.push(now); return true; } else { return false }
    }; return { check };
}

// ############### LISTENER ###############

// [antigo] → sem retorno
// let listeners = {}; function listenerMonitorar(nomeList, callback) { if (!listeners[nomeList]) { listeners[nomeList] = []; }; listeners[nomeList].push(callback); };
// function listenerAcionar(nomeList, param1, param2) { if (listeners[nomeList]) { listeners[nomeList].forEach((callback) => { callback(nomeList, param1, param2); }); } }

// listenerMonitorar('TESTE1', async (nomeList, param1, param2) => {
//     console.log('ACIONADO:', nomeList, '→', param1, param2);
// });
// listenerAcionar('TESTE1', 'INF1', 'INF2');

// ------------

// [novo] → com retorno
let listeners = {}; function listenerMonitorar(nomeList, callback) { if (!listeners[nomeList]) { listeners[nomeList] = []; } listeners[nomeList].push(callback); }
async function listenerAcionar(nomeList, inf, callback) {
    if (listeners[nomeList]) { for (let callFun of listeners[nomeList]) { let response = await callFun(nomeList, inf); if (callback) { callback(response); } return response; } }
}

// listenerMonitorar('TESTE1', async (nomeList, inf) => {
//     console.log('ACIONADO:', nomeList, '→', inf);
//     return 'retorno do listener';
// });
// let retListenerAcionar = await listenerAcionar('TESTE1', { 'a': 'a', 'b': 'b' });
// console.log(retListenerAcionar);

// ############### AWAIT TIMEOUT ###############

function awaitTimeout(inf) {
    return new Promise((resolve) => {
        let timeout; listenerMonitorar(inf.listenerName, async (nomeList, param1) => { clearTimeout(timeout); resolve({ 'ret': true, 'msg': 'TIMEOUT_FOI_LIMPO', 'res': param1, }); });
        timeout = setTimeout(() => { resolve({ 'ret': false, 'msg': 'TIMEOUT_EXPIROU' }); }, inf.secondsAwait * 1000);
    });
}

// async function run() {
//     console.log('INICIO');
//     let retAwaitTimeout = await awaitTimeout({ 'secondsAwait': 5, 'listenerName': 'NOME AQUI' });
//     console.log(retAwaitTimeout);
// }; run();

// async function liberarTimeout() {
//     setTimeout(() => { listenerAcionar('NOME AQUI', 'INF1', 'INF2'); }, 2000);
// }; liberarTimeout();

// ##########################################################

// // ############### CLEAR CONSOLE ###############
function clearConsoleRun() { console.clear(); if (!eng) { process.stdout.write('\x1B[2J\x1B[0f'); } }
clearConsoleRun(); let msgQtd = 0; let clearConsole = console.log; console.log = function () {
    clearConsole.apply(console, arguments); msgQtd++; if (msgQtd >= 100) { clearConsoleRun(); msgQtd = 0; console.log('CONSOLE LIMPO!') }
}
// // ###############               ###############

if (eng) { // CHROME
    // ## BIBLIOTECAS / NATIVO
    window['_WebSocket'] = _WebSocket;
    // ## VARIÁVEIS
    window['cs'] = cs;
    window['catchGlobal'] = false;
    // ## GLOBAL OBJECT [NOVO]
    window['gO'] = gO; window['gOList'] = gOList;
    // ## GLOBAL OBJECT [SNIFFER CHROME] 
    window['gOSniffer'] = gOSniffer;
    window['gOAddSniffer'] = gOAddSniffer;
    window['gORemSniffer'] = gORemSniffer;
    // ## LISTENER
    window['listenerMonitorar'] = listenerMonitorar;
    window['listenerAcionar'] = listenerAcionar;
    // ## FUNÇÕES
    window['rateLimiter'] = rateLimiter
    window['getPath'] = getPath;
    window['awaitTimeout'] = awaitTimeout;
} else { // NODEJS 
    // ## BIBLIOTECAS / NATIVO
    const { WebSocketServer } = await import('ws'); global['_WebSocketServer'] = WebSocketServer; // SERVER WEBSOCKET [EC2] (não subir!!!)
    global['_WebSocket'] = _WebSocket;
    global['_fs'] = _fs;
    global['_path'] = _path;
    global['_cheerio'] = _cheerio;
    global['_clipboard'] = _clipboard;
    global['_http'] = _http;
    global['_exec'] = _exec;
    global['_google'] = _google;
    global['_crypto'] = _crypto
    global['_puppeteer'] = _puppeteer
    global['_net'] = _net
    global['_util'] = _util
    global['_getFolderSize'] = _getFolderSize
    global['_parse'] = _parse
    // ## VARIÁVEIS
    global['cs'] = cs;
    global['catchGlobal'] = false;
    // ## GLOBAL OBJECT [NOVO]
    global['gO'] = gO;
    global['gOList'] = gOList;
    // ## GLOBAL OBJECT [SNIFFER CHROME]  
    global['gOSniffer'] = gOSniffer;
    global['gOAddSniffer'] = gOAddSniffer;
    global['gORemSniffer'] = gORemSniffer;
    // ## LISTENER
    global['listenerMonitorar'] = listenerMonitorar;
    global['listenerAcionar'] = listenerAcionar;
    // ## FUNÇÕES
    global['rateLimiter'] = rateLimiter
    global['getPath'] = getPath;
    global['awaitTimeout'] = awaitTimeout;
}

// OBRIGATÓRIO FICAR APOS O EXPORT GLOBAL (não subir!!!)
function all1() { }; // ******************************************************** NÃO USAR !!!
if (eng) { window['all1'] = all1; } else { global['all1'] = all1 }
// *****************************************************************************************

// NÃO COMENTAR! NECESSÁRIO QUANDO NÃO FOR 'Chrome_Extension'
if (!(eng ? window.all2 : global.all2)) { await import('./@export.js'); }

//  *************************** NÃO APAGAR ***************************
// let matches = new Error().stack.match(/\:\/\/(.*?)\.js\:/g).map(match => match.slice(1, -1))
// matches = matches[matches.length - 1]

// let lisTime = { 'lists': {}, 'tims': {}, 'ids': [] }
// function lisAdd(eve, cal) { if (!lisTime.lists[eve]) { lisTime.lists[eve] = []; }; lisTime.lists[eve].push(cal); }
// function lisDel(eve, cal) { if (lisTime.lists[eve]) { lisTime.lists[eve] = lisTime.lists[eve].filter(cb => cb !== cal); } }
// function lisRun(eve, param) { if (lisTime.lists[eve]) { lisTime.lists[eve].forEach(cal => cal(param)); } }

// let idNew = `TIMEOUT_ID_${new Date().getTime()}`

// async function runAndAwait() {
//     let resolvePromise; // RETORNO RECEBIDO A TEMPO [SIM]
//     let promiseAwait = new Promise((resolve) => {
//         resolvePromise = resolve; lisAdd(`timeClear_${idNew}`, (promiseRet) => { resolve(promiseRet); });
//     }); lisTime.tims[idNew] = setTimeout(() => { // RETORNO RECEBIDO A TEMPO [NÃO]
//         resolvePromise('RETORNO_NAO_RECEBIDO_A_TEMPO');
//     }, 5000);
//     // ###################

//     // ################### LIMPAR TIMEOUT, LISTENER E RETORNAR RESPOSTA
//     let retAwait = await promiseAwait; clearTimeout(lisTime.tims[idNew]); lisDel(`timeClear_${idNew}`);
//     delete lisTime.tims[idNew]; delete lisTime.lists[`timeClear_${idNew}`]; return retAwait;
// }

// // SIMULANDO RECEBIMENTO DO RETORNO
// let timeout = setTimeout(function () {
//     lisRun(`timeClear_${idNew}`, 'RESPOSTA');
// }, 2000);

// async function run() {
//     let retRunAndAwait = await runAndAwait()
//     clearTimeout(timeout);
//     console.log('AQUI', retRunAndAwait)
// }
// run()


// javascript: (function () {
//     function pw(j, pw, ph, u) {
//         let w = (pw / 100) * j.top.screen.width, h = (ph / 100) * j.top.screen.height;
//         let y = j.top.outerHeight / 2 + j.top.screenY - (h / 2), x = j.top.outerWidth / 2 + j.top.screenX - (w / 2);
//         return j.open(u, '', `width=${w},height=${h},top=${y},left=${x}`);
//     }; pw(window, 40, 40, 'http://12.345.678.910:123');
// })();

