await import('./resources/@functions.js');
let time = dateHour().res; console.log('onStart', `${time.day}/${time.mon} ${time.hou}:${time.min}:${time.sec}`);

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

        async function keepCookieLive() {
            await new Promise(resolve => { setTimeout(resolve, 15000) }); wsSend(devChrome, { 'other': 'keepCookieLive' })
        }; keepCookieLive();

        ret['ret'] = true
    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; if (!ret.ret) {
        if (dev) { const retConfigStorage = await configStorage({ 'action': 'del', 'key': 'webSocket' }) }
        else { await log({ 'folder': 'JavaScript', 'path': `log.txt`, 'text': `ONSTART NODEJS: ${ret.msg}` }) } // ← NODEJS  ↑ CHROME
    }
}
await run()


// const infTabSearch = { 'search': '*google*', 'openIfNotExist': true, 'active': true, 'pinned': false, 'url': 'https://www.google.com/', 'retInf': true }
// const retTabSearch = await tabSearch(infTabSearch); // 'ATIVA', 'TODAS', '*google*' ou 12345678 (ID)
// console.log(retTabSearch)
