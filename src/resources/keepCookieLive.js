async function keepCookieLive(inf) {
    await import('./@functions.js');
    let ret = { 'ret': false };
    try {
        if (!`rodar no → CHROME`.includes(engName)) { // [ENCAMINHAR PARA DEVICE]
            let infDevAndFun = { 'enc': true, 'data': { 'name': 'keepCookieLive', 'par': inf, 'retInf': inf.retInf } };
            let retDevAndFun = await devFun(infDevAndFun); return retDevAndFun
        };
        let retGetCookies, infChromeActions, retChromeActions
        let retConfigStorage = await configStorage({ 'action': 'get', 'key': 'chatGptOra.ai' });
        retConfigStorage = retConfigStorage.res
        // ATUALIZAR A PÁGINA DO ora.ai
        let retTabSearch = await tabSearch({ 'search': '*ora.ai*', 'openIfNotExist': true, 'active': false, 'pinned': true, 'url': retConfigStorage.meu });
        chrome.tabs.update(retTabSearch.res.id, { url: retConfigStorage.meu });
        await new Promise(resolve => { setTimeout(resolve, 10000) })
        retGetCookies = await getCookies({ 'url': retConfigStorage.meu, 'cookieSearch': '__Secure-next-auth.session-token' });
        if (!retGetCookies.ret) {
            // ABRIR A PÁGINA DE LOGIN
            chrome.tabs.update(retTabSearch.res.id, { url: 'https://ora.ai/signin' });
            await new Promise(resolve => { setTimeout(resolve, 10000) })
            // CLICAR NO ÍCONE DO GOOGLE PARA FAZER LOGIN
            infChromeActions = {
                'id': retTabSearch.res.id, 'action': 'script', 'method': 'xpath', 'execute': 'click',
                'element': `//*[@id="__next"]/div/div/div[3]/div[2]/div/main/div/div/button/div`
            };
            retChromeActions = await chromeActions(infChromeActions);
            await new Promise(resolve => { setTimeout(resolve, 10000) })
            // CLICAR NA PRIMEIRA CONTA DO GOOGLE
            infChromeActions = {
                'id': retTabSearch.res.id, 'action': 'script', 'method': 'xpath', 'execute': 'click',
                'element': `//*[@id="view_container"]/div/div/div[2]/div/div[1]/div/form/span/section/div/div/div/div/ul/li[1]/div`
            };
            retChromeActions = await chromeActions(infChromeActions);
            await new Promise(resolve => { setTimeout(resolve, 10000) })
            // ABRIR A MINHA PÁGINA DO ora.ai
            chrome.tabs.update(retTabSearch.res.id, { url: retConfigStorage.meu });
            await new Promise(resolve => { setTimeout(resolve, 10000) })
            retGetCookies = await getCookies({ 'url': retConfigStorage.meu, 'cookieSearch': '__Secure-next-auth.session-token' });
        }
        let time = dateHour().res;
        retConfigStorage['cookie'] = retGetCookies.res.concat;
        retConfigStorage['dateHour'] = `${time.day}/${time.mon} ${time.hou}:${time.min}:${time.sec}`;
        let infConfigStorage = { 'action': 'set', 'key': 'chatGptOra.ai', 'value': retConfigStorage }
        retConfigStorage = await configStorage(infConfigStorage);
        let send = {
            'fun': [
                { 'securityPass': securityPass, 'retInf': false, 'name': 'configStorage', 'par': infConfigStorage },
                { 'securityPass': securityPass, 'retInf': false, 'name': 'log', 'par': { 'folder': 'JavaScript', 'path': `log.txt`, 'text': `keepCookieLive` } }
            ]
        };
        wsSend(devNodeJS, send);
        ret['msg'] = `KEEP COOKIE LIVE: OK`;
        ret['ret'] = true;
    } catch (e) {
        let m = await regexE({ 'e': e });
        ret['msg'] = m.res
    };
    return ret
}

if (typeof eng === 'boolean') {
    if (eng) { // CHROME
        window['keepCookieLive'] = keepCookieLive;
    } else { // NODEJS
        global['keepCookieLive'] = keepCookieLive;
    }
}

