// await new Promise(r => setTimeout(r, 2000));

/* CHECAR SE É ARRAY  */ // Array.isArray(['a', 'b', ])   |   CHECAR SE TEM A CHAVE  if ('chave' in obj){ }   |   CHECAR SE É OBJETO typeof obj === 'object'
// let { key: atribuirNisso, } = { 'key': 'AAA', }; console.log(atribuirNisso); let arrNew = arr.map((v, index) => ({ index, providerOk: v.provider, actionOk: v.action, })); // PODE REATRIBUIR NA MESMA VARIÁVEL
// let ret = rets.some(v => v.ret === true)), ret = rets.every(v => v.ret === true)); 
// let string = 'a/b/c/d'; console.log(string.split('/').reverse()[0]); console.log(string.split('/').reverse()[1]); console.log(string.split('/').reverse()[2]); // SPLIT POR '/' E PEGAR A PARTIR DO ÚLTIMO ÍNDICE

// for (let [index, value,] of array.entries()) { console.log('INDEX', index, 'VALUE', value); };
// let obj = { 'keyA': 'valueA', 'keyB': 'valueB', 'keyC': 'valueC' }; for (let key in obj) { console.log(key); console.log(obj[key]); }

/* FORMATAR EM '0001' */ // number = String(number).padStart(4, '0'); 
/* ESPERAR E EXECUTAR UMA VEZ */ // setTimeout(() => { console.log('OK'); }, 2000);
/* ESPERAR E REPETIR */ // setInterval(() => { console.log('OK'); }, 2000);
/* TIMEOUT */ // let timeout = setTimeout(() => { console.log('OK'); }, 2000); clearTimeout(timeout);
/* LOOP 99 VEZES */ // for (let index = 0; index < 99; index++) { console.log('INDEX', index); };

/* QUALQUER → BASE64 | BASE64 → UTF8 */ // let qualquerParaBase64 = Buffer.from('CASAMENTO').toString('base64'); console.log(`qualquerParaBase64 ${qualquerParaBase64}`) // npm prune (REMOVER BIBLIOTECAS DESNCESSÁRIAS)
// let base64ParaUtf8 = Buffer.from(qualquerParaBase64, 'base64').toString('utf8'); console.log(`base64ParaUtf8 ${base64ParaUtf8}`); cd /d D:\ARQUIVOS\PROJETOS\Sniffer_Python

// ############### CLEAR CONSOLE | CRASH CODE ###############
function clearRun() { if (eng) { console.clear(); } else { process.stdout.write('\u001b[2J\u001b[0;0H'); process.stdout.write('\x1Bc'); } } let msgQtd = 0; let clearConsole = console.log; clearRun();
console.log = function () { clearConsole.apply(console, arguments); msgQtd++; if (msgQtd >= 100) { clearRun(); msgQtd = 0; console.log('CONSOLE LIMPO!\n'); } };
/* *** */ function crashCode(txt = 'QUEBRANDO CÓDIGO...') { console.log(txt); if (eng) { chrome.management.setEnabled(chrome.runtime.id, false); } else { process.exit(); } } // crashCode()

// *-*-*-*-*-*-*-*-*- eng: [true|false → CHROME|NODE/GOOGLE] *-*-*-*-*-*-*-*-*- engType: [1|2|3 → CHROME|NODE|GOOGLE] *-*-*-*-*-*-*-*-*- engName: CHROME|NODE|GOOGLE *-*-*-*-*-*-*-*-*- 
let _fs, cs; globalThis['engType'] = typeof document !== 'undefined' ? 1 : typeof global !== 'undefined' ? 2 : 3; globalThis['engName'] = (engType === 1) ? 'CHROME' : (engType === 2) ? 'NODE' : 'GOOGLE';
globalThis['letter'] = 'x'; globalThis['fileProjetos'] = 'x'; globalThis['fileChrome_Extension'] = 'x'; globalThis['fileWindows'] = 'x'; if (!eng) {
    process.noDeprecation = true; _fs = await import('fs'); globalThis['_fs'] = _fs; let m; m = await import('path'); globalThis[`_path`] = m; m = await import('module'); globalThis[`_createRequire`] = m.createRequire;
} globalThis['currentFile'] = function (err) { return err.stack.match(/([^ \n])*([a-z]*:\/\/\/?)*?[a-z0-9\/\\]*\.js/ig)?.[0].replace(/[()]/g, ''); }; globalThis['firstFileCall'] = currentFile(firstFileCall);

// DEFINIR → LETTER | ROOT | FUNCTION | PROJECT | FILE | LINE
await import('./getPath.js'); let rGP = await getPath({ 'e': new Error(), 'isFunction': true, }), conf = rGP.res.confOk, devMaster = conf.master; conf = conf.webSocket;

let securityPass = `${conf.securityPass}`, devicesObjSend = conf.devices[conf.devices.is[engName].sendTo], devicesValuesSend = Object.values(devicesObjSend), devicesKeysSend = {}, devicesObjGet = conf.devices[engName];
Object.keys(devicesObjSend).forEach((key, index) => { devicesKeysSend[key] = index; }); let devicesValuesGet = Object.values(devicesObjGet), devicesKeysGet = {};
Object.keys(devicesObjGet).forEach((key, index) => { devicesKeysGet[key] = index; }); let devices = [[conf.devices.is[engName].sendTo, devicesKeysSend, devicesValuesSend,], [engName, devicesKeysGet, devicesValuesGet,],];
let serverLoc = conf.server['1'], hostLoc = `${serverLoc.host}`, portLoc = `${serverLoc.port}`, hostPortLoc = `${hostLoc}:${portLoc}`, serverWeb = conf.server['2'], serverWebEstrelar = conf.server['3'].host;
let hostWeb = `${serverWeb.host}`, portWeb = `${serverWeb.port}`, hostPortWeb = `${hostWeb}:${portWeb}`, secConnect = conf.secConnect, secReconnect = conf.secReconnect, secRetWebSocket = conf.secRetWebSocket;
let secPing = conf.secPing, secPingTimeout = conf.secPingTimeout, secLoop = conf.secLoop, kbPartsMessage = conf.kbPartsMessage, minClearPartsMessages = conf.minClearPartsMessages;
let devMy = conf.devMy, par0 = `${conf.par0}`, par1 = `${securityPass}-${conf.par1}`, par2 = `${securityPass}-${conf.par2}`, par3 = `${securityPass}-${conf.par3}`, par4 = `${securityPass}-${conf.par4}`;
let par5 = `${securityPass}-${conf.par5}`, par6 = `${securityPass}-${conf.par6}`, par7 = `${securityPass}-${conf.par7}`, par8 = `${conf.par8}`, hostPort = `${letter === 'D' ? hostPortLoc : hostPortWeb}/?roo=`;
let devSend = `${hostPort}${devMy}-${devices[0][0]}-${devices[0][2][0]}`, devSever = `${hostPort}${devMaster}-${devices[eng ? 0 : 1][0]}-${devices[eng ? 0 : 1][2][0]}`;
gW = { // MANTER APÓS O 'devSend'
    ...gW, securityPass, 'serverWeb': serverWeb.host, portWeb, 'serverLoc': serverLoc.host, serverWebEstrelar, portLoc, devMaster, 'devSlave': engName, devSend, devices, hostPortWeb, hostPortLoc, secConnect,
    secReconnect, secRetWebSocket, secPing, secPingTimeout, secLoop, kbPartsMessage, minClearPartsMessages, devMy, devSever, par0, par1, par2, par3, par4, par5, par6, par7, par8,
    'cloneProject': firstFileCall.split('/').pop().replace('_TEMP', '').replace('.js', ''), // ← 'server', 'serverC6', 'serverC6_New2' ...
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// ############### GLOBAL OBJECT ###############
// let gOListener = [], gOObj = {}; function gOList(listener) { gOListener.push(listener); } function notificarListeners(prop, value) {
//     if (gO.inf.alert) { console.log('globalObject [export] ALTERADO →', gO.inf); } for (let listener of gOListener) { listener(prop, value); }
// } let gO = new Proxy(gOObj, { set(target, prop, value) { target[prop] = value; notificarListeners(prop, value); return true; }, }); gO.inf = {}; // let cs = await configStorage(['']); console.log(cs)
// gOList(async function () { console.log('globalObject [import] ALTERADO →', gO.inf) }); gO.inf['NovaChave'] = { 'a': 'b' }; gO.inf['NovaChave'] = ['a', 'b', 'c',]; console.log(gO.inf)

// ############### RATE LIMIT ###############
function rateLimiter(inf = {}) {
    let { max, sec, } = inf; let i = sec * 1000, t = [], b = 'BLOQUEADO ATÉ ', x = 'PERMITIDO', r, m, f = ts => new Date(ts).toLocaleString('pt-BR').replace(/^(\d{2}\/\d{2}).*?(\d{2}:\d{2}:\d{2}).*$/, '$1 $2');
    return { check: () => { let n = Date.now(); while (t[0] < n - i) { t.shift(); } r = t.length < max; if (r) { t.push(n); m = x; } else { m = b + f(t[0] + i); } return { ret: r, msg: m, }; }, reset: () => t = [], };
}// let rate = rateLimiter({ 'max': 2, 'sec': 5 }); function testRate() { console.log(rate.check()); console.log(rate.check()); console.log(rate.check()); }; testRate(); rate.reset() // LIMPAR TODO O REGISTRO E LIBERAR

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

// ############### CALCULAR TEMPO DE INICIALIZAÇÃO | PATH DA BIBLIOTECA NODE ###############
function startupTime(b, c) { let a = c - b, s = Math.floor(a / 1000), m = a % 1000, f = m.toString().padStart(3, '0'); return `${s}.${f}`; } function libPath(i = {}) {
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
    let libs = args[0], libsT = libs; qtd1++; if (qtd1 > 50) { console.log(`IMPORT LIBS: ERRO | EM LOOP [1]!!!`); crashCode(); } for (let m in libs) {
        qtd1++; if (qtd1 > 50) { console.log(`IMPORT LIBS: ERRO | EM LOOP [2]!!!`); crashCode(); } for (let l in libs[m]) {
            qtd1++; if (qtd1 > 50) { console.log(`IMPORT LIBS: ERRO | EM LOOP [3]!!!`); crashCode(); } let mL = false; if (l !== 'pro') {
                let pro = libs[m]['pro'] === true ? gW.project : libs[m]['pro'], b0 = libs[m][l] === 1, b1 = globalThis[`_${l}`]; if (b0 && !b1) {
                    mL = true; if (!eng) { mL = await import(pro ? libPath({ 'p': pro, m, l, }) : m); } globalThis[`_${l}`] = eng ? globalThis[`${l}`] : (m === l) ? mL : mL[l] || mL.default[l] || mL.default;
                } if (globalThis[`_${l}`]) { Object.keys(libsT[m] || {}).length === 2 && libsT?.[m]?.pro && delete libsT[m].pro; delete libsT?.[m]?.[l], Object.keys(libsT[m] || {}).length || delete libsT[m]; }
                // console.log(`${mL ? '✅' : '❌'} | EXISTE (${b1 ? 'SIM' : 'NAO'}) | (${m}${pro && !eng ? '⚠️ ' : ''}) [${l}] | _(${args[1]})_ |`, JSON.stringify(libsT));
            }
        }
    } return libsT;
}

// SUBSTITUIR VARIÁVEIS
function replaceVars(inf = {}) {
    // eslint-disable-next-line camelcase
    let { content = '', } = inf; let a = letter, b = fileProjetos, c = fileChrome_Extension, d = fileWindows;
    return content.replace(/[!%](letter|letra)[!%]/g, a).replace(/[!%](fileProjetos)[!%]/g, b).replace(/[!%](fileChrome_Extension)[!%]/g, c).replace(/[!%](fileWindows)[!%]/g, d);
}

// PEGAR PARTE DE TEXTO DE STRING
function stringGet(t, m, x, y = 0) {
    let s = String(t); if (!x) { x = 1; } if (m === '>') { return s.slice(0, x); } if (m === '<') { return s.slice(-x); } if (m === '>|') { return s.slice(x - 1, y); }
    if (m === '|<') { return s.slice(s.length - y, s.length - x + 1); } if (m === '>+') { return s.slice(x - 1, x - 1 + y + 1); }
    if (m === '+<') { let f = s.length - x + 1; return s.slice(Math.max(0, f - y - 1), f); } return '';
} // let s = '123456789'; console.log(stringGet(s, '>', 3)); /* 123 */ console.log(stringGet(s, '<', 3)); /* 789 */ console.log(stringGet(s, '>|', 2, 5)); /* 2345 */ console.log(stringGet(s, '|<', 2, 5)); /* 5678 */
// console.log(stringGet(s, '>+', 3, 2)); /* 345 */ console.log(stringGet(s, '>+', 3, 999)); /* 3456789 */ console.log(stringGet(s, '+<', 3, 2)); /* 567 */ console.log(stringGet(s, '+<', 3, 999)); /* 567 */

let gO = { 'inf': {}, }; Object.assign(globalThis, {
   /* ## VARIÁVEIS */     cs,
   // /* ## GLOBAL OBJECT */ gO, gOList,
   /* ## GLOBAL OBJECT */ gO,
    /* ## LISTENER */     listenerMonitorar, listenerAcionar,
    /* ## FUNÇÕES */      crashCode, rateLimiter, randomNumber, awaitTimeout, clearRun, startupTime, importFun, importLibs, replaceVars, stringGet,
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


