await import('./resources/@functions.js'); console.log('onStartNode')

async function run(inf) {
    let ret = { 'ret': false }; try {
        const infConfigStorage = { 'action': 'get', 'key': 'webSocket' }; let retConfigStorage = await configStorage(infConfigStorage)
        if (!retConfigStorage.ret) { return ret } else { retConfigStorage = retConfigStorage.res }; const securityPass = retConfigStorage.securityPass;
        let s = retConfigStorage.server['1'], url = s.url, host = s.host, port = s.port, dev = retConfigStorage.devices; let dev2 = `${url}://${host}:${port}/${dev[2].name}`
        await wsConnect([dev2,]); wsList(dev2, async (m) => {
            let data = {}; try { data = JSON.parse(m) } catch (e) { }; if (data.fun) {
                let infWebSocketRet; if (data.retWs && data.retWs.res) {
                    infWebSocketRet = { 'data': m.replace(/"########"/g, JSON.stringify(`${data.retWs.res}\n`)) }
                } else { infWebSocketRet = { 'data': m } }; await webSocketRet(infWebSocketRet)
            } else if (data.other) {  // other
                console.log('ther', data.other)
            } else { console.log(`\n\n MENSAGEM DO WEBSCKET \n\n ${m} \n\n`) }
        }); ret['ret'] = true
    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res };
    if (!ret.ret) {
        console.log(ret.msg); await log({ 'folder': 'JavaScript', 'path': `log.txt`, 'text': `ONSTART NODEJS: ${ret.msg}` });
        if (typeof window !== 'undefined') { const retConfigStorage = await configStorage({ 'action': 'del', 'key': 'webSocket' }) }
    }
}
run()