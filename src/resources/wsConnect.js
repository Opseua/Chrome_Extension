// await wsConnect({ 'e': e, 'url': [dev1, dev2, dev3, dev4,] })
// wsList(devSend, async (nomeList, param1) => {
//     console.log('MENSAGEM RECEBIDA EM:', nomeList, '→', param1);
// })
// await new Promise(resolve => { setTimeout(resolve, 2000) })
// wsSend({ 'e': e, 'url': dev1, 'message': `Essa mensagem está sendo enviada` })

// wsList('listener1', async (nomeList, param1, param2) => {
//     console.log('ACIONADO:', nomeList, '→', param1, param2);
// });
// wsList('listener2', async (nomeList, param1, param2) => {
//     console.log('ACIONADO:', nomeList, '→', param1, param2);
// });

// acionarListener('listener1', 'INF1', 'INF2');
// acionarListener('listener2', 'INF1', 'INF2'); 

async function wsSend(inf) { return await ws({ 'e': inf.e, 'url': inf.url, 'message': inf.message }) }
let listeners = {};
function wsList(nomeList, callback) {
    if (!listeners[nomeList]) { listeners[nomeList] = []; } listeners[nomeList].push(callback);
}
function acionarListener(nomeList, param1, param2) {
    if (listeners[nomeList]) { listeners[nomeList].forEach(async (callback) => { await callback(nomeList, param1, param2); }); }
}
async function logWs(inf) { // NODEJS
    if (!eng) {
        let retLog = await log({ 'e': inf.e, 'folder': 'JavaScript', 'path': `log.txt`, 'text': inf.msg })
    }
}

let loopIsRunning = false
let pingsTimeouts = {};
async function wsConnect(inf) {
    try {
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
                        await logWs({ 'e': inf.e, 'msg': msgLog });
                    }, 2000);
                    pingsTimeouts[key] = pingTimeout;
                }
            }, (secPing * 1000)); // secPing
        }
        return await ws(inf);
    } catch (e) {
        let retRegexE = await regexE({ 'inf': inf, 'e': e, 'catchGlobal': false });
    }
}

let activeSockets = new Map();
async function ws(inf) {
    try {
        let url = inf.url
        let message = inf.message
        let e = inf.e
        let time
        if (activeSockets.size == 0) {
            let msgLog = `WS: START`;
            await logWs({ 'e': e, 'msg': msgLog })
        }
        async function connectToServer(server) {
            return new Promise(resolve => {
                if (!activeSockets.has(server)) {
                    let webSocket = new _WebSocket(server);
                    webSocket.onopen = async () => {
                        let msgLog = `WS OK: ${server}`;
                        time = dateHour().res;
                        console.log(`${time.hou}:${time.min}:${time.sec} ${msgLog.replace('ws://', '')}`);
                        await logWs({ 'e': e, 'msg': msgLog })
                        activeSockets.set(server, webSocket);
                        resolve('');
                    }
                    webSocket.onmessage = (event) => {
                        if (event.data == par7) { // RECEBIDO 'pong' DO SERVIDOR
                            clearTimeout(pingsTimeouts[server]);
                            time = dateHour().res;
                            // console.log(`${time.hou}:${time.min}:${time.sec} RECEBIDO PONG:\n${server.replace('ws://', ' ')}`)
                        } else { // OUTRO TIPO DE MENSAGEM RECEBIDA
                            acionarListener(server, event.data);
                            // console.log('RECEBIDA MENSAGEM:', server);
                        }
                    }
                    webSocket.onclose = async () => {
                        clearTimeout(pingsTimeouts[server]);
                        activeSockets.delete(server);
                        let msgLog = `WS RECONECTANDO: ${server}`;
                        let time = dateHour().res;
                        console.log(`${time.hou}:${time.min}:${time.sec} ${msgLog.replace('ws://', '')}`);
                        await logWs({ 'e': e, 'msg': msgLog })
                        setTimeout(async () => { await connectToServer(server); }, (secReconnect * 1000));
                    }
                    webSocket.onerror = async () => { };
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
            return new Promise((resolve) => {
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
                        tentativas++;
                    }
                }
                resolve(false)
            })
        }
    } catch (e) {
        let retRegexE = await regexE({ 'inf': inf, 'e': e, 'catchGlobal': false });
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

