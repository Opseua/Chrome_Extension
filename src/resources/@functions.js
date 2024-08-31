// await new Promise(resolve => { setTimeout(resolve, 2000) });

// process.exit(); process.cwd();

// for (let [index, value] of array.entries()) {
//     console.log('INDEX', index, 'VALUE', value);
// };

// ESPERAR E REPETIR
// setInterval(() => {
//     console.log('OK');
//   }, 2000);

// ESPERAR E EXECUTAR UMA VEZ
// setTimeout(() => {
//     console.log('OK');
// }, 2000);

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
let cng = eng ? 1 : 2;

let _fs, _path, _cheerio, _clipboard, _WebSocket, _http, _exec, _spawn, _google, _crypto, _puppeteer, _net, _getFolderSize, _parse, cs // *** _url, _util

if (cng == 1) { // CHROME
    window['engName'] = 'CHROME'; window['cng'] = 1; window['letter'] = 'x'; window['globalWindow'] = {}; window['esLintIgnore'] = ''; // window['wsClients'] = { 'rooms': {} }; window['wsClientLoc'] = '';
} else { // NDEJS
    global['engName'] = 'NODEJS'; global['cng'] = 2; global['letter'] = 'x'; global['globalWindow'] = {}; global['esLintIgnore'] = ''; // global['wsClients'] = { 'rooms': {} }; global['wsClientLoc'] = '';
    _fs = await import('fs'); global['_fs'] = _fs;
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

if (eng) { // CHROME
    _WebSocket = window.WebSocket
} else { // NODEJS
    _path = await import('path'); _cheerio = await import('cheerio'); const { default: WebSocket } = await import('ws'); _WebSocket = WebSocket; const { default: clipboard } = await import('clipboardy');
    _clipboard = clipboard; const { default: http } = await import('http'); _http = http; const { exec } = await import('child_process'); _exec = exec; const { spawn } = await import('child_process');
    _spawn = spawn; const { google } = await import('googleapis'); _google = google; const { createHash } = await import('crypto'); _crypto = createHash; _puppeteer = await import('puppeteer');
    _net = await import('net'); const { default: getFolderSize } = await import('get-folder-size'); _getFolderSize = getFolderSize; const { parse } = await import('url'); _parse = parse;
    // *** _url = await import('url'); _util = await import('util');
}

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
// console.log(randomNumber(2, 5))
function randomNumber(min, max) { return Math.floor(Math.random() * (max - min + 1) + min) }

// ############### LISTENER ###############
let listeners = {}; function listenerMonitorar(nomeList, callback) { if (!listeners[nomeList]) { listeners[nomeList] = []; } listeners[nomeList].push(callback); }
// async function listenerAcionar(nomeList, inf, callback) { if (listeners[nomeList]) { for (let callFun of listeners[nomeList]) { let resp = await callFun(nomeList, inf); if (callback) { callback(resp) } return resp } } }
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



let promtpGpt = `
Preciso da sua ajuda com uma tarefa, lembrando que você deve comparar o texto que eu vou mandar, com o seu banco de dados, para identificar se o texto é autêntico (do Português do Brasil) ou não. A seguir vou deixar as regras da tarefa, mas não se esqueça de TAMBÉM usar o seu banco de dados para auxiliar e complementar o julgamento final. Você só deve responder 'AUTHENTIC' (se for autentico de acordo com as regras da tarefa e com o adicional do seu banco de dados, que você pode identificar as palavras chave que os Brasileiros usam) ou 'INAUTHENTIC' (caso contrário). Não se esqueça de checar se as palavras que fazem parte do texto são do vocabulário autentico brasileiro. Em alguns casos a frase parece não ser autentica, mas tem uma ou mais palavras que são mais usadas pelos brasileiros.

OBJECTIVE

You're going to be presented with some AI-generated text in Brazilian Portuguese. Because those pieces of text are AI-generated, some might not have the tone that Brazilian Portuguese content has in vernacular conversations, or when you read media in Brazilian Portuguese, so they might feel inauthentic to a native Brazilian Portuguese speaker. Your goal is to select **ONLY TEXT THAT HAS AN AUTHENTIC-SOUNDING BRAZILIAN PORTUGUESE TONE.

A note about Brazilian Portuguese dialects: The generated text is in Brazilian Portuguese, without a specific region or dialect. This means that you might find words or expressions that are not common in your particular variant of Brazilian Portuguese, but might be fine for another variant. If you encounter text that does not sound natural to you, but you know it is natural/authentic Brazilian Portuguese for other native Speakers, then you can indicate "yes". For example, "Sossega o facho e não me aperreie!" is authentic Brazilian Portuguese from the Northeast, even if this sentence would not be spoken in the South of Brazil.

Overall, we're looking for content that could have been typed by a native Brazilian Portuguese speaker (from any Brazilian Portuguese-speaking region), even if that content is imperfect.

• It's fine if it has spelling/capitalization/punctuation/grammar issues. We would actually suggest rating those as authentic if you think those mistakes could have been made by a native Brazilian Portuguese speaker. For example, someone typing too fast, someone who's not that good at writing eloquent prose, someone intentionally writing in slang/Internet speak/text speak (abbreviations), etc. Those would be labelled as authentic, as long as the substance/content doesn't feel inauthentic.

• Loan words from other languages (such as English) are fine, as long as they would be used by someone in colloquial or formal Spanish.
	• For example, "O CEO me deu um feedback positivo" could be spoken by a young professional from São Paulo or Salvador.
	• But "Isso não é ciência de foguete!" for example is a little unusual and could imply that this was literally translated from English.

• Content that would be taboo or extremely unusual in most Brazilian Portuguese variants should be considered inauthentic.

Here are some examples of what constitutes authentic-sounding content. If you're having doubts about whether content feels authentic or not, think about it the following way: IS THIS SOMETHING YOU OR ANOTHER BRAZILIAN PORTUGUESE SPEAKER WOULD'VE WRITTEN WORD-FOR-WORD AS PART OF YOUR DAILY LIFE?


→→→ AUTHENTIC EXAMPLES: 

 * EXAMPLE 1:
Oi, Doreen! Meus filhos estão super a fim de dormir na sua casa. Tô pensando em levar eles pra te visitar no fim de semana que vem, e o Marvin e a Lenah falaram que você vai estar em casa. Dá para confirmar se você vai estar disponível pra eu organizar tudo por aqui? Valeu!
 * COMMENT 1:
Regular sentence, more on the formal side, that a Brazilian person could write.

 * EXAMPLE 2:
As pessoas usam o ativismo social para desafiar ou mudar as coisas ao seu redor. Por exemplo, usando protestos, educação e defesa política. Este tipo de ativismo exige comprometimento e paciência. Geralmente, inclui a colaboração de algum grupo de pessoas. As pessoas usam o ativismo social para o bem da sociedade há bastante tempo. Às vezes, pode levar à reforma social. Alguns exemplos de reforma social são as leis de direitos civis e os direitos LGBTQ+. Esses grupos enfrentam desigualdade. O ativismo social visa levar justiça social a esses tipos de grupos que enfrentam desigualdade.
 * COMMENT 2:
The text is consistent with a matter-of-fact article in a newspaper.

 * EXAMPLE 3:
E aí, professor? Te falar, tô indo na academia todo dia, viu? Sei lá se tá errado, mas eu gosto de treinar todo dia, me sinto muito bem depois. O que você acha, professor? Tô no aguardo, viu?
 * COMMENT 3:
Informal sentence that a Brazilian person would say/write. The phrase is grammatically correct. 

 * EXAMPLE 4:
Sei que tem muita coisa pra fazer em Las Vegas, ainda mais nessa época do ano, mas a gente só vai ficar lá por uns dias. A gente devia escolher as melhores coisas pra fazer na área e mandar bala! Sei que tem uns shows de mágica que eu queria muito ver na sexta. Você tava pensando em fazer alguma coisa? Beijos, Nancy
 * COMMENT 4:
Informal sentence, including a common slang. The phrase is gramatically correct. 

 * EXAMPLE 5:
Pessoal, Só pra avisar vocês, entreguei meu aviso prévio hoje. Vou ficar até o final do mês. Se precisarem de alguma coisa até lá, podem falar. Depois aviso pra onde vou. Até mais, Larry
 * COMMENT 5:
Appropriate level of formality for a work place.

 * EXAMPLE 6:
Cães, companheiros leais ao longo da história. Domesticacão lááá na pré-história. Várias raças, tamanhos e jeitos. Fazem companhia, protegem e ajudam a gente. Um amor e carinho sem fim.
 * COMMENT 6:
This phrase even has a common spoken manneirism, but the grammar is perfect (which is unusual).

 * EXAMPLE 7:
E aí, FAMÍLIA, tudo sussa? Escrevo esse email na esperança de que esteja tudo bem. Nosso irmão deu uns perdidos e foi pego tentando fugir pra TANZÂNIA, lá de NAIVASHA. Nós, como seus pais, estamos muito putos com isso. Precisamos nos reunir logo. Abraços, SEUS PAIS QUE TE AMAM.
 * COMMENT 7:
Informal Brazilian Portuguese internet lingo, including common slangs.

 * EXAMPLE 8:
A mina fez uma reforma foda pra karalho numa casa alugada, imagina o que ela faria se fosse numa casa própria então
 * COMMENT 8:
This is an example of an average tweet from a Brazilian person. It contains slangs, curse words (not in an offensive way, just to express intensity) and purposefully misspelling.

 * EXAMPLE 9:
Vcs acreditam em tudo mesmo KKKKKKKK nunca que ele vai dar 13 milha num relogio sem nem saber ver as horas
 * COMMENT 9:
This is also a great example of written online average tweet in pt_BR. Notice the "KKKKKKKK" which is one of the most common ways of expressing laughter/joy.

 * EXAMPLE 10:
As duas últimas fotos foi na minha casa pra saber se tava funcionando HAUEOAJSHEIAA
 * COMMENT 10:
Same as above, but now the laughter is expressed as "HAUEOAJSHEIAA"


→→→ UNAUTHENTIC EXAMPLES: 

 * EXAMPLE 1:
Mas você não está a perceber o que eu estou a dizer? Isto é frustrante pá!
 * COMMENT 1:
This sounds like a Portugal Portuguese translation and it's not something a Brazilian person would say. 

 * EXAMPLE 2:
Trabalho duro. Dedicação. Oportunidade. Liberdade. Imigrantes construíram essa nação. O Sonho Americano. Ao alcance de todos.
 * COMMENT 2:
This sentence is gramatically correct, but it's just not a common way to express yourself. It's very unclear if there's any kind of context where someone would express themselves like this.

 * EXAMPLE 3:
Prezado(a) senhor(a), Espero que esta mensagem o(a) encontre bem. Tenho o prazer de informar que médicos de família estarão fazendo visitas domiciliares. Por favor, dê a eles o apoio necessário enquanto eles realizam seu trabalho. Obrigado(a) pelo seu apoio e cooperação contínuos. Atenciosamente, Joe
 * COMMENT 3:
This sentence reads very machine translated. The first sentence in the second paragraph for exemple is not used at all in Brazilian Portugese and you can tell it was literally translated from English.

 * EXAMPLE 4:
Era conhecido originalmente como Bouledogue Français. Os Buldogues Franceses se originaram na Inglaterra, e não na França. São carinhosos e amigáveis. Ótimos cães de companhia. Carinhosamente apelidados de "cães sapo" por sua semelhança com sapos.
 * COMMENT 4:
This comes across as machine translated. 

O TEXTO É ESSE:

`

if (eng) { // CHROME
    // ## BIBLIOTECAS / NATIVO
    window['_WebSocket'] = _WebSocket;
    // ## VARIÁVEIS
    window['cs'] = cs;
    // ## GLOBAL OBJECT [NOVO]
    window['gO'] = gO; window['gOList'] = gOList;
    // ## LISTENER
    window['listenerMonitorar'] = listenerMonitorar; window['listenerAcionar'] = listenerAcionar;
    // ## FUNÇÕES
    window['rateLimiter'] = rateLimiter; window['randomNumber'] = randomNumber; window['awaitTimeout'] = awaitTimeout;
} else { // NODEJS
    // ## BIBLIOTECAS / NATIVO
    const { WebSocketServer } = await import('ws'); global['_WebSocketServer'] = WebSocketServer; global['_WebSocket'] = _WebSocket; global['_fs'] = _fs; global['_path'] = _path; global['_cheerio'] = _cheerio;
    global['_clipboard'] = _clipboard; global['_http'] = _http; global['_exec'] = _exec; global['_spawn'] = _spawn; global['_google'] = _google; global['_crypto'] = _crypto; global['_puppeteer'] = _puppeteer;
    global['_net'] = _net; global['_getFolderSize'] = _getFolderSize; global['_parse'] = _parse; // *** global['_url'] = _url; global['_util'] = _util;
    // ## VARIÁVEIS
    global['cs'] = cs;
    // ## GLOBAL OBJECT [NOVO]
    global['gO'] = gO; global['gOList'] = gOList;
    // ## LISTENER
    global['listenerMonitorar'] = listenerMonitorar; global['listenerAcionar'] = listenerAcionar;
    // ## FUNÇÕES
    global['rateLimiter'] = rateLimiter; global['randomNumber'] = randomNumber; global['awaitTimeout'] = awaitTimeout;


    global['promtpGpt'] = promtpGpt;
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



