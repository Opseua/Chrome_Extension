// import { oraAi } from './chatGpt.js';
// const infOraAi = { 'input': `Qual a velocidade da Voyager?` }
// const retOraAi = await oraAi(infOraAi)
// console.log(retOraAi);

const { api } = await import('./api.js');
const { getCookies } = await import('./getCookies.js');
import { storageSet, storageGet, storageDel } from './storage.js';

async function oraAi(inf) {
    let ret = { 'ret': false };

    let cookie
    const infStorageGet = { 'key': 'oraAiCookie' }
    const retStorageGet = await storageGet(infStorageGet);
    if (!retStorageGet.ret) {
        const infGetCookies = { 'search': `Orlando | ora.ai` }
        const retGetCookies = await getCookies(infGetCookies)
        if (!retGetCookies.ret) { return ret }
        cookie = retGetCookies.res.concat
        const infStorageSet = { 'key': 'oraAiCookie', 'value': cookie }
        const retStorageSet = await storageSet(infStorageSet);
    } else { cookie = retStorageGet.res }
    const retConfigJson = await fetch('D:/ARQUIVOS/BIBLIOTECAS/1_PROJETOS/Chrome_Extension/src/config.json');
    const config = await retConfigJson.json();

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
            "Referer": config.Referer,
            "cookie": cookie,
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        body: { "chatbotId": config.chatbotId, "input": inf.input, "conversationId": config.conversationId, "userId": config.userId, "provider": "OPEN_AI", "config": false, "includeHistory": true }
    };
    const retApi = await api(infApi);
    if (!retApi.ret) { return ret }

    const res = JSON.parse(retApi.res);
    if ('response' in res) {
        ret['ret'] = true;
        ret['msg'] = `GPT ORA AI: OK`;
        ret['res'] = res.response;
    } else {
        ret['msg'] = `GPT ORA AI: ERRO | ${res.error.message}`;
    }

    if (!ret.ret) { console.log(ret.msg) }
    return ret
}

export { oraAi }
