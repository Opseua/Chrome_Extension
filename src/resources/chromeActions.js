// const infChromeActions = { 'action': 'badge', 'text': 'OLA' }
// const retChromeActions = await chromeActions(infChromeActions);
// console.log(retChromeActions)

async function chromeActions(inf) {
    await import('./@functions.js');
    let ret = { 'ret': false }; try {
        if (typeof window == 'undefined') { // [ENCAMINHAR PARA DEVICE → CHROME]
            const infDevAndFun = {
                'name': 'chromeActions', 'retInf': inf.retInf,
                'par': { 'action': inf.action, 'color': inf.color, 'text': inf.text, 'tabSearch': inf.tabSearch, 'url': inf.url, 'code': inf.code }
            }; const retDevAndFun = await devAndFun(infDevAndFun); return retDevAndFun
        };
        if (inf.action == 'badge') {
            const action = chrome.browserAction; if (inf.color) { action.setBadgeBackgroundColor({ 'color': inf.color }) } // [25, 255, 71, 255]
            if (inf.hasOwnProperty('text')) { action.setBadgeText({ 'text': inf.text }) }; ret['msg'] = `CHROME ACTIONS BADGE: OK`
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
        }; ret['ret'] = true;
    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; return ret
}

if (typeof window !== 'undefined') { // CHROME
    window['chromeActions'] = chromeActions;
} else { // NODEJS
    global['chromeActions'] = chromeActions;
}