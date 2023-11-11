// PARAMETRO 'retInf' aguardar e enviar o retorno na MESMA sala [true/false/idAleatorioAqui]
// PARAMETRO 'retUrl' para qual url deve enviar a mensagem [padrão é a mesma sala que recebeu] (não definir no objeto)

async function devAndFun(inf) {
    await import('./@functions.js');
    let ret = { 'ret': false }; try {
        let dev, r = await configStorage({ 'action': 'get', 'key': 'webSocket' });
        if (!r.ret) { return ret } else { r = r.res }; let stop = false; for (let [index, value] of r.devices.entries()) {
            const a = value; for (let [i, v] of a.functions.entries()) { if (v == inf.name) { dev = value; stop = true; break } }; if (stop) { break }
        }; if (stop) {
            const url = `${r.server[dev.server].url}://${r.server[dev.server].host}:${r.server[dev.server].port}/${dev.name}`
            let par = inf.par; par['devAndFun'] = true;
            const retInf = typeof inf.retInf === 'boolean' ? inf.retInf ? JSON.stringify(Date.now()) : false : inf.retInf ? inf.retInf : JSON.stringify(Date.now())
            const send = {
                'fun': [{
                    'securityPass': r.securityPass,
                    'funRet': { 'retUrl': inf.retUrl, 'retInf': retInf },
                    'funRun': { 'name': inf.name, 'par': par }
                }]
            }; let retWsSend = await wsSend(url, send);
            retWsSend = JSON.parse(retWsSend)
            if (retWsSend.retWs && retWsSend.retWs.res) {
                ret['res'] = retWsSend.retWs.res;
            }
            ret['msg'] = retWsSend.retWs && retWsSend.retWs.msg ? retWsSend.retWs.msg : `[ENC] ${inf.name}: OK`
            ret['ret'] = retWsSend.retWs && retWsSend.retWs.ret ? retWsSend.retWs.ret : true
        }; if (!stop) { ret['msg'] = `\n\n #### ERRO #### DEV AND FUN \n NENHUM DEVICE PARA A FUNCAO '${inf.name}' \n\n` }
    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; return ret
}

if (dev) { // CHROME
    window['devAndFun'] = devAndFun;
} else { // NODEJS
    global['devAndFun'] = devAndFun;
}