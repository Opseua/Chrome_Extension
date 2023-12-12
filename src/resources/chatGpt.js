// let infChatGpt, retChatGpt
// infChatGpt = { 'provider': 'open.ai', 'input': `Qual a idade de Marte?` };
// retChatGpt = await chatGpt(infChatGpt);
// console.log(retChatGpt)

let e = import.meta.url;
async function chatGpt(inf) { // https://chat.openai.com/api/auth/session
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    // if (catchGlobal) {
    //     const errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; let retRegexE = await regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
    //     if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
    //     else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    // }
    try {
        let infConfigStorage, retConfigStorage, retApi, infNotification, infApi
        if (inf.provider == 'ora.ai') { // ######## ora.ai
            infConfigStorage = { 'e': e, 'action': 'get', 'key': 'chatGptOra.ai' };
            retConfigStorage = await configStorage(infConfigStorage)
            if (!retConfigStorage.ret) { return retConfigStorage } else { retConfigStorage = retConfigStorage.res };
            if (!retConfigStorage['cookie']) {
                let infTabSearch = { 'search': retConfigStorage['Referer'], 'openIfNotExist': true, 'active': false, 'pinned': true, 'url': retConfigStorage['Referer'], }
                let retTabSearch = await tabSearch(infTabSearch);
                if (!retTabSearch.ret) {
                    infNotification = { 'duration': 5, 'icon': './src/media/notification_3.png', 'title': `ERRO AO ABRIR CHATGPT`, 'text': `Não foi possível abrir a aba` }
                    await notification(infNotification);
                    return retTabSearch
                };
                let infGetCookies = { 'url': retTabSearch.res.url, 'cookieSearch': '__Secure-next-auth.session-token', };
                let retGetCookies = await getCookies(infGetCookies)
                if (!(retGetCookies.ret)) {
                    if (eng) { // CHROME
                        infConfigStorage = { 'e': e, 'action': 'del', 'key': 'chatGptOra.ai' };
                        retConfigStorage = await configStorage(infConfigStorage)
                    };
                    if (!retConfigStorage.ret) {
                        return retConfigStorage
                    } else {
                        retConfigStorage = retConfigStorage.res
                    };
                    infNotification = {
                        'duration': 5, 'icon': './src/media/notification_3.png', 'title': `ERRO AO PEGAR COOKIE CHATGPT`, 'text': `Verificar se a aba abriu e se está logado`
                    };
                    await notification(infNotification);
                    return ret
                };
                retConfigStorage['cookie'] = retGetCookies.res.concat;
                infConfigStorage = { 'e': e, 'action': 'set', 'key': 'chatGptOra.ai', 'value': retConfigStorage }
                let retSETConfigStorage = await configStorage(infConfigStorage); if (!retSETConfigStorage.ret) { return retSETConfigStorage }
            };
            infApi = {
                method: 'POST', url: 'https://ora.ai/api/conversation', headers: {
                    "accept": "*/*", "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
                    "content-type": "application/json", "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Google Chrome\";v=\"114\"",
                    "sec-ch-ua-mobile": "?0", "sec-ch-ua-platform": "\"Windows\"", "sec-fetch-dest": "empty", "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin", "Referer": retConfigStorage['Referer'], "cookie": retConfigStorage['cookie'],
                    "Referrer-Policy": "strict-origin-when-cross-origin"
                },
                body: { "chatbotId": retConfigStorage['chatbotId'], "input": inf.input, "conversationId": retConfigStorage['conversationId'], "userId": retConfigStorage['userId'], "provider": "OPEN_AI", "config": false, "includeHistory": true }
            };
            retApi = await api(infApi); if (!retApi.ret) { return retApi } else { retApi = retApi.res }
            console.log(retApi)
            let res = JSON.parse(retApi.body);
            if ('response' in res) {
                ret['res'] = res.response;
                ret['msg'] = `CHAT GPT ORA AI: OK`
                ret['ret'] = true;
            } else { // CHROME
                if (eng) {
                    infConfigStorage = { 'e': e, 'action': 'del', 'key': 'chatGptOra.ai' };
                    retConfigStorage = await configStorage(infConfigStorage)
                };
                infNotification = { 'duration': 5, 'icon': './src/media/notification_3.png', 'title': `ERRO AO PESQUISAR NO CHATGPT`, 'text': res.error.message }
                await notification(infNotification);
                ret['res'] = res.error.message;
                ret['msg'] = `\n #### ERRO #### CHAT GPT ORA AI \n ${res.error.message} \n\n`;
                ret['ret'] = true;
            }
        } else if (inf.provider == 'open.ai') { // ######## open.ai
            infConfigStorage = { 'e': e, 'action': 'get', 'key': 'chatGptOpenAi' };
            retConfigStorage = await configStorage(infConfigStorage); if (!retConfigStorage.ret) { return retConfigStorage } else { retConfigStorage = retConfigStorage.res };
            infApi = {
                'method': 'POST', 'url': `https://api.openai.com/v1/chat/completions`,
                'headers': { 'Content-Type': 'application/json', 'Authorization': `Bearer ${retConfigStorage.Authorization}` },
                'body': { 'model': 'gpt-3.5-turbo', 'messages': [{ 'role': 'user', 'content': inf.input }], 'temperature': 0.7 }
            };
            retApi = await api(infApi); if (!retApi.ret) { return retApi } else { retApi = retApi.res }
            let res = JSON.parse(retApi.body);
            if ('choices' in res) {
                ret['res'] = res.choices[0].message.content;
                ret['msg'] = `CHAT GPT OPEN AI: OK`
                ret['ret'] = true;
            } else { // CHROME
                if (eng) {
                    infConfigStorage = { 'e': e, 'action': 'del', 'key': 'chatGptOpenAi' };
                    retConfigStorage = await configStorage(infConfigStorage)
                }
                infNotification = { 'duration': 5, 'icon': './src/media/notification_3.png', 'title': `ERRO AO PESQUISAR NO CHATGPT`, 'text': res.error.message }
                await notification(infNotification);
                ret['res'] = res.error.message
                ret['msg'] = `\n #### ERRO #### CHAT GPT OPEN AI \n ${res.error.message} \n\n`;
            }
        } else if (inf.provider == 'aichatos') { // ######## aichatos
            infApi = {
                'method': 'POST', 'url': `https://api.aichatos.cloud/api/generateStream`, 'headers': {
                    'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
                    'accept': 'application/json, text/plain, */*', 'content-type': 'application/json', 'dnt': '1', 'sec-ch-ua-mobile': '?0',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
                    'sec-ch-ua-platform': '"Windows"', 'origin': 'https://chat9.yqcloud.top', 'sec-fetch-site': 'cross-site',
                    'sec-fetch-mode': 'cors', 'sec-fetch-dest': 'empty', 'referer': 'https://chat9.yqcloud.top/',
                    'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7,it;q=0.6'
                }, 'body': { "prompt": inf.input, "userId": `#/chat/${dateHour().res.timMil}`, "network": false, "system": "", "withoutContext": false, "stream": false }
            };
            retApi = await api(infApi); if (!retApi.ret || retApi.res.code !== 200) { return retApi } else { retApi = retApi.res }
            if (retApi.code == 200) {
                ret['res'] = retApi.body;
                ret['msg'] = `CHAT GPT AI CHATOS: OK`
                ret['ret'] = true;
            } else {
                infNotification = { 'duration': 5, 'icon': './src/media/notification_3.png', 'title': `ERRO AO PESQUISAR NO CHATGPT`, 'text': '' }
                await notification(infNotification);
                ret['msg'] = `\n #### ERRO #### CHAT GPT AI CHATOS \n \n\n`
            }
        } else if (inf.provider == 'ec2') { // ######## ec2
            infConfigStorage = { 'e': e, 'action': 'get', 'key': 'webSocket' };
            retConfigStorage = await configStorage(infConfigStorage); if (!retConfigStorage.ret) { return retConfigStorage } else { retConfigStorage = retConfigStorage.res };
            infApi = {
                'method': 'POST', 'url': `http://${retConfigStorage.ws1}:${retConfigStorage.portWebSocket}/chatgpt`,
                'headers': {}, 'body': { "prompt": inf.input, "network": inf.network ? true : false }
            };
            retApi = await api(infApi); if (!retApi.ret) { return retApi } else { retApi = retApi.res }
            if (JSON.parse(retApi.body).ret) {
                ret['res'] = JSON.parse(retApi.body).res;
                ret['msg'] = `CHAT GPT EC2: OK`
                ret['ret'] = true;
            } else {
                infNotification = { 'duration': 5, 'icon': './src/media/notification_3.png', 'title': `ERRO AO PESQUISAR NO CHATGPT`, 'text': '' }
                await notification(infNotification);
                ret['msg'] = `\n #### ERRO #### CHAT GPT EC2 \n \n\n`;
                ret['res'] = 'res.error.message'
            }
        } else if (inf.provider == 'globalgpt') { // ######## globalgpt
            infApi = {
                'method': 'POST', 'url': `https://swiftmodel.azurewebsites.net/api/ChatTrigger`, 'headers': {
                    'content-type': 'text/plain',
                },
                'body': { "name": [{ "role": "user", "content": inf.input }] }
            };
            retApi = await api(infApi); if (!retApi.ret || retApi.res.code !== 200) { return retApi } else { retApi = retApi.res }
            ret['msg'] = `CHAT GPT AI [GLOBALGPT]: OK`
            ret['res'] = JSON.parse(retApi.body).message.content;
            ret['ret'] = true;
        }

        // ### LOG FUN ###
        if (inf && inf.logFun) {
            let infFile = { 'e': e, 'action': 'write', 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }, retFile
            infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; retFile = await file(infFile);
        }
    } catch (e) {
        let retRegexE = await regexE({ 'inf': inf, 'e': e, 'catchGlobal': false });
        ret['msg'] = retRegexE.res
    };
    return {
        ...({ ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}

if (eng) { // CHROME
    window['chatGpt'] = chatGpt;
} else { // NODEJS
    global['chatGpt'] = chatGpt;
}