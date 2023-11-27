// let infApi, retApi
// infApi = { // ########## TYPE → json
//     'method': 'POST', 'url': `https://ntfy.sh/`, 'headers': { 'Content-Type': 'application/json' },
//     'body': { 'Chave1': 'Valor 1', 'Chave2': 'Valor 2' }
// };
// infApi = { // ########## TYPE → text
//     'method': 'POST', 'url': `https://ntfy.sh/`, 'headers': { 'Content-Type': 'text/plain;charset=UTF-8' },
//     'body': '{"topic":"OPSEUA","message":"a"}'
// };
// let formData = new URLSearchParams(); // ########## TYPE → x-www-form-urlencoded
// formData.append('grant_type', 'client_credentials');
// formData.append('resource', 'https://graph.microsoft.com'); infApi = {
//     'method': 'POST', 'url': `https://ntfy.sh/`, 'headers': { 'Content-Type': 'application/x-www-form-urlencoded' },
//     'body': formData.toString()
// };
// retApi = await api(infApi);
// console.log(retApi)

async function api(inf) {
    let ret = { 'ret': false };
    try {
        if (typeof UrlFetchApp !== 'undefined') { // ################ GOOGLE APP SCRIPT
            let reqOpt = { 'method': inf.method, 'redirect': 'follow', 'keepalive': true, 'muteHttpExceptions': true, 'validateHttpsCertificates': true, };
            if (inf.headers) {
                reqOpt['headers'] = inf.headers
            }
            if ((inf.body) && (inf.method == 'POST' || inf.method == 'PUT')) {
                reqOpt['body'] = typeof inf.body === 'object' ? JSON.stringify(inf.body) : inf.body
            }
            let req = UrlFetchApp.fetch(inf.url, reqOpt);
            let resHeaders = req.getAllHeaders();
            let resBody = req.getContentText();
            ret['ret'] = true;
            ret['msg'] = 'API: OK';
            ret['res'] = {
                'code': req.getResponseCode(),
                'headers': resHeaders,
                'body': resBody
            }
        } else { // ######################################### NODEJS ou CHROME
            let reqOpt = { 'method': inf.method, 'redirect': 'follow', 'keepalive': true };
            if (inf.headers) {
                reqOpt['headers'] = inf.headers
            }; if ((inf.body) && (inf.method == 'POST' || inf.method == 'PUT')) {
                reqOpt['body'] = typeof inf.body === 'object' ? JSON.stringify(inf.body) : inf.body
            };
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
