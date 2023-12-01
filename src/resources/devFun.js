async function devFun(inf) {
    let ret = { 'ret': false };
    try {
        let infLog, retLog
        if (inf.enc) { // ENCAMINHAR PARA O DEVICE CERTO
            let retInf = typeof inf.data.retInf === 'boolean' ? inf.data.retInf : inf.data.retInf ? inf.data.retInf : true
            let url = eng ? devNodeJSLocal : devChromeLocal
            let data = { 'securityPass': securityPass, 'retInf': retInf, 'name': inf.data.name, 'par': inf.data.par }
            delete data.par.retInf // PARA REMOVER O 'retInf' QUE NÃO É NECESSÁRIO
            let send = { "fun": [data] }
            let retWsSend = await wsSend(url, send);
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
                if (value.securityPass !== securityPass) {
                    ret['msg'] = `\n #### SECURITYPASS INCORRETO #### \n\n ${JSON.stringify(data)} \n\n`
                    console.log(ret.msg)
                    infLog = { 'folder': 'JavaScript', 'path': `err.txt`, 'text': ret.msg }
                    retLog = await log(infLog);
                } else if (!label(value.name)) {
                    ret['msg'] = `\n #### FUNÇÃO '${value.name}' NÃO EXITE #### \n\n ${JSON.stringify(data)} \n\n`
                    console.log(ret.msg)
                    infLog = { 'folder': 'JavaScript', 'path': `err.txt`, 'text': ret.msg }
                    retLog = await log(infLog);
                } else {
                    let name = eng ? window[value.name] : global[value.name] // CHROME ← : → NODEJS
                    let infName = value.par
                    let retInf = typeof value.retInf === 'boolean' ? value.retInf : value.retInf ? value.retInf : true
                    infName['retInf'] = retInf
                    let retName = await name(infName);
                    if (retInf) { // RESPOSTA NECESSÁRIA [SIM] (ENVIAR O RET DE VOLTA)
                        let url = inf.wsOrigin
                        let send = { 'retInf': retInf, 'retWs': retName.retWs ? retName.retWs : retName };
                        let retWsSend = await wsSend(url, send);
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
        let retRegexE = await regexE({ 'inf': inf, 'e': e });
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
