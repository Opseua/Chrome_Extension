// peroptyxQIDC()

async function peroptyxQIDC(inf) {
    let ret = { 'ret': false };
    try {
        let infNotification, retNotification
        const gOEve = async (i) => {
            if (i.inf.sniffer === 2) { gORem(gOEve); chrome.browserAction.setBadgeText({ text: '' }); ret = { 'ret': false }; return ret }
        }; gOAdd(gOEve);

        const retSniffer = JSON.parse(inf.sniffer)
        if (retSniffer.targetLocalIds.length == 1) {
            infNotification =
            {
                'duration': 4,
                'type': 'basic',
                'title': `ALERTA`,
                'message': `Blind!\n\n${retSniffer.tasks[0].taskData.query}`,
                'iconUrl': "./src/media/notification_3.png",
                'buttons': [],
            };
            retNotification = await notification(infNotification)
        } else {
            infNotification =
            {
                'duration': 2,
                'type': 'basic',
                'title': `CONCLUÍDO`,
                'message': `Não blind\n\n${retSniffer.tasks[0].taskData.query}`,
                'iconUrl': "./src/media/notification_1.png",
                'buttons': [],
            };
            retNotification = await notification(infNotification)
        }
        ret['ret'] = true;
        ret['msg'] = `PEROPTYX: OK`;
    } catch (e) {
        ret['msg'] = regexE({ 'e': e }).res
    }
    if (!ret.ret) { console.log(ret.msg) }
    return ret
}

if (typeof window !== 'undefined') { // CHROME
    window['peroptyxQIDC'] = peroptyxQIDC;
} else { // NODEJS
    global['peroptyxQIDC'] = peroptyxQIDC;
}