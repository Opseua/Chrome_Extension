// let infChromeActions, retChromeActions // 'logFun': true,
// infChromeActions = { 'e': e, 'action': 'badge', 'text': `OLA` }
// retChromeActions = await chromeActions(infChromeActions);
// console.log(retChromeActions)

let e = import.meta.url, ee = e
async function chromeActions(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        let errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
    try {
        if (!`rodar no → CHROME`.includes(engName)) { // [ENCAMINHAR PARA DEVICE]
            let infDevAndFun = { 'e': e, 'enc': true, 'data': { 'name': 'chromeActions', 'par': inf, 'retInf': inf.retInf } };
            let retDevAndFun = await devFun(infDevAndFun); return retDevAndFun
        };

        if (inf.action == 'badge') {
            let action = chrome.browserAction;
            if (inf.color) {
                action.setBadgeBackgroundColor({ 'color': inf.color })
            } // [25, 255, 71, 255]
            // if (inf.hasOwnProperty('text')) {
            if ('text' in inf) {
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

        // ### LOG FUN ###
        if (inf && inf.logFun) {
            let infFile = { 'e': e, 'action': 'write', 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }
            infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; file(infFile);
        }
    } catch (err) {
        let retRegexE = await regexE({ 'inf': inf, 'e': err, 'catchGlobal': false });
        ret['msg'] = retRegexE.res
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



