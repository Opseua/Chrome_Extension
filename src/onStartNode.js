await import('./resources/@functions.js'); console.log('onStartNode')

async function run(inf) {
    let ret = { 'ret': false };
    try {
        const infConfigStorage = { 'action': 'get', 'key': 'webSocket' }; let retConfigStorage = await configStorage(infConfigStorage)
        if (!retConfigStorage.ret) { return ret } else { retConfigStorage = retConfigStorage.res }; const securityPass = retConfigStorage.securityPass;
        let s = retConfigStorage.server['1'], url = s.url, host = s.host, port = s.port, dev = retConfigStorage.devices;
        let devChrome = `${url}://${host}:${port}/${dev[1].name}`, devNodeJS = `${url}://${host}:${port}/${dev[2].name}`
        gO.inf['wsArr'] = [devNodeJS, devChrome,]; await wsConnect(gO.inf.wsArr);

        wsList(gO.inf.wsArr[0], async (nomeList, par1) => {
            let data = {}; try { data = JSON.parse(par1) } catch (e) { }; if (data.fun) { // fun
                let infWebSocketRet; if (data.retWs && data.retWs.res) {
                    infWebSocketRet = { 'data': JSON.parse(par1.replace(/"########"/g, JSON.stringify(`${data.retWs.res}\n`))) }
                } else { infWebSocketRet = { 'data': data, 'wsOrigin': nomeList } }; await webSocketRet(infWebSocketRet)
            } else if (data.other) { // other
                console.log('other', data.other)
            } else { console.log(`\nMENSAGEM DO WEBSCKET\n\n${par1}\n`) }
        });

        ret['ret'] = true
    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; if (!ret.ret) {
        console.log(ret.msg); if (typeof window !== 'undefined') {
            const retConfigStorage = await configStorage({ 'action': 'del', 'key': 'webSocket' })
        } else { await log({ 'folder': 'JavaScript', 'path': `log.txt`, 'text': `ONSTART NODEJS: ${ret.msg}` }) } // ← NODEJS  ↑CHROME
    }
}
await run()


