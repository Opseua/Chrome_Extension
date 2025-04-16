// let infApi, retApi; 'buffer' → true
// infApi = { // ###### → json/object
//     e, 'method': 'POST', 'url': `https://ntfy.sh/AAA`, 'headers': { 'Content-Type': 'application/json', },
//     'body': { 'aaa': 'bbb', }, 'max': 10, 'object': true, 'hideHeaders': true,
// };
// infApi = { // ###### → text
//     e, 'method': 'POST', 'url': `https://ntfy.sh/AAA`, 'headers': { 'Content-Type': 'text/plain;charset=UTF-8', },
//     'body': `Esse é o texto`, 'max': 10, 'object': true, 'hideHeaders': true,
// };
// infApi = { // ###### → x-www-form-urlencoded
//     e, 'method': 'POST', 'url': `https://ntfy.sh/AAA`, 'headers': { 'Content-Type': 'application/x-www-form-urlencoded', },
//     'body': { 'Chave': 'Valor', }, 'max': 10, 'object': true, 'hideHeaders': true,
// };
// infApi = [
//     2, // ESPERAR APENAS PELAS x PRIMEIRAS REQUISIÇÕES CONCLUÍDAS OU 0 PARA TODAS
//     { 'method': 'GET', 'url': `https://httpstat.us/200?sleep=4000`, 'headers': { 'Content-Type': 'application/json', }, 'max': 10, },
//     { 'method': 'GET', 'url': `https://httpstat.us/200?sleep=10`, 'headers': { 'Content-Type': 'application/json', }, 'max': 10, },
//     { 'method': 'GET', 'url': `https://httpstat.us/200?sleep=10000`, 'headers': { 'Content-Type': 'application/json', }, 'max': 5, },
// ];
// retApi = await api(infApi); console.log(retApi);

// fetch('http://www.cepdobrasil.com.br/rio-de-janeiro/rua-maria-da-silva.html', { 'headers': {}, 'body': null, 'method': 'GET', })
//     .then(res => { console.log('RES CODE:', res.status); console.log('RES HEADERS:', [...res.headers.entries(),]); return res.text(); })
//     .then(body => { console.log('RES BODY:', body); }).catch(error => { console.error('RESPONSE error:', error); });

// TESTAR REQUISIÇÃO E TEMPO DE RESPOSTA → https://httpstat.us/200?sleep=5000

let e = import.meta.url, ee = e;
async function api(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        let type = (typeof globalThis.doGet !== 'undefined'); if (Array.isArray(inf)) { // MANTER ANTES DAS VARIÁVEIS DA 'inf'!!!
            async function apiMulti(m, q) {
                let cs = q.map(() => new AbortController()); let ts = []; let r = []; let f = q.map((req, index) => {
                    let c = cs[index]; req.controller = c; let t = setTimeout(() => c.abort(), (req.max || 20) * 1000); ts.push(t); return api(req).then(res => {
                        clearTimeout(t); r.push({ index, ...res, }); if (r.length >= m) { cs.forEach(c => c.abort()); ts.forEach(clearTimeout); }
                    }).catch(e => { clearTimeout(t); r.push({ index, ...{ ret: false, msg: `API [MULTI]: ERRO | ${e.message}`, }, }); });
                }); await Promise.race(f); while (r.length < m && r.length < q.length) { await new Promise(resolve => setTimeout(resolve, 50)); } return r.slice(0, m);
            } let m = 1; let i = inf.findIndex(v => typeof v === 'number'); if (i !== -1) { m = inf.splice(i, 1)[0]; } m = m === 0 ? inf.length : m;
            let s = await apiMulti(m, inf); let t = Array.isArray(s) ? s.some(v => v.ret) : s.ret; return { t, 'msg': `API [MULTI]: ${t ? 'OK' : 'ERRO | ***'}`, s, };
        } let { method = '', url = false, headers = {}, body = false, max = 20, object = false, controller = false, hideHeaders = true, buffer = false, } = inf; let reqE = 0, typeB = null;

        // ❌❌❌❌❌❌❌❌❌❌❌❌ NÃO SUBIR AS LINHAS!!! (PARA SEREM VISUALIZADAS NO GOOGLE APP SCRIPT) | CHECAR SE TEM ERRO ❌❌❌❌❌❌❌❌❌❌❌❌
        reqE = !['GET', 'POST', 'PUT',].includes(method) ? 1 : !url ? 2 : (['POST', 'PUT',].includes(method) && !body) ? 3 : 0; function cT(t) { clearTimeout(t); }
        if (reqE > 0) { ret['msg'] = `API: ERRO | ${reqE === 1 ? `MÉTODOS ACEITOS 'GET', 'POST', 'PUT'` : `INFORMAR O ${reqE === 2 ? `'url'` : `'body'`}`}`; return ret; }

        // REQ: HEADERS
        let req, resU, resC, resH = {}, resB; let reqOpt = { method, 'redirect': 'follow', 'keepalive': true, 'rejectUnauthorized': false, }; let timId;
        reqOpt['headers'] = {}; if (Object.keys(headers).length > 0) { reqOpt.headers = headers; }

        // REQ: BODY | CHECAR SE TEM ERRO
        if (!['POST', 'PUT',].includes(method)) { body = false; } else {
            let bodyT = !(typeof body === 'object') ? -1 : Object.keys(body).length;  // → json/object/text | x-www-form-urlencoded
            if (!JSON.stringify(reqOpt.headers).toLowerCase().includes('x-www-form-urlencoded')) { body = bodyT === -1 ? body : JSON.stringify(body); }
            else if (!(bodyT > 0)) { reqE = 2; } else { body = Object.entries(body).map(([k, v,]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&'); }
        } if (reqE > 0) { ret['msg'] = `API: ERRO | 'body' VAZIO/NÃO É OBJETO [x-www-form-urlencoded]`; return ret; }

        // REQ: PREPARAR (GOOGLE | CHROME/NODEJS)
        if (type) { reqOpt['muteHttpExceptions'] = true; reqOpt['validateHttpsCertificates'] = true; if (body) { reqOpt['payload'] = body; } } else {
            controller = controller || new AbortController(); timId = setTimeout(() => controller.abort(), (max * 1000)); reqOpt['signal'] = controller.signal;
            if (body) { reqOpt['body'] = body; let enc = new TextEncoder(); let len = enc.encode(reqOpt.body).length; reqOpt.headers['Content-Length'] = len; }
        }

        // → TENTAR: PROCESSAR REQUISIÇÃO (GOOGLE | CHROME/NODEJS) | LIMPAR TIMEOUT (CHROME/NODEJS) | CHECAR SE TEM ERRO
        try { if (type) { req = UrlFetchApp.fetch(url, reqOpt); } else { req = await fetch(url, reqOpt); cT(timId); } } catch (c) { reqE = 3; ret['msg'] = c; }
        if (!type) { cT(timId); } if (reqE > 0 && String(ret.msg).includes('AbortError')) { ret['msg'] = `API: ERRO | TEMPO MÁXIMO DE CONEXÃO ATINGIDO`; return ret; }
        else if (reqE > 0) { ret['msg'] = `API: ERRO | AO PROCESSAR REQUISIÇÃO (NÃO NA FUNÇÃO)\n\n${ret.msg}`; return ret; }

        try { // → TENTAR: PROCESSAR BODY/HEADERS/CODE (GOOGLE | CHROME/NODEJS) | CHECAR SE TEM ERRO
            if (type) { resB = req.getContentText(); Object.entries(req.getAllHeaders()).forEach(([k, v,]) => { resH[String(k).toLowerCase()] = String(v).toLowerCase(); }); }
            else { resB = await req[buffer ? 'arrayBuffer' : 'text'](); req.headers.forEach((v, k) => { resH[String(k).toLowerCase()] = String(v).toLowerCase(); }); }
            resC = req.status || req.getResponseCode(); resU = (type ? req.getHeaders()['X-Final-Url'] : req.url) || false;
        } catch (c) { reqE = 4; ret['msg'] = c; } if (reqE > 0) { ret['msg'] = `API: ERRO | AO PROCESSAR HEADERS/BODY (NÃO NA FUNÇÃO)\n\n${ret.msg}`; return ret; }

        // → TENTAR: FAZER O PARSE DO BODY (SE NECESSÁRIO)
        if (resH['content-type']?.includes('application/json')) { typeB = false; if (object) { try { let t = JSON.parse(resB); resB = t; typeB = true; } catch (c) { } } }

        ret['ret'] = true;
        ret['msg'] = 'API: OK';
        ret['res'] = {
            'code': resC,
            'object': typeB, // true → OBJETO | false → JSON | null → OUTRO TIPO
            'url': resU,
            ...(!hideHeaders && { 'headers': resH, }), // ADICIONAR HEADERS APENAS SE NECESSÁRIO
            'body': resB,
        };

    } catch (catchErr) {
        if (catchErr.name !== 'AbortError') {
            if (inf.ignoreErr) { ret['msg'] = `API: ERRO | CHAMADA PELA 'regexE'`; }
            else { let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res']; }
        }
    }

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.res && { 'res': ret.res, }), };
}

// CHROME | NODEJS
globalThis['api'] = api;


