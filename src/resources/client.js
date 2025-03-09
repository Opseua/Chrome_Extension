let e = import.meta.url, ee = e; let libs = ['WebSocket',]; let wsServers = { 'rooms': {}, }, reconnecting = {}, timSecCon = {}, secConnect = gW.secConnect;
async function client(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
         /* IMPORTAR BIBLIOTECA [NODEJS] */ if (libs.length > 0) { libs = await importLibs(libs, [{ 'm': 'ws', 'l': ['WebSocket',], },]); } // OK

        // ### CONEXÃO
        function connect(inf = {}) {
            let { hostRoom, } = inf; let ws = new _WebSocket(`ws://${hostRoom}`); let url = ws._url || ws.url; let host = url.replace('ws://', '').split('/')[0]; let room = url.split(`${host}/`)[1].replace('?roo=', '');
            let locWeb = host.includes('127.0.0') ? `[LOC]` : `[WEB]`; ws['host'] = host; ws['room'] = room; ws['hostRoom'] = hostRoom; ws['locWeb'] = locWeb; ws['method'] = 'WEBSOCKET';
            function clearTimRec(event) { clearTimeout(timSecCon[hostRoom]); if (event) { setTimeout(() => { reconnect({ host, room, hostRoom, 'resWs': ws, event, }); }, 1000); } }

            // # ON OPEN
            ws.onopen = async () => {
                // LIMPAR TIMEOUT DE CONEXÃO | SALA [ADICIONAR] | ENVIAR PING DE INÍCIO DE CONEXÃO
                clearTimRec(false); if (!wsServers.rooms[hostRoom]) { wsServers.rooms[hostRoom] = new Set(); } wsServers.rooms[hostRoom].add(ws); logConsole({ e, ee, 'msg': `${locWeb} OK:\n'${room}'`, });

                // LISTENER PARA RETORNAR O 'ws'
                function getWs(inf = {}) { let { hostRoom, } = inf; if (wsServers.rooms[hostRoom]) { for (let ws of wsServers.rooms[hostRoom]) { if (ws.hostRoom === hostRoom) { return ws; } } } return null; }
                ws.send(`ping`); listenerMonitorar(`getWs_${locWeb}`, async (/*nomeList, inf*/) => { return getWs({ hostRoom, }); });
            };

            // # ON MESSAGE
            ws.onmessage = async (data) => {
                let message = data.data.toString('utf-8'); let pingPong = message === `ping` ? 1 : message === `pong` ? 2 : 0;
                // ÚLTIMA MENSAGEM RECEBIDA
                ws['lastMessage'] = ws.lastMessage || pingPong > 0 ? Number(dateHour().res.tim) : false; // logConsole({ e, ee, 'msg': `← CLI | ${ws.lastMessage} | ${hostRoom}` });
                if (pingPong > 0) { // RECEBIDO: 'PING' ENVIAR 'PONG'
                    if (pingPong === 2) { return; } ws.send('pong'); // logConsole({ e, ee, 'msg': `RECEBEU PING ${locWeb} '${room}'` });
                } else { // RECEBIDO: OUTRA MENSAGEM
                    try { message = JSON.parse(message); } catch (catchErr) { message = { message, }; } if (!message.message) { message = { message, }; }
                    if (ws.lastMessage) { ws.send(`pong`); } messageReceived({ ...message, host, room, 'resWs': ws, locWeb, });
                }
            };

            // # ON ERROR/CLOSE | TEMPO MÁXIMO DE CONEXÃO | LIMPAR TIMEOUT DE CONEXÃO
            ws.onerror = () => { clearTimRec('error'); }; ws.onclose = () => { clearTimRec('close'); }; let c = () => ws.close(); timSecCon[hostRoom] = setTimeout(() => { c(); }, secConnect * 1000);
        }

        // ------------------------------------------------------------------------------------------------------------------------------------------------------------------

        // ### RECONEXÃO | REMOVER SERVIDOR
        function reconnect(inf = {}) {
            let { host, room, hostRoom, resWs, event, } = inf; let locWeb = host.includes('127.0.0') ? `[LOC]` : `[WEB]`; if (!reconnecting[hostRoom]) {
                reconnecting[hostRoom] = true; let secReconnect = gW.secReconnect - secConnect + 1; removeSerCli({ hostRoom, resWs, msg: `${locWeb} RECONECTADO ${event}:\n${room}`, });
                setTimeout(() => { reconnecting[hostRoom] = false; connect({ hostRoom, }); }, (secReconnect * 1000) - 50); // ← MENOS SEGUNDOS DO TEMPO DE CONEXÃO
            }
        } function removeSerCli(inf = {}) {
            let { hostRoom, resWs, msg, } = inf; logConsole({ e, ee, msg, });
            if (wsServers.rooms[hostRoom]) { wsServers.rooms[hostRoom].delete(resWs); if (wsServers.rooms[hostRoom].size === 0) { delete wsServers.rooms[hostRoom]; } }
        }

        // SERVIDORES: CONECTAR E LISTENER DE MENSAGENS RECEBIDAS → GET [WEB] | GET [LOC]
        let servers = [gW.devGet[0], gW.devGet[1],]; for (let [index, value,] of servers.entries()) {
            if (!value.includes('127.0.0.1') && (gW.project === 'Sniffer_Python' || (!value.includes('USUARIO_0') && value.includes('USUARIO_')))) {
                // NÃO CONECTAR AO WEBSOCKET
            } else { connect({ 'hostRoom': value, }); listenerMonitorar(value, async (nomeList, param1) => { runLis({ nomeList, param1, }); }); }
        }

        async function runLis(inf = {}) {
            let { nomeList, param1, } = inf, { messageId, message, resWs, origin, host, room, } = param1; // FUN | OTHER | MENSAGEM NÃO IDENTIFICADA
            // logConsole({ e, ee, 'msg': `LIS: ${nomeList} | HOST: ${host} | ROOM: ${room} | ${messageId}\nORIGEM: ${origin} | MES:\n${message.length > 50000 ? 'MUITO GRANDE' : message}` });
            let data = {}; try { data = JSON.parse(message); } catch (catchErr) { } if (data.fun) { devFun({ e, data, messageId, resWs, 'destination': origin, }); }
            else if (data.other) { logConsole({ e, ee, 'msg': `OTHER\n${JSON.stringify(data.other)}`, }); }
        }

        // LOOP: CHECAR ÚLTIMA MENSAGEM
        let secPing = gW.secPing; function lastMessageReceived() {
            for (let clientSet of Object.values(wsServers.rooms)) {
                for (let v of clientSet) {
                    function check(inf = {}) { let { lastMessage, locWeb, room, } = inf; return { 'dif': lastMessage ? Number(dateHour().res.tim) - lastMessage : -99, locWeb, room, }; }
                    let retCheck = check(v); if (retCheck.dif > (secPing - 1)) {
                        // logConsole({ e, ee, 'msg': `MENSAGEM ANTIGA → ENVIAR 'PING' ${retCheck.locWeb} '${retCheck.room}'` });
                        v.send('ping'); setTimeout(() => {
                            retCheck = check(v); if (retCheck.dif > (secPing - 1)) { logConsole({ e, ee, 'msg': `DESCONECTAR [PING ${retCheck.dif}] ${retCheck.locWeb} '${retCheck.room}'`, }); v.close(); }
                        }, gW.secPingTimeout * 1000);
                    }
                }
            }
        } setInterval(() => { lastMessageReceived(); }, (secPing) * 1000);

        ret['ret'] = true;
        ret['msg'] = 'CLIENT: OK';
    } catch (catchErr) {
        let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    }
    if (!ret.ret) {
        if (eng) { // CHROME
            configStorage({ e, 'action': 'del', 'key': 'webSocket', });
        } else { // NODEJS
            log({ e, 'folder': 'JavaScript', 'path': `log.txt`, 'text': `SERVER NODEJS: ${ret.msg}`, });
        }
    }
}

// CHROME | NODEJS
globalThis['client'] = client;


