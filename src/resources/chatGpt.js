// import { oraAi } from './chatGpt.js';
// async function chat() {
//     const infOraAi = { 'input': `Qual a idade do dono do Google?` }
//     const retOraAi = await oraAi(infOraAi)
//     console.log(retOraAi)
// }
// chat()

const { api } = await import('./api.js');
const { getCookies } = await import('./getCookies.js');
import { storageSet, storageGet, storageDel } from './storage.js';
import { tabSearch } from './tabSearch.js';

async function oraAi(inf) {
    const ret = { 'ret': false };

    const retConfigJson = await fetch('D:/ARQUIVOS/BIBLIOTECAS/1_PROJETOS/Chrome_Extension/src/config.json');
    const config = await retConfigJson.json();
    const par = { 'search': config.Referer, 'key': 'oraAiCookie', 'input': inf.input }
    async function fun1() {
        const infGetCookies = { 'search': par.search };
        const retGetCookies = await getCookies(infGetCookies)
        const infFun2 = { 'key': par.key, 'value': retGetCookies.res.concat };
        await fun2(infFun2)
    }

    async function fun2(inf) {
        const infStorageSet = { 'key': inf.key, 'value': inf.value };
        const retStorageSet = await storageSet(infStorageSet);
        const infRodar = { 'input': par.input, 'cookie': retStorageSet.res }
        return await rodarOraAi(infRodar)
    }

    const retStorageGet = await storageGet(par);
    if (!retStorageGet.ret) {
        const rettabSearch = await tabSearch(par)
        if (!rettabSearch.ret) {
            chrome.tabs.create({ url: par.search, active: false }, (novaAba) => {
                chrome.tabs.update(novaAba.id, { pinned: true });
                chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo) {
                    if (tabId === novaAba.id && changeInfo.status === 'complete') {
                        await fun1()
                    }
                });
            });
        } else {
            await fun1()
        }
    } else {
        const infRodar = { 'input': par.input, 'cookie': retStorageGet.res }
        return await rodarOraAi(infRodar)
    }

    async function rodarOraAi(inf) {
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
                "cookie": inf.cookie,
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

}

export { oraAi }
