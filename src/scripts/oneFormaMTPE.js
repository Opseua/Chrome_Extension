async function oneFormaMTPE(inf) {
    let ret = { 'ret': false };
    try {
        let infRegex1, infRegex2, retRegex1, retRegex2, infSniffer, retSniffer, infNotification, retNotification, infChatGpt, retChatGpt, infClipboard, retClipboard
        const gOEve = async (i) => {
            if (i.inf.sniffer === 2) { gORem(gOEve); chrome.browserAction.setBadgeText({ text: '' }); ret = { 'ret': false }; return ret }
        }; gOAdd(gOEve);
        async function run() {
            ret = { 'ret': false }
            infSniffer = { 'newReqSend': true, 'arrUrl': ['https://desk.oneforma.com/scribo_apps/MTPE_new_process/postediting.php*'] }
            retSniffer = await sniffer(infSniffer)
            if (!retSniffer.res || !gO.inf.sniffer == 1) { return ret }

            infRegex1 = { 'simple': true, 'pattern': '<p class="source_text"(.*?)/p>', 'text': retSniffer.res.res.body }
            retRegex1 = regex(infRegex1)
            infRegex2 = { 'simple': true, 'pattern': 'mt_textbox" dir class="form-control"(.*?)/textarea>', 'text': retSniffer.res.res.body }
            retRegex2 = regex(infRegex2)

            if (retRegex1.ret && retRegex1.res.text.split('<').length - 1 == 1 && retRegex1.res.text.split('>').length - 1 == 1 && retRegex2.ret && retRegex2.res.text.split('<').length - 1 == 1 && retRegex2.res.text.split('>').length - 1 == 1) {

                infRegex1 = { 'simple': true, 'pattern': '>(.*?)<', 'text': retRegex1.res.text }
                retRegex1 = regex(infRegex1)
                infRegex2 = { 'simple': true, 'pattern': '>(.*?)<', 'text': retRegex2.res.text }
                retRegex2 = regex(infRegex2)

                infNotification =
                {
                    'duration': 1,
                    'type': 'basic',
                    'title': `AGUARDE...`,
                    'message': `Mudando o texto`,
                    'iconUrl': "./src/media/icon_4.png",
                    'buttons': [],
                };
                retNotification = await notification(infNotification)

                if (!gO.inf.sniffer == 1) { return ret }
                infChatGpt = { 'provider': 'ora.ai', 'input': `REWRITE THIS IN THE MOST NATURAL WAY POSSIBLE KEEPING THE SAME MEANING, AND IF POSSIBLE KEEPING THE SAME AMOUNT OF WORDS\n\n${retRegex2.res.text}` }
                retChatGpt = await chatGpt(infChatGpt)
                if (!retChatGpt.res || !gO.inf.sniffer == 1) { return ret }

                infClipboard = { 'value': retChatGpt.res };
                retClipboard = await clipboard(infClipboard)

                if (retRegex2.res.text == retChatGpt.res) {
                    infNotification =
                    {
                        'duration': 1,
                        'type': 'basic',
                        'title': `PULAR`,
                        'message': `Mesmo texto`,
                        'iconUrl': "./src/media/notification_2.png",
                        'buttons': [],
                    };
                    retNotification = await notification(infNotification)
                } else {
                    infNotification =
                    {
                        'duration': 2,
                        'type': 'basic',
                        'title': `CONCLUÍDO`,
                        'message': `pt → ${retRegex1.res.text}\nen → ${retRegex2.res.text}\n🟢 ${retChatGpt.res}`,
                        'iconUrl': "./src/media/notification_1.png",
                        'buttons': [],
                    };
                    retNotification = await notification(infNotification)
                }
            } else {
                infNotification =
                {
                    'duration': 1,
                    'type': 'basic',
                    'title': `PULAR`,
                    'message': `Erro ao alterar texto`,
                    'iconUrl': "./src/media/notification_3.png",
                    'buttons': [],
                };
                retNotification = await notification(infNotification)
            }
            ret['ret'] = true;
            ret['msg'] = `ONEFORMA MTPE: OK`;
            if (gO.inf.sniffer == 1) { await run() }
        }
        await run()

    } catch (e) {
        ret['msg'] = regexE({ 'e': e }).res
    }
    if (!ret.ret) { console.log(ret.msg) }
    return ret
}

if (typeof window !== 'undefined') { // CHROME
    window['oneFormaMTPE'] = oneFormaMTPE;
} else { // NODEJS
    global['oneFormaMTPE'] = oneFormaMTPE;
}
