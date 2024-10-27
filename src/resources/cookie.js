// let infCookie, retCookie
// infCookie = { 'e': e, 'url': `https://www.google.com/`, 'cookieSearch': `__Secure-next-auth.session-token` }
// retCookie = await cookie(infCookie); console.log(retCookie);

let e = import.meta.url, ee = e;
async function cookie(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    try {
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
            ret['msg'] = `GET COOKIES: ERRO | COOKIE '${inf.cookieSearch}' NAO CONTRADO`;
        } else {
            ret['res'] = { 'array': retCookies, 'concat': cookie };
            ret['msg'] = 'GET COOKIES: OK'
            ret['ret'] = true;
        }

    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res;
    }; return { ...({ 'ret': ret.ret }), ...(ret.msg && { 'msg': ret.msg }), ...(ret.res && { 'res': ret.res }), };
};

// CHROME | NODEJS
(eng ? window : global)['cookie'] = cookie;