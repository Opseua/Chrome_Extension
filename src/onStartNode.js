await import('./resources/@functions.js');
console.log('onStartNodeJS');

// *************************

async function client(inf) {
    let ret = { 'ret': false };
    try {
        let WebS; ret['ret'] = true;
        if (typeof window !== 'undefined') { WebS = window.WebSocket } // CHROME
        else { const { default: WebSocket } = await import('isomorphic-ws'); WebS = WebSocket } // NODEJS

        const infConfigStorage = { 'path': `${letter}:/ARQUIVOS/PROJETOS/Chrome_Extension/src/config.json`, 'action': 'get', 'key': 'webSocket' }
        let retConfigStorage = await configStorage(infConfigStorage)
        if (!retConfigStorage.ret) { return ret } else { retConfigStorage = retConfigStorage.res }
        const wsHost = retConfigStorage.ws1
        const portWebSocket = retConfigStorage.portWebSocket;
        const device2 = retConfigStorage.device2.name
        const securityPass = retConfigStorage.securityPass

        let ws1;
        async function web1() {
            let ws1 = new WebS(`ws://${wsHost}:${portWebSocket}/${device2}`);
            ws1.onerror = (e) => { };
            ws1.onopen = () => {
                console.log(`ON START: CONEXAO OK - WS1`);
                setInterval(async () => {
                    if (ws1.readyState === WebS.OPEN) {
                        ws1.send('.');
                        let d = dateHour().res, n = `MES_${d.mon}/DIA_${d.day}/${d.tim} NODEJS`
                        let infFile = { 'action': 'write', 'path': `log/WebSocket/${n}.txt`, 'rewrite': false, 'text': '.' }
                        let retFile = await file(infFile)
                    }
                }, 60000);
            };
            ws1.onclose = async (event) => {
                console.log(`ON START: RECONEXAO EM 10 SEGUNDOS - WS1`);
                await new Promise(r => setTimeout(r, 10000)); web1()
            }
            ws1.onmessage = async (event) => {
                let data, fun
                try {
                    data = JSON.parse(event.data);
                    if (data.fun) { fun = true }
                } catch (e) { }
                if (fun) {
                    let infWebSocketRet
                    if (data.retWs && data.retWs.res) {
                        infWebSocketRet = { 'data': event.data.replace(/"########"/g, JSON.stringify(`${data.retWs.res}\n`)) }
                    } else {
                        infWebSocketRet = { 'data': event.data }
                    }
                    const retWebSocketRet = webSocketRet(infWebSocketRet)
                } else {
                    console.log(`MENSAGEM DO WEBSCKET\n\n${event.data}\n\n`)
                }
            }
        }
        web1()

    } catch (e) {
        ret['msg'] = regexE({ 'e': e }).res
    }

    if (!ret.ret) {
        console.log(ret.msg)
        if (typeof window !== 'undefined') { // CHROME
            const infConfigStorage = { 'path': '/src/config.json', 'action': 'del', 'key': 'webSocket' }
            const retConfigStorage = await configStorage(infConfigStorage)
        }
    }
}
//client()
console.log('ONSTART', conf)