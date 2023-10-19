// const infConfigStorage = { 'action': 'get', 'key': 'webSocket' };
// let retConfigStorage = await configStorage(infConfigStorage)
// if (!retConfigStorage.ret) { return ret } else { retConfigStorage = retConfigStorage.res };
// let s = retConfigStorage.server['1'], url = s.url, host = s.host, port = s.port, dev = retConfigStorage.devices;
// let dev1 = `${url}://${host}:${port}/${dev[1].name}`


// gO.inf = { 'wsArr': [dev1,] };
// await wsConnect(gO.inf.wsArr);
// wsList(gO.inf.wsArr[0], async (m) => {
//     console.log('MENSAGEM RECEBIDA:', m)
// })
// await new Promise(resolve => { setTimeout(resolve, 2000) })
// wsSend(dev1, 'Essa mensagem está sendo enviada')

// wsList('listener1', async (nomeList, par1, par2) => {
//     console.log('ACIONADO:', nomeList, '→', par1, par2);
// });
// wsList('listener2', async (nomeList, par1, par2) => {
//     console.log('ACIONADO:', nomeList, '→', par1, par2);
// });

// acionarListener('listener1', 'INF1', 'INF2');
// acionarListener('listener2', 'INF1', 'INF2'); 

if (typeof window !== 'undefined') { // CHROME
    if (!window.all) { await import('./@functions.js') }
} else { if (!global.all) { await import('./@functions.js') } }

async function wsConnect(inf) {
    return await ws(inf);
}
async function wsSend(parametro, message) {
    return await ws(parametro, message);
}
const listeners = {};
function wsList(nomeList, callback) {
    if (!listeners[nomeList]) {
        listeners[nomeList] = [];
    }
    listeners[nomeList].push(callback);
}
function acionarListener(nomeList, par1, par2) {
    if (listeners[nomeList]) {
        listeners[nomeList].forEach(async (callback) => {
            await callback(nomeList, par1, par2);
        });
    }
}
async function logWs(inf) { // NODEJS
    if (typeof window == 'undefined') {
        await log({ 'folder': 'JavaScript', 'path': `log.txt`, 'text': inf })
    }
}
const activeSockets = new Map();
async function ws(param, message) {
    if (activeSockets.size == 0) {
        await logWs('ONSTART NODEJS: START')
    }
    async function connectToServer(server) {
        return new Promise(resolve => {
            const socket = new _WebS(server);
            socket.addEventListener('open', async (event) => {
                let msgLog = `WS OK:\n${server}`;
                console.log(msgLog);
                await logWs(msgLog);
                activeSockets.set(server, socket);
                resolve('');
            });
            socket.addEventListener('message', (event) => {
                // console.log('EVENTO, MENSAGEM RECEBIDA:', server);
                acionarListener(server, event.data);
            });
            socket.addEventListener('close', async (event) => {
                activeSockets.delete(server);
                let msgLog = `WS RECONEXAO EM 5 SEGUNDOS:\n${server}`;
                console.log(msgLog);
                await logWs(msgLog);
                setTimeout(() => {
                    connectToServer(server);
                }, 5000);
            });
        });
    }
    if (Array.isArray(param)) { // conectar servidores
        const promises = param.map(server => new Promise(resolve => {
            if (!activeSockets.has(server)) {
                connectToServer(server).then(() => {
                    resolve('');
                });
            } else {
                resolve('');
            }
        }));
        await Promise.all(promises);
        console.log('Todos os servidores estão conectados');
    } else if (typeof param === 'string') { // enviar mensagem
        return new Promise(async (resolve) => {
            const socket = activeSockets.has(param) ? activeSockets.get(param) : new _WebS(param)
            let tentativas = 0, maxTentativas = 10;
            while (tentativas < maxTentativas) {
                if (socket.readyState === _WebS.OPEN) {
                    let messageNew = typeof message === 'object' ? JSON.stringify(message) : message
                    const retRegex = regex({ 'pattern': '"retInf":"(.*?)"', 'text': messageNew })
                    const awaitRet = retRegex.res ? retRegex.res['1'] : false
                    socket.send(messageNew);
                    if (!activeSockets.get(param)) {
                        console.log('CONECTADO [NAO]: mensagem enviada')
                    } else {
                        console.log('CONECTADO [SIM]: mensagem enviada')
                    }
                    if (!awaitRet) {
                        if (!activeSockets.get(param)) {
                            socket.close()
                        }
                        resolve(false)
                    } else {
                        console.log('aguardando nova mensagem')
                        let timer;
                        socket.onmessage = function (event) {
                            if (event.data.includes(awaitRet)) {
                                if (!activeSockets.get(param)) {
                                    console.log('CONECTADO [NAO]: mensagem recebida')
                                } else {
                                    console.log('CONECTADO [SIM]: mensagem recebida')
                                }
                                clearTimeout(timer);
                                if (!activeSockets.get(param)) {
                                    socket.close()
                                }
                                resolve(event.data.replace('[ENC]', '[ENC-OK]'))
                            }
                        };
                        timer = setTimeout(() => {
                            if (!activeSockets.get(param)) {
                                console.log('CONECTADO [NAO]: mensagem expirou')
                            } else {
                                console.log('CONECTADO [SIM]: mensagem expirou')
                            }
                            if (!activeSockets.get(param)) {
                                socket.close()
                            }
                            resolve(false)
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


if (typeof window !== 'undefined') { // CHROME
    window['wsConnect'] = wsConnect;
    window['wsList'] = wsList;
    window['wsSend'] = wsSend;
} else { // NODEJS
    global['wsConnect'] = wsConnect;
    global['wsList'] = wsList;
    global['wsSend'] = wsSend;
}




























// async function wsConnect(inf) {
//     await import('./@functions.js');
//     let ret = { 'ret': false };
//     try {
//         async function logWs(inf) { // NODEJS
//             if (typeof window == 'undefined') {
//                 await log({ 'folder': 'JavaScript', 'path': `log.txt`, 'text': inf })
//             }
//         }
//         await logWs('ONSTART NODEJS: START'); const urls = inf; const listeners = {};
//         const createWebSocket = (url) => {
//             const ws = new _WebS(url); ws.onerror = (e) => { };
//             ws.onopen = async () => {
//                 let msgLog = `WS OK:\n${url}`; console.log(msgLog); await logWs(msgLog);
//             }
//             ws.onmessage = (event) => {
//                 const listener = listeners[url]; if (listener && typeof listener === 'function') { listener(event.data) }
//             }
//             ws.onclose = async () => {
//                 let msgLog = `WS RECONEXAO EM 5 SEGUNDOS:\n${url}`;
//                 console.log(msgLog); await logWs(msgLog);
//                 await new Promise(resolve => setTimeout(resolve, (5000)));
//                 createWebSocket(url)
//             }
//             return ws;
//         };
//         const webSockets = urls.map(createWebSocket);
//         const wsSend = (url, message) => {
//             message = typeof message === 'object' ? JSON.stringify(message) : message
//             const ws = webSockets.find(ws => ws.url === url);
//             if (ws) {
//                 ws.send(message)
//             } else {
//                 const ws = new _WebS(url);
//                 ws.onopen = async () => { ws.send(message); ws.close() }
//             }
//         };
//         const wsList = (url, listener) => { listeners[url] = listener };
//         if (typeof window !== 'undefined') { // CHROME
//             window['wsSend'] = wsSend; window['wsList'] = wsList;
//         } else { // NODEJS
//             global['wsSend'] = wsSend; global['wsList'] = wsList;
//         }

//         ret['ret'] = true;
//         ret['res'] = `WSCONNECT: OK`;
//     } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res };
//     if (!ret.ret) { console.log(ret.msg) }; return ret
// }

// if (typeof window !== 'undefined') { // CHROME
//     window['wsConnect'] = wsConnect;
// } else { // NODEJS
//     global['wsConnect'] = wsConnect;
// }
