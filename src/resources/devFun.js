let e = import.meta.url, ee = e
async function devFun(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        let errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
    try {
        if (inf.enc) { // ENCAMINHAR PARA O DEVICE CERTO
            let retInf = typeof inf.data.retInf === 'boolean' ? inf.data.retInf : inf.data.retInf ? inf.data.retInf : true
            let url = globalWindow.devSend
            let data = { 'securityPass': globalWindow.securityPass, 'retInf': retInf, 'name': inf.data.name, 'par': inf.data.par }
            data.par['e'] = inf.e
            delete data.par.retInf // PARA REMOVER O 'retInf' QUE NÃO É NECESSÁRIO
            let send = { "fun": [data] }
            // let retWsSend = await wsSend({ 'e': e, 'url': url, 'message': send });
            let retMessageSend = await messageSend({ 'messageId': false, 'message': send, 'ws': url, 'secondsAwait': 0, })
            console.log('DEV FUN')
            if (!retMessageSend.ret) {
                return retMessageSend
            } else {
                retMessageSend = retMessageSend.res
            }
            if (!data.retInf) { // RESPOSTA NECESSÁRIA [NÃO]
                ret['msg'] = `[ENC] ${data.name}`
                ret['ret'] = true
            } else if (!retMessageSend) { // RESPOSTA NECESSÁRIA [SIM] | RECEBIDO [NÃO]
                ret['msg'] = `[ENC][EXPIROU] ${data.name}`
                ret['ret'] = true
            } else { // RESPOSTA NECESSÁRIA [SIM] | RECEBIDO [SIM]
                try {
                    retMessageSend = JSON.parse(retMessageSend.replace('"msg":"', '"msg":"[ENC] '))
                    ret = retMessageSend.retWs
                } catch (e) {
                    ret['msg'] = `RESPOSTA DO WEBSOCKET NÃO É OBJETO`
                };
            }
        } else {
            // RECEBIDO DO WEBSOCKET
            let data = inf.data;
            function label(funName) { return typeof (eng ? window : global)[funName] === 'function' }
            for (let [index, value] of data.fun.entries()) {
                if (value.securityPass !== globalWindow.securityPass) {
                    ret['msg'] = `#### SECURITYPASS INCORRETO ####`
                    logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `${ret.msg}\n\n${JSON.stringify(data)}` });
                } else if (!label(value.name)) {
                    ret['msg'] = `#### FUNÇÃO '${value.name}' NÃO EXITE ####`
                    logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `${ret.msg}\n\n${JSON.stringify(data)}` });
                } else {
                    let name = eng ? window[value.name] : global[value.name] // CHROME ← : → NODEJS
                    let infName = value.par
                    let retInf = value.retInf ? true : false
                    infName['retInf'] = retInf
                    let retName = await name(infName);
                    if (retInf) {
                        // RESPOSTA NECESSÁRIA [SIM]
                        let { resWs, destination, messageId, } = inf
                        messageSend({ 'destination': destination, 'messageId': messageId, 'message': retName, 'resWs': resWs, 'secondsAwait': 0, })
                    }
                    ret['ret'] = true
                    ret['msg'] = `DEV FUN: OK`
                    ret['res'] = retName
                }
            }
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
