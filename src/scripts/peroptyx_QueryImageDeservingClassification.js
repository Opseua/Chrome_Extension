let e = import.meta.url, ee = e;
async function peroptyx_QueryImageDeservingClassification(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        let errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
    try {
        let infNotification, retNotification, retSniffer, retFile
        if (inf.snifferChrome) {
            let gOEve = async (i) => {
                if (i.inf.sniffer === 2) {
                    gORem(gOEve); chrome.browserAction.setBadgeText({ text: '' }); ret = { 'ret': false };
                    return ret
                }
            }; gOAdd(gOEve);
        }; if (inf.logFile) { retFile = await file({ 'e': e, 'action': 'read', 'path': inf.logFile }); retSniffer = JSON.parse(retFile.res) }
        else { retSniffer = JSON.parse(inf.sniffer) }; let query = retSniffer.tasks[0].taskData.query; await clipboard({ 'e': e, 'value': query })
        if (retSniffer.targetLocalIds.length == 1) {
            infNotification = { 'e': e, 'duration': 4, 'icon': './src/scripts/media/notification_3.png', 'title': `BLIND`, 'text': `${query}` }
            retNotification = await notification(infNotification)
        } else {
            infNotification = { 'e': e, 'duration': 2, 'icon': './src/scripts/media/notification_1.png', 'title': `NÃO BLIND`, 'text': `${query}` }
            // retNotification = await notification(infNotification)
        }; let infChatGpt = {
            'e': e, 'provider': 'open.ai',
            'input': `Eu preciso identificar se uma consulta que foi feita no Google faz sentido ou não. Com base nos dados que você tem da internet até 2021, só me responda '####SIM####' se fizer sentido ou '####NAO####' caso não faça sentido. A consulta é a seguinte: \n\n '${query}'`
        }; let retChatGpt = await chat(infChatGpt); if (!retChatGpt.ret) {
            infNotification = {
                'e': e, 'duration': 3, 'icon': './src/scripts/media/notification_3.png', 'title': `ERRO PESQUISA NO CHATGPT`, 'text': `'ret' → false`
            }; retNotification = await notification(infNotification)
        } else if (!retChatGpt.res.includes('####SIM####') && !retChatGpt.res.includes('####NAO####')) {
            infNotification = {
                'e': e, 'duration': 3, 'icon': './src/scripts/media/notification_3.png', 'title': `ERRO CHATGPT`, 'text': `Resposta diferente de 'SIM' ou 'NAO'`
            }; retNotification = await notification(infNotification);
            logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `\n${retChatGpt.res}` });
        } else if (retChatGpt.res.includes('####NAO####')) {
            infNotification = {
                'e': e, 'duration': 3, 'icon': './src/scripts/media/notification_3.png', 'title': query, 'text': `🔵 GIBBERISH`
            }; retNotification = await notification(infNotification)
            let radio = { "other": "peroptyx_QueryImageDeservingClassification", "inf": [2], "res": "🔵 GIBBERISH", "query": query }
            // ws1.send(JSON.stringify(radio))
            let infApi = {
                'e': e, 'method': 'POST', 'url': `http://127.0.0.1:1234/SALA_AQUI/`,
                'headers': { 'accept-language': 'application/json' }, 'body': radio
            }; let retApi = await api(infApi);
        } else {
            listenerAcionar('messageSendOrigin_127.0.0.1:1234/ORIGEM_AQUI', { 'destination': '127.0.0.1:1234/DESTINO_AQUI', 'message': { "name": "google", "par": { "search": query } }, 'secondsAwait': 0, });

        }; ret['ret'] = true; ret['msg'] = `PEROPTYX: OK`;
    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, 'catchGlobal': false });
        ret['msg'] = retRegexE.res
    };
    return {
        ...({ ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}

if (eng) { // CHROME
    window['peroptyx_QueryImageDeservingClassification'] = peroptyx_QueryImageDeservingClassification;
} else { // NODEJS
    // global['peroptyx_QueryImageDeservingClassification'] = peroptyx_QueryImageDeservingClassification;
}