// let infApi, retApi; // 'object': true | 'maxConnect'/'maxResponse': 10 | 'bodyReqRaw'/'bodyResRaw': true (antigo buffer) [Buffer.from(retApi.res.body)] | 'hideHeaders': false
// infApi = { e, 'method': 'POST', 'url': `https://ntfy.sh/AAA`, 'headers': { 'Content-Type': 'application/json', }, 'body': { 'aaa': 'bbb', }, }; // ### json/object
// infApi = { e, 'method': 'POST', 'url': `https://ntfy.sh/AAA`, 'headers': { 'Content-Type': 'application/x-www-form-urlencoded', }, 'body': { 'key': 'value', }, }; // ### x-www-form-urlencoded
// infApi = { e, 'method': 'POST', 'url': `https://ntfy.sh/AAA`, 'headers': { 'Content-Type': 'text/plain;charset=UTF-8', }, 'body': `Esse é o texto`, }; // ### text
// infApi = [
//     2, // ESPERAR APENAS PELAS x PRIMEIRAS REQUISIÇÕES CONCLUÍDAS OU 0 PARA TODAS
//     { 'method': 'GET', 'url': `https://httpstat.us/200?sleep=4000`, 'headers': { 'Content-Type': 'application/json', }, },
//     { 'method': 'GET', 'url': `https://httpstat.us/200?sleep=10`, 'headers': { 'Content-Type': 'application/json', }, },
//     { 'method': 'GET', 'url': `https://httpstat.us/200?sleep=10000`, 'headers': { 'Content-Type': 'application/json', }, },
// ];
// retApi = await api(infApi); console.log(retApi);

// fetch('http://www.cepdobrasil.com.br/rio-de-janeiro/rua-maria-da-silva.html', { 'headers': {}, 'body': null, 'method': 'GET', })
//     .then(res => { console.log('RES CODE:', res.status); console.log('RES HEADERS:', [...res.headers.entries(),]); return res.text(); })
//     .then(body => { console.log('RES BODY:', body); }).catch(error => { console.error('RESPONSE error:', error); });

// PUT → atualiza tudo | PATCH → atualiza apenas uma parte | TESTAR REQUISIÇÃO E TEMPO DE RESPOSTA → https://httpstat.us/200?sleep=5000

let e = currentFile(), ee = e;
async function api(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        let type = (typeof globalThis.doGet !== 'undefined'); let reqE = 0, typeB = null; if (Array.isArray(inf)) { // MANTER ANTES DAS VARIÁVEIS DA 'inf'!!!
            async function apiMulti(m, q) {
                let cs = q.map(() => new AbortController()); let ts = []; let r = []; let f = q.map((req, index) => {
                    let c = cs[index]; req.controller = c; let t = setTimeout(() => c.abort(), ((req.maxConnect || 20) * 1000)); ts.push(t); return api(req).then(res => {
                        clearTimeout(t); r.push({ index, ...res, }); if (r.length >= m) { cs.forEach(c => c.abort()); ts.forEach(clearTimeout); }
                    }).catch(e => { clearTimeout(t); r.push({ index, ...{ ret: false, msg: `API [MULTI]: ERRO | ${e.message}`, }, }); });
                }); await Promise.race(f); while (r.length < m && r.length < q.length) { await new Promise(resolve => setTimeout(resolve, 50)); } return r.slice(0, m);
            } let m = 1; let i = inf.findIndex(v => typeof v === 'number'); if (i !== -1) { m = inf.splice(i, 1)[0]; } m = m === 0 ? inf.length : m;
            let s = await apiMulti(m, inf); let t = Array.isArray(s) ? s.some(v => v.ret) : s.ret; return { t, 'msg': `API [MULTI]: ${t ? 'OK' : 'ERRO | ***'}`, s, };
        } let { method = '', url, headers = {}, body, maxConnect = 20, maxResponse = 20, object = false, controller, hideHeaders = true, bodyResRaw, bodyReqRaw, } = inf;

        // ❌❌❌❌❌❌❌❌❌❌❌❌ NÃO SUBIR AS LINHAS!!! (PARA SEREM VISUALIZADAS NO GOOGLE APP SCRIPT) | CHECAR SE TEM ERRO ❌❌❌❌❌❌❌❌❌❌❌❌
        reqE = !['GET', 'POST', 'PUT', 'DELETE', 'PATCH',].includes(method) ? 1 : !url ? 2 : (['POST', 'PUT', 'PATCH',].includes(method) && !body) ? 3 : 0;
        if (reqE > 0) { ret['msg'] = `API: ERRO | ${reqE === 1 ? `MÉTODOS ACEITOS 'GET', 'POST', 'PUT', 'DELETE', 'PATCH'` : `INFORMAR O ${reqE === 2 ? `'url'` : `'body'`}`}`; return ret; }

        // REQ: HEADERS
        let req, resU, resT, resC, resH = {}, resB; let reqOpt = { method, 'redirect': 'follow', 'keepalive': true, 'rejectUnauthorized': false, }; let timC = null, timR = null;
        reqOpt['headers'] = {}; if (Object.keys(headers).length > 0) { reqOpt.headers = headers; } function cT() { if (timC) { clearTimeout(timC); } if (timR) { clearTimeout(timR); } }

        // REQ: BODY | CHECAR SE TEM ERRO
        if (!['POST', 'PUT', 'PATCH',].includes(method)) { body = false; } else if (!bodyReqRaw) {
            let bodyT = !(typeof body === 'object') ? -1 : Object.keys(body).length; // → json/object | x-www-form-urlencoded
            if (!JSON.stringify(reqOpt.headers).toLowerCase().includes('x-www-form-urlencoded')) { body = bodyT === -1 ? body : JSON.stringify(body); }
            else if (!(bodyT > 0)) { reqE = 2; } else { body = Object.entries(body).map(([k, v,]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&'); }
        } if (reqE > 0) { ret['msg'] = `API: ERRO | 'body' VAZIO/NÃO É OBJETO [x-www-form-urlencoded]`; return ret; }

        // REQ: PREPARAR (GOOGLE | CHROME/NODE)
        if (type) { reqOpt['muteHttpExceptions'] = true; reqOpt['validateHttpsCertificates'] = true; if (body) { reqOpt['payload'] = body; } } else {
            controller = controller || new AbortController(); reqOpt['signal'] = controller.signal;
            if (body) {
                reqOpt['body'] = body;
                // let enc = new TextEncoder(); let len = enc.encode(reqOpt.body).length; reqOpt.headers['Content-Length'] = len;

                // if (bodyReqRaw) {
                //     if (typeof Buffer !== 'undefined' && Buffer.isBuffer(body)) {
                //         reqOpt.headers['Content-Length'] = body.length;
                //     } else if (body instanceof ArrayBuffer || ArrayBuffer.isView(body)) {
                //         reqOpt.headers['Content-Length'] = body.byteLength || body.length;
                //     }
                //     // ⚠️ não defina Content-Length se for blob ou stream (fetch cuida)
                // } else {
                //     let enc = new TextEncoder();
                //     let len = enc.encode(reqOpt.body).length;
                //     reqOpt.headers['Content-Length'] = len;
                // }

            }
        }

        // → REQ: PROCESSAR (GOOGLE | CHROME/NODE) | LIMPAR TIMEOUT (CHROME/NODE)
        if (type) { try { req = UrlFetchApp.fetch(url, reqOpt); } catch (c) { reqE = 3; ret['msg'] = c; } } else {
            async function fetchComTimeout() {
                let cnt = false; return new Promise((resolve) => {
                    timC = setTimeout(() => { if (!cnt) { controller.abort(); cT(); reqE = 1; resolve(false); } }, (maxConnect * 1000)); fetch(url, reqOpt).then(async req => {
                        cnt = true; clearTimeout(timC); timR = setTimeout(() => { controller.abort(); cT(); reqE = 2; resolve(false); }, (maxResponse * 1000));
                        let resB = await req[bodyResRaw ? 'arrayBuffer' : 'text'](); cT(); resolve({ cod: req.status, url: req.url, hea: req.headers, bod: resB, });
                    }).catch(err => { cT(); if (err.name === 'AbortError') { return; } reqE = 3; ret['msg'] = err; resolve(false); });
                });
            } req = await fetchComTimeout();
        }

        // RES: CHECAR SE TEM ERRO
        if (reqE === 1 || reqE === 2) { ret['msg'] = `API: ERRO | TEMPO MÁXIMO DE ${reqE === 1 ? 'CONEXÃO' : 'RESPOSTA'} ATINGIDO`; return ret; }
        else if (reqE > 0) { ret['msg'] = `API: ERRO | AO PROCESSAR REQUISIÇÃO → ${ret.msg}`; return ret; } let keyValLowCase = v => typeof v === 'string' ? v.toLowerCase() : v;

        try { // RES: PROCESSAR CODE/BODY/HEADERS/URL (GOOGLE | CHROME/NODE) | CHECAR SE TEM ERRO
            resC = req.cod || req.getResponseCode(); resB = type ? req.getContentText() : req.bod; resH = {}; (type ? Object.entries(req.getAllHeaders()) :
                [...req.hea,]).forEach(([k, v,]) => resH[keyValLowCase(k)] = v); resU = req.url || resH['X-Final-Url']; delete resH['X-Final-Url']; resT = resU && new URL(resU).origin;
        } catch (c) { reqE = 4; ret['msg'] = c; } if (reqE > 0) { ret['msg'] = `API: ERRO | AO PROCESSAR CODE/URL/HEADERS/BODY → ${ret.msg}`; return ret; }

        // → RES: FAZER O PARSE DO BODY (SE NECESSÁRIO)
        if (resH['content-type']?.includes('application/json')) { typeB = false; if (object) { try { let t = JSON.parse(resB); resB = t; typeB = true; } catch (c) { } } }

        ret['ret'] = true;
        ret['msg'] = 'API: OK';
        ret['res'] = {
            'code': resC,
            'object': typeB, // true → OBJETO | false → JSON | null → OUTRO TIPO
            'host': resT,
            'url': resU,
            ...(!hideHeaders && { 'headers': resH, }), // ADICIONAR HEADERS SE NECESSÁRIO
            'body': resB,
        };

    } catch (catchErr) {
        if (inf.ignoreErr) { ret['msg'] = `API: ERRO | CHAMADA PELA 'regexE'`; }
        else { let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res']; }
    }

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.res && { 'res': ret.res, }), };
}

// CHROME | NODE
globalThis['api'] = api;


