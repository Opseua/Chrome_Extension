/* eslint-disable camelcase */

// * JS [NODEJS/CRHOME]
// nextWay                → gpt-3.5-turbo / gpt-4o-free / gemini-pro   [https://github.com/zachey01/gpt4free.js]
// openAi                 → gpt-4o-mini

// * PYTHON
// telegram               → gpt-4o
// g4f                    → gpt-4o
// zukiJourney (12/min)   → gpt-4
// naga (3/min)           → gpt-4                                       [https://naga.ac/dashboard/models]

// let infChat, retChat;
// infChat = { e, 'provider': 'nextWay', 'model': 'gpt-4o-free', 'messagePrompt': `Qual a idade de Saturno?`, };
// retChat = await chat(infChat); console.log(retChat);

// IMPORTAR PROVEDORES ADICIONAIS
await import('./chats/@import.js'); (eng ? window : global)['zachey01___gpt4free_js'] = GPT4js; delete (eng ? window : global)['GPT4js'];

let e = import.meta.url, ee = e;
async function chat(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        let { provider, model, messagePrompt, } = inf;

        let retConfigStorage, retApi, infApi;
        if (provider === 'openAi') {
            // ######## OPEN.AI
            retConfigStorage = await configStorage({ e, 'action': 'get', 'key': 'chatOpenAi', }); if (!retConfigStorage.ret) { return retConfigStorage; } else { retConfigStorage = retConfigStorage.res; }; infApi = {
                e, 'method': 'POST', 'url': `https://api.openai.com/v1/chat/completions`, 'headers': { 'Content-Type': 'application/json', 'Authorization': `Bearer ${retConfigStorage.Authorization}`, },
                'body': { 'model': model || 'gpt-4o-mini', 'messages': [{ 'role': 'user', 'content': messagePrompt, },], 'temperature': 0.7, },
            }; retApi = await api(infApi); if (!retApi.ret) { return retApi; } else { retApi = retApi.res; }; let res = JSON.parse(retApi.body);
            if ('choices' in res) {
                ret['res'] = res.choices[0].message.content;
                ret['msg'] = `CHAT [OPEN AI]: OK`;
                ret['ret'] = true;
            } else { // CHROME
                if (eng) { retConfigStorage = await configStorage({ e, 'action': 'del', 'key': 'chatOpenAi', }); };
                notification({ e, 'duration': 4, 'icon': 'notification_3.png', 'title': `ERRO AO PESQUISAR NO CHATGPT`, 'text': res.error.message, });
                ret['msg'] = `CHAT [OPEN AI]: ERRO | ${res.error.message}`;
            }
        } else if (provider.toLowerCase() === 'nextway') {
            // ######## GITHUB
            provider = 'Nextway'; let pass = false; messagePrompt = Array.isArray(messagePrompt) ? messagePrompt : [{ 'role': 'user', 'content': messagePrompt, },];
            try { let pro = zachey01___gpt4free_js.createProvider(provider); pass = await pro.chatCompletion(messagePrompt, { provider, 'model': model || 'gpt-4o-free', }); } catch (catchErr) { esLintIgnore = catchErr; };
            if (!pass) {
                ret['msg'] = `CHAT [NEXTWAY]: ERRO | AO GERAR RESPOSTA`;
            } else {
                ret['ret'] = true;
                ret['msg'] = `CHAT [NEXTWAY]: OK`;
                ret['res'] = pass;
            }
        } else {
            retConfigStorage = await configStorage({ e, 'action': 'get', 'key': 'chatPython', }); if (!retConfigStorage.ret) { return retConfigStorage; } else { retConfigStorage = retConfigStorage.res; };
            infApi = { e, 'method': 'POST', 'url': `http://127.0.0.1:${retConfigStorage.portServerHttp}/chat`, 'headers': {}, 'body': inf, }; retApi = await api(infApi);
            if (!retApi.ret) { return retApi; } else { retApi = retApi.res; if (retApi.body && retApi.body.includes('{"ret": ')) { retApi = JSON.parse(retApi.body); } }; return retApi;
        }
    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    };

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.res && { 'res': ret.res, }), };
};

// CHROME | NODEJS
(eng ? window : global)['chat'] = chat;


