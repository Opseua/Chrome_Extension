let e = import.meta.url, ee = e;
let mensagensPartesRecebida = {}
async function messageReceived(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    let messageId = inf.messageId === true || !inf.messageId ? `ID_${new Date().getTime()}_${Math.random().toString(36).substring(2, 5)}_messageId` : inf.messageId
    let partesRestantes = inf.partesRestantes > -99 ? inf.partesRestantes : 0
    let message = typeof inf.message === 'object' ? JSON.stringify(inf.message) : inf.message
    let buffer = inf.buffer ? inf.buffer : false
    let { host, room, resWs, wsClients } = inf
    let origin = inf.origin ? inf.origin.replace('ws://', '') : `${host}/?roo=${room}`;
    let destination = inf.destination ? inf.destination.replace('ws://', '') : 'x', isSerCli = wsClients ? 'isSer' : 'isCli'

    // LOOP: APAGAR PARTE ANTIGAS DAS MENSAGENS
    if (Object.keys(mensagensPartesRecebida).length == 0) {
        let mensagensPartesRecebida = {}; setInterval(() => {
            let currentTime = new Date().getTime(); for (let messageId in mensagensPartesRecebida) {
                if ((currentTime - Number(messageId.split('_')[1])) > globalWindow.minClearPartsMessages * 60000) { delete mensagensPartesRecebida[messageId]; }
            }
        }, globalWindow.minClearPartsMessages * 60000);
    }

    if (isSerCli == 'isSer') {
        // ### RECEBIDO NO SERVER
        let wsClientsToSend = [], erroType = 0; let wsClientsArrRoom = []
        for (let room in wsClients.rooms) {
            if (regex({ 'e': e, 'simple': true, 'pattern': destination, 'text': room }) && !JSON.stringify(wsClientsArrRoom).includes(room.split('/')[1])) {
                wsClientsArrRoom.push(room) // // 'wsClientsArrRoom' USADO PARA EVITAR QUE O CLIENTE CONECTADO NO 'LOC' E 'WEB' AO MESMO TEMPO RECEBA A MENSAGEM NOS DOIS
                wsClientsToSend = wsClientsToSend.concat(Array.from(wsClients.rooms[room]));
            }
        }
        erroType = wsClientsToSend.length == 0 ? `DESTINO INVÁLIDO` : (regex({ 'e': e, 'simple': true, 'pattern': destination, 'text': origin }) || origin == destination) ? `DESTINO IGUAL` : 0

        // ENVIAR: MENSAGEM STATUS → ORIGEM
        let messageOrigin = {
            'origin': 'SERVER',
            'destination': origin,
            'messageId': `${messageId}_SERVER_${partesRestantes}`,
            'buffer': false,
            'partesRestantes': 0,
            'message': { 'ret': !erroType, 'msg': !erroType ? `SEND [SERVER]: OK` : `${erroType} '${destination}'` }
        }
        resWs.send(JSON.stringify(messageOrigin))

        // ENVIAR: MENSAGEM REAL → DESTINO
        if (!erroType) {
            for (let [index, value] of wsClientsToSend.entries()) {
                try { message = JSON.parse(message) } catch (catchErr) { }
                let messageDestination = {
                    'origin': origin,
                    'destination': `${value.hostRoom}`,
                    'messageId': messageId,
                    'buffer': buffer,
                    'partesRestantes': partesRestantes,
                    'message': message
                }
                // logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `ENVIANDO MENSAGEM: [${index + 1}/${wsClientsToSend.length}] ${messageId} → ${messageDestination.destination}` });
                value.send(JSON.stringify(messageDestination))
                await new Promise(resolve => { setTimeout(resolve, 200) })
            }
        }
    } else {
        // ### RECEBIDO NO CLIENT
        if (!mensagensPartesRecebida[messageId]) { mensagensPartesRecebida[messageId] = { partes: [] }; }
        mensagensPartesRecebida[messageId].partes.push(message)
        if (partesRestantes == 0) {
            message = mensagensPartesRecebida[messageId].partes.join('');
            message = buffer ? eng ? atob(message) : Buffer.from(message, 'base64') : message
            let listName = 'x'
            if (messageId.includes(`SERVER`) || messageId.includes(`RET-OK`)) {
                // RECEBIDO: RETORNO DO SERVIDOR OU RESPOSTA SENDO AGUARDADA
                listName = `${messageId}`
            } else {
                // RECEBIDO: OUTRA MENSAGEM → PROCESSAR E CHAMAR A FUNÇÃO
                listName = `${destination}`
            }

            // ACIONAR LISTENER
            // logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `ACIONANDO LISTENER: '${listName}` });
            listenerAcionar(`${listName}`, { 'origin': origin, 'messageId': messageId, 'message': message, 'resWs': resWs, 'host': host, 'room': room })
        }

        // ---------------- TESTES
        // if (!messageId.includes(`SERVER`)) {
        //     logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `${messageId} | [${partesRestantes}] | ← TOTAL ${mensagensPartesRecebida[messageId].partes.join('').length}` });
        //     file({ 'e': e, 'action': 'write', 'functionLocal': false, 'path': `D:/z_CLIENTE_RECEBENDO_[${partesRestantes}]_.txt`, 'rewrite': false, 'text': inf.message });
        //     if (partesRestantes == 0) {
        //         if (buffer && eng) {
        //             let b = new Array(message.length); for (let i = 0; i < message.length; i++) { b[i] = message.charCodeAt(i); }; let l = new Blob([new Uint8Array(b)], { type: 'application/zip' });
        //             chrome.downloads.download({ url: URL.createObjectURL(l), filename: `D:/z_CLIENTE_RECEBENDO_[X]_COMPLETO.zip`, }, function () { });
        //         } else {
        //             file({ 'e': e, 'action': 'write', 'functionLocal': false, 'path': `D:/z_CLIENTE_RECEBENDO_[X]_COMPLETO.${buffer ? 'jpg' : 'txt'}`, 'rewrite': false, 'text': message });
        //         }
        //     }
        // }
        // ----------------
    }
};

// CHROME | NODEJS
(eng ? window : global)['messageReceived'] = messageReceived;