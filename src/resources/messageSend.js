// // SOMENTE FORA DO WEBSOCKET!!! → 'WEB' PARA 'WEB  E  'LOC' PARA 'LOC'
// let message = { "fun": [{ "securityPass": globalWindow.securityPass, "retInf": true, "name": "notification", "par": { "duration": 3, "title": "TITULO", "text": "TEXTO", } }] };
// let retListenerAcionar = await listenerAcionar(`messageSendOrigin_127.0.0.1:1234/?roo=ORIGEM_AQUI`, { 'destination': `127.0.0.1:1234/?roo=DESTINO_AQUI`, 'message': message, 'secondsAwait': 0, });
// logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': JSON.stringify(retListenerAcionar) });

// // SOMENTE DENTRO DO WEBSOCKET!!!
// let infMessageSend, retMessageSend
// infMessageSend = { 'destination': '127.0.0.1:1234/DESTINO_AQUI', 'message': 'aaa', 'resWs': ws, 'secondsAwait': 0, }
// retMessageSend = await messageSend(infMessageSend); console.log(retMessageSend)

let e = import.meta.url, ee = e;
async function messageSend(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    try {
        let messageId = inf.messageId === true || !inf.messageId ? `ID_${new Date().getTime()}_${Math.random().toString(36).substring(2, 5)}_messageId` : inf.messageId.replace('_RET-TRUE', '_RET-OK')
        let message, buffer, chunkSize = globalWindow.kbPartsMessage * 1024 // globalWindow.kbPartsMessage * 1024
        if (typeof inf.message === 'object') {
            message = JSON.stringify(inf.message); buffer = message.includes(`"type":"Buffer"`) && message.includes(`"data":[`) && !message.includes(`"ret"`) ? true : false
            message = buffer ? Buffer.from(inf.message).toString('base64') : message;
        } else { buffer = false; message = inf.message }; let messageLength = message.length; let totalChunks = Math.ceil(messageLength / chunkSize);
        let secondsAwait = !message.includes('"retInf":true') ? 0 : inf.secondsAwait > 0 ? inf.secondsAwait : globalWindow.secRetWebSocket // → TEMPO PADRÃO SE NÃO FOR INFORMADO
        messageId = secondsAwait == 0 ? `${messageId}` : `${messageId}_RET-TRUE`; let { resWs, } = inf; let host = resWs.host, room = resWs.room;
        let destination = inf.destination ? inf.destination.replace('ws://', '') : 'x'; let origin = inf.origin ? inf.origin : `${host}/?roo=${room}`;

        // LISTENER DE RESPOSTA: DEFINIR (SE NECESSÁRIO)
        let retAwaitTimeout, listenerName;
        if (secondsAwait > 0) {
            listenerName = `${messageId.replace('_RET-TRUE', '_RET-OK')}`;
            retAwaitTimeout = awaitTimeout({ 'secondsAwait': secondsAwait, 'listenerName': listenerName });
        }

        // PREPARAR MENSAGEM: ÚNICA OU EM PARTES
        let messageParts = []; for (let i = 0; i < totalChunks; i++) {
            let start = i * chunkSize; let end = Math.min(start + chunkSize, messageLength); let chunk = message.slice(start, end); messageParts.push({
                'origin': origin, 'destination': destination, 'messageId': messageId, 'buffer': buffer,
                'partesRestantes': totalChunks - i - 1, 'secondsAwait': secondsAwait, 'message': chunk,
            })
            // ---------------- TESTES
            // logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `${messageId} | [${totalChunks - i - 1}] | → TOTAL ${JSON.stringify(messageParts).length} | DE ${start} ATÉ ${end}` });
            // ----------------
        };

        // ENVIAR MENSAGEM(s)
        enviarMensagem({ 'resWs': resWs, 'big': totalChunks == 1 ? false : true, 'message': messageParts });

        // LISTENER DE RESPOSTA: MONITORAR (SE NECESSÁRIO)
        if (secondsAwait > 0) {
            retAwaitTimeout = await retAwaitTimeout;
            retAwaitTimeout = retAwaitTimeout.ret ? retAwaitTimeout.res : retAwaitTimeout
            retAwaitTimeout = retAwaitTimeout.message ? JSON.parse(retAwaitTimeout.message) : retAwaitTimeout
            ret['ret'] = retAwaitTimeout.ret;
            ret['msg'] = retAwaitTimeout.msg;
            ret['res'] = retAwaitTimeout.res ? retAwaitTimeout.res : undefined;
        } else {
            ret['ret'] = true;
            ret['msg'] = 'MESSAGE SEND: OK';
        }

    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res;
    }; return { ...({ ret: ret.ret }), ...(ret.msg && { msg: ret.msg }), ...(ret.res && { res: ret.res }), };
}

let filaBigFalse = []; let filaBigTrue = []; let sending = false; function enviarMensagem(inf) {
    let { resWs, big, message } = inf; if (big) { if (Array.isArray(message)) { filaBigTrue.push(...message); } else { filaBigTrue.push(message); } }
    else { if (Array.isArray(message)) { filaBigFalse.push(...message); } else { filaBigFalse.push(message); } } if (!sending) { sending = true; enviarMensagens({ 'resWs': resWs }); }
}; function processarFilas() {
    if (filaBigFalse.length > 0) { return { big: false, value: filaBigFalse.shift() }; } else if (filaBigTrue.length > 0) { return { big: true, value: filaBigTrue.shift() }; } else { return { big: false, value: false }; }
}; async function enviarMensagens(inf) {
    while (true) {
        let resWs = inf.resWs; let { big, value } = processarFilas(); if (!value) { sending = false; break; }
        let { messageId, partesRestantes, secondsAwait } = value; let message = JSON.stringify(value);
        secondsAwait = secondsAwait == 0 ? globalWindow.secRetWebSocket / 2 : secondsAwait / 2;

        // LISTENER DE STATUS: DEFINIR
        let retAwaitTimeout, listenerName = `${messageId}_SERVER_${partesRestantes}`;
        retAwaitTimeout = awaitTimeout({ 'secondsAwait': secondsAwait, 'listenerName': listenerName });

        // ENVIAR MENSAGEM
        resWs.send(message);

        // ---------------- TESTES
        // logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `[${(filaBigFalse.length + filaBigTrue.length).toString().padStart(2, '0')}] | ENVIADA ${big ? 'GRANDE' : 'PEQUENA'} ${messageId}` });
        // file({ 'e': e, 'action': 'write', 'functionLocal': false, 'path': `D:/z_CLIENTE_ENVIANDO_[${partesRestantes}]_.txt`, 'rewrite': false, 'text': message });
        // ----------------

        // LISTENER DE STATUS: MONITORAR
        retAwaitTimeout = await retAwaitTimeout;

        retAwaitTimeout = retAwaitTimeout.ret ? JSON.parse(retAwaitTimeout.res.message) : { 'ret': false, 'msg': `TIMEOUT_EXPIROU | MENSAGEM STATUS DO SERVIDOR` }
        if (!retAwaitTimeout.ret || partesRestantes == 0 && secondsAwait == 0) {
            let listenerName = `${messageId.replace('_RET-TRUE', '_RET-OK').split('_SERVER_')[0]}`; listenerAcionar(listenerName, retAwaitTimeout);
            // REMOVER MENSAGENS COM ERROS DE RETORNO
            filaBigFalse = filaBigFalse.filter(item => item.messageId !== messageId); filaBigTrue = filaBigTrue.filter(item => item.messageId !== messageId);
        }
    }
};

// CHROME | NODEJS
(eng ? window : global)['messageSend'] = messageSend;