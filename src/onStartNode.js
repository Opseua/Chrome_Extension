await import('./resources/@functions.js');
console.log('onStartNodeJS');

async function client(inf) {
    let ret = { 'ret': false }
    try {
        await log({ 'folder': 'JavaScript', 'rewrite': true, 'path': `log.txt`, 'text': 'ONSTART NODEJS: START' })
        const infConfigStorage = { 'action': 'get', 'key': 'webSocket' }; let retConfigStorage = await configStorage(infConfigStorage)
        if (!retConfigStorage.ret) { return ret } else { retConfigStorage = retConfigStorage.res }
        const wsHost = retConfigStorage.ws1; const portWebSocket = retConfigStorage.portWebSocket;
        const device1 = retConfigStorage.device2.name; const securityPass = retConfigStorage.securityPass
        let ws1; async function web1() {
            let ws1 = new _WebS(`ws://${wsHost}:${portWebSocket}/${device1}`); ws1.onerror = async (e) => { };
            ws1.onopen = async () => {
                console.log(`ON START: CONEXAO OK`);
                await log({ 'folder': 'JavaScript', 'rewrite': true, 'path': `log.txt`, 'text': 'ONSTART NODEJS: CONEXAO OK' })
            }; ws1.onclose = async (event) => {
                console.log(`ON START: RECONEXAO EM 10 SEGUNDOS`);
                await log({ 'folder': 'JavaScript', 'rewrite': true, 'path': `log.txt`, 'text': 'ONSTART NODEJS: RECONEXAO EM 10 SEGUNDOS' })
                await new Promise(r => setTimeout(r, 10000)); web1()
            }; ws1.onmessage = async (event) => {
                let data, fun; try { data = JSON.parse(event.data); if (data.fun) { fun = true } } catch (e) { }; if (fun) {
                    let infWebSocketRet; if (data.retWs && data.retWs.res) {
                        infWebSocketRet = { 'data': event.data.replace(/"########"/g, JSON.stringify(`${data.retWs.res}\n`)) }
                    } else { infWebSocketRet = { 'data': event.data } }; const retWebSocketRet = webSocketRet(infWebSocketRet)
                } else {
                    const msg = `\n\n MENSAGEM DO WEBSCKET \n\n ${event.data} \n\n`; console.log(msg)
                    await log({ 'folder': 'JavaScript', 'rewrite': true, 'path': `log.txt`, 'text': msg })
                }
            }
        }; web1(); ret['ret'] = true;
    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }
    if (!ret.ret) {
        console.log(ret.msg)
        await log({ 'folder': 'JavaScript', 'rewrite': true, 'path': `log.txt`, 'text': `ONSTART NODEJS: ${ret.msg}` })
        if (typeof window !== 'undefined') { // CHROME
            const infConfigStorage = { 'action': 'del', 'key': 'webSocket' }; const retConfigStorage = await configStorage(infConfigStorage)
        }
    }
}
client()
