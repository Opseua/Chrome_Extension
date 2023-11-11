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

if (dev) { if (!window.all) { await import('./@functions.js') } } // CHROME
else { if (!global.all) { await import('./@functions.js') } } // NODEJS

async function wsConnect(inf) { return await ws(inf); }
async function wsSend(parametro, message) { return await ws(parametro, message); }
const listeners = {};
function wsList(nomeList, callback) {
    if (!listeners[nomeList]) { listeners[nomeList] = []; } listeners[nomeList].push(callback);
}
function acionarListener(nomeList, par1, par2) {
    if (listeners[nomeList]) { listeners[nomeList].forEach(async (callback) => { await callback(nomeList, par1, par2); }); }
}
async function logWs(inf) { // NODEJS
    if (!dev) { await log({ 'folder': 'JavaScript', 'path': `log.txt`, 'text': inf }) }
}
const activeSockets = new Map();
async function ws(param, message) {
    if (activeSockets.size == 0) { await logWs('ONSTART NODEJS: START') }
    async function connectToServer(server) {
        return new Promise(resolve => {
            const webSocket = new _WebS(server);
            webSocket.onopen = async (event) => {
                let msgLog = `WS OK:\n${server}`;
                console.log(msgLog.replace('\n', '').replace('ws://', ' ')); await logWs(msgLog);
                activeSockets.set(server, webSocket); resolve('');
            }
            webSocket.onmessage = (event) => {
                acionarListener(server, event.data);  // console.log('EVENTO, MENSAGEM RECEBIDA:', server);
            }
            webSocket.onclose = async (event) => {
                activeSockets.delete(server);
                let msgLog = `WS RECONEXAO EM 5 SEGUNDOS:\n${server}`;
                console.log(msgLog.replace('\n', '').replace('ws://', ' ')); await logWs(msgLog);
                setTimeout(() => { connectToServer(server); }, 5000);
            }
            webSocket.onerror = async (event) => {
                let msgLog = `WS ERROR:\n${server}`;
                // console.log(msgLog.replace('\n', '').replace('ws://', ' ')); await logWs(msgLog);
            };
        });
    }
    if (Array.isArray(param)) { // conectar servidores
        const promises = param.map(server => new Promise(resolve => {
            if (!activeSockets.has(server)) {
                connectToServer(server).then(() => { resolve(''); });
            } else {
                resolve('');
            }
        }));
        await Promise.all(promises);
        let time = dateHour().res; console.log('wsConnect', `${time.day}/${time.mon} ${time.hou}:${time.min}:${time.sec}`);
        // let msgLog = `WS CONECTADO(s): ${param.length}`;
        // console.log(msgLog); await logWs(msgLog);
    } else if (typeof param === 'string') { // enviar mensagem
        return new Promise(async (resolve) => {
            const webSocket = activeSockets.has(param) ? activeSockets.get(param) : new _WebS(param)
            let tentativas = 0, maxTentativas = 10;
            while (tentativas < maxTentativas) {
                if (webSocket.readyState === _WebS.OPEN) {
                    let messageNew = typeof message === 'object' ? JSON.stringify(message) : message
                    const retRegex = regex({ 'pattern': '"retInf":"(.*?)"', 'text': messageNew })
                    const awaitRet = retRegex.res ? retRegex.res['1'] : false
                    webSocket.send(messageNew);
                    if (!activeSockets.get(param)) {
                        // console.log('CONECTADO [NAO]: mensagem enviada')
                    } else {
                        // console.log('CONECTADO [SIM]: mensagem enviada')
                    }
                    if (!awaitRet) {
                        if (!activeSockets.get(param)) {
                            webSocket.close()
                        }
                        resolve(false)
                    } else {
                        console.log('aguardando nova mensagem');
                        let timer;
                        webSocket.onmessage = function (event) {
                            if (event.data.includes(awaitRet)) {
                                if (!activeSockets.get(param)) {
                                    console.log('CONECTADO [NAO]: mensagem recebida')
                                } else {
                                    console.log('CONECTADO [SIM]: mensagem recebida')
                                }
                                clearTimeout(timer);
                                if (!activeSockets.get(param)) {
                                    webSocket.close()
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
                            if (!activeSockets.get(param)) { webSocket.close() }
                            resolve(false)
                        }, 20000);
                    }
                    return;
                } else {
                    await new Promise(resolve => setTimeout(resolve, 500)); tentativas++;
                }
            }
            resolve(false)
        })
    }
}

if (dev) { // CHROME
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




























// async function wsConnect(inf) {
//     await import('./@functions.js');
//     let ret = { 'ret': false };
//     try {
//         async function logWs(inf) { // NODEJS
//             if (!dev) {
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
//         if (dev) { // CHROME
//             window['wsSend'] = wsSend; window['wsList'] = wsList;
//         } else { // NODEJS
//             global['wsSend'] = wsSend; global['wsList'] = wsList;
//         }

//         ret['ret'] = true;
//         ret['res'] = `WSCONNECT: OK`;
//     } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; return ret
// }

// if (dev) { // CHROME
//     window['wsConnect'] = wsConnect;
// } else { // NODEJS
//     global['wsConnect'] = wsConnect;
// }
