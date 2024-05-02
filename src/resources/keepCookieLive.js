let e = import.meta.url, ee = e;
async function keepCookieLive(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    try {
        let retGetCookies, infChromeActions, retChromeActions
        let retConfigStorage = await configStorage({ 'e': e, 'action': 'get', 'key': 'chatOra.ai' });
        retConfigStorage = retConfigStorage.res
        // ATUALIZAR A PÁGINA DO ora.ai
        let retTabSearch = await tabSearch({ 'e': e, 'search': '*ora.ai*', 'openIfNotExist': true, 'active': false, 'pinned': true, 'url': retConfigStorage.meu });
        chrome.tabs.update(retTabSearch.res.id, { url: retConfigStorage.meu });
        await new Promise(resolve => { setTimeout(resolve, 10000) })
        retGetCookies = await getCookies({ 'e': e, 'url': retConfigStorage.meu, 'cookieSearch': '__Secure-next-auth.session-token' });
        if (!retGetCookies.ret) {
            // ABRIR A PÁGINA DE LOGIN
            chrome.tabs.update(retTabSearch.res.id, { url: 'https://ora.ai/signin' });
            await new Promise(resolve => { setTimeout(resolve, 10000) })
            // CLICAR NO ÍCONE DO GOOGLE PARA FAZER LOGIN
            infChromeActions = {
                'e': e, 'id': retTabSearch.res.id, 'action': 'script', 'method': 'xpath', 'execute': 'click',
                'element': `//*[@id="__next"]/div/div/div[3]/div[2]/div/main/div/div/button/div`
            };
            retChromeActions = await chromeActions(infChromeActions);
            await new Promise(resolve => { setTimeout(resolve, 10000) })
            // CLICAR NA PRIMEIRA CONTA DO GOOGLE
            infChromeActions = {
                'e': e, 'id': retTabSearch.res.id, 'action': 'script', 'method': 'xpath', 'execute': 'click',
                'element': `//*[@id="view_container"]/div/div/div[2]/div/div[1]/div/form/span/section/div/div/div/div/ul/li[1]/div`
            };
            retChromeActions = await chromeActions(infChromeActions);
            await new Promise(resolve => { setTimeout(resolve, 10000) })
            // ABRIR A MINHA PÁGINA DO ora.ai
            chrome.tabs.update(retTabSearch.res.id, { url: retConfigStorage.meu });
            await new Promise(resolve => { setTimeout(resolve, 10000) })
            retGetCookies = await getCookies({ 'e': e, 'url': retConfigStorage.meu, 'cookieSearch': '__Secure-next-auth.session-token' });
        }
        let time = dateHour().res;
        retConfigStorage['cookie'] = retGetCookies.res.concat;
        retConfigStorage['dateHour'] = `${time.day}/${time.mon} ${time.hou}:${time.min}:${time.sec}`;
        let infConfigStorage = { 'e': e, 'action': 'set', 'key': 'chatOra.ai', 'value': retConfigStorage }
        retConfigStorage = await configStorage(infConfigStorage);
        let send = {
            'fun': [
                { 'securityPass': globalWindow.securityPass, 'retInf': false, 'name': 'configStorage', 'par': infConfigStorage },
                { 'securityPass': globalWindow.securityPass, 'retInf': false, 'name': 'log', 'par': { 'e': e, 'folder': 'JavaScript', 'path': `log.txt`, 'text': `keepCookieLive` } }
            ]
        };
        listenerAcionar('messageSendOrigin_127.0.0.1:1234/ORIGEM_AQUI', { 'destination': '127.0.0.1:1234/DESTINO_AQUI', 'message': send, 'secondsAwait': 0, });
        ret['msg'] = `KEEP COOKIE LIVE: OK`;
        ret['ret'] = true;
    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, });
        ret['msg'] = retRegexE.res
    };
    return {
        ...({ ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}

if (eng) { // CHROME
    window['keepCookieLive'] = keepCookieLive;
} else { // NODEJS
    global['keepCookieLive'] = keepCookieLive;
}


