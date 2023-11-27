// await wsConnect([devChrome, devNodeJS,]);
// wsList(devChrome, async (nomeList, par1) => {
//     console.log('MENSAGEM RECEBIDA EM:', nomeList, '→', par1);
// })
// await new Promise(resolve => { setTimeout(resolve, 2000) })
// wsSend(devChrome, 'Essa mensagem está sendo enviada')

// wsList('listener1', async (nomeList, par1, par2) => {
//     console.log('ACIONADO:', nomeList, '→', par1, par2);
// });
// wsList('listener2', async (nomeList, par1, par2) => {
//     console.log('ACIONADO:', nomeList, '→', par1, par2);
// });

// acionarListener('listener1', 'INF1', 'INF2');
// acionarListener('listener2', 'INF1', 'INF2'); 

async function wsSend(parametro, message) { return await ws(parametro, message); }
let listeners = {};
function wsList(nomeList, callback) {
    if (!listeners[nomeList]) { listeners[nomeList] = []; } listeners[nomeList].push(callback);
}
function acionarListener(nomeList, par1, par2) {
    if (listeners[nomeList]) { listeners[nomeList].forEach(async (callback) => { await callback(nomeList, par1, par2); }); }
}
async function logWs(inf) { // NODEJS
    if (!eng) { await log({ 'folder': 'JavaScript', 'path': `log.txt`, 'text': inf }) }
}

let loopIsRunning = false
let pingsTimeouts = {};
async function wsConnect(inf) {
    if (!loopIsRunning) { // ENVIAR 'ping' PARA O SERVIDOR
        loopIsRunning = true
        let time
        setInterval(async () => {
            for (let [key, value] of activeSockets.entries()) {
                value.send(par6);
                time = dateHour().res;
                // console.log(`${time.hou}:${time.min}:${time.sec} ENVIADO PING:\n${key.replace('ws://', ' ')}`)
                let pingTimeout = setTimeout(async () => {
                    let msgLog = `WS pong EXPIROU:\n${key}`;
                    time = dateHour().res;
                    console.log(`${time.hou}:${time.min}:${time.sec} WS pong EXPIROU: ${msgLog.replace('\n', '').replace('ws://', ' ').split('/')[1]}`);
                    value.close()
                    await logWs(msgLog);
                }, 2000);
                pingsTimeouts[key] = pingTimeout;
            }
        }, (secPing * 1000)); // secPing
    }
    return await ws(inf);
}

let activeSockets = new Map();
async function ws(url, message) {
    if (activeSockets.size == 0) { await logWs('WS: START') }
    async function connectToServer(server) {
        return new Promise(resolve => {
            if (!activeSockets.has(server)) {
                let webSocket = new _WebSocket(server);
                webSocket.onopen = async (event) => {
                    let msgLog = `WS OK:\n${server}`;
                    let time = dateHour().res;
                    console.log(`${time.hou}:${time.min}:${time.sec} ${msgLog.replace('ws://', '')}`);
                    await logWs(msgLog);
                    activeSockets.set(server, webSocket);
                    resolve('');
                }
                webSocket.onmessage = (event) => {
                    if (event.data == par7) { // RECEBIDO 'pong' DO SERVIDOR
                        clearTimeout(pingsTimeouts[server]);
                        let time = dateHour().res;
                        // console.log(`${time.hou}:${time.min}:${time.sec} RECEBIDO PONG:\n${server.replace('ws://', ' ')}`)
                    } else { // OUTRO TIPO DE MENSAGEM RECEBIDA
                        acionarListener(server, event.data);
                        // console.log('RECEBIDA MENSAGEM:', server);
                    }
                }
                webSocket.onclose = async (event) => {
                    clearTimeout(pingsTimeouts[server]);
                    activeSockets.delete(server);
                    let msgLog = `WS RECONECTANDO:\n${server}`;
                    let time = dateHour().res;
                    console.log(`${time.hou}:${time.min}:${time.sec} ${msgLog.replace('ws://', '')}`);
                    await logWs(msgLog);
                    setTimeout(async () => { await connectToServer(server); }, (secReconnect * 1000));
                }
                webSocket.onerror = async (event) => { };
            }

        });
    }
    if (Array.isArray(url)) { // CONECTAR SERVIDORES
        let promises = url.map(server => new Promise(resolve => {
            if (!activeSockets.has(server)) {
                connectToServer(server).then(() => { resolve(''); });
            } else {
                resolve('');
            }
        }));
        await Promise.all(promises);
    } else if (typeof url === 'string') { // ENVIAR MENSAGEM
        return new Promise(async (resolve) => {
            let webSocket = activeSockets.has(url) ? activeSockets.get(url) : new _WebSocket(url)
            let connected = activeSockets.has(url) ? true : false
            let tentativas = 0, maxTentativas = 10;
            while (tentativas < maxTentativas) {
                if (webSocket.readyState === _WebSocket.OPEN) {
                    let messageNew = typeof message === 'object' ? JSON.stringify(message) : message
                    let retInf = false
                    if (messageNew.includes(`"retInf":true`) || regex({ 'simple': true, 'pattern': '*"retInf":"*', 'text': messageNew })) {
                        retInf = JSON.stringify(Date.now())
                        messageNew = messageNew.replace('"retInf":true', `"retInf":"${retInf}"`)
                        let retRegexOK = regex({ 'pattern': '"retInf":"(.*?)"', 'text': messageNew })
                        retInf = retRegexOK.res['1']
                    }
                    let awaitRet = messageNew.includes('retWs') ? false : retInf
                    webSocket.send(messageNew); // MOSTRAR URL DO WEBSOCKET ATUAL webSocket._url
                    // console.log(`CONECTADO [${connected}]: MENSAGEM ENVIADA`)
                    if (!awaitRet) {
                        if (!connected) {
                            webSocket.close()
                        }
                        // RESPOSTA NECESSÁRIA [NÃO]
                        resolve({ 'ret': true, 'msg': 'WS OK: MENSAGEM ENVIADA' })
                    } else {
                        // console.log(`CONECTADO [${connected}]: AGUARDANDO NOVA MENSAGEM`);
                        let timer;
                        webSocket.onmessage = function (event) {
                            if (event.data.includes(awaitRet)) {
                                // console.log(`CONECTADO [${connected}]: MENSAGEM RECEBIDA`)
                                clearTimeout(timer);
                                if (!connected) {
                                    webSocket.close()
                                    // console.log(`CONECTADO [${connected}]: CONEXÃO ENCERRADA`)
                                }
                                // RESPOSTA NECESSÁRIA [SIM] | RECEBIDO [SIM]
                                resolve({ 'ret': true, 'msg': 'WS OK: MENSAGEM RECEBIDA', 'res': event.data })
                            }
                        };
                        timer = setTimeout(() => {
                            // console.log(`CONECTADO [${connected}]: TEMPO EXPIROU`)
                            if (!connected) {
                                webSocket.close()
                                // console.log(`CONECTADO [${connected}]: CONEXÃO ENCERRADA`)
                            }
                            // RESPOSTA NECESSÁRIA [SIM] | RECEBIDO [NÃO]
                            resolve({ 'ret': true, 'msg': 'WS OK: TEMPO EXPIROU' })
                        }, 20000);
                    }
                    return;
                } else {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    tentativas++;
                }
            }
            resolve(false)
        })
    }
}

if (eng) { // CHROME
    window['wsConnect'] = wsConnect;
    window['wsList'] = wsList;
    window['wsSend'] = wsSend;
    window['acionarListener'] = acionarListener;
} else { // NODEJS
    global['wsConnect'] = wsConnect;
    global['wsList'] = wsList;
    global['wsSend'] = wsSend;
    global['acionarListener'] = acionarListener;
}

