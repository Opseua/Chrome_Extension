// let infApi, retApi // 'logFun': true
// infApi = { // ###### → json/object
//     'e': e, 'method': 'POST', 'url': `https://ntfy.sh/AAA`,
//     'headers': { 'Content-Type': 'application/json' },
//     'body': { 'aaa': 'bbb' }, 'max': 10
// };
// infApi = { // ###### → text
//     'e': e, 'method': 'POST', 'url': `https://ntfy.sh/AAA`,
//     'headers': { 'Content-Type': 'text/plain;charset=UTF-8' },
//     'body': `Esse é o texto`, 'max': 10
// };
// infApi = { // ###### → x-www-form-urlencoded
//     'e': e, 'method': 'POST', 'url': `https://ntfy.sh/AAA`,
//     'headers': { 'Content-Type': 'application/x-www-form-urlencoded' },
//     'body': { 'Chave': 'Valor' }, 'max': 10
// };
// retApi = await api(infApi);
// console.log(retApi)

let e = import.meta.url, ee = e;
async function api(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        let errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
    try {
        let req, resCode, resHeaders, resBody, body = false, reqOk = false, reqE; let reqOpt = { 'method': inf.method, 'redirect': 'follow', 'keepalive': true, 'rejectUnauthorized': false };

        // HEADERS
        reqOpt['headers'] = {}; if (inf.headers && Object.keys(inf.headers).length > 0) { reqOpt.headers = inf.headers };

        // BODY
        if ((inf.body) && (reqOpt.method == 'POST' || reqOpt.method == 'PUT')) {
            if (!JSON.stringify(reqOpt.headers).includes('x-www-form-urlencoded')) {
                // ###### → json/object | text
                body = typeof inf.body === 'object' ? JSON.stringify(inf.body) : inf.body
            } else {
                // ###### → x-www-form-urlencoded
                if (!typeof inf.body === 'object' || !Object.keys(inf.body).length > 0) {
                    ret['msg'] = `API: ERRO | 'body' NÃO É OBJETO [x-www-form-urlencoded]`
                    return ret
                }; body = []; for (let key in inf.body) { if (key in inf.body) { body.push(encodeURIComponent(key) + '=' + encodeURIComponent(inf.body[key])); } }; body = body.join('&');
            }
        }

        // ################ GOOGLE APP SCRIPT
        if (typeof UrlFetchApp !== 'undefined') {
            reqOpt['muteHttpExceptions'] = true; reqOpt['validateHttpsCertificates'] = true; if (body) { reqOpt['payload'] = body }
            try { req = UrlFetchApp.fetch(inf.url, reqOpt); resCode = req.getResponseCode(); resHeaders = req.getAllHeaders(); resBody = req.getContentText(); reqOk = true }
            catch (catchErr) { reqE = catchErr }
        } else {
            // ################ CHROME | NODEJS
            // TEMPO LIMITE [PADRÃO 20 SEGUNDOS]
            let max = inf.max ? inf.max * 1000 : 20000; let controller = new AbortController(); let signal = controller.signal; reqOpt['signal'] = signal
            if (body) { reqOpt['body'] = body; let encoder = new TextEncoder(); let length = encoder.encode(reqOpt.body).length; reqOpt.headers['Content-Length'] = length }
            let timeoutId = setTimeout(() => {
                // CANCELAR A REQUISIÇÃO SE O TEMPO FOR ATINGIDO
                ret['msg'] = 'API: TEMPO MÁXIMO ATINGIDO'; controller.abort();
            }, max);
            try {
                req = await fetch(inf.url, reqOpt);
                // LIMPAR O TIMER SE A RESPOSTA FOR RECEBIDA ANTES DO TEMPO
                clearTimeout(timeoutId); resCode = req.status; resHeaders = {}; req.headers.forEach((value, name) => { resHeaders[name] = value }); resBody = await req.text(); reqOk = true
            } catch (catchErr) { clearTimeout(timeoutId); reqE = catchErr }
        }

        if (!reqOk) {
            ret['msg'] = ret.msg ? ret.msg : `API: ERRO AO FAZER REQUISIÇÃO (NÃO NA FUNÇÃO)\n\n${reqE}`;
        } else {
            ret['ret'] = true;
            ret['msg'] = 'API: OK';
            ret['res'] = {
                'code': resCode,
                'headers': resHeaders,
                'body': resBody
            }
        }

    } catch (catchErr) {
        if (catchErr.name !== 'AbortError') {
            let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, 'catchGlobal': false });
            ret['msg'] = retRegexE.res
        }
    };
    return {
        ...({ ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}

if (eng) { // CHROME
    window['api'] = api;
} else { // NODEJS
    global['api'] = api;
}


