let filaBigFalse = []; let filaBigTrue = []; let sending = false;
export function enviarMensagem(inf) {
    let { resWs, big, message } = inf
    if (big) { if (Array.isArray(message)) { filaBigTrue.push(...message); } else { filaBigTrue.push(message); } }
    else { if (Array.isArray(message)) { filaBigFalse.push(...message); } else { filaBigFalse.push(message); } }
    if (!sending) { sending = true; enviarMensagens(resWs); }
}
function processarFilas() {
    if (filaBigFalse.length > 0) { return { big: false, value: filaBigFalse.shift() }; }
    else if (filaBigTrue.length > 0) { return { big: true, value: filaBigTrue.shift() }; }
    else { return { big: false, value: false }; }
}

async function enviarMensagens(ws) {
    while (true) {
        let { big, value } = processarFilas(); if (!value) { sending = false; break; }

        let { messageId, partesRestantes, secondsAwait } = value; let message = JSON.stringify(value)
        secondsAwait = secondsAwait == 0 ? globalWindow.secRetWebSocket / 2 : secondsAwait / 2;

        // console.log(`FALTAM ${(filaBigFalse.length + filaBigTrue.length).toString().padStart(2, '0')} | ENVIADA ${big ? 'GRANDE' : 'PEQUENA'}`, messageId);

        // LISTENER DE STATUS: DEFINIR
        let retAwaitTimeout, listenerName = `${messageId}_SERVER_${partesRestantes}`
        retAwaitTimeout = awaitTimeout({ 'secondsAwait': secondsAwait, 'listenerName': listenerName });

        // ENVIAR MENSAGEM
        ws.send(message);

        // LISTENER DE STATUS: MONITORAR
        retAwaitTimeout = await retAwaitTimeout;
        retAwaitTimeout = retAwaitTimeout.ret ? JSON.parse(retAwaitTimeout.res.message) : { 'ret': false, 'msg': `TIMEOUT_EXPIROU | MENSAGEM STATUS DO SERVIDOR` }
        if (!retAwaitTimeout.ret || partesRestantes == 0 && secondsAwait == 0) {
            let listenerName = `${messageId.replace('_RET-TRUE', '_RET-OK').split('_SERVER_')[0]}`;
            listenerAcionar(listenerName, retAwaitTimeout);
            // REMOVER MENSAGENS COM ERROS DE RETORNO
            filaBigFalse = filaBigFalse.filter(item => item.messageId !== messageId); filaBigTrue = filaBigTrue.filter(item => item.messageId !== messageId);
        }
    }
}
