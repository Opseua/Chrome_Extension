let wsServers = { 'rooms': {} }, reconnecting = {}, timeoutSecConnect = {}, secConnect = globalWindow.secConnect, servers

let e = import.meta.url, ee = e;
async function client(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        let errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
    try {
        // ### CONEXÃO

        function connect(inf) {
            let { hostRoom } = inf; let ws = new _WebSocket(`ws://${hostRoom}`)
            let url = ws._url ? ws._url : ws.url; let host = url.replace('ws://', '').split('/')[0]; let room = url.split(`${host}/`)[1].replace('?roo=', '')
            let locWeb = host.includes('127.0.0') ? `[LOC]` : `[WEB]`; ws['host'] = host; ws['room'] = room; ws['hostRoom'] = hostRoom; ws['locWeb'] = locWeb; ws['method'] = 'WEBSOCKET';

            // # ON OPEN
            ws.onopen = async () => {
                // LIMPAR TIMEOUT DE CONEXÃO | SALA [ADICIONAR] | ENVIAR PING DE INÍCIO DE CONEXÃO
                clearTimeout(timeoutSecConnect[hostRoom]); if (!wsServers.rooms[hostRoom]) { wsServers.rooms[hostRoom] = new Set() }; wsServers.rooms[hostRoom].add(ws); ws.send(`ping`)
                logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `OK: ${locWeb} '${room}'` });

                // LISTENER PARA RETORNAR O 'ws' QUANDO 'messageSend' FOR CHAMADA EM OUTROS ARQUIVOS (SOMENTE NO CLIENT!!!)
                listenerMonitorar(`getWs_${locWeb}`, async (/*nomeList, inf*/) => { return ws });

                // LISTENER PARA ENVIAR MENSAGEM DE OUTROS ARQUIVOS (FORA DO WebSocket!!!)
                listenerMonitorar(`messageSendOrigin_${hostRoom}`, async (nomeList, inf) => {
                    let { destination, message, secondsAwait } = inf;
                    let retMessageSend = await messageSend({ 'destination': destination, 'messageId': true, 'message': message, 'resWs': ws, 'secondsAwait': secondsAwait, }); return retMessageSend
                });
            };

            // # ON MESSAGE
            ws.onmessage = async (data) => {
                let message = data.data.toString('utf-8'); let pingPong = message == `${globalWindow.par6}` ? 1 : message == `${globalWindow.par7}` ? 2 : 0
                // ÚLTIMA MENSAGEM RECEBIDA
                ws['lastMessage'] = ws.lastMessage || pingPong > 0 ? Number(dateHour().res.tim) : false
                // logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `← CLI | ${ws.lastMessage} | ${hostRoom}` });
                if (pingPong > 0) {
                    if (pingPong == 2) { return } // RECEBIDO: 'PING' ENVIAR 'PONG'
                    ws.send('pong'); // logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `RECEBEU PING ${locWeb} '${room}'` });
                } else { // RECEBIDO: OUTRA MENSAGEM
                    try { message = JSON.parse(message) } catch (catchErr) { message = { 'message': message } }; if (!message.message) { message = { 'message': message } }
                    if (ws.lastMessage) { ws.send(`pong`) }; messageReceived({ ...message, 'host': host, 'room': room, 'resWs': ws, 'locWeb': locWeb, });
                }
            };

            // # ON ERROR/CLOSE | TEMPO MÁXIMO DE CONEXÃO
            ws.onerror = () => { clearTimeoutReconnect('error') }; ws.onclose = () => { clearTimeoutReconnect('close') };
            function clearTimeoutReconnect(inf) { clearTimeout(timeoutSecConnect[hostRoom]); reconnect({ 'host': host, 'room': room, 'hostRoom': hostRoom, 'resWs': ws, 'event': inf }) }
            timeoutSecConnect[hostRoom] = setTimeout(() => { ws.close() }, secConnect * 1000);
        }

        // ------------------------------------------------------------------------------------------------------------------------------------------------------------------

        // ### RECONEXÃO | REMOVER SERVIDOR
        function reconnect(inf) {
            let { host, room, hostRoom, resWs, event } = inf; let locWeb = host.includes('127.0.0') ? `[LOC]` : `[WEB]`; if (!reconnecting[hostRoom]) {
                reconnecting[hostRoom] = true; let secReconnect = globalWindow.secReconnect - secConnect + 1
                removeSerCli({ 'host': host, 'room': room, 'hostRoom': hostRoom, 'resWs': resWs, 'write': true, msg: `RECONECTANDO ${event}: ${locWeb} ${room}` }) // ↓ MENOS SEGUNDOS DO TEMPO DE CONEXÃO
                setTimeout(() => { reconnecting[hostRoom] = false; connect({ 'hostRoom': hostRoom }); }, (secReconnect * 1000) - 50);
            }
        }; function removeSerCli(inf) {
            let { host, room, hostRoom, resWs, msg, write } = inf; logConsole({ 'e': e, 'ee': ee, 'write': write, 'msg': msg }); if (wsServers.rooms[hostRoom]) {
                wsServers.rooms[hostRoom].delete(resWs); if (wsServers.rooms[hostRoom].size == 0) { delete wsServers.rooms[hostRoom] }
            }
        }

        // SERVIDORES: CONECTAR E LISTENER DE MENSAGENS RECEBIDAS → GET [WEB] | GET [LOC]
        servers = [globalWindow.devGet[0], globalWindow.devGet[1],]; servers.forEach((hostRoom) => connect({ 'hostRoom': hostRoom }));
        listenerMonitorar(servers[0], async (nomeList, param1) => { runLis({ 'nomeList': nomeList, 'param1': param1 }) });
        listenerMonitorar(servers[1], async (nomeList, param1) => { runLis({ 'nomeList': nomeList, 'param1': param1 }) });

        async function runLis(inf) {
            let { nomeList } = inf, { messageId, message, resWs, origin, host, room } = inf.param1
            // logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `LIS: ${nomeList} | HOST: ${host} | ROOM: ${room} | ${messageId}\nORIGEM: ${origin} | MES:\n${message.length > 50000 ? 'MUITO GRANDE' : message}` });

            // FUN | OTHER | MENSAGEM NÃO IDENTIFICADA
            let data = {}; try { data = JSON.parse(message) } catch (catchErr) { }; if (data.fun) {
                devFun({ 'e': e, 'data': data, 'messageId': messageId, 'resWs': resWs, 'destination': origin, })
            } else if (data.other) {
                logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `OTHER\n${JSON.stringify(data.other)}` });
            } else {
                logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `MENSAGEM DO WEBSCKET\n\n${message}` });
            }
        }

        // LOOP: CHECAR ÚLTIMA MENSAGEM
        let secPing = globalWindow.secPing; function lastMessageReceived() {
            for (const clientSet of Object.values(wsServers.rooms)) {
                for (const value of clientSet) {
                    function check(inf) { let { lastMessage, locWeb, room } = inf; return { 'dif': lastMessage ? Number(dateHour().res.tim) - lastMessage : -99, 'locWeb': locWeb, 'room': room } };
                    let retCheck = check(value); if (retCheck.dif > (secPing - 1)) {
                        // logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `MENSAGEM ANTIGA → ENVIAR 'PING' ${retCheck.locWeb} '${retCheck.room}'` });
                        value.send('ping'); setTimeout(() => {
                            retCheck = check(value); if (retCheck.dif > (secPing - 1)) {
                                logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `DESCONECTAR [PING ${retCheck.dif}] ${retCheck.locWeb} '${retCheck.room}'` }); value.close()
                            }
                        }, globalWindow.secPingTimeout * 1000);
                    }
                }
            };
        }; setInterval(() => { lastMessageReceived() }, (secPing) * 1000);

        ret['ret'] = true
        ret['msg'] = 'CLIENT: OK'
    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, 'catchGlobal': false });
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
    window['client'] = client;
} else { // NODEJS
    global['client'] = client;
}

