
async function devFun(inf) {
    await import('./@functions.js');
    let ret = { 'ret': false };
    try {
        if (inf.enc) { // ENCAMINHAR PARA O DEVICE CERTO
            let retInf = typeof inf.data.retInf === 'boolean' ? inf.data.retInf ? JSON.stringify(Date.now()) : false : inf.data.retInf ? inf.data.retInf : JSON.stringify(Date.now())
            let url = eng ? devNodeJS : devChrome
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
                ret['msg'] = `[ENC] ${inf.data.name}: OK`
                ret['ret'] = true
            } else if (!retWsSend) { // RESPOSTA NECESSÁRIA [SIM] | RECEBIDO [NÃO]
                ret['msg'] = `[ENC][EXPIROU] ${data.name}: OK`
                ret['ret'] = true
            } else { // RESPOSTA NECESSÁRIA [SIM] | RECEBIDO [SIM]
                try {
                    retWsSend = JSON.parse(retWsSend)
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
                } else if (!label(value.name)) {
                    ret['msg'] = `\n #### FUNCAO '${value.name}' NAO EXITE #### \n\n ${JSON.stringify(data)} \n\n`
                } else {
                    let name = eng ? window[value.name] : global[value.name] // CHROME ← : → NODEJS
                    let infName = value.par
                    let retInf = typeof value.retInf === 'boolean' ? value.retInf ? JSON.stringify(Date.now()) : false : value.retInf ? value.retInf : JSON.stringify(Date.now())
                    infName['retInf'] = retInf
                    let retName = await name(infName);
                    if (retInf) { // RESPOSTA NECESSÁRIA [SIM] (ENVIAR O RET DE VOLTA)
                        let url = inf.wsOrigin
                        let send = { 'retInf2': retInf, 'retWs': retName.retWs ? retName.retWs : retName };
                        let retWsSend = await wsSend(url, send); if (!retWsSend.ret) { return retWsSend } else { retWsSend = retWsSend.res }
                    }
                } // --------------------------------------------------
            }))
        }
    } catch (e) {
        let m = await regexE({ 'e': e });
        ret['msg'] = m.res
    };
    return ret
}

if (typeof eng === 'boolean') {
    if (eng) { // CHROME
        window['devFun'] = devFun;
    } else { // NODEJS
        global['devFun'] = devFun;
    }
}