// let infGetCookies, retGetCookies // 'logFun': true,
// infGetCookies = { 'url': `https://www.google.com/`, 'cookieSearch': `__Secure-next-auth.session-token` }
// retGetCookies = await getCookies(infGetCookies);
// console.log(retGetCookies);

let e = import.meta.url;
async function getCookies(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        const errs = async (err, ret) => { if (!ret.stop) { ret['stop'] = true; let retRegexE = await regexE({ 'e': err, 'inf': inf, 'catchGlobal': true }) } }
        if (typeof window !== 'undefined') { window.addEventListener('error', (err) => errs(err, ret)); window.addEventListener('unhandledrejection', (err) => errs(err, ret)) }
        else { process.on('uncaughtException', (err) => errs(err, ret)); process.on('unhandledRejection', (err) => errs(err, ret)) }
    }
    try {
        if (!`rodar no → CHROME`.includes(engName)) { // [ENCAMINHAR PARA DEVICE]
            let infDevAndFun = { 'enc': true, 'data': { 'name': 'getCookies', 'par': inf, 'retInf': inf.retInf } };
            let retDevAndFun = await devFun(infDevAndFun); return retDevAndFun
        };

        let cookiesPromise = new Promise((resolve) => {
            chrome.cookies.getAll({ 'url': inf.url },
                cookies => {
                    let retCookies = JSON.stringify(cookies);
                    resolve(retCookies)
                })
        })
        let retCookies = await cookiesPromise;
        let cookie = '';
        let cookieMap = JSON.parse(retCookies).reduce((accumulator, v) => {
            cookie += `${v.name}=${v.value}; `;
            return accumulator
        }, '');
        if ((inf.cookieSearch) && !(retCookies.toString().includes(inf.cookieSearch))) {
            ret['msg'] = `\n #### ERRO #### GET COOKIES \n COOKIE '${inf.cookieSearch}' NAO CONTRADO \n\n`;
        } else {
            ret['res'] = { 'array': retCookies, 'concat': cookie };
            ret['msg'] = 'GET COOKIES: OK'
            ret['ret'] = true;
        }

        // ### LOG FUN ###
        if (inf && inf.logFun) {
            let infFile = { 'e': e, 'action': 'write', 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }, retFile
            infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; retFile = await file(infFile);
        }
    } catch (e) {
        let retRegexE = await regexE({ 'inf': inf, 'e': e, 'catchGlobal': false });
        ret['msg'] = retRegexE.res
    };
    return {
        ...({ ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}

if (eng) { // CHROME
    window['getCookies'] = getCookies;
} else { // NODEJS
    global['getCookies'] = getCookies;
}
