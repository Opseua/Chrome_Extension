// await import('./chatGpt.js');
// const infChatGpt = { 'provider': 'ora.ai', 'input': `Qual a idade de Saturno?` }
// const retChatGpt = await chatGpt(infChatGpt)
// console.log(retChatGpt)

await import('./functions.js');
await import('./tabSearch.js');
await import('./getCookies.js');
await import('./notification.js');

async function chatGpt(inf) {
    let ret = { 'ret': false };
    try {

        let infConfigStorage, retConfigStorage

        if (inf.provider == 'ora.ai') {
            infConfigStorage = { 'path': '/src/config.json', 'action': 'get', 'key': 'chatGptOra.ai' }
            retConfigStorage = await configStorage(infConfigStorage)
            if (!retConfigStorage.ret) {
                return ret
            }
            if (!retConfigStorage.res['cookie']) {
                const infTabSearch = { 'search': retConfigStorage.res['Referer'], 'openIfNotExist': true, 'active': false, 'pinned': true, 'url': retConfigStorage.res['Referer'] } // 'ATIVA', 'TODAS', '*google*' ou 12345678 (ID)
                const retTabSearch = await tabSearch(infTabSearch)
                if (!retTabSearch.ret) {
                    let infNotification =
                    {
                        'duration': 5,
                        'type': 'basic',
                        'title': `ERRO AO ABRIR CHATGPT`,
                        'message': `Não foi possível abrir a aba`,
                        'iconUrl': undefined,
                        'buttons': [],
                    };
                    const retNotification = await notification(infNotification)
                    return ret
                }
                const infGetCookies = { 'url': retTabSearch.res.url, 'cookieSearch': '__Secure-next-auth.session-token' }
                const retGetCookies = await getCookies(infGetCookies)
                if (!(retGetCookies.ret)) {
                    infConfigStorage = { 'path': '/src/config.json', 'action': 'del', 'key': 'chatGptOra.ai' }
                    retConfigStorage = await configStorage(infConfigStorage)
                    let infNotification =
                    {
                        'duration': 5,
                        'type': 'basic',
                        'title': `ERRO AO PEGAR COOKIE`,
                        'message': `Verificar se a aba abriu e se está logado`,
                        'iconUrl': undefined,
                        'buttons': [],
                    };
                    const retNotification = await notification(infNotification)
                    return ret
                }
                retConfigStorage.res['cookie'] = retGetCookies.res.concat;
                infConfigStorage = { 'path': '/src/config.json', 'action': 'set', 'key': 'chatGptOra.ai', 'value': retConfigStorage.res }
                const retSETConfigStorage = await configStorage(infConfigStorage)
                if (!retSETConfigStorage.ret) {
                    return ret
                }
            }

            const infApi = {
                url: 'https://ora.ai/api/conversation',
                method: 'POST',
                headers: {
                    "accept": "*/*",
                    "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
                    "content-type": "application/json",
                    "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Google Chrome\";v=\"114\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "Referer": retConfigStorage.res['Referer'],
                    "cookie": retConfigStorage.res['cookie'],
                    "Referrer-Policy": "strict-origin-when-cross-origin"
                },
                body: { "chatbotId": retConfigStorage.res['chatbotId'], "input": inf.input, "conversationId": retConfigStorage.res['conversationId'], "userId": retConfigStorage.res['userId'], "provider": "OPEN_AI", "config": false, "includeHistory": true }
            }
            const retApi = await api(infApi);
            if (!retApi.ret) { return ret }

            const res = JSON.parse(retApi.res.body);
            if ('response' in res) {
                ret['ret'] = true;
                ret['msg'] = `CHAT GPT AI: OK`;
                ret['res'] = res.response;
            } else {
                //ret['msg'] = `CHAT GPT AI: ERRO | ${res.error.message}`;
                infConfigStorage = { 'path': '/src/config.json', 'action': 'del', 'key': 'chatGptOra.ai' }
                retConfigStorage = await configStorage(infConfigStorage)
                let infNotification =
                {
                    'duration': 5,
                    'type': 'basic',
                    'title': `ERRO AO PESQUISAR NO CHATGPT`,
                    'message': res.error.message,
                    'iconUrl': undefined,
                    'buttons': [],
                };
                const retNotification = await notification(infNotification)
                ret['msg'] = `\n #### ERRO ####  CHAT GPT AI \n ${res.error.message} \n\n`;
                ret['res'] = res.error.message;
                ret['ret'] = true;
            }
        }

    } catch (e) {
        ret['msg'] = regexE({ 'e': e }).res
    }

    if (!ret.ret) { console.log(ret.msg) }
    return ret
}

// export { chatGpt }

if (typeof window !== 'undefined') { // CHROME
    window['chatGpt'] = chatGpt;
} else if (typeof global !== 'undefined') { // NODE
    global['chatGpt'] = chatGpt;
}