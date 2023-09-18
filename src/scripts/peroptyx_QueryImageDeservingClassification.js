// peroptyx_QueryImageDeservingClassification()

async function peroptyx_QueryImageDeservingClassification(inf) {
    let ret = { 'ret': false }
    try {
        let infNotification, retNotification, retSniffer, retFile
        if (inf.snifferChrome) {
            const gOEve = async (i) => {
                if (i.inf.sniffer === 2) { gORem(gOEve); chrome.browserAction.setBadgeText({ text: '' }); ret = { 'ret': false }; return ret }
            }; gOAdd(gOEve);
        }
        if (inf.logFile) { retFile = await file({ 'action': 'read', 'path': inf.logFile }); retSniffer = JSON.parse(retFile.res) }
        else { retSniffer = JSON.parse(inf.sniffer) }
         await clipboard({ 'value': retSniffer.tasks[0].taskData.query })
        if (retSniffer.targetLocalIds.length == 1) {
            infNotification =
            {
                'duration': 4, 'icon': './src/media/notification_3.png',
                'title': `BLIND`,
                'text': `${retSniffer.tasks[0].taskData.query}`,
            }; retNotification = await notification(infNotification)
        } else {
            infNotification =
            {
                'duration': 2, 'icon': './src/media/notification_1.png',
                'title': `NÃO BLIND`,
                'text': `${retSniffer.tasks[0].taskData.query}`,
            }
            // retNotification = await notification(infNotification)
        }
        ret['ret'] = true; ret['msg'] = `PEROPTYX: OK`;
    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; if (!ret.ret) { console.log(ret.msg) }; return ret
}

if (typeof window !== 'undefined') { // CHROME
    window['peroptyx_QueryImageDeservingClassification'] = peroptyx_QueryImageDeservingClassification;
} else { // NODEJS
    // global['peroptyx_QueryImageDeservingClassification'] = peroptyx_QueryImageDeservingClassification;
}