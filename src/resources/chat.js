// let infChat, retChat
// infChat = { 'e': e, 'provider': 'open.ai', 'input': `Qual a idade de Marte?` };
// retChat = await chat(infChat);
// console.log(retChat)

let e = import.meta.url, ee = e
async function chat(inf) { // https://chat.openai.com/api/auth/session
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        let errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
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
                infNotification = { 'e': e, 'duration': 5, 'icon': './src/scripts/media/notification_3.png', 'title': `ERRO AO PESQUISAR NO CHATGPT`, 'text': res.error.message }
                notification(infNotification);
                ret['res'] = res.error.message
                ret['msg'] = `\n #### ERRO #### CHAT GPT OPEN AI \n ${res.error.message} \n\n`;
            }
        } else if (inf.provider == 'ec2') {
            // ######## AWS
            infConfigStorage = { 'e': e, 'action': 'get', 'key': 'webSocket' };
            retConfigStorage = await configStorage(infConfigStorage); if (!retConfigStorage.ret) { return retConfigStorage } else { retConfigStorage = retConfigStorage.res };
            infApi = {
                'e': e, 'method': 'POST', 'url': `http://${retConfigStorage.ws1}:${retConfigStorage.globalWindow.portWebSocket}/chatgpt`,
                'headers': {}, 'body': { "prompt": inf.input, "network": inf.network ? true : false }
            };
            retApi = await api(infApi); if (!retApi.ret) { return retApi } else { retApi = retApi.res }
            if (JSON.parse(retApi.body).ret) {
                ret['res'] = JSON.parse(retApi.body).res;
                ret['msg'] = `CHAT [EC2]: OK`
                ret['ret'] = true;
            } else {
                infNotification = { 'e': e, 'duration': 5, 'icon': './src/scripts/media/notification_3.png', 'title': `ERRO AO PESQUISAR NO CHATGPT`, 'text': '' }
                notification(infNotification);
                ret['msg'] = `\n #### ERRO #### CHAT GPT EC2 \n \n\n`;
                ret['res'] = 'res.error.message'
            }
        } else if (inf.provider == 'globalgpt') {
            // ######## GLOBALGPT
            infApi = {
                'e': e, 'method': 'POST', 'url': `https://swiftmodel.azurewebsites.net/api/ChatTrigger`, 'headers': {
                    'content-type': 'text/plain',
                },
                'body': { "name": [{ "role": "user", "content": inf.input }] }
            };
            retApi = await api(infApi); if (!retApi.ret || retApi.res.code !== 200) { return retApi } else { retApi = retApi.res }
            ret['msg'] = `CHAT [GLOBALGPT]: OK`
            ret['res'] = JSON.parse(retApi.body).message.content;
            ret['ret'] = true;
        }

        // ### LOG FUN ###
        if (inf && inf.logFun) {
            let infFile = { 'e': e, 'action': 'write', 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }
            infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; file(infFile);
        }
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
    window['chat'] = chat;
} else { // NODEJS
    global['chat'] = chat;
}