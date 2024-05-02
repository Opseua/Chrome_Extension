// [1] CHROME [c] | [2] NODEJS [n] | [3] GOOGLE [g]  
let cng = typeof window !== 'undefined' ? 1 : typeof UrlFetchApp !== 'undefined' ? 3 : 2
function all2() { }; // ******************************************************** NÃO USAR !!!
if (cng == 1) { window['all2'] = all2; } else { global['all2'] = all2 }
// *****************************************************************************************

if (!(cng == 1 ? window.all1 : global.all1)) {
    // DEFINIR O 'devChildren' → [CHROME] EMAIL DO USUÁRIO | [NODEJS] PRIMEIRO ARQUIVO A SER EXECUTADO (NA MAIORIA DOS CASOS 'server')
    let devC = new Error().stack.split('\n'); devC = devC[devC.length - 1]; let devChildren = devC.includes('.js:') ? devC.match(/\/([^/]+)\.[^/]+$/)[1] : false
    if (typeof window !== 'undefined') { devChildren = await new Promise((resolve) => { chrome.identity.getProfileUserInfo(function (u) { resolve(u.email) }) }) }

    // @functions
    await import('./@functions.js');

    // DEFINIR → LETTER | ROOT | FUNCTION | PROJECT | FILE | LINE
    let retGetPath = await getPath({ 'e': new Error(), 'devChildren': devChildren })

    // console.log(eng, '-', engName, '-', cng, '-', letter); console.log("#################")
    // console.log('securityPass:', globalWindow.securityPass)
    // console.log('portWeb:', globalWindow.portWeb, '|', 'serverWeb:', globalWindow.serverWeb)
    // console.log('portLoc:', globalWindow.portLoc, '|', 'serverLoc:', globalWindow.serverLoc)
    // console.log('devMaster:', globalWindow.devMaster, '|', 'devSlave:', globalWindow.devSlave, '|', 'devChildren:', globalWindow.devChildren)
    // console.log('devSend:', globalWindow.devSend)
    // console.log('devGet:', globalWindow.devGet)
    // console.log('conf:', globalWindow.conf)
    // console.log('root:', globalWindow.root)
    // console.log('functions:', globalWindow.functions)
    // console.log('project:', globalWindow.project)
}

// FUNÇÕES DESSE PROJETO
// await import('./regexE.js') // MANTER COMO 1º IMPORT *
// await import('./file.js') // MANTER COMO 2º IMPORT *
// await import('./api.js') *
// await import('./chat.js') * 
// await import('./chromeActions.js') *
// await import('./client.js') *
// await import('./clipboard.js') *
// await import('./commandLine.js') *
// await import('./completeJudge.js') *
// await import('./configStorage.js') *
// await import('./dateHour.js') *
// await import('./devFun.js') * 
// await import('./getCookies.js')
// await import('./getPage.js')
// await import('./getPath.js') *
// await import('./googleSheets.js') * 
// await import('./hasKey.js') *
// await import('./htmlToJson.js') *
// await import('./jsonInterpret.js')
// await import('./keepCookieLive.js')
// await import('./log.js') *
// await import('./logConsole.js') *
// await import('./notification.js') *
// await import('./messageReceived.js') *
// await import('./messageSend.js') *
// await import('./orderObj.js')
// await import('./promptChrome.js') *
// await import('./randomNumber.js')
// await import('./rawText.js') *
// await import('./regex.js') *
// await import('./secToHour.js') *
// await import('./sniffer.js')
// await import('./splitText.js')
// await import('./tabSearch.js') *
// await import('./translate.js') *

// SCRIPTS DESSE PROJETO
// await import('../scripts/command1.js') *
// await import('../scripts/command2.js') *

let functionsArr = [
    // FUNÇÕES DESSE PROJETO
    { 'eng': 'CHROME/NODEJS', 'functionName': 'regexE', 'functionPath': './regexE.js', }, // MANTER COMO 1º IMPORT
    { 'eng': 'CHROME/NODEJS', 'functionName': 'file', 'functionPath': './file.js', }, // MANTER COMO 2º IMPORT
    { 'eng': 'CHROME/NODEJS', 'functionName': 'api', 'functionPath': './api.js', },
    { 'eng': 'CHROME/NODEJS', 'functionName': 'chat', 'functionPath': './chat.js', },
    { 'eng': 'CHROME', 'functionName': 'chromeActions', 'functionPath': './chromeActions.js', },
    { 'eng': 'CHROME/NODEJS', 'functionName': 'client', 'functionPath': './client.js', },
    { 'eng': 'CHROME/NODEJS', 'functionName': 'clipboard', 'functionPath': './clipboard.js', },
    { 'eng': 'NODEJS', 'functionName': 'commandLine', 'functionPath': './commandLine.js', },
    { 'eng': 'CHROME', 'functionName': 'completeJudge', 'functionPath': './completeJudge.js', },
    { 'eng': 'CHROME/NODEJS', 'functionName': 'configStorage', 'functionPath': './configStorage.js', },
    { 'eng': 'CHROME/NODEJS', 'functionName': 'dateHour', 'functionPath': './dateHour.js', },
    { 'eng': 'CHROME/NODEJS', 'functionName': 'devFun', 'functionPath': './devFun.js', },
    // { 'eng': 'CHROME', 'functionName': 'getCookies', 'functionPath': './getCookies.js', },
    // { 'eng': 'CHROME', 'functionName': 'getPage', 'functionPath': './getPage.js', },
    // { 'eng': 'CHROME/NODEJS', 'functionName': 'getPath', 'functionPath': './getPath.js', },
    { 'eng': 'NODEJS', 'functionName': 'googleSheets', 'functionPath': './googleSheets.js', },
    { 'eng': 'CHROME/NODEJS', 'functionName': 'hasKey', 'functionPath': './hasKey.js', },
    { 'eng': 'NODEJS', 'functionName': 'htmlToJson', 'functionPath': './htmlToJson.js', },
    // { 'eng': 'CHROME/NODEJS', 'functionName': 'jsonInterpret', 'functionPath': './jsonInterpret.js', },
    // { 'eng': 'CHROME', 'functionName': 'keepCookieLive', 'functionPath': './keepCookieLive.js', },
    { 'eng': 'NODEJS', 'functionName': 'log', 'functionPath': './log.js', },
    { 'eng': 'CHROME/NODEJS', 'functionName': 'logConsole', 'functionPath': './logConsole.js', },
    { 'eng': 'CHROME', 'functionName': 'notification', 'functionPath': './notification.js', },
    { 'eng': 'CHROME/NODEJS', 'functionName': 'messageReceived', 'functionPath': './messageReceived.js', },
    { 'eng': 'CHROME/NODEJS', 'functionName': 'messageSend', 'functionPath': './messageSend.js', },
    // { 'eng': 'CHROME/NODEJS', 'functionName': 'orderObj', 'functionPath': './orderObj.js', },
    { 'eng': 'CHROME', 'functionName': 'promptChrome', 'functionPath': './promptChrome.js', },
    // { 'eng': 'CHROME/NODEJS', 'functionName': 'randomNumber', 'functionPath': './randomNumber.js', },
    { 'eng': 'CHROME/NODEJS', 'functionName': 'rawText', 'functionPath': './rawText.js', },
    { 'eng': 'CHROME/NODEJS', 'functionName': 'regex', 'functionPath': './regex.js', },
    { 'eng': 'CHROME/NODEJS', 'functionName': 'secToHour', 'functionPath': './secToHour.js', },
    // { 'eng': 'CHROME', 'functionName': 'sniffer', 'functionPath': './sniffer.js', },
    // { 'eng': 'CHROME/NODEJS', 'functionName': 'splitText', 'functionPath': './splitText.js', },
    { 'eng': 'CHROME', 'functionName': 'tabSearch', 'functionPath': './tabSearch.js', },
    { 'eng': 'CHROME/NODEJS', 'functionName': 'translate', 'functionPath': './translate.js', },

    // SCRIPTS DESSE PROJETO
    { 'eng': 'CHROME', 'functionName': 'command1', 'functionPath': '../scripts/command1.js', },
    { 'eng': 'CHROME', 'functionName': 'command2', 'functionPath': '../scripts/command2.js', },
]

// FUNÇÃO GENÉRICA (QUANDO O ENGINE ESTIVER ERRADO)
async function functionGeneric(functionName, inf) {
    // ENCAMINHAR PARA DEVICE
    let infDevAndFun = { 'e': cng == 1 ? chrome.runtime.getURL(functionName) : import.meta.url, 'enc': true, 'data': { 'name': functionName, 'par': inf, 'retInf': inf.retInf, } };
    let retDevAndFun = await devFun(infDevAndFun); return retDevAndFun
}

// IMPORTAR FUNÇÕES
async function functionsImport() {
    // ASSOCIAR FUNÇÃO GENÉRICA EM TODAS AS VARIÁVEIS GLOBAIS COM O NOME DAS FUNÇÕES
    for (let [index, value] of functionsArr.entries()) {
        if (cng == 1) { window[value.functionName] = (inf) => functionGeneric(value.functionName, inf); } // CHROME
        else { global[value.functionName] = (inf) => functionGeneric(value.functionName, inf); } // NODEJS
    }; let devType = cng == 1 ? 'CHROME' : 'NODEJS'
    // ASSOCIAR FUNÇÕES NAS VARIÁVEIS GLOBAIS 
    for (let [index, value] of functionsArr.entries()) { if (value.eng.includes(devType)) { await import(`${value.functionPath}`); } };
}; await functionsImport()
