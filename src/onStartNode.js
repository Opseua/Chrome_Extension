await import('./resources/@functions.js'); console.log('onStartNode')

async function run(inf) {
    let ret = { 'ret': false };
    try {
        await wsConnect([devNodeJS, devChrome,]);

        wsList(devNodeJS, async (nomeList, par1) => {
            let data = {}; try { data = JSON.parse(par1) } catch (e) { }; if (data.fun) { // fun
                let infWebSocketRet; if (data.retWs && data.retWs.res) {
                    infWebSocketRet = { 'data': JSON.parse(par1.replace(/"########"/g, JSON.stringify(`${data.retWs.res}\n`))) }
                } else { infWebSocketRet = { 'data': data, 'wsOrigin': nomeList } }; await webSocketRet(infWebSocketRet)
            } else if (data.other) { // other
                console.log('other', data.other)
            } else { console.log(`\nMENSAGEM DO WEBSCKET\n\n${par1}\n`) }
        });

        wsSend(devChrome, { 'other': 'keepCookieLive' })

        ret['ret'] = true
    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; if (!ret.ret) {
        console.log(ret.msg); if (typeof window !== 'undefined') {
            const retConfigStorage = await configStorage({ 'action': 'del', 'key': 'webSocket' })
        } else { await log({ 'folder': 'JavaScript', 'path': `log.txt`, 'text': `ONSTART NODEJS: ${ret.msg}` }) } // ← NODEJS  ↑ CHROME
    }
}
await run()


