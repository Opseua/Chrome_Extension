// await import('./websocketRet.js');
// const infWebsocketRet = { 'data': event.data }
// const retWebsocketRet = websocketRet(infWebsocketRet)

// {
//     "securityPass": "#####",
//     "funRet": {
//       "ret": true,
//       "url": "ws://18.xxx.xxx.xx:xxxx/FUNCTION_RET",
//       "inf": "excel"
//     },
//     "funRun": {
//       "name": "excel",
//       "par": {
//         "action": "get",
//         "tab": "CQPT",
//         "col": "A",
//         "lin": 1
//       }
//     }
//   }

await import('./functions.js');

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
        const port = retConfigStorage.res.port;
        const device = retConfigStorage.res.device1
        const securityPass = retConfigStorage.res.securityPass

        const data = JSON.parse(inf.data)
        if (data.securityPass && data.securityPass == securityPass && data.funRun && data.funRun.name && data.funRun.par) {
            function label(pro) {
                return typeof (typeof window !== 'undefined' ? window : global)[pro] === 'function'
            }
            const searchFun = label(data.funRun.name)
            if (!searchFun) {
                ret['msg'] = `FUNCAO '${data.funRun.name}' NAO EXITE`;
            } else {
                const name = window[data.funRun.name];
                const infName = data.funRun.par;
                const retName = await name(infName);
                ret['ret'] = true;
                ret['res'] = retName;
                if (data.funRet.ret) {
                    let wsRet;
                    wsRet = new WebS(`${data.funRet.url}`);
                    wsRet.onerror = (e) => { console.error(`BACKGROUND: ERRO WSRET`) };
                    wsRet.onopen = () => {
                        wsRet.send(JSON.stringify({ 'inf': data.funRet.inf, 'retWs': ret.res }));
                        wsRet.close()
                    }
                }
            }
        } else {
            ret['msg'] = `\n #### NAO RODAR ####  NAO RODAR \n ${inf.data} \n\n`;
        }

    } catch (e) {
        ret['msg'] = regexE({ 'e': e }).res
        ret['msg'] = `\n #### ERRO ####  CONFIG SET \n INFORMAR A 'key' \n\n`;
    }

    if (!ret.ret) { console.log(ret.msg) }
    return ret
}

// export { websocketRet }

if (typeof window !== 'undefined') { // CHROME
    window['websocketRet'] = websocketRet;
} 