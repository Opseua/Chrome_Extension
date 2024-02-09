let e = import.meta.url, ee = e
async function devFun(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        let errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
    try {
        let infLog
        if (inf.enc) { // ENCAMINHAR PARA O DEVICE CERTO
            let retInf = typeof inf.data.retInf === 'boolean' ? inf.data.retInf : inf.data.retInf ? inf.data.retInf : true
            let url = windowGlobal.devSend
            let data = { 'securityPass': windowGlobal.securityPass, 'retInf': retInf, 'name': inf.data.name, 'par': inf.data.par }
            data.par['e'] = inf.e
            delete data.par.retInf // PARA REMOVER O 'retInf' QUE NÃO É NECESSÁRIO
            let send = { "fun": [data] }
            let retWsSend = await wsSend({ 'e': e, 'url': url, 'message': send });
            if (!retWsSend.ret) {
                return retWsSend
            } else {
                retWsSend = retWsSend.res
            }
            if (!data.retInf) { // RESPOSTA NECESSÁRIA [NÃO]
                ret['msg'] = `[ENC] ${data.name}`
                ret['ret'] = true
            } else if (!retWsSend) { // RESPOSTA NECESSÁRIA [SIM] | RECEBIDO [NÃO]
                ret['msg'] = `[ENC][EXPIROU] ${data.name}`
                ret['ret'] = true
            } else { // RESPOSTA NECESSÁRIA [SIM] | RECEBIDO [SIM]
                try {
                    retWsSend = JSON.parse(retWsSend.replace('"msg":"', '"msg":"[ENC] '))
                    ret = retWsSend.retWs
                } catch (e) {
                    ret['msg'] = `RESPOSTA DO WEBSOCKET NÃO É OBJETO`
                };
            }
        } else { // RECEBIDO DO WEBSOCKET
            let data = inf.data;
            function label(funName) { return typeof (eng ? window : global)[funName] === 'function' }
            await Promise.all(data.fun.map(async (value, index) => { // --------------------------------------------------
                if (value.securityPass !== windowGlobal.securityPass) {
                    ret['msg'] = `#### SECURITYPASS INCORRETO ####`
                    logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `${ret.msg}` });
                    infLog = { 'e': e, 'folder': 'JavaScript', 'path': `err.txt`, 'text': `${ret.msg}\n\n${JSON.stringify(data)}` }
                    log(infLog);
                } else if (!label(value.name)) {
                    ret['msg'] = `#### FUNÇÃO '${value.name}' NÃO EXITE ####`
                    logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `${ret.msg}` });
                    infLog = { 'e': e, 'folder': 'JavaScript', 'path': `err.txt`, 'text': `${ret.msg}\n\n${JSON.stringify(data)}` }
                    log(infLog);
                } else {
                    let name = eng ? window[value.name] : global[value.name] // CHROME ← : → NODEJS
                    let infName = value.par
                    let retInf = typeof value.retInf === 'boolean' ? value.retInf : value.retInf ? value.retInf : true
                    infName['retInf'] = retInf
                    let retName = await name(infName);
                    if (retInf) { // RESPOSTA NECESSÁRIA [SIM] (ENVIAR O RET DE VOLTA)
                        let url = inf.wsOrigin
                        let send = { 'retInf': retInf, 'retWs': retName.retWs ? retName.retWs : retName };
                        let retWsSend = await wsSend({ 'e': e, 'url': url, 'message': send });
                        if (!retWsSend.ret) {
                            return retWsSend
                        } else {
                            retWsSend = retWsSend.res
                        }
                    }

                } // --------------------------------------------------
            }))
        }
    } catch (e) {
        let retRegexE = await regexE({ 'inf': inf, 'e': e, 'catchGlobal': false });
        ret['msg'] = retRegexE.res
    };
    return {
        ...({ ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}
if (eng) { // CHROME
    window['devFun'] = devFun;
} else { // NODEJS
    global['devFun'] = devFun;
}
