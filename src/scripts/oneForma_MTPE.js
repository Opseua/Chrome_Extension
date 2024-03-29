let e = import.meta.url, ee = e
async function oneForma_MTPE(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    try {
        let infRegex1, infRegex2, retRegex1, retRegex2, infNotification, retNotification
        let gOEve = async (i) => {
            if (i.inf.sniffer === 2) {
                gORem(gOEve);
                chrome.browserAction.setBadgeText({ text: '' });
                ret = { 'ret': false };
                return ret
            }
        };
        gOAdd(gOEve);

        infRegex1 = { 'e': e, 'simple': true, 'pattern': '<p class="source_text"(.*?)/p>', 'text': inf.sniffer }
        retRegex1 = regex(infRegex1)
        infRegex2 = { 'e': e, 'simple': true, 'pattern': 'mt_textbox" dir class="form-control"(.*?)/textarea>', 'text': inf.sniffer }
        retRegex2 = regex(infRegex2)

        if (retRegex1.ret && retRegex1.res['1'].split('<').length - 1 == 1 && retRegex1.res['1'].split('>').length - 1 == 1 && retRegex2.ret && retRegex2.res['1'].split('<').length - 1 == 1 && retRegex2.res['1'].split('>').length - 1 == 1) {

            infRegex1 = { 'e': e, 'simple': true, 'pattern': '>(.*?)<', 'text': retRegex1.res['1'] }
            retRegex1 = regex(infRegex1)
            infRegex2 = { 'e': e, 'simple': true, 'pattern': '>(.*?)<', 'text': retRegex2.res['1'] }
            retRegex2 = regex(infRegex2)

            if (!gO.inf.sniffer == 1) {
                return ret
            }
            let infChat = { 'e': e, 'provider': 'open.ai', 'input': `REWRITE THE SENTENCE IN ENGLISH, WHICH WAS IN PORTUGUESE AND WAS TRANSLATED, KEEPING THE SAME MEANING AND LEAVING THE MOST LIKE THE ORIGINAL\n\nPORTUGUESE:\n${retRegex1.res['1']}\n\nENGLISH:\n${retRegex2.res['1']}` }
            let retChat = await chat(infChat)
            if (!retChat.res || !gO.inf.sniffer == 1) {
                return ret
            }

            let clipboardText
            if (!retRegex2.res['1'].endsWith('.') && retChat.res.endsWith('.')) {
                clipboardText = retChat.res.slice(0, -1);
            } else if (retRegex2.res['1'].endsWith('.') && !retChat.res.endsWith('.')) {
                clipboardText = `${retChat.res}.`
            } else {
                clipboardText = retChat.res
            }
            if (retRegex2.res['1'].toLowerCase() == clipboardText.toLowerCase()) {
                let infTranslate = { 'e': e, 'source': 'pt', 'target': 'en', 'text': clipboardText };
                let retTranslate = await translate(infTranslate)
                if (!retRegex2.res['1'].endsWith('.') && retTranslate.res.endsWith('.')) {
                    clipboardText = retTranslate.res.slice(0, -1);
                } else if (retRegex2.res['1'].endsWith('.') && !retTranslate.res.endsWith('.')) {
                    clipboardText = `${retTranslate.res}.`
                } else {
                    clipboardText = retTranslate.res
                }
            }

            await clipboard({ 'e': e, 'value': clipboardText })

            if (retRegex2.res['1'].toLowerCase() == clipboardText.toLowerCase()) {
                infNotification = {
                    'e': e, 'duration': 2, 'icon': '/src/scripts/media/notification_2.png',
                    'title': `PULAR`,
                    'text': 'Mesmo texto',
                };
                retNotification = await notification(infNotification)
            }
            else {
                infNotification = {
                    'e': e, 'duration': 2, 'icon': './src/scripts/media/notification_1.png',
                    'title': `CONCLUÍDO`,
                    'text': `pt → ${retRegex1.res['1']}`,
                };
                retNotification = await notification(infNotification)

                let firstA = retRegex1.res['1'].charAt(0)
                let firstB = retChat.res.charAt(0)
                if ((firstA === firstA.toUpperCase()) && !(firstB === firstB.toUpperCase())) {
                    infNotification = {
                        'e': e, 'duration': 4, 'icon': './src/scripts/media/notification_3.png',
                        'title': `ALERTA`,
                        'text': `Conferir primeira letra!`,
                    };
                    retNotification = await notification(infNotification)
                } else if (!(firstA === firstA.toUpperCase()) && (firstB === firstB.toUpperCase())) {
                    infNotification = {
                        'e': e, 'duration': 4, 'icon': './src/scripts/media/notification_3.png',
                        'title': `ALERTA`,
                        'text': `Conferir primeira letra!`,
                    }
                    retNotification = await notification(infNotification)
                }
            }

        } else {
            infNotification = {
                'e': e, 'duration': 4, 'icon': './src/scripts/media/notification_3.png',
                'title': `PULAR`,
                'text': `Erro ao alterar texto`,
            }
            retNotification = await notification(infNotification)
        }
        ret['ret'] = true;
        ret['msg'] = `ONEFORMA: OK`;
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
    window['oneForma_MTPE'] = oneForma_MTPE;
} else { // NODEJS
    // global['oneForma_MTPE'] = oneForma_MTPE;
}
