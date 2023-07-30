const { notification } = await import('./notification.js');
const { getCookies } = await import('./getCookies.js');
const { regex, fileRead, fileWrite, dateHour, random, configStorage } = await import('./functions.js');
const { api } = await import('./api.js');

let retGetXAppId = false
let stopLoop = false
async function leads(inf) {
    let ret = { 'ret': false };
    try {

        const infGetCookies = { 'search': '*instagram*', 'openIfNotExist': true, 'active': true, 'pinned': false, 'url': 'https://www.instagram.com/' }
        const retGetCookies = await getCookies(infGetCookies)
        if (retGetCookies.ret) {
            if (retGetCookies.res.concat.includes('ds_user_id')) {

                const infFileRead = { 'file': `D:/Downloads/Google Chrome/leadsFiles/array/arrayProfiles.txt` }
                const retFileRead = await fileRead(infFileRead)
                if (retGetCookies.ret) {
                    ret['ret'] = true;
                    let arrProfiles = JSON.parse(retFileRead.res)

                    while (arrProfiles.length > 0) {
                        if (stopLoop) { break }
                        const infRandom = { 'min': 10, 'max': 20, 'msg': true }
                        const retRandom = await random(infRandom)
                        await new Promise(resolve => setTimeout(resolve, retRandom.res));
                        // ########################
                        let arrayPro = arrProfiles[0]
                        console.log(`RESTANTE: ${arrProfiles.length} = ${arrayPro}`)

                        async function getFetch() {
                            console.log('RODOU getFetch')
                            try {
                                const response = await fetch(`https://www.instagram.com/${arrayPro}/`, {
                                    "headers": {
                                        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                                        "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
                                        "sec-ch-prefers-color-scheme": "dark",
                                        "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Google Chrome\";v=\"114\"",
                                        "sec-ch-ua-full-version-list": "\"Not.A/Brand\";v=\"8.0.0.0\", \"Chromium\";v=\"114.0.5735.199\", \"Google Chrome\";v=\"114.0.5735.199\"",
                                        "sec-ch-ua-mobile": "?0",
                                        "sec-ch-ua-platform": "\"Windows\"",
                                        "sec-ch-ua-platform-version": "\"15.0.0\"",
                                        "sec-fetch-dest": "document",
                                        "sec-fetch-mode": "navigate",
                                        "sec-fetch-site": "none",
                                        "sec-fetch-user": "?1",
                                        "upgrade-insecure-requests": "1",
                                        //"cookie": "dpr=1.25; ig_did=F66BF6CD-C1F8-4831-9E27-4C994B66893A; ig_nrcb=1; datr=_LqlZINp88m9HnZGIFGO2lA4; mid=ZKW6_wALAAEUS9Zxybqg1FXEZS2C; csrftoken=1tBgSan0IX4cDutrkWl64efOExEVQYzt; ds_user_id=2229804097; fbm_124024574287414=base_domain=.instagram.com; shbid=\"9407\\0542229804097\\0541721230309:01f73937a7258d6234d0eb9d23abc1e442f3d2e1158dbdda9e7124e6411fdac29f59b0f3\"; shbts=\"1689694309\\0542229804097\\0541721230309:01f7f2a455ee60ed45811bbbeafd8844f8883430c12b146a5a9876e17a8281ff4844d0b5\"; sessionid=2229804097%3AGglnprjcSY8Dur%3A7%3AAYev6OLN-CdWAe8x0E67zr-4YiIVtEeKc-thnpZkLJE; rur=\"VLL\\0542229804097\\0541721241957:01f7746cb6767a5c370a0508eef93894ef8502cb1bb245f50b3be5f367a4fab3121fc56b\""
                                    },
                                    "referrerPolicy": "strict-origin-when-cross-origin",
                                    "body": null,
                                    "method": "GET"
                                });
                                const status = response.status;
                                const data = await response.text();
                                const regex = /,"APP_ID":"(.*?)","IS_BUSINESS_DOMAIN":/;
                                const match = data.match(regex);
                                if (match && match[1]) {
                                    return match[1].replace(/\\/g, '')
                                } else {
                                    return 'NAO ENCONTRADO';
                                    stopLoop = true
                                }
                                console.log(status);
                            } catch (error) {
                                console.error('Erro ao fazer a requisição:', error);
                                stopLoop = true
                            }
                        }
                        if (!retGetXAppId) {
                            retGetXAppId = await getFetch();
                        }

                        const infApi = {
                            url: `https://www.instagram.com/api/v1/users/web_profile_info/?username=${arrayPro}`,
                            method: 'GET',
                            headers: {
                                "accept": "*/*",
                                "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
                                "sec-ch-prefers-color-scheme": "dark",
                                "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Google Chrome\";v=\"114\"",
                                "sec-ch-ua-full-version-list": "\"Not.A/Brand\";v=\"8.0.0.0\", \"Chromium\";v=\"114.0.5735.199\", \"Google Chrome\";v=\"114.0.5735.199\"",
                                "sec-ch-ua-mobile": "?0",
                                "sec-ch-ua-platform": "\"Windows\"",
                                "sec-ch-ua-platform-version": "\"15.0.0\"",
                                "sec-fetch-dest": "empty",
                                "sec-fetch-mode": "cors",
                                "sec-fetch-site": "same-origin",
                                //"viewport-width": "722",
                                //"x-asbd-id": "129477",
                                //"x-csrftoken": "1tBgSan0IX4cDutrkWl64efOExEVQYzt",
                                "x-ig-app-id": retGetXAppId,
                                //"x-ig-www-claim": "hmac.AR1wV1sMgoHXgsGU4mIp0BTocULDQP6VdlUgkF37F2OXYdan",
                                "x-requested-with": "XMLHttpRequest",
                                "cookie": retGetCookies.res.concat,
                                "Referer": `https://www.instagram.com/${arrayPro}/`,
                                "Referrer-Policy": "strict-origin-when-cross-origin"
                            }
                        };
                        const retApi = await api(infApi);
                        //console.log( retApi)
                        if (retApi.ret && JSON.stringify(retApi.res.body).includes('biography')) {

                            const RetDateHour = dateHour()
                            const infFileWrite1 = {
                                'file': `leadsFiles/api-v1-users-web_profile_info/${RetDateHour.res.tim}=${arrayPro}.txt`,
                                'rewrite': false, // 'true' adiciona no MESMO arquivo, 'false' cria outro em branco
                                'text': `${retApi.res.body}`
                            };
                            const retFileWrite1 = await fileWrite(infFileWrite1);
                            //console.log(retFileWrite1);

                            const res = JSON.parse(retApi.res.body)
                            //console.log(res.data.user.biography)

                            arrProfiles.shift();
                            const infFileWrite2 = {
                                'file': `leadsFiles/array/arrayProfiles.txt`,
                                'rewrite': false, // 'true' adiciona no MESMO arquivo, 'false' cria outro em branco
                                'text': JSON.stringify(arrProfiles)
                            };
                            const retFileWrite2 = await fileWrite(infFileWrite2);
                            //console.log(retFileWrite2);

                        } else {
                            console.log('JSON DO PERFIL NAO VALIDO');
                            stopLoop = true
                            return
                        }
                    }

                    console.log('fim')
                }
            } else {
                //ret['msg'] = `LEADS: ERRO | NAO ACHOU O COOKIE DO USUARIO`;
                ret['msg'] = `\n #### ERRO ####  LEADS \n NAO ACHOU O COOKIE DO USUARIO \n\n`;
            }
        }

    } catch (e) {
        ret['msg'] = regexE({ 'e': e }).res
    }

    if (!ret.ret) { console.log(ret.msg) }
    return ret
}

// export { leads }
