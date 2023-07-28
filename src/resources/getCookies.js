// await import('./getCookies.js');
// const infGetCookies = { 'url': retTabSearch.res.url }
// const retGetCookies = await getCookies(infGetCookies)
// console.log(retGetCookies);

await import('./functions.js');

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
        ret['ret'] = true;
        ret['msg'] = 'GET COOKIES: OK';
        ret['res'] = { 'array': retCookies, 'concat': cookie };
    }
    catch (e) {
        ret['msg'] = regexE({ 'e': e }).res;
    }

    if (!ret.ret) { console.log(ret.msg) }
    return ret
}

export { getCookies };

window['getCookies'] = getCookies;
