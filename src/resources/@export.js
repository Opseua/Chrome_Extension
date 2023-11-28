// [1] CHROME [c] | [2] NODEJS [n] | [3] GOOGLE [g]  
let cng = typeof window !== 'undefined' ? 1 : typeof UrlFetchApp !== 'undefined' ? 3 : 2
// ###### true CHROME / GOOGLE | false NODEJS
if (cng == 1) {
    window['eng'] = true
    window['engName'] = 'CHROME'
} else if (cng == 2) {
    global['eng'] = false
    global['engName'] = 'NODEJS'
} else if (cng == 3) {
    global['eng'] = true
    global['engName'] = 'GOOGLE'
}

function all2() { }; // ******************************************************** NÃO USAR !!!
if (eng) { window['all2'] = all2; } else { global['all2'] = all2 }
// *****************************************************************************************

// IMPORTAR BIBLIOTECAS
if (!(eng ? window.all1 : global.all1)) {
    await import('./@functions.js');
}

// FUNÇÕES DESSE PROJETO
await import('./api.js')
await import('./chatGpt.js')
await import('./chromeActions.js')
await import('./clipboard.js')
await import('./file.js')
await import('./commandLine.js')
await import('./configStorage.js')
await import('./dateHour.js')
await import('./devFun.js')
await import('./file.js')
await import('./getCookies.js')
await import('./getPage.js')
await import('./googleSheet.js')
await import('./hasKey.js')
await import('./htmlToJson.js')
await import('./jsonInterpret.js')
await import('./log.js')
await import('./keepCookieLive.js')
await import('./notification.js')
await import('./orderObj.js')
await import('./promptChrome.js')
await import('./random.js')
await import('./regex.js')
await import('./regexE.js')
await import('./secToHour.js')
await import('./sniffer.js')
await import('./splitText.js')
await import('./tabSearch.js')
await import('./translate.js')
await import('./wsConnect.js')

// SERVER NODE
await import('../serverNode.js')

// SCRIPTS DESSE PROJETO
await import('../scripts/command1.js')
await import('../scripts/command2.js')

// ### WORD [NECESSÁRIO PARA CHAMAR A 'sendData']
if (!eng) {
    await import('../../../WebScraper/src/resources/sendData.js')
}
