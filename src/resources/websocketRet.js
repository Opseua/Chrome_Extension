// {
//     "fun": [
//         {
//             "securityPass": "####################",
//             "funRet": { "retUrl": false, "funA": "ARRAY AQUI" },
//             "funRun": {
//                 "name": "notification",
//                 "par": {
//                     "title": "TITULO 1",
//                     "message": "TEXTO"
//                 }
//             }
//         },
//         {
//             "securityPass": "####################",
//             "funRet": { "retUrl": false, "funA": "ARRAY AQUI" },
//             "funRun": {
//                 "name": "notification",
//                 "par": {
//                     "title": "TITULO 2",
//                     "message": "TEXTO"
//                 }
//             }
//         }
//     ]
// }

async function webSocketRet(inf) {
    let ret = { 'ret': false }
    try {
        let WebS;
        if (typeof window !== 'undefined') { WebS = window.WebSocket } // CHROME
        else { const { default: WebSocket } = await import('ws'); WebS = WebSocket } // NODEJS
        const infConfigStorage = { 'action': 'get', 'key': 'webSocket' }; let retConfigStorage = await configStorage(infConfigStorage)
        if (!retConfigStorage.ret) { return ret } else { retConfigStorage = retConfigStorage.res }
        const data = JSON.parse(inf.data);
        const wsHost = retConfigStorage.ws1; const portWebSocket = retConfigStorage.portWebSocket;
        const device0Ret = retConfigStorage.device0.ret; const securityPass = retConfigStorage.securityPass

        function label(f) { return typeof (typeof window !== 'undefined' ? window : global)[f] === 'function' }
        await Promise.all(data.fun.map(async (value, index) => {
            // --------------------------------------------------
            if (value.securityPass !== securityPass) {
                ret['msg'] = `\n #### SECURITYPASS INCORRETO #### \n\n ${JSON.stringify(data)} \n\n`;
            } else if (!label(value.funRun.name)) {
                ret['msg'] = `\n #### FUNCAO '${value.funRun.name}' NAO EXITE #### \n\n ${JSON.stringify(data)} \n\n`
            } else {
                let name; if (typeof window !== 'undefined') { name = window[value.funRun.name] } // CHROME
                else { name = global[value.funRun.name] } // NODEJS
                const infName = value.funRun.par
                const retName = await name(infName)
                if (value.funRet && value.funRet.retUrl) {
                    let wsRet
                    if (typeof value.funRet.retUrl === 'boolean') { wsRet = `ws://${wsHost}:${portWebSocket}/${device0Ret}` }
                    else { wsRet = `${value.funRet.retUrl}` }
                    wsRet = new WebS(wsRet)
                    wsRet.onerror = (e) => { console.error(`WEBSOCKET RET: ERRO WS`) }
                    wsRet.onopen = () => {
                        wsRet.send(JSON.stringify({ 'inf': value.funRet.retInf, 'retWs': retName, 'fun': value.funRet.fun }))
                        wsRet.close()
                    }
                }
                ret['ret'] = true;
            }
            // --------------------------------------------------
        }))
    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res; }
    if (!ret.ret) {
        console.log(ret.msg);
        const retLog = await log({ 'folder': 'JavaScript', 'rewrite': true, 'file': `log.txt`, 'text': ret.msg })
        if (typeof window !== 'undefined') { // CHROME
            const infConfigStorage = { 'action': 'del', 'key': 'webSocket' }; const retConfigStorage = await configStorage(infConfigStorage)
        }
    }; return ret
}

if (typeof window !== 'undefined') { // CHROME
    window['webSocketRet'] = webSocketRet;
} else { // NODEJS
    global['webSocketRet'] = webSocketRet;
}