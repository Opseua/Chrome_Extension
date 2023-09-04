// const infGetCookies = { 'url': retTabSearch.res.url, 'cookieSearch': '__Secure-next-auth.session-token' }
// const retGetCookies = await getCookies(infGetCookies)
// console.log(retGetCookies);

async function getCookies(inf) {
    let ret = { 'ret': false };
    try {
        const cookiesPromise = new Promise((resolve) => {
            chrome.cookies.getAll({
                'url': inf.url
            }, cookies => {
                const retCookies = JSON.stringify(cookies)
                resolve(retCookies);
            });
        });
        const retCookies = await cookiesPromise;

        let cookie = '';
        const cookieMap = JSON.parse(retCookies).reduce((accumulator, v) => {
            cookie += `${v.name}=${v.value}; `;
            return accumulator;
        }, '');

        if ((inf.cookieSearch) && !(retCookies.toString().includes(inf.cookieSearch))) {
            ret['msg'] = `\n #### ERRO #### GET COOKIES \n COOKIE '${inf.cookieSearch}' NAO CONTRADO \n\n`;
        } else {
            ret['ret'] = true;
            ret['msg'] = 'GET COOKIES: OK';
            ret['res'] = { 'array': retCookies, 'concat': cookie };
        }

    } catch (e) { ret['msg'] = regexE({ 'e': e }).res }
    if (!ret.ret) { console.log(ret.msg) }
    return ret
};

if (typeof window !== 'undefined') { // CHROME
    window['getCookies'] = getCookies;
} else { // NODEJS
    global['getCookies'] = getCookies;
}