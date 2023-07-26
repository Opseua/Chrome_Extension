// await import('./chatGpt.js');
// const infChatGpt = { 'provider': 'ora.ai', 'input': `Qual a idade da Vênus?` }
// const retChatGpt = await chatGpt(infChatGpt)
// console.log(retChatGpt)
await import('./functions.js');
await import('./tabSearch.js');
await import('./getCookies.js');

async function chatGpt(inf) {
    let ret = { 'ret': false };
    try {
        let infConfigStorage, retConfigStorage
        if (inf.provider == 'ora.ai') {
            infConfigStorage = { 'path': '/src/config.json', 'action': 'get', 'key': 'chatGptOra.ai' }
            retConfigStorage = await configStorage(infConfigStorage)
            console.log(retConfigStorage)
            if (!retConfigStorage.ret) {
                console.log(1)
                return ret
            }
            if (!retConfigStorage.res['cookie']) {
                console.log(0)
                const infTabSearch = { 'search': retConfigStorage.res['Referer'], 'openIfNotExist': true, 'active': false, 'pinned': true, 'url': retConfigStorage.res['Referer'] } // 'ATIVA', 'TODAS', '*google*' ou 12345678 (ID)
                const retTabSearch = await tabSearch(infTabSearch)
                console.log(retTabSearch)
                if (!retTabSearch.ret) {
                    console.log(2)
                    return ret
                }
                const infGetCookies = { 'url': retTabSearch.res.url }
                const retGetCookies = await getCookies(infGetCookies)
                console.log(retGetCookies);
                if (!retGetCookies.ret) {
                    console.log(3)
                    return ret
                }
                retConfigStorage.res['cookie'] = retGetCookies.res.concat;
                infConfigStorage = { 'path': '/src/config.json', 'action': 'set', 'key': 'chatGptOra.ai', 'value': retConfigStorage.res }
                const retSETConfigStorage = await configStorage(infConfigStorage)
                console.log(retSETConfigStorage)
                if (!retSETConfigStorage.ret) {
                    console.log(3)
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
                ret['msg'] = `CHAT GPT AI: ERRO | ${res.error.message}`;
            }
        }
    } catch (e) {
        ret['msg'] = `CHAT GPT AI: ERRO | ${e}`
    }

    if (!ret.ret) { console.log(ret.msg) }
    return ret
}

export { chatGpt }

if (typeof window !== 'undefined') { // CHOME
    window['chatGpt'] = chatGpt;
} else if (typeof global !== 'undefined') { // NODE
    global['chatGpt'] = chatGpt;
}