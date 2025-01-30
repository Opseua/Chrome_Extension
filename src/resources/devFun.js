let e = import.meta.url, ee = e;
async function devFun(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        let { enc, data, } = inf;

        if (enc) {
            // ENCAMINHAR PARA O DEVICE CERTO
            let retMessageSend, retInf = typeof data.retInf === 'boolean' ? data.retInf : data.retInf ? data.retInf : true;
            let destination = gW.devSend;
            let locWeb = destination.includes('127.0.0.1') ? '[LOC]' : '[WEB]';
            data = { 'securityPass': gW.securityPass, 'retInf': retInf, 'name': data.name, 'par': data.par, };
            data.par['enc'] = true; data.par['e'] = inf.e;
            // PARA REMOVER O 'retInf' QUE NÃO É NECESSÁRIO
            delete data.par.retInf;
            let message = { 'fun': [data,], };
            // PEGAR 'ws'
            let retListenerAcionar = await listenerAcionar(`getWs_${locWeb}`, { 'a': 'a', 'b': 'b', });
            if (!retListenerAcionar) {
                ret['msg'] = `DEV FUN: ERRO | NÃO ACHOU O OBJETO 'ws'`;
            } else {
                // ENVIAR COMANDO PARA O DESTINO CERTO
                retMessageSend = await messageSend({ 'destination': destination, 'message': message, 'resWs': retListenerAcionar, 'secondsAwait': 0, });
                if (retMessageSend.ret && !data.retInf) {
                    // RESPOSTA NECESSÁRIA [NÃO]
                    ret['ret'] = true;
                    ret['msg'] = `[ENC] ${data.name}`;
                } else if (!retMessageSend.ret && data.retInf) {
                    // RESPOSTA NECESSÁRIA [SIM] | RECEBIDO [NÃO]
                    ret = retMessageSend;
                } else if (retMessageSend.ret && data.retInf) {
                    // RESPOSTA NECESSÁRIA [SIM] | RECEBIDO [SIM]
                    if (!(retMessageSend.ret === true || retMessageSend.ret === false)) {
                        ret['msg'] = `DEV FUN: ERRO | RESPOSTA DO WEBSOCKET NÃO É OBJETO`;
                    } else {
                        ret = JSON.parse(JSON.stringify(retMessageSend).replace('"msg":"', '"msg":"[ENC] '));
                    }
                }
            }
        } else {
            // RECEBIDO DO WEBSOCKET
            function label(funName) { return typeof (eng ? window : global)[funName] === 'function'; };
            for (let [index, value,] of data.fun.entries()) {
                let { resWs, destination, messageId, } = inf;
                let retInf = !!value.retInf; let errAlert = false;
                if (value.securityPass !== gW.securityPass) {
                    errAlert = true;
                    ret['ret'] = false;
                    ret['msg'] = `DEV FUN: ERRO | SECURITYPASS INCORRETO`;
                } else if (!label(value.name)) {
                    errAlert = true;
                    ret['ret'] = false;
                    ret['msg'] = `DEV FUN: ERRO | FUNÇÃO '${value.name}' NÃO EXITE`;
                } else {
                    let name = eng ? window[value.name] : global[value.name]; // CHROME ← : → NODEJS
                    let infName = value.par;
                    infName['retInf'] = retInf;
                    ret = await name(infName);
                }

                if (retInf) {
                    // RESPOSTA NECESSÁRIA [SIM]
                    messageSend({ 'destination': destination, 'messageId': messageId, 'message': ret, 'resWs': resWs, 'secondsAwait': 0, });
                }

                if (errAlert) {
                    let text = `${ret.msg}\n\n${JSON.stringify(data)}`; logConsole({ e, ee, 'write': true, 'msg': `${text}`, });
                }

            }
        }
    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    };

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.res && { 'res': ret.res, }), };
};

// CHROME | NODEJS
(eng ? window : global)['devFun'] = devFun;


