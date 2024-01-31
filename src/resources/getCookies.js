// let infGetCookies, retGetCookies // 'logFun': true,
// infGetCookies = { 'e': e, 'url': `https://www.google.com/`, 'cookieSearch': `__Secure-next-auth.session-token` }
// retGetCookies = await getCookies(infGetCookies);
// console.log(retGetCookies);

let e = import.meta.url, ee = e
async function getCookies(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        let errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
    try {
        if (!`rodar no → CHROME`.includes(engName)) { // [ENCAMINHAR PARA DEVICE]
            let infDevAndFun = { 'e': e, 'enc': true, 'data': { 'name': 'getCookies', 'par': inf, 'retInf': inf.retInf } };
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
        JSON.parse(retCookies).reduce((accumulator, v) => {
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
            let infFile = { 'e': e, 'action': 'write', 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }
            infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; file(infFile);
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
