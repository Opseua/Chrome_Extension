// let infApi, retApi;
// infApi = { // ###### → json/object
//     e, 'method': 'POST', 'url': `https://ntfy.sh/AAA`,
//     'headers': { 'Content-Type': 'application/json' },
//     'body': { 'aaa': 'bbb' }, 'max': 10,
// };
// infApi = { // ###### → text
//     e, 'method': 'POST', 'url': `https://ntfy.sh/AAA`,
//     'headers': { 'Content-Type': 'text/plain;charset=UTF-8' },
//     'body': `Esse é o texto`, 'max': 10,
// };
// infApi = { // ###### → x-www-form-urlencoded
//     e, 'method': 'POST', 'url': `https://ntfy.sh/AAA`,
//     'headers': { 'Content-Type': 'application/x-www-form-urlencoded' },
//     'body': { 'Chave': 'Valor' }, 'max': 10,
// };
// retApi = await api(infApi); console.log(retApi);

// fetch('http://www.cepdobrasil.com.br/rio-de-janeiro/rua-maria-da-silva.html', { 'headers': {}, 'body': null, 'method': 'GET' })
//     .then(response => {
//         console.log('RESPONSE code:', response.status); return response.text();  // console.log('RESPONSE headers:', [...response.headers.entries()]);
//     }).then(body => { console.log('RESPONSE body:', body); }).catch(error => { console.error('RESPONSE error:', error); });

// TESTAR REQUISIÇÃO E TEMPO DE RESPOSTA → https://httpbin.org/delay/5

let e = import.meta.url, ee = e;
async function api(inf = {}) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    try {
        let { method, url, headers, body, max, } = inf;

        let req, resCode, resHeaders, resBody, reqOk = false, reqE; let reqOpt = { 'method': method, 'redirect': 'follow', 'keepalive': true, 'rejectUnauthorized': false };

        // HEADERS
        reqOpt['headers'] = {}; if (headers && Object.keys(headers).length > 0) { reqOpt.headers = headers };

        // BODY
        if ((body) && (reqOpt.method == 'POST' || reqOpt.method == 'PUT')) {
            if (!JSON.stringify(reqOpt.headers).includes('x-www-form-urlencoded')) {
                // ###### → json/object | text
                body = typeof body === 'object' ? JSON.stringify(body) : body
            } else {
                // ###### → x-www-form-urlencoded
                if (!typeof body === 'object' || !Object.keys(body).length > 0) {
                    ret['msg'] = `API: ERRO | 'body' NÃO É OBJETO [x-www-form-urlencoded]`
                    return ret
                }; body = []; for (let key in body) { if (key in body) { body.push(encodeURIComponent(key) + '=' + encodeURIComponent(body[key])); } }; body = body.join('&');
            }
        }

        // ################ GOOGLE APP SCRIPT
        if (typeof UrlFetchApp !== 'undefined') {
            reqOpt['muteHttpExceptions'] = true; reqOpt['validateHttpsCertificates'] = true; if (body) { reqOpt['payload'] = body }
            try { req = UrlFetchApp.fetch(url, reqOpt); resCode = req.getResponseCode(); resHeaders = req.getAllHeaders(); resBody = req.getContentText(); reqOk = true }
            catch (catchErr) { reqE = catchErr }
        } else {
            // ################ CHROME | NODEJS
            // TEMPO LIMITE [PADRÃO 20 SEGUNDOS]
            max = max ? max * 1000 : 20000; let controller = new AbortController(); let signal = controller.signal; reqOpt['signal'] = signal
            if (body) { reqOpt['body'] = body; let encoder = new TextEncoder(); let length = encoder.encode(reqOpt.body).length; reqOpt.headers['Content-Length'] = length }
            let timeoutId = setTimeout(() => {
                // CANCELAR A REQUISIÇÃO SE O TEMPO FOR ATINGIDO
                ret['msg'] = 'API: ERRO | TEMPO MÁXIMO ATINGIDO'; controller.abort();
            }, max);
            try {
                req = await fetch(url, reqOpt);
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
        if (catchErr.name !== 'AbortError') { let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; }
    };

    return { ...({ 'ret': ret.ret }), ...(ret.msg && { 'msg': ret.msg }), ...(ret.res && { 'res': ret.res }), };
};

// CHROME | NODEJS
(eng ? window : global)['api'] = api;
