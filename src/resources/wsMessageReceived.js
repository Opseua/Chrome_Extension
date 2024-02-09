let receivedMessages = {};

let e = import.meta.url, ee = e
async function wsMessageReceived(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        let errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
    try {
        let messageId = inf.parsedData.messageId ? inf.parsedData.messageId : 'x', message = inf.parsedData.message, urlRoom = inf.url ? inf.url : inf.room
        let parts = inf.parsedData.parts, missing = inf.parsedData.missing, rooms = inf.rooms, sender = inf.sender, server = inf.server, method = inf.method

        // LOOP: APAGAR PARTE ANTIGAS DAS MENSAGENS
        if (Object.keys(receivedMessages).length == 0) {
            let receivedMessages = {}; setInterval(() => {
                let currentTime = new Date().getTime(); for (let messageId in receivedMessages) {
                    if ((currentTime - Number(messageId.split('_')[1])) > windowGlobal.minClearPartsMessages * 60000) { delete receivedMessages[messageId]; }
                }
            }, windowGlobal.minClearPartsMessages * 60000);
        }

        // URL → ws://127.0.0.1:1234/NAME_DEVICE
        if (!parts) {
            // LISTENER DO CLIENTE DE MENSAGEM RECEBIDA | MENSAGEM ÚNICA
            // console.log(`MENSAGEM ÚNICA RECEBIDA: ${messageId}`)
            urlRoom = messageId.includes('_RET-OK') ? `${urlRoom}_${messageId}` : `${urlRoom}`
            if (!rooms) {
                // CLIENT
                listenerAcionar(urlRoom, message, messageId)
            } else {
                // SERVER
                receivedNew({ 'e': e, 'rooms': rooms, 'room': urlRoom, 'message': message, 'messageId': messageId, 'action': '', 'sender': sender, 'server': res, 'method': method })
            }
        } else {
            // console.log(`MENSAGEM EM PARTES RECEBIDA: ${messageId}`)
            if (!receivedMessages[messageId]) {
                receivedMessages[messageId] = { chunks: [] };
            }
            receivedMessages[messageId].chunks.push(message)
            // console.log(`PARTE: ${messageId} | [${missing}]`)
            if (missing == 0) {
                // LISTENER DO CLIENTE DE MENSAGEM RECEBIDA | MENSAGEM EM PARTES [ÚLTIMA PARTE]
                let ba64ToConvert = receivedMessages[messageId].chunks.map(chunk => Buffer.from(chunk, 'base64'));
                message = Buffer.concat(ba64ToConvert)
                console.log(`RECEBIDO: ${messageId} | [${message.length}]`);
                _fs.promises.writeFile('D:/OK.jpg', message, { flag: 'w' })
                urlRoom = messageId.includes('_RET-OK') ? `${urlRoom}_${messageId}` : `${urlRoom}`
                if (!rooms) {
                    // CLIENT
                    listenerAcionar(urlRoom, message, messageId)
                } else {
                    // SERVER
                    receivedNew({ 'e': e, 'rooms': rooms, 'room': urlRoom, 'message': message, 'messageId': messageId, 'action': '', 'sender': sender, 'server': res, 'method': method })
                }
            }
        }

        ret['msg'] = `WS MESSAGE RECEIVED: OK`;
        ret['ret'] = true;
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
    window['wsMessageReceived'] = wsMessageReceived;
} else { // NODEJS
    global['wsMessageReceived'] = wsMessageReceived;
}

