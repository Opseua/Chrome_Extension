async function oneFormaMTPE(inf) {
    let ret = { 'ret': false };
    try {
        let infRegex1, infRegex2, retRegex1, retRegex2, infNotification, retNotification
        const gOEve = async (i) => {
            if (i.inf.sniffer === 2) { gORem(gOEve); chrome.browserAction.setBadgeText({ text: '' }); ret = { 'ret': false }; return ret }
        }; gOAdd(gOEve);

        infRegex1 = { 'simple': true, 'pattern': '<p class="source_text"(.*?)/p>', 'text': inf.sniffer }
        retRegex1 = regex(infRegex1)
        infRegex2 = { 'simple': true, 'pattern': 'mt_textbox" dir class="form-control"(.*?)/textarea>', 'text': inf.sniffer }
        retRegex2 = regex(infRegex2)

        if (retRegex1.ret && retRegex1.res['1'].split('<').length - 1 == 1 && retRegex1.res['1'].split('>').length - 1 == 1 && retRegex2.ret && retRegex2.res['1'].split('<').length - 1 == 1 && retRegex2.res['1'].split('>').length - 1 == 1) {

            infRegex1 = { 'simple': true, 'pattern': '>(.*?)<', 'text': retRegex1.res['1'] }
            retRegex1 = regex(infRegex1)
            infRegex2 = { 'simple': true, 'pattern': '>(.*?)<', 'text': retRegex2.res['1'] }
            retRegex2 = regex(infRegex2)

            if (!gO.inf.sniffer == 1) { return ret }
            const infChatGpt = { 'provider': 'ora.ai', 'input': `REWRITE THE SENTENCE IN ENGLISH, WHICH WAS IN PORTUGUESE AND WAS TRANSLATED, KEEPING THE SAME MEANING AND LEAVING THE MOST LIKE THE ORIGINAL\n\nPORTUGUESE:\n${retRegex1.res['1']}\n\nENGLISH:\n${retRegex2.res['1']}` }
            const retChatGpt = await chatGpt(infChatGpt)
            if (!retChatGpt.res || !gO.inf.sniffer == 1) { return ret }

            let clipboardText
            if (!retRegex2.res['1'].endsWith('.') && retChatGpt.res.endsWith('.')) {
                clipboardText = retChatGpt.res.slice(0, -1);
            } else if (retRegex2.res['1'].endsWith('.') && !retChatGpt.res.endsWith('.')) {
                clipboardText = `${retChatGpt.res}.`
            } else {
                clipboardText = retChatGpt.res
            }
            if (retRegex2.res['1'].toLowerCase() == clipboardText.toLowerCase()) {
                let msg = `${retRegex2.res['1']}\n${clipboardText}`
                const infTranslate = { 'source': 'pt', 'target': 'en', 'text': clipboardText };
                const retTranslate = await translate(infTranslate)
                if (!retRegex2.res['1'].endsWith('.') && retTranslate.res.endsWith('.')) {
                    clipboardText = retTranslate.res.slice(0, -1);
                } else if (retRegex2.res['1'].endsWith('.') && !retTranslate.res.endsWith('.')) {
                    clipboardText = `${retTranslate.res}.`
                } else {
                    clipboardText = retTranslate.res
                }
                msg = `${msg}\n${clipboardText}`
            }

            const infClipboard = { 'value': clipboardText };
            const retClipboard = await clipboard(infClipboard)

            if (retRegex2.res['1'].toLowerCase() == clipboardText.toLowerCase()) {
                infNotification =
                {
                    'duration': 2,
                    'type': 'basic',
                    'title': `PULAR`,
                    'message': `Mesmo texto`,
                    'iconUrl': "./src/media/notification_2.png",
                    'buttons': [],
                };
                retNotification = await notification(infNotification)
            }
            else {
                infNotification =
                {
                    'duration': 2,
                    'type': 'basic',
                    'title': `CONCLUÍDO`,
                    'message': `pt → ${retRegex1.res['1']}`,
                    'iconUrl': "./src/media/notification_1.png",
                    'buttons': [],
                };
                retNotification = await notification(infNotification)

                let firstA = retRegex1.res['1'].charAt(0)
                let firstB = retChatGpt.res.charAt(0)
                if ((firstA === firstA.toUpperCase()) && !(firstB === firstB.toUpperCase())) {
                    infNotification =
                    {
                        'duration': 4,
                        'type': 'basic',
                        'title': `ALERTA`,
                        'message': `Conferir primeira letra!`,
                        'iconUrl': "./src/media/notification_3.png",
                        'buttons': [],
                    };
                    retNotification = await notification(infNotification)
                } else if (!(firstA === firstA.toUpperCase()) && (firstB === firstB.toUpperCase())) {
                    infNotification =
                    {
                        'duration': 4,
                        'type': 'basic',
                        'title': `ALERTA`,
                        'message': `Conferir primeira letra!`,
                        'iconUrl': "./src/media/notification_3.png",
                        'buttons': [],
                    };
                    retNotification = await notification(infNotification)
                }
            }

        } else {
            infNotification =
            {
                'duration': 2,
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
