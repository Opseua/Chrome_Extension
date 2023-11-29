// let infApi, retApi // 'logFun': true,
// infApi = { // ########## TYPE → json
//     'method': 'POST', 'url': `https://ntfy.sh/`,
//     'headers': {
//         'Content-Type': 'application/json'
//     },
//     'body': { 'Chave1': 'Valor 1', 'Chave2': 'Valor 2' }
// };
// infApi = { // ########## TYPE → text
//     'method': 'POST', 'url': `https://ntfy.sh/`,
//     'headers': {
//         'Content-Type': 'text/plain;charset=UTF-8'
//     },
//     'body': `ESSE É O VALOR`
// };
// infApi = { // ########## TYPE → urlencoded
//     'method': 'POST', 'url': `https://ntfy.sh/`,
//     'headers': {
//         'Content-Type': 'application/x-www-form-urlencoded'
//     },
//     'body': { 'Chave1': 'Valor 1', 'Chave2': 'Valor 2' }
// };
// retApi = await api(infApi);
// console.log(retApi.ret)

// async function api(inf) {
//     let ret = { 'ret': false };
//     try {
//         if (typeof UrlFetchApp !== 'undefined') { // ################ GOOGLE APP SCRIPT
//             let reqOpt = { 'method': inf.method, 'redirect': 'follow', 'keepalive': true, 'muteHttpExceptions': true, 'validateHttpsCertificates': true, };
//             if (inf.headers) {
//                 reqOpt['headers'] = inf.headers
//             }
//             if ((inf.body) && (inf.method == 'POST' || inf.method == 'PUT')) {
//                 reqOpt['body'] = typeof inf.body === 'object' ? JSON.stringify(inf.body) : inf.body
//             }
//             let req = UrlFetchApp.fetch(inf.url, reqOpt);
//             let resHeaders = req.getAllHeaders();
//             let resBody = req.getContentText();
//             ret['ret'] = true;
//             ret['msg'] = 'API: OK';
//             ret['res'] = {
//                 'code': req.getResponseCode(),
//                 'headers': resHeaders,
//                 'body': resBody
//             }
//         } else { // ######################################### NODEJS ou CHROME
//             let reqOpt = { 'method': inf.method, 'redirect': 'follow', 'keepalive': true };
//             if (inf.headers) {
//                 reqOpt['headers'] = inf.headers
//             };
//             if ((inf.body) && (inf.method == 'POST' || inf.method == 'PUT')) {
//                 if (JSON.stringify(inf.headers).includes('x-www-form-urlencoded')) {
//                     // x-www-form-urlencoded
//                     reqOpt['body'] = new URLSearchParams(inf.body).toString();
//                 } else {
//                     // application/json | text/plain;charset=UTF-8
//                     reqOpt['body'] = typeof inf.body === 'object' ? JSON.stringify(inf.body) : inf.body
//                 }
//             };

//             console.log(reqOpt)
//             return ret

//             let req = await fetch(inf.url, reqOpt);
//             let resHeaders = {};
//             req.headers.forEach((value, name) => { resHeaders[name] = value })
//             let resBody = await req.text();
//             ret['ret'] = true;
//             ret['msg'] = 'API: OK';
//             ret['res'] = {
//                 'code': req.status,
//                 'headers': resHeaders,
//                 'body': resBody
//             }

//             // ### LOG FUN ###
//             if (inf.logFun) {
//                 let infFile = { 'action': 'write', 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }, retFile
//                 infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; retFile = await file(infFile);
//             }
//         }
//     } catch (e) {
//         let m = await regexE({ 'e': e });
//         ret['msg'] = m.res
//     };
//     return {
//         ...({ ret: ret.ret }),
//         ...(ret.msg && { msg: ret.msg }),
//         ...(ret.res && { res: ret.res }),
//     };
// }

// if (eng) { // CHROME
//     window['api'] = api;
// } else { // NODEJS
//     global['api'] = api;
// }
















async function api(inf) {
    let ret = { 'ret': false };
    try {
        if (typeof UrlFetchApp !== 'undefined') { // ################ GOOGLE APP SCRIPT
            // Código para Google Apps Script (GAS)
        } else { // ######################################### NODEJS ou CHROME
            let reqOpt = { 'method': inf.method, 'redirect': 'follow', 'keepalive': true };

            // Adicionar cabeçalho Content-Type para 'x-www-form-urlencoded'
            if (inf.method === 'POST' || inf.method === 'PUT') {
                reqOpt.headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    ...inf.headers
                };
            } else {
                reqOpt.headers = inf.headers;
            }

            // Formatar dados no corpo da requisição se existirem
            if (inf.body && (inf.method === 'POST' || inf.method === 'PUT')) {
                reqOpt.body = new URLSearchParams(inf.body).toString();
            }

            let req = await fetch(inf.url, reqOpt);
            let resHeaders = {};
            req.headers.forEach((value, name) => { resHeaders[name] = value })
            let resBody = await req.text();
            ret['ret'] = true;
            ret['msg'] = 'API: OK';
            ret['res'] = {
                'code': req.status,
                'headers': resHeaders,
                'body': resBody
            }

            // ### LOG FUN ###
            if (inf.logFun) {
                let infFile = { 'action': 'write', 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }, retFile
                infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; retFile = await file(infFile);
            }
        }
    } catch (e) {
        let m = await regexE({ 'e': e });
        ret['msg'] = m.res
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
