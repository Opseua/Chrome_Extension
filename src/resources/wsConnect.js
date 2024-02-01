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

let loopIsRunning = false
let pingsTimeouts = {};
let e = import.meta.url, ee = e
async function wsConnect(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    try {
        // ENVIAR 'ping' PARA O SERVIDOR
        if (!loopIsRunning) {
            loopIsRunning = true
            setInterval(async () => {
                for (let [key, value] of activeSockets.entries()) {
                    value.send(par6);
                    // logConsole({ 'e': e, 'ee': ee, 'ee': e, 'write': true, 'msg': `[CLIENT] PING ENVIADO: '${value.roomLocWeb}'` });
                    let pingTimeout = setTimeout(async () => {
                        logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `[CLIENT] PONG EXPIROU: '${value.roomLocWeb}'` });
                        value.close()
                    }, 2000);
                    pingsTimeouts[key] = pingTimeout;
                }
            }, (secPing * 1000)); // secPing
        }
        return await ws(inf);
    } catch (e) {
        regexE({ 'inf': inf, 'e': e, 'catchGlobal': false });
    }
}

let activeSockets = new Map();
async function ws(inf) {
    try {
        let url = inf.url
        let message = inf.message
        let e = inf.e
        if (activeSockets.size == 0) {
            logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `[WS]: START` });
        }
        async function connectToServer(server) {
            return new Promise(resolve => {
                if (!activeSockets.has(server)) {
                    let webSocket = new _WebSocket(server);
                    // ON OPEN
                    webSocket.onopen = async () => {
                        webSocket['room'] = server.split('/').pop()
                        webSocket['roomLocWeb'] = server.includes('127.0.0') ? `[LOC] ${webSocket.room}` : `[WEB] ${webSocket.room}`
                        logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `[CLIENT] OK: '${webSocket.roomLocWeb}'` });
                        activeSockets.set(server, webSocket);
                        // MASTER OU SLAVE [ENVIAR SOMENTE SE FOR MASTER E 'WebSocket' /'Chrome_Extension']
                        let masterSlaveDev = `${devMaster}_${engName}`
                        let masterSlaveUrl = webSocket.url.split('/').pop()
                        if (masterSlaveDev == masterSlaveUrl && (e.includes('WebSocket') || e.includes('chrome-extension'))) {
                            webSocket.send(par11)
                        }
                        resolve('');
                    }
                    // ON MESSAGE
                    webSocket.onmessage = (event) => {
                        if (event.data.toLowerCase() == par7.toLowerCase()) {
                            // RECEBIDO 'pong' DO SERVIDOR
                            clearTimeout(pingsTimeouts[server]);
                            // logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `[SERVER] PONG RECEBIDO: '${webSocket.roomLocWeb}'` });
                        } else {
                            // OUTRO TIPO DE MENSAGEM RECEBIDA
                            acionarListener(server, event.data);
                            // logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `[SERVER] RECEBIDA MENSAGEM: '${webSocket.roomLocWeb}'` });
                        }
                    }
                    // ON CLOSE
                    webSocket.onclose = async () => {
                        clearTimeout(pingsTimeouts[server]);
                        activeSockets.delete(server);
                        logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `[SERVER] RECONECTANDO: '${webSocket.roomLocWeb}'` });
                        setTimeout(async () => { await connectToServer(server); }, (secReconnect * 1000));
                    }
                    // ON ERROR
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
        } else if (typeof url === 'string') {
            // ENVIAR MENSAGEM
            return new Promise((resolve) => {
                let webSocket = activeSockets.has(url) ? activeSockets.get(url) : new _WebSocket(url)
                let connected = activeSockets.has(url) ? true : false
                let tentativas = 0, maxTentativas = 10;
                while (tentativas < maxTentativas) {
                    if (webSocket.readyState === _WebSocket.OPEN) {
                        let messageNew = typeof message === 'object' ? JSON.stringify(message) : message
                        let retInf = false
                        if (messageNew.includes(`"retInf":true`) || regex({ 'e': e, 'simple': true, 'pattern': '*"retInf":"*', 'text': messageNew })) {
                            retInf = JSON.stringify(Date.now())
                            messageNew = messageNew.replace('"retInf":true', `"retInf":"${retInf}"`)
                            let retRegexOK = regex({ 'e': e, 'pattern': '"retInf":"(.*?)"', 'text': messageNew })
                            retInf = retRegexOK.res['1']
                        }
                        let awaitRet = messageNew.includes('retWs') ? false : retInf
                        webSocket.send(messageNew); // MOSTRAR URL DO WEBSOCKET ATUAL webSocket._url
                        // logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `[CLIENT/${connected}] MENSAGEM ENVIADA` });
                        if (!awaitRet) {
                            if (!connected) {
                                webSocket.close()
                            }
                            // RESPOSTA NECESSÁRIA [NÃO]
                            resolve({ 'ret': true, 'msg': 'WS OK: MENSAGEM ENVIADA' })
                        } else {
                            // logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `[CLIENT/${connected}] AGUARDANDO NOVA MENSAGEM` });
                            let timer;
                            webSocket.onmessage = function (event) {
                                if (event.data.includes(awaitRet)) {
                                    // logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `[CLIENT/${connected}] MENSAGEM RECEBIDA` });
                                    clearTimeout(timer);
                                    if (!connected) {
                                        webSocket.close()
                                        // logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `[CLIENT/${connected}] CONEXÃO ENCERRADA` });
                                    }
                                    // RESPOSTA NECESSÁRIA [SIM] | RECEBIDO [SIM]
                                    resolve({ 'ret': true, 'msg': 'WS OK: MENSAGEM RECEBIDA', 'res': event.data })
                                }
                            };
                            timer = setTimeout(() => {
                                // logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `[CLIENT/${connected}] TEMPO EXPIROU` });
                                if (!connected) {
                                    webSocket.close()
                                    // logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `[CLIENT/${connected}] CONEXÃO ENCERRADA` });
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
        regexE({ 'inf': inf, 'e': e, 'catchGlobal': false });
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

