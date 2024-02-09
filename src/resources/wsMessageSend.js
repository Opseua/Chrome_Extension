let receivedMessages = {};

let e = import.meta.url, ee = e
async function wsMessageSend(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        let errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
    try {
        let urlRoom = inf.url ? inf.url : inf.room, message = inf.message, chunkSize = windowGlobal.kbPartsMessage * 1024, secondsAwait = inf.secondsAwait
        let messageId = inf.messageId ? inf.messageId : `ID_${new Date().getTime()}_${Math.random().toString(36).substring(2, 5)}_messageId`, rooms = inf.rooms, sender = inf.sender
        messageId = secondsAwait > 0 ? `${messageId}_RET-TRUE` : `${messageId.replace('_RET-TRUE', '_RET-OK')}`

        // LOOP: APAGAR PARTE ANTIGAS DAS MENSAGENS
        if (Object.keys(receivedMessages).length == 0) {
            let receivedMessages = {}; setInterval(() => {
                let currentTime = new Date().getTime(); for (let messageId in receivedMessages) {
                    if ((currentTime - Number(messageId.split('_')[1])) > windowGlobal.minClearPartsMessages * 60000) { delete receivedMessages[messageId]; }
                }
            }, windowGlobal.minClearPartsMessages * 60000);
        }

        function sendMessage(inf) {
            if (!rooms) {
                // CLIENT
                wsSend({ 'e': e, 'url': urlRoom, 'message': { 'messageId': inf.messageId, 'parts': inf.parts, 'missing': inf.missing, 'message': inf.message } });
            } else {
                // SERVER
                sendRoom({ 'e': e, 'room': urlRoom, 'message': { 'messageId': inf.messageId, 'parts': inf.parts, 'missing': inf.missing, 'message': inf.message }, 'rooms': rooms, 'sender': sender, });
            }
        }
        async function awaitMessageRet() {
            listenerMonitorar(`${urlRoom}_${messageId.replace('_RET-TRUE', '_RET-OK')}`, async (nomeList, param1) => {
                ret['ret'] = true; ret['res'] = param1;
                listenerAcionar(messageId, 'INF1');
            });

            if (message.length < chunkSize) {
                // MENSAGEM ÚNICA
                // console.log(`MENSAGEM ÚNICA ENVIADA: ${messageId}`)
                sendMessage({ 'messageId': messageId, 'parts': false, 'missing': 0, 'message': message })
            } else {
                // MENSAGEM EM PARTES
                // console.log(`MENSAGEM EM PARTES ENVIADA: ${messageId}`)
                let totalChunks = Math.ceil(message.length / chunkSize), i = 0;
                if (!receivedMessages[messageId]) {
                    receivedMessages[messageId] = { chunks: [] };
                }
                console.log(`ENVIANDO: ${messageId} | [${message.length}]`);
                for (let i = 0; i < totalChunks; i++) {
                    let start = i * chunkSize;
                    let end = Math.min(start + chunkSize, message.length);
                    let chunk = message.slice(start, end);
                    receivedMessages[messageId].chunks.push(chunk.toString('base64'));
                }
                function sendNextChunk() {
                    sendMessage({ 'messageId': messageId, 'parts': true, 'missing': receivedMessages[messageId].chunks.length - i - 1, 'message': receivedMessages[messageId].chunks[i] })
                    i++; if (i < receivedMessages[messageId].chunks.length) {
                        setTimeout(() => {
                            sendNextChunk();
                        }, 10);
                    }
                }
                sendNextChunk();
            }

            // MONITORAR A RESPOSTA [SE FOR NECESSÁRIO]
            if (secondsAwait > 0) {
                ret['res'] = `TIMEOUT_EXPIROU`;
                await awaitTimeout({ 'secondsAwait': secondsAwait, 'listenerName': messageId });
            } else {
                ret['ret'] = true;
                ret['msg'] = `WS MESSAGE SEND: OK`;
            }
        };
        await awaitMessageRet()

        // ### LOG FUN ###
        if (inf && inf.logFun) {
            let infFile = { 'e': e, 'action': 'write', 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }
            infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; file(infFile);
        }
    } catch (e) {
        (async () => {
            let retRegexE = await regexE({ 'inf': inf, 'e': e, 'catchGlobal': false });
            ret['msg'] = retRegexE.res
        })()
    };
    return {
        ...({ ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}

if (eng) { // CHROME
    window['wsMessageSend'] = wsMessageSend;
} else { // NODEJS
    global['wsMessageSend'] = wsMessageSend;
}

