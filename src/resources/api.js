// let infApi, retApi;
// infApi = { // ###### → json/object
//     e, 'method': 'POST', 'url': `https://ntfy.sh/AAA`,
//     'headers': { 'Content-Type': 'application/json' },
//     'body': { 'aaa': 'bbb' }, 'max': 10, 'bodyObject': true,
// };
// infApi = { // ###### → text
//     e, 'method': 'POST', 'url': `https://ntfy.sh/AAA`,
//     'headers': { 'Content-Type': 'text/plain;charset=UTF-8' },
//     'body': `Esse é o texto`, 'max': 10, 'bodyObject': true,
// };
// infApi = { // ###### → x-www-form-urlencoded
//     e, 'method': 'POST', 'url': `https://ntfy.sh/AAA`,
//     'headers': { 'Content-Type': 'application/x-www-form-urlencoded' },
//     'body': { 'Chave': 'Valor' }, 'max': 10, 'bodyObject': true,
// };
// retApi = await api(infApi); console.log(retApi);

// fetch('http://www.cepdobrasil.com.br/rio-de-janeiro/rua-maria-da-silva.html', { 'headers': {}, 'body': null, 'method': 'GET' })
//     .then(response => {
//         console.log('RESPONSE code:', response.status); return response.text();  // console.log('RESPONSE headers:', [...response.headers.entries()]);
//     }).then(body => { console.log('RESPONSE body:', body); }).catch(error => { console.error('RESPONSE error:', error); });

// TESTAR REQUISIÇÃO E TEMPO DE RESPOSTA → https://httpbin.org/delay/5

let e = import.meta.url, ee = e;
async function api(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        let { method, url, headers, body, max = 20, bodyObject = null, } = inf;

        let req, resCode, resHeaders, resBody, reqE = false; let reqOpt = { 'method': method, 'redirect': 'follow', 'keepalive': true, 'rejectUnauthorized': false, };

        // HEADERS
        reqOpt['headers'] = {}; if (headers && Object.keys(headers).length > 0) { reqOpt.headers = headers; };

        // BODY
        if ((body) && (reqOpt.method === 'POST' || reqOpt.method === 'PUT')) {
            if (!JSON.stringify(reqOpt.headers).toLowerCase().includes('x-www-form-urlencoded')) {
                // ###### → json/object | text
                body = typeof body === 'object' ? JSON.stringify(body) : body;
            } else {
                // ###### → x-www-form-urlencoded
                if (!(typeof body === 'object') || !Object.keys(body).length > 0) { ret['msg'] = `API: ERRO | 'body' NÃO É OBJETO [x-www-form-urlencoded]`; return ret; };
                body = []; for (let key in body) { if (key in body) { body.push(encodeURIComponent(key) + '=' + encodeURIComponent(body[key])); } }; body = body.join('&');
            }
        }

        if (typeof UrlFetchApp !== 'undefined') {
            // ################ GOOGLE APP SCRIPT
            reqOpt['muteHttpExceptions'] = true; reqOpt['validateHttpsCertificates'] = true; if (body) { reqOpt['payload'] = body; };
            try {
                req = UrlFetchApp.fetch(url, reqOpt); resCode = req.getResponseCode(); resBody = req.getContentText();
                resHeaders = {}; Object.entries(req.getAllHeaders()).forEach(([k, v,]) => { resHeaders[k.toLowerCase()] = v.toLowerCase(); });
                if (resHeaders['content-type'].includes('application/json') && bodyObject) {
                    try { let temp = JSON.parse(resBody); resBody = temp; } catch (c) { esLintIgnore = c; bodyObject = false; };
                };
            } catch (catchErr) { reqE = catchErr; }
        } else {
            // ################ CHROME | NODEJS
            max = max * 1000; let controller = new AbortController(); let signal = controller.signal; reqOpt['signal'] = signal;
            if (body) { reqOpt['body'] = body; let encoder = new TextEncoder(); let length = encoder.encode(reqOpt.body).length; reqOpt.headers['Content-Length'] = length; };
            let timeoutId = setTimeout(() => { ret['msg'] = 'API: ERRO | TEMPO MÁXIMO ATINGIDO'; controller.abort(); }, max); // CANCELAR A REQUISIÇÃO AO ATINGIR O TEMPO
            try {
                req = await fetch(url, reqOpt);
                clearTimeout(timeoutId); // LIMPAR TIMEOUT AO RECEBER RESPOSTA
                resCode = req.status; resBody = await req.text(); resHeaders = {}; req.headers.forEach((v, n) => { resHeaders[n.toLowerCase()] = v.toLowerCase(); });
                if (resHeaders['content-type'].includes('application/json') && bodyObject) {
                    try { let temp = JSON.parse(resBody); resBody = temp; } catch (c) { esLintIgnore = c; bodyObject = false; };
                };
            } catch (catchErr) { reqE = catchErr; clearTimeout(timeoutId); }
        }

        if (reqE) {
            ret['msg'] = ret.msg || `API: ERRO AO FAZER REQUISIÇÃO (NÃO NA FUNÇÃO)\n\n${reqE}`;
        } else {
            ret['ret'] = true;
            ret['msg'] = 'API: OK';
            ret['res'] = {
                'code': resCode,
                'headers': resHeaders,
                'bodyObject': bodyObject,
                'body': resBody,
            };
        }

    } catch (catchErr) {
        if (catchErr.name !== 'AbortError') {
            let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
        }
    };

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.res && { 'res': ret.res, }), };
};

// CHROME | NODEJS
(eng ? window : global)['api'] = api;
