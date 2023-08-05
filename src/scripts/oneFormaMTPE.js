
await import('../resources/sniffer.js');
await import('../resources/clipboard.js');
await import('../resources/notification.js');
await import('../resources/chatGpt.js');

async function oneFormaMTPE(inf) {
    let ret = { 'ret': false };
    try {
        let infRegex1, infRegex2, retRegex1, retRegex2, infSniffer, retSniffer, infNotification, retNotification, infChatGpt, retChatGpt, infClipboard, retClipboard

        infSniffer = { 'arrUrl': ['https://desk.oneforma.com/scribo_apps/MTPE_new_process/postediting.php*',] }
        retSniffer = await sniffer(infSniffer)

        infRegex1 = { 'simple': true, 'pattern': '<p class="source_text"(.*?)/p>', 'text': retSniffer.res }
        retRegex1 = regex(infRegex1)
        infRegex2 = { 'simple': true, 'pattern': 'mt_textbox" dir class="form-control"(.*?)/textarea>', 'text': retSniffer.res }
        retRegex2 = regex(infRegex2)

        if (retRegex1.ret && retRegex1.res.text.split('<').length - 1 == 1 && retRegex1.res.text.split('>').length - 1 == 1 && retRegex2.ret && retRegex2.res.text.split('<').length - 1 == 1 && retRegex2.res.text.split('>').length - 1 == 1) {

            infRegex1 = { 'simple': true, 'pattern': '>(.*?)<', 'text': retRegex1.res.text }
            retRegex1 = regex(infRegex1)
            infRegex2 = { 'simple': true, 'pattern': '>(.*?)<', 'text': retRegex2.res.text }
            retRegex2 = regex(infRegex2)

            infNotification =
            {
                'duration': 2,
                'type': 'basic',
                'title': `AGUARDE...`,
                'message': `Mudando o texto`,
                'iconUrl': null,
                'buttons': [],
            };
            retNotification = await notification(infNotification)

            infChatGpt = { 'provider': 'ora.ai', 'input': `REWRITE THIS SENTENCE IN ANOTHER WAY, KEEPING IT AS SIMILAR AS POSSIBLE AND WITH THE SAME NUMBER OF WORDS POSSIBLE, AND KEEPING CAPITAL LETTERS ACCORDING TO THE ORIGINAL TEXT\n\n${retRegex2.res.text}` }
            retChatGpt = await chatGpt(infChatGpt)

            infClipboard = { 'value': retChatGpt.res };
            retClipboard = await clipboard(infClipboard)

            if (retRegex2.res.text == retChatGpt.res) {
                infNotification =
                {
                    'duration': 2,
                    'type': 'basic',
                    'title': `🟡 PULAR 🟡`,
                    'message': `Mesmo texto`,
                    'iconUrl': null,
                    'buttons': [],
                };
                retNotification = await notification(infNotification)
            } else {
                infNotification =
                {
                    'duration': 8,
                    'type': 'basic',
                    'title': `🟢 CONCLUÍDO 🟢`,
                    'message': `pt → ${retRegex1.res.text}\nen → ${retRegex2.res.text}\n🔵 ${retChatGpt.res}`,
                    'iconUrl': null,
                    'buttons': [],
                };
                retNotification = await notification(infNotification)
            }
        } else {
            infNotification =
            {
                'duration': 1,
                'type': 'basic',
                'title': `🔴 PULAR 🔴`,
                'message': `Erro ao alterar texto`,
                'iconUrl': null,
                'buttons': [],
            };
            retNotification = await notification(infNotification)
        }

        ret['ret'] = true;
        ret['msg'] = `ONEFORMA MTPE: OK`;
        oneFormaMTPE()

    } catch (e) {
        ret['msg'] = regexE({ 'e': e }).res
    }

    if (!ret.ret) { console.log(ret.msg) }
    return ret
}

if (typeof window !== 'undefined') { // CHROME
    window['oneFormaMTPE'] = oneFormaMTPE;
}

