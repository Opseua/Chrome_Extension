// await import('./websocketRet.js');
// const infWebsocketRet = { 'data': event.data }
// const retWebsocketRet = websocketRet(infWebsocketRet)

// {
//     "securityPass": "#####",
//     "funRet": {
//         "ret": false,
//         "url": "ws://xx.xxx.xxx.xx:xx/FUNCTION_RET",
//         "inf": "ID DO RETORNO"
//     },
//     "funRun": {
//         "name": "notification",
//         "par": {
//             "duration": 1,
//             "type": "basic",
//             "title": "titulo",
//             "message": "texto",
//             "iconUrl": null,
//             "buttons": []
//         }
//     }
// }

await import('./functions.js');
await import('./excel.js');

async function websocketRet(inf) {
    let ret = { 'ret': false };
    try {
        let WebS;
        const retNodeOrBrowser = await nodeOrBrowser();
        if (retNodeOrBrowser.res == 'node') { // NODEJS
            const { default: WebSocket } = await import('isomorphic-ws'); WebS = WebSocket;
        } else if (retNodeOrBrowser.res == 'chrome') { // CHROME
            WebS = window.WebSocket;
        }
        const infConfigStorage = { 'path': '/src/config.json', 'action': 'get', 'key': 'websocket' }
        const retConfigStorage = await configStorage(infConfigStorage)
        if (!retConfigStorage.ret) {
            return ret
        }
        const securityPass = retConfigStorage.res.securityPass
        const data = JSON.parse(inf.data)
        if (data.fun && data.fun.securityPass && data.fun.securityPass == securityPass && data.fun.funRun && data.fun.funRun.name && data.fun.funRun.par) {
            function label(pro) {
                return typeof (typeof window !== 'undefined' ? window : global)[pro] === 'function'
            }
            const searchFun = label(data.fun.funRun.name)
            if (!searchFun) {
                ret['msg'] = `FUNCAO '${data.fun.funRun.name}' NAO EXITE`;
            } else {
                let name
                if (typeof window !== 'undefined') { // CHROME
                    name = window[data.fun.funRun.name];
                } else if (typeof global !== 'undefined') { // NODE
                    name = global[data.fun.funRun.name];
                }
                const infName = data.fun.funRun.par;
                const retName = await name(infName);
                ret['ret'] = true;
                if (data.fun.funRet.ret) {
                    let wsRet = new WebS(`${data.fun.funRet.url}`);
                    wsRet.onerror = (e) => { console.error(`WEBSOCKET RET: ERRO WS`) };
                    wsRet.onopen = () => {
                        wsRet.send(JSON.stringify({ 'inf': data.fun.funRet.inf, 'retWs': retName, 'fun': data.fun.funRet.fun }));
                        wsRet.close()
                    }
                }
            }
        } else {
            ret['msg'] = `\n #### NAO RODAR ####  NAO RODAR \n\n ${inf.data} \n\n`;
        }

    } catch (e) {
        ret['msg'] = regexE({ 'e': e }).res
    }

    if (!ret.ret) { console.log(ret.msg) }
    return ret
}

if (typeof window !== 'undefined') { // CHROME
    window['websocketRet'] = websocketRet;
} else if (typeof global !== 'undefined') { // NODE
    global['websocketRet'] = websocketRet;
}