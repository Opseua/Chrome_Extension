// let infChat, retChat
// infChat = { 'e': e, 'provider': 'open.ai', 'input': `Qual a idade de Marte?` };
// retChat = await chat(infChat); console.log(retChat)

let e = import.meta.url, ee = e;
async function chat(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    try {
        let infConfigStorage, retConfigStorage, retApi, infNotification, infApi
        if (inf.provider == 'open.ai') {
            // ######## OPEN.AI
            infConfigStorage = { 'e': e, 'action': 'get', 'key': 'chatOpenAi' };
            retConfigStorage = await configStorage(infConfigStorage); if (!retConfigStorage.ret) { return retConfigStorage } else { retConfigStorage = retConfigStorage.res };
            infApi = {
                'e': e, 'method': 'POST', 'url': `https://api.openai.com/v1/chat/completions`,
                'headers': { 'Content-Type': 'application/json', 'Authorization': `Bearer ${retConfigStorage.Authorization}` },
                'body': { 'model': 'gpt-3.5-turbo', 'messages': [{ 'role': 'user', 'content': inf.input }], 'temperature': 0.7 }
            };
            retApi = await api(infApi); if (!retApi.ret) { return retApi } else { retApi = retApi.res }
            let res = JSON.parse(retApi.body);
            if ('choices' in res) {
                ret['res'] = res.choices[0].message.content;
                ret['msg'] = `CHAT [OPEN AI]: OK`
                ret['ret'] = true;
            } else { // CHROME
                if (eng) {
                    infConfigStorage = { 'e': e, 'action': 'del', 'key': 'chatOpenAi' };
                    retConfigStorage = await configStorage(infConfigStorage)
                }
                infNotification = { 'e': e, 'duration': 4, 'icon': './src/scripts/media/notification_3.png', 'title': `ERRO AO PESQUISAR NO CHATGPT`, 'text': res.error.message }
                notification(infNotification);
                ret['res'] = res.error.message
                ret['msg'] = `CHAT [OPEN AI]: ERRO | ${res.error.message}`;
            }
        } else if (inf.provider == 'ec2') {
            // ######## AWS
            infConfigStorage = { 'e': e, 'action': 'get', 'key': 'webSocket' };
            retConfigStorage = await configStorage(infConfigStorage); if (!retConfigStorage.ret) { return retConfigStorage } else { retConfigStorage = retConfigStorage.res };
            infApi = {
                'e': e, 'method': 'POST', 'url': `http://${retConfigStorage.ws1}:${retConfigStorage.portWebSocket}/chatgpt`,
                'headers': {}, 'body': { "prompt": inf.input, "network": inf.network ? true : false }
            };
            retApi = await api(infApi); if (!retApi.ret) { return retApi } else { retApi = retApi.res }
            if (JSON.parse(retApi.body).ret) {
                ret['res'] = JSON.parse(retApi.body).res;
                ret['msg'] = `CHAT [EC2]: OK`
                ret['ret'] = true;
            } else {
                infNotification = { 'e': e, 'duration': 4, 'icon': './src/scripts/media/notification_3.png', 'title': `ERRO AO PESQUISAR NO CHATGPT`, 'text': '' }
                notification(infNotification);
                ret['msg'] = `CHAT [EC2]: ERRO`;
                ret['res'] = 'res.error.message'
            }
        } else if (inf.provider == 'gitHub_Python') {
            // ######## GITHUB
            try {
                let messages = [{ 'role': 'user', 'content': inf.input }]; let options = {
                    'provider': "Aryahcr", // [gpt-4] Aryahcr, Nextway, ChatBotRu 
                    'model': "gpt-4",
                    //'temperature': 0.7286209388976096, // PRÓXIMO DO [1 → ALEATÓRIO] | [0 → PRECISO]
                    'x': 'x'
                }; let response = await GPT4js.createProvider(options.provider).chatCompletion(messages, options, (data) => { return data });
                if (!response) {
                    ret['msg'] = `CHAT [GITHUB]: ERRO | AO GERAR RESPOSTA`
                } else {
                    ret['res'] = response;
                    ret['msg'] = `CHAT [GITHUB]: OK`
                    ret['ret'] = true;
                }
            } catch (catchErr) {
                ret['msg'] = `CHAT [GITHUB]: ERRO | AO GERAR RESPOSTA`
                esLintIgnore = catchErr;
            }
        } else {
            retConfigStorage = await configStorage({ 'e': e, 'action': 'get', 'key': 'chatPython' }); if (!retConfigStorage.ret) { return retConfigStorage } else { retConfigStorage = retConfigStorage.res };
            infApi = { 'e': e, 'method': 'POST', 'url': `http://127.0.0.1:${retConfigStorage.portServerHttp}/chat`, 'headers': {}, 'body': inf }; retApi = await api(infApi);
            if (!retApi.ret) { return retApi } else { retApi = retApi.res; if (retApi.body && retApi.body.includes('{"ret": ')) { retApi = JSON.parse(retApi.body) } }; return retApi
        }
    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res;
    }; return { ...({ ret: ret.ret }), ...(ret.msg && { msg: ret.msg }), ...(ret.res && { res: ret.res }), };
};

// CHROME | NODEJS
(eng ? window : global)['chat'] = chat;