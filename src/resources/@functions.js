// await new Promise(resolve => { setTimeout(resolve, 2000) });   

// CHECAR SE É ARRAY Array.isArray(retHtmlToJson)   |   CHECAR SE TEM A CHAVE  if ('chave' in obj){ }   |   CHECAR SE É OBJETO typeof obj === 'object'
// let { key: atribuirNisso, } = { 'key': 'AAA', }; console.log(atribuirNisso);
// ({ issoJaExiste, } = functionAqui(obj));

// process.exit();

// for (let [index, value,] of array.entries()) { console.log('INDEX', index, 'VALUE', value); };

// ESPERAR E EXECUTAR UMA VEZ
// setTimeout(() => { console.log('OK'); }, 2000);

// ESPERAR E REPETIR
// setInterval(() => { console.log('OK'); }, 2000);

// TIMEOUT
// let timeout = setTimeout(() => { console.log('OK'); }, 2000); clearTimeout(timeout);

// let obj = { 'a': { 'b': null }, 'c': 'AAA' }; console.log(!!obj.a)

// LOOP 99 VEZES
// for (let index = 0; index < 99; index++) { console.log('INDEX', index); };

// QUALQUER → BASE64 | BASE64 → UTF8
// let qualquerParaBase64 = Buffer.from('CASAMENTO').toString('base64'); console.log(`qualquerParaBase64 ${qualquerParaBase64}`)
// let base64ParaUtf8 = Buffer.from(qualquerParaBase64, 'base64').toString('utf8'); console.log(`base64ParaUtf8 ${base64ParaUtf8}`)

// cd /d D:\ARQUIVOS\PROJETOS\Sniffer_Python

// https://api.hashify.net/hash/md5/hex?value=aaaa

let _fs, cs; globalThis['engName'] = (eng) ? 'CHROME' : 'NODEJS'; globalThis['letter'] = 'x'; globalThis['fileProjetos'] = 'x'; globalThis['fileChrome_Extension'] = 'x'; globalThis['fileWindows'] = 'x';
if (!eng) { _fs = await import('fs'); globalThis['_fs'] = _fs; process.noDeprecation = true; }

// DEFINIR → LETTER | ROOT | FUNCTION | PROJECT | FILE | LINE
await import('./getPath.js'); let retGetPath = await getPath({ 'e': new Error(), 'isFunction': true, }); let conf = retGetPath.res.confOk.webSocket; let devMaster = retGetPath.res.confOk.master;

let securityPass = `${conf.securityPass}`; let devicesObjSend = conf.devices[conf.devices.is[engName].sendTo]; let devicesValuesSend = Object.values(devicesObjSend);
let devicesKeysSend = {}; Object.keys(devicesObjSend).forEach((key, index) => { devicesKeysSend[key] = index; }); let devicesObjGet = conf.devices[engName];
let devicesValuesGet = Object.values(devicesObjGet); let devicesKeysGet = {}; Object.keys(devicesObjGet).forEach((key, index) => { devicesKeysGet[key] = index; });
let devices = [[conf.devices.is[engName].sendTo, devicesKeysSend, devicesValuesSend,], [engName, devicesKeysGet, devicesValuesGet,],]; let serverLoc = conf.server['1']; let hostLoc = `${serverLoc.host}`;
let portLoc = `${serverLoc.port}`; let hostPortLoc = `${hostLoc}:${portLoc}`; let serverWeb = conf.server['2']; let hostWeb = `${serverWeb.host}`; let portWeb = `${serverWeb.port}`;
let hostPortWeb = `${hostWeb}:${portWeb}`; let secConnect = conf.secConnect; let secReconnect = conf.secReconnect; let secRetWebSocket = conf.secRetWebSocket; let secPing = conf.secPing;
let secPingTimeout = conf.secPingTimeout; let secLoop = conf.secLoop; let kbPartsMessage = conf.kbPartsMessage; let minClearPartsMessages = conf.minClearPartsMessages; let devMy = conf.devMy;
let par1 = `${securityPass}-${conf.par1}`; let par2 = `${conf.par2}`; let par3 = `${securityPass}-${conf.par3}`; let par4 = `${securityPass}-${conf.par4}`; let par5 = `${securityPass}-${conf.par5}`;
let par8 = `${securityPass}-${conf.par8}`; let par9 = `${securityPass}-${conf.par9}`; let par10 = `${securityPass}-${conf.par10}`; let par11 = `${conf.par11}`; let par12 = `${conf.par12}`;
let par13 = `${conf.par13}`; let hostPort = `${letter === 'D' ? hostPortLoc : hostPortWeb}/?roo=`; let devSend = `${hostPort}${devMy}-${devices[0][0]}-${devices[0][2][0]}`;
let devSever = `${hostPort}${devMaster}-${devices[eng ? 0 : 1][0]}-${devices[eng ? 0 : 1][2][0]}`;

gW = { // MANTER APÓS O 'devSend'
    ...gW, securityPass, 'serverWeb': serverWeb.host, portWeb, 'serverLoc': serverLoc.host, portLoc, devMaster, 'devSlave': engName, devSend, devices, hostPortWeb, hostPortLoc, secConnect, secReconnect,
    secRetWebSocket, secPing, secPingTimeout, secLoop, kbPartsMessage, minClearPartsMessages, devMy, devSever, par1, par2, par3, par4, par5, par8, par9, par10, par11, par12, 'pages': false, par13,
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// ############### GLOBAL OBJECT ###############
// gOList(async function () { console.log('globalObject [import] ALTERADO →', gO.inf) }); gO.inf['NovaChave'] = { 'a': 'b' }; gO.inf['NovaChave'] = ['a', 'b', 'c',]; console.log(gO.inf)
let gOListener = []; let gOObj = {}; function gOList(listener) { gOListener.push(listener); } function notificarListeners(prop, value) {
    if (gO.inf.alert) { console.log('globalObject [export] ALTERADO →', gO.inf); } for (let listener of gOListener) { listener(prop, value); }
} let gO = new Proxy(gOObj, { set(target, prop, value) { target[prop] = value; notificarListeners(prop, value); return true; }, }); gO.inf = {}; // let cs = await configStorage(['']); console.log(cs)

// ############### RATE LIMIT ###############
// let rate = rateLimiter({ 'max': 3, 'sec': 5 }); function testRate() { console.log(rate.check()); console.log(rate.check()); console.log(rate.check()); console.log(rate.check()) }; testRate();
function rateLimiter(inf = {}) {
    let { max, sec, } = inf; sec = sec * 1000; let old = [];
    function check() { let now = Date.now(); let recent = old.filter(timestamp => timestamp >= now - sec); if (recent.length < max) { old.push(now); return true; } else { return false; } } return { check, };
}

// ############### NÚMERO ALEATÓRIO ###############
function randomNumber(min, max) { return Math.floor(Math.random() * ((typeof max === 'number' ? max : min + 1) - min + 1) + min); } // console.log(randomNumber(2, 5))

// ############### LISTENER ###############
let lists = {}; function listenerMonitorar(namLis, callback) { if (!lists[namLis]) { lists[namLis] = []; } lists[namLis].push(callback); }
async function listenerAcionar(namLis, inf, call) { if (lists[namLis]) { for (let callFun of lists[namLis]) { let res = await callFun(namLis, inf); if (typeof call === 'function') { call(res); } return res; } } }

// ############### AWAIT TIMEOUT ###############
function awaitTimeout(inf = {}) {
    let { listenerName, secondsAwait, } = inf; return new Promise((resolve) => {
        let timeout; listenerMonitorar(listenerName, async (namLis, param1) => { clearTimeout(timeout); resolve({ 'ret': true, 'msg': 'TIMEOUT_FOI_LIMPO', 'res': param1, }); });
        timeout = setTimeout(() => { resolve({ 'ret': false, 'msg': 'TIMEOUT_EXPIROU', }); }, secondsAwait * 1000);
    });
} // async function runOk() {  console.log('INICIO'); let retAwaitTimeout = await awaitTimeout({ 'secondsAwait': 5, 'listenerName': 'NOME AQUI' }); console.log(retAwaitTimeout); }; runOk();
// async function liberarTimeout() { setTimeout(() => { listenerAcionar('NOME AQUI', 'INF1', 'INF2'); }, 2000);}; liberarTimeout();

// ############### CLEAR CONSOLE ###############
function clearRun() { if (eng) { console.clear(); } else { process.stdout.write('\u001b[2J\u001b[0;0H'); process.stdout.write('\x1Bc'); } } let msgQtd = 0; let clearConsole = console.log;
console.log = function () { clearConsole.apply(console, arguments); msgQtd++; if (msgQtd >= 100) { clearRun(); msgQtd = 0; console.log('CONSOLE LIMPO!\n'); } }; clearRun();

// PEGAR O NOME DO ARQUIVO(SEM EXTENSÃO) | IMPORTAR FUNÇÕES DINAMICAMENTE QUANDO NECESSÁRIO | FUNÇÃO GENÉRICA (QUANDO O ENGINE ESTIVER ERRADO) | ENCAMINHAR PARA DEVICE
function funFile(txt) { return txt.match(/([^\\/]+)(?=\.[^\\.]+$)/)[0]; }
let qtd1 = 0; async function funImport(infOk) { let { path, inf, } = infOk; qtd1++; let n = funFile(path); if (qtd1 > 30) { console.log('IMPORTANDO...', n); } await import(`${path}`); return await globalThis[n](inf); }
async function funGeneric(infOk) { let { path, inf, } = infOk; let n = funFile(path); let retDevAndFun = await devFun({ 'e': import.meta.url, 'enc': true, 'data': { 'name': n, 'par': inf, }, }); return retDevAndFun; }

// CALCULAR TEMPO DE INICIALIZAÇÃO
function startupTime(b, c) { let a = c - b; let s = Math.floor(a / 1000); let m = a % 1000; let f = m.toString().padStart(3, '0'); return `${s}.${f}`; }

// ## VARIÁVEIS
globalThis['cs'] = cs;
// ## GLOBAL OBJECT [NOVO]
globalThis['gO'] = gO; globalThis['gOList'] = gOList;
// ## LISTENER
globalThis['listenerMonitorar'] = listenerMonitorar; globalThis['listenerAcionar'] = listenerAcionar;
// ## FUNÇÕES
globalThis['rateLimiter'] = rateLimiter; globalThis['randomNumber'] = randomNumber; globalThis['awaitTimeout'] = awaitTimeout; globalThis['funImport'] = funImport; globalThis['funGeneric'] = funGeneric;
globalThis['clearRun'] = clearRun; globalThis['startupTime'] = startupTime;

// ********************** OBRIGATÓRIO FICAR APOS O EXPORT GLOBAL (não subir!!!) NÃO USAR !!!
function all1() { } globalThis['all1'] = all1;
// *****************************************************************************************

// NÃO COMENTAR! NECESSÁRIO QUANDO NÃO FOR 'Chrome_Extension'
if (!globalThis.all2) { await import('./@export.js'); }

// javascript: (function () {
//     function pw(j, pw, ph, u) {
//         let w = (pw / 100) * j.top.screen.width, h = (ph / 100) * j.top.screen.height; let y = j.top.outerHeight / 2 + j.top.screenY - (h / 2), x = j.top.outerWidth / 2 + j.top.screenX - (w / 2);
//         return j.open(u, '', `width=${w},height=${h},top=${y},left=${x}`)
//     }; pw(globalThis, 40, 40, 'http://12.345.678.910:1234')
// })()


