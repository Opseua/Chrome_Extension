let e = import.meta.url, ee = e;
async function devFun(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    try {
        if (inf.enc) {
            // ENCAMINHAR PARA O DEVICE CERTO
            let retMessageSend, retInf = typeof inf.data.retInf === 'boolean' ? inf.data.retInf : inf.data.retInf ? inf.data.retInf : true
            let destination = globalWindow.devSend;
            let locWeb = destination.includes('127.0.0.1') ? '[LOC]' : '[WEB]'
            let data = { 'securityPass': globalWindow.securityPass, 'retInf': retInf, 'name': inf.data.name, 'par': inf.data.par }
            data.par['e'] = inf.e
            // PARA REMOVER O 'retInf' QUE NÃO É NECESSÁRIO
            delete data.par.retInf
            let message = { "fun": [data] }
            // PEGAR 'ws'
            let retListenerAcionar = await listenerAcionar(`getWs_${locWeb}`, { 'a': 'a', 'b': 'b' });
            if (!retListenerAcionar) {
                ret['msg'] = `DEV FUN: ERRO | NÃO ACHOU O OBJETO 'ws'`
            } else {
                // ENVIAR COMANDO PARA O DESTINO CERTO
                retMessageSend = await messageSend({ 'destination': destination, 'messageId': true, 'message': message, 'resWs': retListenerAcionar, 'secondsAwait': 0, });
                if (retMessageSend.ret && !data.retInf) {
                    // RESPOSTA NECESSÁRIA [NÃO]
                    ret['ret'] = true
                    ret['msg'] = `[ENC] ${data.name}`
                } else if (!retMessageSend.ret && data.retInf) {
                    // RESPOSTA NECESSÁRIA [SIM] | RECEBIDO [NÃO]
                    ret = retMessageSend
                } else if (retMessageSend.ret && data.retInf) {
                    // RESPOSTA NECESSÁRIA [SIM] | RECEBIDO [SIM]
                    if (!(retMessageSend.ret === true || retMessageSend.ret === false)) {
                        ret['msg'] = `DEV FUN: ERRO | RESPOSTA DO WEBSOCKET NÃO É OBJETO`
                    } else {
                        ret = JSON.parse(JSON.stringify(retMessageSend).replace('"msg":"', '"msg":"[ENC] '))
                    }
                }
            }
        } else {
            // RECEBIDO DO WEBSOCKET
            let data = inf.data;
            function label(funName) { return typeof (eng ? window : global)[funName] === 'function' }
            for (let [index, value] of data.fun.entries()) {
                let { resWs, destination, messageId, } = inf
                if (value.securityPass !== globalWindow.securityPass) {
                    ret['msg'] = `DEV FUN: ERRO | SECURITYPASS INCORRETO`
                    logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `${ret.msg}\n\n${JSON.stringify(data)}` });
                } else if (!label(value.name)) {
                    ret['msg'] = `DEV FUN: ERRO | FUNÇÃO '${value.name}' NÃO EXITE`
                    logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `${ret.msg}\n\n${JSON.stringify(data)}` });
                } else {
                    let name = eng ? window[value.name] : global[value.name] // CHROME ← : → NODEJS
                    let infName = value.par
                    let retInf = value.retInf ? true : false
                    infName['retInf'] = retInf
                    let retName = await name(infName);
                    if (retInf) {
                        // RESPOSTA NECESSÁRIA [SIM]
                        messageSend({ 'destination': destination, 'messageId': messageId, 'message': retName, 'resWs': resWs, 'secondsAwait': 0, })
                    }
                    ret['ret'] = true
                    ret['msg'] = `DEV FUN: OK`
                    ret['res'] = retName
                }
            }
        }
    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res;
    }; return { ...({ ret: ret.ret }), ...(ret.msg && { msg: ret.msg }), ...(ret.res && { res: ret.res }), };
};

// CHROME | NODEJS
(eng ? window : global)['devFun'] = devFun;