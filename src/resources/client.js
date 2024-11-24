let wsServers = { 'rooms': {} }, reconnecting = {}, timeoutSecConnect = {}, secConnect = gW.secConnect

let e = import.meta.url, ee = e;
async function client(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        if (typeof _WebSocket === 'undefined') { await funLibrary({ 'lib': '_WebSocket' }); };

        // ### CONEXÃO
        function connect(inf = {}) {
            let { hostRoom, } = inf; let ws = new _WebSocket(`ws://${hostRoom}`); let url = ws._url ? ws._url : ws.url; let host = url.replace('ws://', '').split('/')[0]; let room = url.split(`${host}/`)[1].replace('?roo=', '')
            let locWeb = host.includes('127.0.0') ? `[LOC]` : `[WEB]`; ws['host'] = host; ws['room'] = room; ws['hostRoom'] = hostRoom; ws['locWeb'] = locWeb; ws['method'] = 'WEBSOCKET';

            // # ON OPEN
            ws.onopen = async () => {
                // LIMPAR TIMEOUT DE CONEXÃO | SALA [ADICIONAR] | ENVIAR PING DE INÍCIO DE CONEXÃO
                clearTimeout(timeoutSecConnect[hostRoom]); if (!wsServers.rooms[hostRoom]) { wsServers.rooms[hostRoom] = new Set() }; wsServers.rooms[hostRoom].add(ws); ws.send(`ping`)
                logConsole({ e, ee, 'write': true, 'msg': `${locWeb} OK:\n'${room}'` });

                // LISTENER PARA RETORNAR O 'ws' QUANDO 'messageSend' FOR CHAMADA EM OUTROS ARQUIVOS (SOMENTE NO CLIENT!!!)
                function getWs(inf = {}) { let { hostRoom, } = inf; if (wsServers.rooms[hostRoom]) { for (let ws of wsServers.rooms[hostRoom]) { if (ws.hostRoom === hostRoom) { return ws; } } }; return null; }
                listenerMonitorar(`getWs_${locWeb}`, async (/*nomeList, inf*/) => { return getWs({ 'hostRoom': hostRoom }) });

                // LISTENER PARA ENVIAR MENSAGEM DE OUTROS ARQUIVOS (FORA DO WebSocket!!!)
                listenerMonitorar(`messageSendOrigin_${hostRoom}`, async (nomeList, inf) => {
                    let { destination, message, secondsAwait } = inf;
                    let retMessageSend = await messageSend({ 'destination': destination, 'messageId': true, 'message': message, 'resWs': ws, 'secondsAwait': secondsAwait, }); return retMessageSend
                });
            };

            // # ON MESSAGE
            ws.onmessage = async (data) => {
                let message = data.data.toString('utf-8'); let pingPong = message == `${gW.par6}` ? 1 : message == `${gW.par7}` ? 2 : 0
                // ÚLTIMA MENSAGEM RECEBIDA
                ws['lastMessage'] = ws.lastMessage || pingPong > 0 ? Number(dateHour().res.tim) : false;
                // logConsole({ e, ee, 'write': true, 'msg': `← CLI | ${ws.lastMessage} | ${hostRoom}` });
                if (pingPong > 0) { // RECEBIDO: 'PING' ENVIAR 'PONG'
                    if (pingPong == 2) { return }; ws.send('pong'); // logConsole({ e, ee, 'write': true, 'msg': `RECEBEU PING ${locWeb} '${room}'` });
                } else { // RECEBIDO: OUTRA MENSAGEM
                    try { message = JSON.parse(message) } catch (catchErr) { message = { 'message': message }; esLintIgnore = catchErr; }; if (!message.message) { message = { 'message': message } }
                    if (ws.lastMessage) { ws.send(`pong`) }; messageReceived({ ...message, 'host': host, 'room': room, 'resWs': ws, 'locWeb': locWeb, });
                }
            };

            // # ON ERROR/CLOSE | TEMPO MÁXIMO DE CONEXÃO
            ws.onerror = () => { clearTimeoutReconnect('error') }; ws.onclose = () => { clearTimeoutReconnect('close') };
            function clearTimeoutReconnect(inf = {}) { clearTimeout(timeoutSecConnect[hostRoom]); reconnect({ 'host': host, 'room': room, 'hostRoom': hostRoom, 'resWs': ws, 'event': inf }) }
            timeoutSecConnect[hostRoom] = setTimeout(() => { ws.close() }, secConnect * 1000);
        }

        // ------------------------------------------------------------------------------------------------------------------------------------------------------------------

        // ### RECONEXÃO | REMOVER SERVIDOR
        function reconnect(inf = {}) {
            let { host, room, hostRoom, resWs, event, } = inf; let locWeb = host.includes('127.0.0') ? `[LOC]` : `[WEB]`; if (!reconnecting[hostRoom]) {
                reconnecting[hostRoom] = true; let secReconnect = gW.secReconnect - secConnect + 1
                removeSerCli({ 'host': host, 'room': room, 'hostRoom': hostRoom, 'resWs': resWs, 'write': true, msg: `${locWeb} RECONECTADO ${event}:\n${room}` }) // ↓ MENOS SEGUNDOS DO TEMPO DE CONEXÃO
                setTimeout(() => { reconnecting[hostRoom] = false; connect({ 'hostRoom': hostRoom }); }, (secReconnect * 1000) - 50);
            }
        }; function removeSerCli(inf = {}) {
            let { host, room, hostRoom, resWs, msg, write, } = inf; logConsole({ e, ee, 'write': write, 'msg': msg }); if (wsServers.rooms[hostRoom]) {
                wsServers.rooms[hostRoom].delete(resWs); if (wsServers.rooms[hostRoom].size == 0) { delete wsServers.rooms[hostRoom] }
            }
        }

        // SERVIDORES: CONECTAR E LISTENER DE MENSAGENS RECEBIDAS → GET [WEB] | GET [LOC]
        let servers = [gW.devGet[0], gW.devGet[1],]; for (let [index, value] of servers.entries()) {
            if (!value.includes('127.0.0.1') && (gW.project == 'Sniffer_Python' || (!value.includes('USUARIO_0') && value.includes('USUARIO_')))) {
                // NÃO CONECTAR AO WEBSOCKET
            } else { connect({ 'hostRoom': value }); listenerMonitorar(value, async (nomeList, param1) => { runLis({ 'nomeList': nomeList, 'param1': param1 }) }) }
        };

        async function runLis(inf = {}) {
            let { nomeList, param1, } = inf, { messageId, message, resWs, origin, host, room } = param1
            // logConsole({ e, ee, 'write': true, 'msg': `LIS: ${nomeList} | HOST: ${host} | ROOM: ${room} | ${messageId}\nORIGEM: ${origin} | MES:\n${message.length > 50000 ? 'MUITO GRANDE' : message}` });

            // FUN | OTHER | MENSAGEM NÃO IDENTIFICADA
            let data = {}; try { data = JSON.parse(message) } catch (catchErr) { esLintIgnore = catchErr; }; if (data.fun) {
                devFun({ e, 'data': data, 'messageId': messageId, 'resWs': resWs, 'destination': origin, })
            } else if (data.other) { logConsole({ e, ee, 'write': true, 'msg': `OTHER\n${JSON.stringify(data.other)}` }); }
        }

        // LOOP: CHECAR ÚLTIMA MENSAGEM
        let secPing = gW.secPing; function lastMessageReceived() {
            for (let clientSet of Object.values(wsServers.rooms)) {
                for (let value of clientSet) {
                    function check(inf = {}) { let { lastMessage, locWeb, room, } = inf; return { 'dif': lastMessage ? Number(dateHour().res.tim) - lastMessage : -99, 'locWeb': locWeb, 'room': room } };
                    let retCheck = check(value); if (retCheck.dif > (secPing - 1)) {
                        // logConsole({ e, ee, 'write': true, 'msg': `MENSAGEM ANTIGA → ENVIAR 'PING' ${retCheck.locWeb} '${retCheck.room}'` });
                        value.send('ping'); setTimeout(() => {
                            retCheck = check(value); if (retCheck.dif > (secPing - 1)) {
                                logConsole({ e, ee, 'write': true, 'msg': `DESCONECTAR [PING ${retCheck.dif}] ${retCheck.locWeb} '${retCheck.room}'` }); value.close()
                            }
                        }, gW.secPingTimeout * 1000);
                    }
                }
            };
        }; setInterval(() => { lastMessageReceived() }, (secPing) * 1000);

        ret['ret'] = true
        ret['msg'] = 'CLIENT: OK'
    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    };
    if (!ret.ret) {
        if (eng) { // CHROME
            configStorage({ e, 'action': 'del', 'key': 'webSocket' })
        } else { // NODEJS
            log({ e, 'folder': 'JavaScript', 'path': `log.txt`, 'text': `SERVER NODEJS: ${ret.msg}` })
        }
    }
};

// CHROME | NODEJS
(eng ? window : global)['client'] = client;
