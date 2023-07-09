// import { getCookies } from './resources/getCookies.js';
// const infGetCookies = {
//   'search': `casa - Pesquisa Google`
// }
// const retGetCookies = await getCookies(infGetCookies)
// console.log(retGetCookies);

import { searchTab } from './searchTab.js';

async function getCookies(inf) {
    const ret = { ret: false };

    try {
        const retSearchTab = await searchTab(inf)
        const cookiesPromise = new Promise((resolve) => {
            chrome.cookies.getAll({
                "url": retSearchTab.res.url
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
        ret['res'] = {'array':retCookies,'concat':cookie};
    }
    catch (e) {
        ret['msg'] = `GET COOKIES: ERRO | ${e}`;
    }

    if (!ret.ret) { console.log(ret.msg) }
    return ret
}

export { getCookies };