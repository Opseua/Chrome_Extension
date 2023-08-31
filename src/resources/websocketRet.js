const p = new Error()
// const infWebSocketRet = { 'data': event.data }
// const retWebSocketRet = webSocketRet(infWebSocketRet)

// {
// 	"fun": {
// 		"securityPass": "######",
// 		"funRet": {
// 			"ret": false,
// 			"url": "ws://xx.xxx.xxx.xx:xx/######_RET",
// 			"inf": "ID DO RETORNO"
// 		},
// 		"funRun": {
// 			"name": "notification",
// 			"par": {
// 				"duration": 1,
// 				"type": "basic",
// 				"title": "titulo",
// 				"message": "texto",
// 				"iconUrl": null,
// 				"buttons": []
// 			}
// 		}
// 	}
// }

async function webSocketRet(inf) {
    let ret = { 'ret': false };
    try {
        let WebS;
        if (typeof window !== 'undefined') { WebS = window.WebSocket } // CHROME
        else { const { default: WebSocket } = await import('isomorphic-ws'); WebS = WebSocket } // NODEJS

        const infConfigStorage = { 'path': './src/config.json', 'action': 'get', 'key': 'webSocket' }
        let retConfigStorage = await configStorage(infConfigStorage)
        if (!retConfigStorage.ret) { return ret } else { retConfigStorage = retConfigStorage.res }
        const data = JSON.parse(inf.data)
        const wsHost = retConfigStorage.ws1
        const portWebSocket = retConfigStorage.portWebSocket;
        const device0Ret = retConfigStorage.device0.ret
        const securityPass = retConfigStorage.securityPass
        if (data.fun && data.fun.securityPass && data.fun.securityPass == securityPass && data.fun.funRun && data.fun.funRun.name && data.fun.funRun.par) {
            function label(pro) { return typeof (typeof window !== 'undefined' ? window : global)[pro] === 'function' }
            const searchFun = label(data.fun.funRun.name)
            if (!searchFun) {
                ret['msg'] = `FUNCAO '${data.fun.funRun.name}' NAO EXITE`;
            } else {
                let name
                if (typeof window !== 'undefined') { // CHROME
                    name = window[data.fun.funRun.name];
                } else { // NODEJS
                    name = global[data.fun.funRun.name];
                }
                const infName = data.fun.funRun.par;
                const retName = await name(infName);
                ret['ret'] = true;
                if (data.fun.funRet.ret) {
                    let wsRet
                    if (!data.fun.funRet.url) { wsRet = `ws://${wsHost}:${portWebSocket}/${device0Ret}` }
                    else { wsRet = `${data.fun.funRet.url}` }
                    wsRet = new WebS(wsRet);
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
    if (!ret.ret) {
        console.log(ret.msg);
        if (typeof window !== 'undefined') { // CHROME
            const infConfigStorage = { 'path': '/src/config.json', 'action': 'del', 'key': 'webSocket' }
            const retConfigStorage = await configStorage(infConfigStorage)
        }
    }
    return ret
}

if (typeof window !== 'undefined') { // CHROME
    window['webSocketRet'] = webSocketRet;
} else { // NODEJS
    global['webSocketRet'] = webSocketRet;
}