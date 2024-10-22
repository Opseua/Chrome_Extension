// await new Promise(resolve => { setTimeout(resolve, 2000) });   

// Usar →    Array.isArray(retHtmlToJson)

// process.exit(); process.cwd();

// for (let [index, value] of array.entries()) {
//     console.log('INDEX', index, 'VALUE', value);
// };

// ESPERAR E EXECUTAR UMA VEZ
// setTimeout(() => {
//     console.log('OK');
// }, 2000);

// ESPERAR E REPETIR
// setInterval(() => {
//     console.log('OK');
//   }, 2000);

// let timeout = setTimeout(() => {
//     console.log('OK');
// }, 2000);
// clearTimeout(timeout);

// let obj = { 'a': { 'b': null }, 'c': 'AAA' }
// console.log(!!obj.a)

// LOOP 99 VEZES
// for (let index = 0; index < 99; index++) {
//     console.log('INDEX', index,);
// };

// // ## LOG ## retApi
// let errMsg = `LOG retApi`
// infLog = {'e':e, 'folder': 'Registros', 'path': `${errMsg}.txt`, 'text': retApi }; await log(infLog);

// let data = 'CASAMENTO'
// // QUALQUER → BASE64
// let qualquerParaBase64 = Buffer.from(data).toString('base64'); console.log(`qualquerParaBase64 ${qualquerParaBase64}`)
// // BASE64 → UTF8
// let base64ParaUtf8 = Buffer.from(qualquerParaBase64, 'base64').toString('utf8'); console.log(`base64ParaUtf8 ${base64ParaUtf8}`)

// cd /d D:\ARQUIVOS\PROJETOS\Projeto_Nome

// [1] CHROME [c] | [2] NODEJS [n]  
let cng = eng ? 1 : 2; let _fs, cs // *** _spawn, _url, _util // *** const { spawn } = await import('child_process'); _spawn = spawn; _url = await import('url'); _util = await import('util');

if (cng == 1) { // CHROME
    window['engName'] = 'CHROME'; window['cng'] = 1; window['letter'] = 'x'; window['globalWindow'] = {}; window['esLintIgnore'] = '';
} else { // NDEJS
    global['engName'] = 'NODEJS'; global['cng'] = 2; global['letter'] = 'x'; global['globalWindow'] = {}; global['esLintIgnore'] = ''; _fs = await import('fs'); global['_fs'] = _fs;
}

// DEFINIR → LETTER | ROOT | FUNCTION | PROJECT | FILE | LINE
await import('./getPath.js'); let retGetPath; retGetPath = await getPath({ 'e': new Error(), 'isFunction': true, }); let conf = retGetPath.res.confOk.webSocket;

let securityPass = `${conf.securityPass}`; let devicesObjSend = conf.devices[conf.devices.is[engName].sendTo]; let devicesValuesSend = Object.values(devicesObjSend);
let devicesKeysSend = {}; Object.keys(devicesObjSend).forEach((key, index) => { devicesKeysSend[key] = index; }); let devicesObjGet = conf.devices[engName];
let devicesValuesGet = Object.values(devicesObjGet); let devicesKeysGet = {}; Object.keys(devicesObjGet).forEach((key, index) => { devicesKeysGet[key] = index; }); let devMaster = conf.master;
let devices = [[conf.devices.is[engName].sendTo, devicesKeysSend, devicesValuesSend], [engName, devicesKeysGet, devicesValuesGet]]; let serverLoc = conf.server['1']; let hostLoc = `${serverLoc.host}`;
let portLoc = `${serverLoc.port}`; let hostPortLoc = `${hostLoc}:${portLoc}`; let serverWeb = conf.server['2']; let hostWeb = `${serverWeb.host}`; let portWeb = `${serverWeb.port}`; let hostPortWeb = `${hostWeb}:${portWeb}`
let secConnect = conf.secConnect; let secReconnect = conf.secReconnect; let secRetWebSocket = conf.secRetWebSocket; let secPing = conf.secPing; let secPingTimeout = conf.secPingTimeout; let secLoop = conf.secLoop;
let kbPartsMessage = conf.kbPartsMessage; let minClearPartsMessages = conf.minClearPartsMessages; let devMy = conf.devMy; let par1 = `${securityPass}-${conf.par1}`; let par2 = `${conf.par2}`;
let par3 = `${securityPass}-${conf.par3}`; let par4 = `${securityPass}-${conf.par4}`; let par5 = `${securityPass}-${conf.par5}`; let par6 = `${conf.par6}`; let par7 = `${conf.par7}`; let par8 = `${securityPass}-${conf.par8}`;
let par9 = `${securityPass}-${conf.par9}`; let par10 = `${securityPass}-${conf.par10}`; let par11 = `${conf.par11}`; let par12 = `${conf.par12}`;
let devSend = `${letter == 'D' ? hostPortLoc : hostPortWeb}/?roo=${devMy}-${devices[0][0]}`; devSend = `${devSend}-${devices[0][2][0]}` // CHROME | Send → NodeJS | Get → Chrome ##### NODEJS | Send → Chrome | Get → NodeJS

// MANTER APÓS O 'devSend'
globalWindow = {
    ...globalWindow, 'securityPass': securityPass, 'serverWeb': serverWeb.host, 'portWeb': portWeb, 'serverLoc': serverLoc.host, 'portLoc': portLoc, 'devMaster': devMaster, 'devSlave': engName, 'devSend': devSend,
    'devices': devices, 'hostPortWeb': hostPortWeb, 'hostPortLoc': hostPortLoc, 'secConnect': secConnect, 'secReconnect': secReconnect, 'secRetWebSocket': secRetWebSocket, 'secPing': secPing, 'secPingTimeout': secPingTimeout,
    'secLoop': secLoop, 'kbPartsMessage': kbPartsMessage, 'minClearPartsMessages': minClearPartsMessages, 'devMy': devMy, 'par1': par1, 'par2': par2, 'par3': par3, 'par4': par4, 'par5': par5, 'par6': par6, 'par7': par7,
    'par8': par8, 'par9': par9, 'par10': par10, 'par11': par11, 'par12': par12, 'pages': false,
}; // console.log('1', '-', globalWindow.conf, '|', letter, '|', globalWindow.root, '| functions →', globalWindow.functions, '| devMaster →', globalWindow.devMaster, '| project →', globalWindow.project, '| devSlave →', globalWindow.devSlave)

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// ############### GLOBAL OBJECT ###############
// gOList(async function () { console.log('globalObject [import] ALTERADO →', gO.inf) }); gO.inf['NovaChave'] = { 'a': 'b' }; gO.inf['NovaChave'] = ['a', 'b', 'c',]; console.log(gO.inf)
let gOListener = []; let gOObj = {}; function gOList(listener) { gOListener.push(listener) }; function notificarListeners(prop, value) {
    if (gO.inf.alert) { console.log('globalObject [export] ALTERADO →', gO.inf) }; for (let listener of gOListener) { listener(prop, value); }
}; let gO = new Proxy(gOObj, { set(target, prop, value) { target[prop] = value; notificarListeners(prop, value); return true; } }); gO.inf = {}
// let cs = await configStorage(['']); console.log(cs)

// ############### RATE LIMIT ###############
// let rate = rateLimiter({ 'max': 3, 'sec': 5 }); function testRate() { console.log(rate.check()); console.log(rate.check()); console.log(rate.check()); console.log(rate.check()) }; testRate();
function rateLimiter(inf) {
    let max = inf.max; let sec = inf.sec * 1000; let old = []; function check() {
        let now = Date.now(); let recent = old.filter(timestamp => timestamp >= now - sec); if (recent.length < max) { old.push(now); return true; } else { return false }
    }; return { check };
}

// ############### NÚMERO ALEATÓRIO ###############
function randomNumber(min, max) { return Math.floor(Math.random() * (max - min + 1) + min) }; // console.log(randomNumber(2, 5))

// ############### LISTENER ###############
let listeners = {}; function listenerMonitorar(nomeList, callback) { if (!listeners[nomeList]) { listeners[nomeList] = []; } listeners[nomeList].push(callback); }
async function listenerAcionar(nomeList, inf, call) { if (listeners[nomeList]) { for (let callFun of listeners[nomeList]) { let res = await callFun(nomeList, inf); if (typeof call === 'function') { call(res) } return res } } }

// ############### AWAIT TIMEOUT ###############
function awaitTimeout(inf) {
    return new Promise((resolve) => {
        let timeout; listenerMonitorar(inf.listenerName, async (nomeList, param1) => { clearTimeout(timeout); resolve({ 'ret': true, 'msg': 'TIMEOUT_FOI_LIMPO', 'res': param1, }); });
        timeout = setTimeout(() => { resolve({ 'ret': false, 'msg': 'TIMEOUT_EXPIROU' }); }, inf.secondsAwait * 1000);
    });
}
// async function runOk() {  console.log('INICIO'); let retAwaitTimeout = await awaitTimeout({ 'secondsAwait': 5, 'listenerName': 'NOME AQUI' }); console.log(retAwaitTimeout); }; runOk();
// async function liberarTimeout() { setTimeout(() => { listenerAcionar('NOME AQUI', 'INF1', 'INF2'); }, 2000);}; liberarTimeout();

// ############### CLEAR CONSOLE ###############
function clearRun() { /* CHROME | ANTIGO | NOVO */ if (eng) { console.clear() } else { process.stdout.write('\u001b[2J\u001b[0;0H'); process.stdout.write('\x1Bc') } };
let msgQtd = 0; let clearConsole = console.log; console.log = function () { clearConsole.apply(console, arguments); msgQtd++; if (msgQtd >= 100) { clearRun(); msgQtd = 0; console.log('CONSOLE LIMPO!\n') } }; clearRun()

// // ###############               ###############

// PEGAR O NOME DO ARQUIVO(SEM EXTENSÃO)
function funFile(inf) { return inf.match(/([^\\/]+)(?=\.[^\\.]+$)/)[0]; }; let gloWin = eng ? window : global

// IMPORTAR FUNÇÕES DINAMICAMENTE QUANDO NECESSÁRIO 
let qtd1 = 0; async function funImport(infOk) { let { path, inf } = infOk; qtd1++; let name = funFile(path); if (qtd1 > 30) { console.log('IMPORTANDO...', name) }; await import(`${path}`); return await gloWin[name](inf); }

// FUNÇÃO GENÉRICA (QUANDO O ENGINE ESTIVER ERRADO) | ENCAMINHAR PARA DEVICE
async function funGeneric(infOk) { let { path, inf } = infOk; let name = funFile(path); let retDevAndFun = await devFun({ 'e': import.meta.url, 'enc': true, 'data': { 'name': name, 'par': inf, } }); return retDevAndFun; }

if (eng) { // CHROME
    // ## VARIÁVEIS
    window['cs'] = cs;
    // ## GLOBAL OBJECT [NOVO]
    window['gO'] = gO; window['gOList'] = gOList;
    // ## LISTENER
    window['listenerMonitorar'] = listenerMonitorar; window['listenerAcionar'] = listenerAcionar;
    // ## FUNÇÕES
    window['rateLimiter'] = rateLimiter; window['randomNumber'] = randomNumber; window['awaitTimeout'] = awaitTimeout; window['funImport'] = funImport; window['funGeneric'] = funGeneric;
} else { // NODEJS
    // ## VARIÁVEIS
    global['cs'] = cs;
    // ## GLOBAL OBJECT [NOVO]
    global['gO'] = gO; global['gOList'] = gOList;
    // ## LISTENER
    global['listenerMonitorar'] = listenerMonitorar; global['listenerAcionar'] = listenerAcionar;
    // ## FUNÇÕES
    global['rateLimiter'] = rateLimiter; global['randomNumber'] = randomNumber; global['awaitTimeout'] = awaitTimeout; global['funImport'] = funImport; global['funGeneric'] = funGeneric;
}

// ********************** OBRIGATÓRIO FICAR APOS O EXPORT GLOBAL (não subir!!!) NÃO USAR !!!
function all1() { }; (eng ? window : global)['all1'] = all1;
// *****************************************************************************************

// NÃO COMENTAR! NECESSÁRIO QUANDO NÃO FOR 'Chrome_Extension'
if (!(eng ? window.all2 : global.all2)) { await import('./@export.js'); }

// javascript: (function () {
//     function pw(j, pw, ph, u) {
//         let w = (pw / 100) * j.top.screen.width, h = (ph / 100) * j.top.screen.height; let y = j.top.outerHeight / 2 + j.top.screenY - (h / 2), x = j.top.outerWidth / 2 + j.top.screenX - (w / 2);
//         return j.open(u, '', `width=${w},height=${h},top=${y},left=${x}`)
//     }; pw(window, 40, 40, 'http://12.345.678.910:1234')
// })()



