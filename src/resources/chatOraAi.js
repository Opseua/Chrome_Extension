// const { chatOraAi } = await import('./chatOraAi.js');
// const infchatOraAi = {
//     'input': `Quando o Android foi criado?`
// }
// const retchatOraAi = await chatOraAi(infchatOraAi)
// console.log(retchatOraAi)

// const fs = await import('fs');
import { fileInf } from './fileInf.js';
// retfileInf = await fileInf(new URL(import.meta.url).pathname);
// const configPath = `${retfileInf.res.pathProject1}\\src\\config.json`
// const configFile = fs.readFileSync(configPath);
// const config = JSON.parse(configFile);
// const { api } = await import('../../Chrome_Extension/src/resources/api.js');

async function chatOraAi(inf) {

    // try {
    //     const response = await fetch(`${retfileInf.res.pathProject2}/src/config.json`);
    //     const config = await response.json();
    //     if ('Referer' in config) {
    //         infApi.headers['Referer'] = config.Referer;
    //     }
    //     if ('cookie' in config) {
    //         infApi.headers['cookie'] = config.cookie;
    //     }
    //     console.log(config)
    // } catch (error) {
    //     console.error('Erro ao ler o arquivo JSON:', error);
    // }








    // let ret = { 'ret': false };

    // const infApi = {
    //     url: 'https://ora.ai/api/conversation',
    //     method: 'POST',
    //     headers: {
    //         "accept": "*/*",
    //         "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
    //         "content-type": "application/json",
    //         "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Google Chrome\";v=\"114\"",
    //         "sec-ch-ua-mobile": "?0",
    //         "sec-ch-ua-platform": "\"Windows\"",
    //         "sec-fetch-dest": "empty",
    //         "sec-fetch-mode": "cors",
    //         "sec-fetch-site": "same-origin",
    //         "Referer": config.Referer,
    //         "cookie": config.cookie,
    //         "Referrer-Policy": "strict-origin-when-cross-origin"
    //     },
    //     body: { 'chatOraAibotId': config.chatOraAibotId, 'input': inf.input, 'userId': config.userId, 'provider': 'OPEN_AI', 'config': false, 'includeHistory': true }
    // };
    // const retApi = await api(infApi);
    // const res = JSON.parse(retApi.res);
    // if ('response' in res) {
    //     ret['ret'] = true;
    //     ret['msg'] = `GPT ORA AI: OK`;
    //     ret['res'] = res.response;
    // } else {
    //     ret['msg'] = `GPT ORA AI: ERRO | ${res.error.message}`;
    // }

    // if (!ret.ret) { console.log(ret.msg) }
    // return ret
}

export { chatOraAi }
