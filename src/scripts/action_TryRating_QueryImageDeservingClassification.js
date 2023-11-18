async function action_TryRating_QueryImageDeservingClassification(inf) {
    await import('./@functions.js');
    let ret = { 'ret': false };
    try {
        if (!`rodar no → CHROME `.includes(engName)) { // [ENCAMINHAR PARA DEVICE]
            let infDevAndFun = { 'enc': true, 'data': { 'name': 'action_TryRating_QueryImageDeservingClassification', 'par': inf, 'retInf': inf.retInf } };
            let retDevAndFun = await devFun(infDevAndFun); return retDevAndFun
        };
        let data = inf
        let infFile = { 'action': 'read', 'path': 'D:/ARQUIVOS/PROJETOS/Sniffer_Python/log/TryRating/reg.txt' }
        let retFile = await file(infFile);
        let old = Number(retFile.res);
        let now = Number(dateHour().res.tim);
        let dif = now - old

        if (dif < 15) {
            let wait = 15 - dif;
            let retRandom = await random({ 'min': wait, 'max': wait + 9, 'await': true })
        }
        console.log('FIM', data.inf, '\n', data.res, '\n', data.query)

        let infTabSearch = { 'search': '*tryrating.com*', 'openIfNotExist': false, 'active': true, 'pinned': false }
        let retTabSearch = await tabSearch(infTabSearch); if (!retTabSearch.res) { console.log('voltou'); return }
        let element, action, code, array = data.inf;
        for (let [index, value] of array.entries()) {
            await new Promise(resolve => { setTimeout(resolve, 800) });// console.log(`INDEX: ${index} | VALUE: ${value}`)
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
            let infChromeActions = { 'action': 'script', 'code': code, 'search': retTabSearch.res.id };
            let retChromeActions = await chromeActions(infChromeActions); if (!retChromeActions.ret) { return retChromeActions }
        }
        // ###### SUBMIT (topo)
        element = `//*[@id="app-root"]/div/div[4]/div[2]/div[1]/div/div[2]/button[2]`
        element = `document.evaluate('${element}', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue`
        action = `.click()`;
        code = `${element}${action}`;
        await new Promise(resolve => { setTimeout(resolve, 800) })
        let infChromeActions = { 'action': 'script', 'code': code, 'search': retTabSearch.res.id };
        let retChromeActions = await chromeActions(infChromeActions); if (!retChromeActions.ret) { return retChromeActions }
        wsSend(nomeList, { 'other': 'OK: TryRating_QueryImageDeservingClassification' })

        ret['msg'] = `action_TryRating_QueryImageDeservingClassification: OK`;
        ret['ret'] = true;

    } catch (e) {
        let m = await regexE({ 'e': e });
        ret['msg'] = m.res
    };
    return ret
}

if (typeof eng === 'boolean') {
    if (eng) { // CHROME
        window['action_TryRating_QueryImageDeservingClassification'] = action_TryRating_QueryImageDeservingClassification;
    } else { // NODEJS
        global['action_TryRating_QueryImageDeservingClassification'] = action_TryRating_QueryImageDeservingClassification;
    }
}




