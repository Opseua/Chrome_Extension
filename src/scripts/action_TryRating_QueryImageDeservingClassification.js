let e = import.meta.url, ee = e;
async function action_TryRating_QueryImageDeservingClassification(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        let errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
    try {
        let data = inf
        let infFile = { 'e': e, 'action': 'read', 'path': `${letter}:/ARQUIVOS/PROJETOS/Sniffer_Python/log/TryRating/reg.txt` }
        let retFile = await file(infFile);
        let old = Number(retFile.res);
        let now = Number(dateHour().res.tim);
        let dif = now - old

        if (dif < 15) {
            let wait = 15 - dif;
            let retRandom = await randomNumber({ 'e': e, 'min': wait, 'max': wait + 9, 'await': true })
        }
        logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `FIM` });

        let infTabSearch = { 'e': e, 'search': '*tryrating.com*', 'openIfNotExist': false, 'active': true, 'pinned': false }
        let retTabSearch = await tabSearch(infTabSearch); if (!retTabSearch.res) { logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `voltou` }); return }
        let element, action, code, array = data.inf;
        for (let [index, value] of array.entries()) {
            await new Promise(resolve => { setTimeout(resolve, 800) });// logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `INDEX: ${index} | VALUE: ${value}` })
            if (index == 0) {
                if (value == 1) { element = `//*[@id="app-root"]/div/div[4]/div[2]/div[2]/div[2]/div[2]/div/div/div/div/div/div/div/div/div/div[2]/div/div/div/div/div/div[1]/div/div/div/div[3]/div/div/form/div/div/div/div[1]/label/span[2]` }
                else if (value == 2) { element = `//*[@id="app-root"]/div/div[4]/div[2]/div[2]/div[2]/div[2]/div/div/div/div/div/div/div/div/div/div[2]/div/div/div/div/div/div[1]/div/div/div/div[3]/div/div/form/div/div/div/div[2]/label/span[2]` }
                else if (value == 3) { element = `//*[@id="app-root"]/div/div[4]/div[2]/div[2]/div[2]/div[2]/div/div/div/div/div/div/div/div/div/div[2]/div/div/div/div/div/div[1]/div/div/div/div[3]/div/div/form/div/div/div/div[3]/label/span[2]` }
                else if (value == 4) { element = `//*[@id="app-root"]/div/div[4]/div[2]/div[2]/div[2]/div[2]/div/div/div/div/div/div/div/div/div/div[2]/div/div/div/div/div/div[1]/div/div/div/div[3]/div/div/form/div/div/div/div[4]/label/span[2]` }
            } else if (index == 1) {
                if (value == 1) { element = `//*[@id="app-root"]/div/div[4]/div[2]/div[2]/div[2]/div[2]/div/div/div/div/div/div/div/div/div/div[2]/div/div/div/div/div/div[1]/div/div/div/div[5]/div/div/form/div/div/div/div[1]/label/span[2]` }
                else if (value == 2) { element = `//*[@id="app-root"]/div/div[4]/div[2]/div[2]/div[2]/div[2]/div/div/div/div/div/div/div/div/div/div[2]/div/div/div/div/div/div[1]/div/div/div/div[5]/div/div/form/div/div/div/div[2]/label/span[2]` }
                else if (value == 3) { element = `//*[@id="app-root"]/div/div[4]/div[2]/div[2]/div[2]/div[2]/div/div/div/div/div/div/div/div/div/div[2]/div/div/div/div/div/div[1]/div/div/div/div[5]/div/div/form/div/div/div/div[3]/label/span[2]` }
            } else if (index == 2) {
                if (value == 1) { element = `//*[@id="app-root"]/div/div[4]/div[2]/div[2]/div[2]/div[2]/div/div/div/div/div/div/div/div/div/div[2]/div/div/div/div/div/div[1]/div/div/div/div[7]/div/div/form/div/div/div/div[1]/label/span[2]` }
                else if (value == 2) { element = `//*[@id="app-root"]/div/div[4]/div[2]/div[2]/div[2]/div[2]/div/div/div/div/div/div/div/div/div/div[2]/div/div/div/div/div/div[1]/div/div/div/div[7]/div/div/form/div/div/div/div[2]/label/span[2]` }
                else if (value == 3) { element = `//*[@id="app-root"]/div/div[4]/div[2]/div[2]/div[2]/div[2]/div/div/div/div/div/div/div/div/div/div[2]/div/div/div/div/div/div[1]/div/div/div/div[7]/div/div/form/div/div/div/div[3]/label/span[2]` }
            }; element = `document.evaluate('${element}', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue`
            action = `.click()`; code = `${element}${action}`
            let infChromeActions = { 'e': e, 'action': 'script', 'code': code, 'search': retTabSearch.res.id };
            let retChromeActions = await chromeActions(infChromeActions); if (!retChromeActions.ret) { return retChromeActions }
        }
        // ###### SUBMIT (topo)
        element = `//*[@id="app-root"]/div/div[4]/div[2]/div[1]/div/div[2]/button[2]`
        element = `document.evaluate('${element}', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue`
        action = `.click()`;
        code = `${element}${action}`;
        await new Promise(resolve => { setTimeout(resolve, 800) })
        let infChromeActions = { 'e': e, 'action': 'script', 'code': code, 'search': retTabSearch.res.id };
        let retChromeActions = await chromeActions(infChromeActions); if (!retChromeActions.ret) { return retChromeActions }
        listenerAcionar('messageSendOrigin_127.0.0.1:1234/ORIGEM_AQUI', { 'destination': '127.0.0.1:1234/DESTINO_AQUI', 'message': { 'other': 'OK: TryRating_QueryImageDeservingClassification' }, 'secondsAwait': 0, });

        ret['msg'] = `action_TryRating_QueryImageDeservingClassification: OK`;
        ret['ret'] = true;

    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, 'catchGlobal': false });
        ret['msg'] = retRegexE.res
    };
    return {
        ...({ ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}

if (eng) { // CHROME
    window['action_TryRating_QueryImageDeservingClassification'] = action_TryRating_QueryImageDeservingClassification;
} else { // NODEJS
    global['action_TryRating_QueryImageDeservingClassification'] = action_TryRating_QueryImageDeservingClassification;
}






