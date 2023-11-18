// let infGetCookies, retGetCookies
// infGetCookies = { 'url': `https://www.google.com/`, 'cookieSearch': `__Secure-next-auth.session-token` }
// retGetCookies = await getCookies(infGetCookies);
// console.log(retGetCookies);

async function getCookies(inf) {
    await import('./@functions.js');
    let ret = { 'ret': false };
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
    } catch (e) {
        let m = await regexE({ 'e': e });
        ret['msg'] = m.res
    };
    return ret
};

if (typeof eng === 'boolean') {
    if (eng) { // CHROME
        window['getCookies'] = getCookies;
    } else { // NODEJS
        global['getCookies'] = getCookies;
    }
}