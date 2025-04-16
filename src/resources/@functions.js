// await new Promise(r => setTimeout(r, 2000));

/* CHECAR SE É ARRAY  */ // Array.isArray(retHtmlToJson)   |   CHECAR SE TEM A CHAVE  if ('chave' in obj){ }   |   CHECAR SE É OBJETO typeof obj === 'object'
// let { key: atribuirNisso, } = { 'key': 'AAA', }; console.log(atribuirNisso); let arrNew = arr.map((v, index) => ({ index, providerOk: v.provider, actionOk: v.action, })); // PODE REATRIBUIR NA MESMA VARIÁVEL
// let ret = rets.some(v => v.ret === true)); let ret = rets.every(v => v.ret === true)); 
// let string = 'a/b/c/d'; console.log(string.split('/').reverse()[0]); console.log(string.split('/').reverse()[1]); console.log(string.split('/').reverse()[2]); // SPLIT POR '/' E PEGAR A PARTIR DO ÚLTIMO ÍNDICE

// for (let [index, value,] of array.entries()) { console.log('INDEX', index, 'VALUE', value); };

/* FORMATAR EM '0001' */ // number = String(number).padStart(4, '0'); 

/* ESPERAR E EXECUTAR UMA VEZ */ // setTimeout(() => { console.log('OK'); }, 2000);

/* ESPERAR E REPETIR */ // setInterval(() => { console.log('OK'); }, 2000);

/* TIMEOUT */ // let timeout = setTimeout(() => { console.log('OK'); }, 2000); clearTimeout(timeout);

/* LOOP 99 VEZES */ // for (let index = 0; index < 99; index++) { console.log('INDEX', index); };

/* QUALQUER → BASE64 | BASE64 → UTF8 */ // let qualquerParaBase64 = Buffer.from('CASAMENTO').toString('base64'); console.log(`qualquerParaBase64 ${qualquerParaBase64}`)
// let base64ParaUtf8 = Buffer.from(qualquerParaBase64, 'base64').toString('utf8'); console.log(`base64ParaUtf8 ${base64ParaUtf8}`); cd /d D:\ARQUIVOS\PROJETOS\Sniffer_Python

let _fs, cs; globalThis['engName'] = (eng) ? 'CHROME' : 'NODEJS'; globalThis['letter'] = 'x'; globalThis['fileProjetos'] = 'x'; globalThis['fileChrome_Extension'] = 'x'; globalThis['fileWindows'] = 'x'; if (!eng) {
    process.noDeprecation = true; _fs = await import('fs'); globalThis['_fs'] = _fs; let m; m = await import('path'); globalThis[`_path`] = m; m = await import('module'); globalThis[`_createRequire`] = m.createRequire;
}

// DEFINIR → LETTER | ROOT | FUNCTION | PROJECT | FILE | LINE
await import('./getPath.js'); let rGP = await getPath({ 'e': new Error(), 'isFunction': true, }); let conf = rGP.res.confOk; let devMaster = conf.master; conf = conf.webSocket;

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
    firstFileCall: sP.split('/').pop().replace('_TEMP', '').replace('.js', ''), // ← DISPONÍVEL APENAS NO 'WebScraper' →→→ 'New2', 'New3', 'New4'...
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// ############### GLOBAL OBJECT ###############
function crashCode(txt = 'QUEBRANDO CÓDIGO...') { console.log(txt); if (eng) { chrome.management.setEnabled(chrome.runtime.id, false); } else { process.exit(); } } // crashCode()

// ############### GLOBAL OBJECT ###############
let gOListener = []; let gOObj = {}; function gOList(listener) { gOListener.push(listener); } function notificarListeners(prop, value) {
    if (gO.inf.alert) { console.log('globalObject [export] ALTERADO →', gO.inf); } for (let listener of gOListener) { listener(prop, value); }
} let gO = new Proxy(gOObj, { set(target, prop, value) { target[prop] = value; notificarListeners(prop, value); return true; }, }); gO.inf = {}; // let cs = await configStorage(['']); console.log(cs)
// gOList(async function () { console.log('globalObject [import] ALTERADO →', gO.inf) }); gO.inf['NovaChave'] = { 'a': 'b' }; gO.inf['NovaChave'] = ['a', 'b', 'c',]; console.log(gO.inf)

// ############### RATE LIMIT ###############
function rateLimiter(inf = {}) { let { max, sec, } = inf; let i = sec * 1000, t = []; return { check: () => { let n = Date.now(); t.push(n); while (t[0] < n - i) { t.shift(); } return t.length <= max; }, }; }
// let rate = rateLimiter({ 'max': 3, 'sec': 5 }); function testRate() { console.log(rate.check()); console.log(rate.check()); console.log(rate.check()); console.log(rate.check()) }; testRate();

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

// ############### CALCULAR TEMPO DE INICIALIZAÇÃO ###############
function startupTime(b, c) { let a = c - b; let s = Math.floor(a / 1000); let m = a % 1000; let f = m.toString().padStart(3, '0'); return `${s}.${f}`; }

// ############### PATH DA BIBLIOTECA NODEJS ###############
function libPath(i = {}) {
    let { p, m, l, } = i; p = `${fileProjetos}/${p}/node_modules/${m}${m.includes('@') ? `/${l}` : ``}`; p = `file:///${p}/${JSON.parse(_fs.readFileSync(`${p}/package.json`)).main.replace(/^(\.\/|\/)/, '')}`; return p;
}

// {IMPORT FUNÇÕES} → DINAMICAMENTE QUANDO NECESSÁRIO | FUNÇÃO GENÉRICA (QUANDO O ENGINE ESTIVER ERRADO) * ENCAMINHAR PARA DEVICE
let qtd0 = 0; async function importFun(infOk = {}) {
    let { engOk, path, inf, project, } = infOk; qtd0++; let name = path.match(/([^\\/]+)(?=\.[^\\.]+$)/)[0]; if (qtd0 > 50) { console.log(`IMPORT FUN: ERRO | EM LOOP!!! '${path}'`); crashCode(); }
    if (engOk) { await import((eng ? `${gW.root}://${gW.functions}` : `file://${fileProjetos}/${project === 'NAO_DEFINIDO' ? 'Chrome_Extension' : project}`) + `/${path.replace('./', '')}`); return globalThis[name](inf); }
    else { let retDevAndFun = await devFun({ 'e': import.meta.url, 'enc': true, 'data': { name, 'par': inf, }, }); return retDevAndFun; }
}

// {IMPORT BIBLIOTECAS} → [NODE] DINAMICAMENTE QUANDO NECESSÁRIO 
let qtd1 = 0; async function importLibs(...args) {
    let libs = args[0]; let libsTem = libs; qtd1++; if (qtd1 > 50) { console.log(`IMPORT LIBS: ERRO | EM LOOP [1]!!!`); crashCode(); } for (let m in libs) {
        qtd1++; if (qtd1 > 50) { console.log(`IMPORT LIBS: ERRO | EM LOOP [2]!!!`); crashCode(); } for (let l in libs[m]) {
            qtd1++; if (qtd1 > 50) { console.log(`IMPORT LIBS: ERRO | EM LOOP [3]!!!`); crashCode(); } let mL = false; if (l !== 'pro') {
                let pro = libs[m]['pro'] === true ? gW.project : libs[m]['pro']; let b0 = libs[m][l] === 1; let b1 = globalThis[`_${l}`]; if (b0 && !b1) {
                    mL = true; if (!eng) { mL = await import(pro ? libPath({ 'p': pro, m, l, }) : m); } globalThis[`_${l}`] = eng ? globalThis[`${l}`] : (m === l) ? mL : mL[l] || mL.default[l] || mL.default;
                } if (globalThis[`_${l}`]) { Object.keys(libsTem[m] || {}).length === 2 && libsTem?.[m]?.pro && delete libsTem[m].pro; delete libsTem?.[m]?.[l], Object.keys(libsTem[m] || {}).length || delete libsTem[m]; }
                // console.log(`${mL ? '✅' : '❌'} | EXISTE (${b1 ? 'SIM' : 'NAO'}) | (${m}${pro && !eng ? '⚠️ ' : ''}) [${l}] | _(${args[1]})_ |`, JSON.stringify(libsTem));
            }
        }
    } return libsTem;
}

Object.assign(globalThis, {
   /* ## VARIÁVEIS */     cs,
   /* ## GLOBAL OBJECT */ gO, gOList,
    /* ## LISTENER */     listenerMonitorar, listenerAcionar,
    /* ## FUNÇÕES */      crashCode, rateLimiter, randomNumber, awaitTimeout, clearRun, startupTime, importFun, importLibs,
});

// ********************** OBRIGATÓRIO FICAR APOS O EXPORT GLOBAL (não subir!!!) NÃO USAR !!! | NÃO COMENTAR! NECESSÁRIO QUANDO NÃO FOR 'Chrome_Extension'
function all1() { } globalThis['all1'] = all1; if (!globalThis.all2) { await import('./@export.js'); }
// *****************************************************************************************

// javascript: (function () {
//     function pw(j, pw, ph, u) {
//         let w = (pw / 100) * j.top.screen.width, h = (ph / 100) * j.top.screen.height; let y = j.top.outerHeight / 2 + j.top.screenY - (h / 2), x = j.top.outerWidth / 2 + j.top.screenX - (w / 2);
//         return j.open(u, '', `width=${w},height=${h},top=${y},left=${x}`)
//     }; pw(globalThis, 40, 40, 'http://12.345.678.910:1234')
// })()


