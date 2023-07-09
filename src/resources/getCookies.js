// import { getCookies } from './getCookies.js';
// const infGetCookies = {
//     'search': `casa - Pesquisa Google`
// }
// const retGetCookies = await getCookies(infGetCookies)
// console.log(retGetCookies.res)

import { searchTab } from './searchTab.js';

async function getCookies(inf) {
    const ret = { ret: false };

    try {
        const retSearchTab = await searchTab(inf.search)
        const cookiesPromise = new Promise((resolve) => {
            chrome.cookies.getAll({
                "url": retSearchTab.res.url
            }, cookies => {
                const retCookies = JSON.stringify(cookies)
                resolve(retCookies);
            });
        });
        const retCookies = await cookiesPromise;
        ret['ret'] = true;
        ret['msg'] = 'GET COOKIES: OK';
        ret['res'] = retCookies;
    }
    catch (e) {
        ret['msg'] = `GET COOKIES: ERRO | ${e}`;
    }

    if (!ret.ret) { console.log(ret.msg) }
    return ret
}

export { getCookies };