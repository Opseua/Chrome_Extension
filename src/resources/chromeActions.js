// let infChromeActions, retChromeActions
// infChromeActions = { 'action': 'badge', 'text': `OLA` }
// retChromeActions = await chromeActions(infChromeActions);
// console.log(retChromeActions)

async function chromeActions(inf) {
    let ret = { 'ret': false };
    try {
        if (!`rodar no → CHROME`.includes(engName)) { // [ENCAMINHAR PARA DEVICE]
            let infDevAndFun = { 'enc': true, 'data': { 'name': 'chromeActions', 'par': inf, 'retInf': inf.retInf } };
            let retDevAndFun = await devFun(infDevAndFun); return retDevAndFun
        };
        if (inf.action == 'badge') {
            let action = chrome.browserAction;
            if (inf.color) {
                action.setBadgeBackgroundColor({ 'color': inf.color })
            } // [25, 255, 71, 255]
            if (inf.hasOwnProperty('text')) {
                action.setBadgeText({ 'text': inf.text })
            };
            ret['msg'] = `CHROME ACTIONS BADGE: OK`
        } else if (inf.action == 'script') {
            let code, element
            if (inf.method == 'xpath') {
                code, element = `document.evaluate('${inf.element}', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue`;
                if (inf.execute == 'click') {
                    code = `${element}.click()`
                } else if (inf.execute == 'input') {
                    code = `${element}.value(${inf.value})`
                }
            }
            chrome.tabs.executeScript(inf.id, {
                // XPATH
                // code: `document.evaluate('//*[@id="app-root"]/div/div[4]/div[2]/div/p/a/button', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click()`
                code: code
            });
            ret['msg'] = `CHROME ACTIONS SCRIPT: OK`
        };
        ret['ret'] = true;
    } catch (e) {
        let m = await regexE({ 'e': e });
        ret['msg'] = m.res
    };
    return {
        ...({ ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}

if (eng) { // CHROME
    window['chromeActions'] = chromeActions;
} else { // NODEJS
    global['chromeActions'] = chromeActions;
}



