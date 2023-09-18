// const infChatGpt = { 'provider': 'ora.ai', 'input': `Qual a idade de Saturno?` }
// const retChatGpt = await chatGpt(infChatGpt)
// console.log(retChatGpt)

async function chatGpt(inf) {
    let ret = { 'ret': false }
    try {
        let infConfigStorage, retConfigStorage
        if (inf.provider == 'ora.ai') {
            infConfigStorage = { 'action': 'get', 'key': 'chatGptOra.ai' }
            retConfigStorage = await configStorage(infConfigStorage)
            if (!retConfigStorage.ret) { return ret } else { retConfigStorage = retConfigStorage.res }
            if (!retConfigStorage['cookie']) {
                const infTabSearch = { 'search': retConfigStorage['Referer'], 'openIfNotExist': true, 'active': false, 'pinned': true, 'url': retConfigStorage['Referer'] } // 'ATIVA', 'TODAS', '*google*' ou 12345678 (ID)
                const retTabSearch = await tabSearch(infTabSearch)
                if (!retTabSearch.ret) {
                    let infNotification =
                    {
                        'duration': 5, 'icon': './src/media/notification_3.png',
                        'title': `ERRO AO ABRIR CHATGPT`,
                        'text': `Não foi possível abrir a aba`,
                    };
                    const retNotification = await notification(infNotification); return ret
                }
                const infGetCookies = { 'url': retTabSearch.res.url, 'cookieSearch': '__Secure-next-auth.session-token' }
                const retGetCookies = await getCookies(infGetCookies)
                if (!(retGetCookies.ret)) {
                    infConfigStorage = { 'action': 'del', 'key': 'chatGptOra.ai' }; retConfigStorage = await configStorage(infConfigStorage)
                    if (!retConfigStorage.ret) { return ret } else { retConfigStorage = retConfigStorage.res }
                    let infNotification =
                    {
                        'duration': 5, 'icon': './src/media/notification_3.png',
                        'title': `ERRO AO PEGAR COOKIE CHATGPT`,
                        'text': `Verificar se a aba abriu e se está logado`,
                    };
                    const retNotification = await notification(infNotification); return ret
                }
                retConfigStorage['cookie'] = retGetCookies.res.concat;
                infConfigStorage = { 'action': 'set', 'key': 'chatGptOra.ai', 'value': retConfigStorage }
                const retSETConfigStorage = await configStorage(infConfigStorage)
                if (!retSETConfigStorage.ret) { return ret }
            }

            const infApi = {
                method: 'POST', url: 'https://ora.ai/api/conversation',
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
                    "Referer": retConfigStorage['Referer'],
                    "cookie": retConfigStorage['cookie'],
                    "Referrer-Policy": "strict-origin-when-cross-origin"
                },
                body: { "chatbotId": retConfigStorage['chatbotId'], "input": inf.input, "conversationId": retConfigStorage['conversationId'], "userId": retConfigStorage['userId'], "provider": "OPEN_AI", "config": false, "includeHistory": true }
            }; const retApi = await api(infApi); if (!retApi.ret) { return ret }

            const res = JSON.parse(retApi.res.body);
            if ('response' in res) {
                ret['res'] = res.response;
                ret['ret'] = true;
                ret['msg'] = `CHAT GPT ORA AI: OK`;
            } else {
                infConfigStorage = { 'action': 'del', 'key': 'chatGptOra.ai' }
                retConfigStorage = await configStorage(infConfigStorage)
                let infNotification =
                {
                    'duration': 5, 'icon': './src/media/notification_3.png',
                    'title': `ERRO AO PESQUISAR NO CHATGPT`,
                    'text': res.error.message,
                };
                const retNotification = await notification(infNotification)
                ret['msg'] = `\n #### ERRO #### CHAT GPT ORA AI \n ${res.error.message} \n\n`;
                ret['res'] = res.error.message;
                ret['ret'] = true;
            }
        }
        else if (inf.provider == 'open.ai') {
            infConfigStorage = { 'action': 'get', 'key': 'chatGptOpenAi' }; retConfigStorage = await configStorage(infConfigStorage)
            if (!retConfigStorage.ret) { return ret } else { retConfigStorage = retConfigStorage.res }

            const infApi = {
                'method': 'POST', 'url': `https://api.openai.com/v1/chat/completions`,
                'headers': { 'Content-Type': 'application/json', 'Authorization': `Bearer ${retConfigStorage.Authorization}` },
                'body': { "model": "gpt-3.5-turbo", "messages": [{ "role": "user", "content": inf.input }] }
            }; const retApi = await api(infApi); if (!retApi.ret) { return ret }

            const res = JSON.parse(retApi.res.body);
            if ('choices' in res) {
                ret['res'] = res.choices[0].message.content;
                ret['ret'] = true;
                ret['msg'] = `CHAT GPT OPEN AI: OK`;
            } else {
                infConfigStorage = { 'action': 'del', 'key': 'chatGptOpenAi' }
                retConfigStorage = await configStorage(infConfigStorage)
                let infNotification =
                {
                    'duration': 5, 'icon': './src/media/notification_3.png',
                    'title': `ERRO AO PESQUISAR NO CHATGPT`,
                    'text': res.error.message,
                };
                const retNotification = await notification(infNotification)
                ret['msg'] = `\n #### ERRO #### CHAT GPT OPEN AI \n ${res.error.message} \n\n`;
                ret['res'] = res.error.message;
            }
        }
    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; if (!ret.ret) { console.log(ret.msg) }; return ret
}

if (typeof window !== 'undefined') { // CHROME
    window['chatGpt'] = chatGpt;
} else { // NODEJS
    // global['chatGpt'] = chatGpt;
}