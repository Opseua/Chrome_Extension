// let infApi, retApi;
// infApi = { // ###### → json/object
//     e, 'method': 'POST', 'url': `https://ntfy.sh/AAA`, 'headers': { 'Content-Type': 'application/json', },
//     'body': { 'aaa': 'bbb', }, 'max': 10, 'bodyObject': true,
// };
// infApi = { // ###### → text
//     e, 'method': 'POST', 'url': `https://ntfy.sh/AAA`, 'headers': { 'Content-Type': 'text/plain;charset=UTF-8', },
//     'body': `Esse é o texto`, 'max': 10, 'bodyObject': true,
// };
// infApi = { // ###### → x-www-form-urlencoded
//     e, 'method': 'POST', 'url': `https://ntfy.sh/AAA`, 'headers': { 'Content-Type': 'application/x-www-form-urlencoded', },
//     'body': { 'Chave': 'Valor', }, 'max': 10, 'bodyObject': true,
// };
// retApi = await api(infApi); console.log(retApi);

// fetch('http://www.cepdobrasil.com.br/rio-de-janeiro/rua-maria-da-silva.html', { 'headers': {}, 'body': null, 'method': 'GET', })
//     .then(res => { console.log('RES CODE:', res.status); console.log('RES HEADERS:', [...res.headers.entries(),]); return res.text(); })
//     .then(body => { console.log('RES BODY:', body); }).catch(error => { console.error('RESPONSE error:', error); });

// TESTAR REQUISIÇÃO E TEMPO DE RESPOSTA → https://httpbin.org/delay/5

let e = import.meta.url, ee = e;
async function api(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        let { method = '', url = false, headers, body = false, max = 20, bodyObject = null, reqE = 0, } = inf;

        // NÃO SUBIR AS LINHAS!!! (PARA SEREM VISUALIZADAS NO GOOGLE APP SCRIPT)
        reqE = !['GET', 'POST', 'PUT',].includes(method) ? 1 : !url ? 2 : (['POST', 'PUT',].includes(method) && !body) ? 3 : 0; function cT(t) { clearTimeout(t); };
        // CHECAR SE TEM ERRO
        if (reqE > 0) { ret['msg'] = `API: ERRO | ${reqE === 1 ? `MÉTODOS ACEITOS 'GET', 'POST', 'PUT'` : `INFORMAR O ${reqE === 2 ? `'url'` : `'body'`}`}`; return ret; };

        // REQ: HEADERS
        let req, resC, resH = {}, resB; let reqOpt = { method, 'redirect': 'follow', 'keepalive': true, 'rejectUnauthorized': false, }; let timeoutId;
        reqOpt['headers'] = {}; if (headers && Object.keys(headers).length > 0) { reqOpt.headers = headers; }; let type = typeof UrlFetchApp !== 'undefined';

        // REQ: BODY
        if (!['POST', 'PUT',].includes(method)) { body = false; } else {
            let bodyT = !(typeof body === 'object') ? -1 : Object.keys(body).length;
            if (!JSON.stringify(reqOpt.headers).toLowerCase().includes('x-www-form-urlencoded')) {
                // → json/object | text
                body = bodyT === -1 ? body : JSON.stringify(body);
            } else {
                // → x-www-form-urlencoded
                if (!(bodyT > 0)) { reqE = 2; } else { body = Object.entries(body).map(([k, v,]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&'); };
            };
        }
        // CHECAR SE TEM ERRO
        if (reqE > 0) { ret['msg'] = `API: ERRO | 'body' VAZIO/NÃO É OBJETO [x-www-form-urlencoded]`; return ret; }

        // REQ: PREPARAR (GOOGLE | CHROME/NODEJS)
        if (type) {
            reqOpt['muteHttpExceptions'] = true; reqOpt['validateHttpsCertificates'] = true; if (body) { reqOpt['payload'] = body; };
        } else {
            max = max * 1000; let controller = new AbortController(); let signal = controller.signal; reqOpt['signal'] = signal;
            if (body) { reqOpt['body'] = body; let enc = new TextEncoder(); let len = enc.encode(reqOpt.body).length; reqOpt.headers['Content-Length'] = len; };
            timeoutId = setTimeout(() => { reqE = 3; controller.abort(); }, max); // TIMEOUT DE TEMPO MÁXIMO
        }

        // → TENTAR: PROCESSAR REQUISIÇÃO (GOOGLE | CHROME/NODEJS)
        try { if (type) { req = UrlFetchApp.fetch(url, reqOpt); } else { req = await fetch(url, reqOpt); }; } catch (c) { reqE = 3; ret['msg'] = c; };
        // LIMPAR TIMEOUT (CHROME/NODEJS) | CHECAR SE TEM ERRO
        if (!type) { cT(timeoutId); }; if (reqE > 0 && String(ret.msg).includes('AbortError')) { ret['msg'] = `API: ERRO | TEMPO ATINGIDO (NÃO NA FUNÇÃO)`; return ret; }
        else if (reqE > 0) { ret['msg'] = `API: ERRO | AO PROCESSAR REQUISIÇÃO (NÃO NA FUNÇÃO)\n\n${ret.msg}`; return ret; };

        // → TENTAR: PROCESSAR BODY/HEADERS/CODE (GOOGLE | CHROME/NODEJS)
        try {
            if (type) {
                resB = req.getContentText(); Object.entries(req.getAllHeaders()).forEach(([k, v,]) => { resH[String(k).toLowerCase()] = String(v).toLowerCase(); });
            } else {
                resB = await req.text(); req.headers.forEach((v, k) => { resH[String(k).toLowerCase()] = String(v).toLowerCase(); });
            };
            resC = req.status || req.getResponseCode();
        } catch (c) { reqE = 4; ret['msg'] = c; };
        // CHECAR SE TEM ERRO
        if (reqE > 0) { ret['msg'] = `API: ERRO | AO PROCESSAR HEADERS/BODY (NÃO NA FUNÇÃO)\n\n${ret.msg}`; return ret; }

        // → TENTAR: FAZER O PARSE DO BODY (SE NECESSÁRIO)
        if (bodyObject && resH['content-type']?.includes('application/json')) { try { let t = JSON.parse(resB); resB = t; } catch (c) { type = c; }; }

        ret['ret'] = true;
        ret['msg'] = 'API: OK';
        ret['res'] = {
            'code': resC,
            'headers': resH,
            'bodyObject': bodyObject === null ? null : typeof resB === 'object',
            'body': resB,
        };

    } catch (catchErr) {
        if (catchErr.name !== 'AbortError') {
            if (inf.ignoreErr) {
                ret['msg'] = `API: ERRO | CHAMADA PELA 'regexE'`;
            } else {
                let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
            }
        }
    };

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.res && { 'res': ret.res, }), };
};

// CHROME | NODEJS
(eng ? window : global)['api'] = api;
