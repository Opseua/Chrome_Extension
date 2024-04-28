// [1] CHROME [c] | [2] NODEJS [n] | [3] GOOGLE [g]  
let cng = typeof window !== 'undefined' ? 1 : typeof UrlFetchApp !== 'undefined' ? 3 : 2
function all2() { }; // ******************************************************** NÃO USAR !!!
if (cng == 1) { window['all2'] = all2; } else { global['all2'] = all2 }
// *****************************************************************************************

// IMPORTAR BIBLIOTECAS
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
}

// FUNÇÕES DESSE PROJETO
await import('./regexE.js') // MANTER COMO 1º IMPORT
await import('./file.js') // MANTER COMO 2º IMPORT
await import('./api.js')
await import('./chat.js')
await import('./chromeActions.js')
await import('./client.js')
await import('./clipboard.js')
await import('./commandLine.js')
await import('./completeJudge.js')
await import('./configStorage.js')
await import('./dateHour.js')
await import('./delOldLogs.js')
await import('./devFun.js')
// await import('./getCookies.js')
// await import('./getPage.js')
await import('./getPath.js')
await import('./googleSheets.js')
await import('./hasKey.js')
await import('./htmlToJson.js')
// await import('./jsonInterpret.js')
// await import('./keepCookieLive.js')
await import('./log.js')
await import('./logConsole.js')
await import('./notification.js')
await import('./messageReceived.js')
await import('./messageSend.js')
// await import('./orderObj.js')
await import('./promptChrome.js')
// await import('./randomNumber.js')
await import('./rawText.js')
await import('./regex.js')
await import('./secToHour.js')
// await import('./sniffer.js')
// await import('./splitText.js')
await import('./tabSearch.js')
await import('./translate.js')

// SCRIPTS DESSE PROJETO
await import('../scripts/command1.js')
await import('../scripts/command2.js')


