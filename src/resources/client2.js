let e = import.meta.url, ee = e

let wsServers = { 'rooms': {} }, reconnecting = {}, timeoutSecConnect = {}
async function client2(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        let errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
    try {
        // ### CONEXÃO
        function connect(inf) {
            let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
            let ws = new _WebSocket(`ws://${inf.hostRoom.replace('/?roo=', '/').replace('/', '/?roo=')}`)
            let url = ws._url ? ws._url : ws.url; let host = url.replace('ws://', '').split('/')[0]; let room = url.split(`${host}/`)[1].replace('?roo=', '')
            let locWeb = host.includes('127.0.0') ? `[LOC]` : `[WEB]`; ws['host'] = host; ws['room'] = room; ws['locWeb'] = locWeb; ws['method'] = 'WEBSOCKET';

            // # ON OPEN
            ws.onopen = async () => {
                // LIMPAR TIMEOUT DE CONEXÃO | SALA [ADICIONAR]
                clearTimeout(timeoutSecConnect[`${host}/${room}`]); logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `OK ${locWeb} '${room}'` });
                if (!wsServers.rooms[`${host}/${room}`]) { wsServers.rooms[`${host}/${room}`] = new Set() }; wsServers.rooms[`${host}/${room}`].add(ws); ws.send(globalWindow.par6)

                // LISTENER PARA ENVIAR MENSAGEM DE OUTROS ARQUIVOS (FORA DO WebSocket!!!)
                listenerMonitorar(`messageSendOrigin_${host}/${room}`, async (nomeList, inf) => {
                    let retMessageSend = await messageSend({ 'destination': inf.destination, 'message': inf.message, 'resWs': ws, 'secondsAwait': inf.secondsAwait, }); return retMessageSend
                });

                async function aaaa() {
                    await new Promise(resolve => { setTimeout(resolve, 5000) });
                    _fs.readFile('D:/1_ZIP_25MB.zip', async (err, data) => {
                        data = { "fun": [{ "securityPass": "passwordAqui", "retInf": true, "name": "commandLine", "par": { "command": "notepad", "awaitFinish": true } }] }
                        let retMessageSend = await messageSend({ 'destination': '127.0.0.1:1234/NAME', 'message': data, 'resWs': ws, 'secondsAwait': 0, });
                        logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `RESPOSTA SENDO ESPERADA:\n${JSON.stringify(retMessageSend)}` });
                    });
                }; // if (!eng) { aaaa() }
            };

            // # ON MESSAGE
            ws.onmessage = async (data) => {
                let message = data.data.toString('utf-8'), messageLowerCase = message.toLowerCase()
                // ÚLTIMA MENSAGEM RECEBIDA
                ws['lastMessage'] = Number(dateHour().res.tim);
                console.log(`CLI ← ${Date.now()}`)
                if (messageLowerCase == globalWindow.par7.toLowerCase()) {
                    // RECEBIDO: 'PONG' (não fazer nada)
                    // logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `RECEBEU PONG ${locWeb} '${room}'` });
                } else if (messageLowerCase == globalWindow.par6.toLowerCase()) {
                    // RECEBIDO: 'PING' → ENVIAR 'PONG'
                    ws.send(globalWindow.par7); // logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `RECEBEU PING ${locWeb} '${room}'` });
                } else {
                    try { message = JSON.parse(message) } catch (e) { message = { 'message': message } }; if (!message.message) { message = { 'message': message } }
                    // RECEBIDO: OUTRA MENSAGEM
                    messageReceived({ ...message, 'host': host, 'room': room, 'resWs': ws, 'locWeb': locWeb });
                }
            };

            // # ON ERROR/CLOSE | TEMPO MÁXIMO DE CONEXÃO
            ws.onerror = () => { clearTimeout(timeoutSecConnect[`${host}/${room}`]); reconnect({ 'host': host, 'room': room, 'resWs': ws, 'event': 'error' }) };
            ws.onclose = () => { clearTimeout(timeoutSecConnect[`${host}/${room}`]); reconnect({ 'host': host, 'room': room, 'resWs': ws, 'event': 'error' }) };
            timeoutSecConnect[`${host}/${room}`] = setTimeout(() => { ws.close(); }, globalWindow.secConnect * 1000);
        }

        // ------------------------------------------------------------------------------------------------------------------------------------------------------------------

        // ### RECONEXÃO | REMOVER SERVIDOR
        function reconnect(inf) {
            let { host, room, resWs, event } = inf; let locWeb = host.includes('127.0.0') ? `[LOC]` : `[WEB]`; if (!reconnecting[`${host}/${room}`]) {
                reconnecting[`${host}/${room}`] = true;
                removeSerCli({ 'host': host, 'room': room, 'resWs': resWs, 'write': true, msg: `RECONECTANDO ${event}: ${locWeb} ${room}` }) // ↓ MENOS 2 SEGUNDOS DO TEMPO DE CONEXÃO
                setTimeout(() => { reconnecting[`${host}/${room}`] = false; connect({ 'hostRoom': `${host}/${room}` }); }, (globalWindow.secReconnect - globalWindow.secConnect + 1) * 1000);
            }
        }; function removeSerCli(inf) {
            let { host, room, resWs, msg } = inf; logConsole({ 'e': e, 'ee': ee, 'write': inf.write, 'msg': msg }); if (wsServers.rooms[`${host}/${room}`]) {
                wsServers.rooms[`${host}/${room}`].delete(resWs); if (wsServers.rooms[`${host}/${room}`].size == 0) { delete wsServers.rooms[`${host}/${room}`] }
            }
        }

        // SERVIDORES: CONECTAR
        let dev2 = globalWindow.devGet[0], dev3 = '127.0.0.1:1234/NAME' // globalWindow.devGet[1]
        let servers = letter == 'D' ? [
            // ### NOTEBOOK
            // dev2, // → GET [WEB]
            dev3, // → GET [LOC]
        ] : [
            // ### EC2 | ESTRELAR
            dev2, // → GET [WEB]
            // dev3, // → GET [LOC]
        ]; servers.forEach((hostRoom) => connect({ 'hostRoom': hostRoom }));

        // LISTENER DE MENSAGENS RECEBIDAS [WEB] | [LOC]
        listenerMonitorar(dev2, async (nomeList, param1) => { runLis({ 'nomeList': nomeList, 'param1': param1 }) });
        listenerMonitorar(dev3, async (nomeList, param1) => { runLis({ 'nomeList': nomeList, 'param1': param1 }) });

        async function runLis(inf) {
            let { nomeList } = inf, { messageId, message, resWs, origin, host, room } = inf.param1
            // logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `LIS: ${nomeList} | HOST: ${host} | ROOM: ${room} | ${messageId}\nORIGEM: ${origin} | MES:\n${message.length > 50000 ? 'MUITO GRANDE' : message}` });

            let data = {}; try { data = JSON.parse(message) } catch (e) { }; if (data.fun) {
                // FUN
                devFun({ 'e': e, 'data': data, 'messageId': messageId, 'resWs': resWs, 'destination': origin, })
            } else if (data.other) {
                // OTHER
                logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `OTHER\n${JSON.stringify(data.other)}` });
            } else {
                // MENSAGEM NÃO IDENTIFICADA
                // logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `MENSAGEM DO WEBSCKET\n\n${message}` });
            }
        }

        // LOOP: CHECAR ÚLTIMA MENSAGEM
        // function lastMessageReceived(inf) {
        //     for (const clientSet of Object.values(wsServers.rooms)) {
        //         for (const value of clientSet) {
        //             function check(inf) { let { lastMessage, locWeb, room } = inf; return { 'dif': lastMessage ? Number(dateHour().res.tim) - lastMessage : -99, 'locWeb': locWeb, 'room': room } };
        //             let retCheck = check(value); if (retCheck.dif > (inf - 1)) {
        //                 logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `MENSAGEM ANTIGA → ENVIAR 'PING' ${retCheck.locWeb} '${retCheck.room}'` });
        //                 value.send(globalWindow.par6)
        //                 setTimeout(() => {
        //                     retCheck = check(value); if (retCheck.dif > (inf - 1)) {
        //                         logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `DESCONECTAR [PING ${retCheck.dif}] ${retCheck.locWeb} '${retCheck.room}'` });
        //                         value.close()
        //                     }
        //                 }, 4000);
        //             }
        //         }
        //     }
        // }; setInterval(() => { lastMessageReceived(globalWindow.secPing) }, (globalWindow.secPing * 1000));

        ret['ret'] = true
        ret['msg'] = 'CLIENT: OK'
    } catch (e) {
        let retRegexE = await regexE({ 'inf': inf, 'e': e, 'catchGlobal': false });
        ret['msg'] = retRegexE.res
    };
    if (!ret.ret) {
        if (eng) { // CHROME
            configStorage({ 'e': e, 'action': 'del', 'key': 'webSocket' })
        } else { // NODEJS
            log({ 'e': e, 'folder': 'JavaScript', 'path': `log.txt`, 'text': `SERVER NODEJS: ${ret.msg}` })
        }
    }
}

if (eng) { // CHROME
    window['client2'] = client2;
} else { // NODEJS
    global['client2'] = client2;
}

