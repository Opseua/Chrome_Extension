await import('./resources/@functions.js');
const p = new Error()
console.log('onStartNodeJS');

// *************************

async function client(inf) {
    let ret = { 'ret': false };
    try {
        let WebS;
        if (typeof window !== 'undefined') { // CHROME
            WebS = window.WebSocket;
        } else { // NODEJS
            const { default: WebSocket } = await import('isomorphic-ws'); WebS = WebSocket;
        }

        const infConfigStorage = { 'p': p, 'path': '/src/config.json', 'action': 'get', 'key': 'webSocket' }
        const retConfigStorage = await configStorage(infConfigStorage)
        if (!retConfigStorage.ret) {
            return ret
        }
        const wsHost = retConfigStorage.res.ws1
        const portWebSocket = retConfigStorage.res.portWebSocket;
        const device2 = retConfigStorage.res.device2.name
        const securityPass = retConfigStorage.res.securityPass

        let ws1;
        async function web1() {
            let ws1 = new WebS(`ws://${wsHost}:${portWebSocket}/${device2}`);
            ws1.onerror = (e) => { };
            ws1.onopen = () => { console.log(`ON START: CONEXAO OK - WS1`) };
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
}
client()


