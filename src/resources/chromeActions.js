// let infChromeActions, retChromeActions // 'logFun': true,
// infChromeActions = { 'e': e, 'action': 'badge', 'text': `OLA` }
// infChromeActions = { 'e': e, 'action': 'badge', 'color': [25, 255, 71, 255] }
// infChromeActions = { 'e': e, 'action': 'user' }
// infChromeActions = { 'e': e, 'action': 'getBody', 'tabTarget': `*buscacepinter*` }
// // PEGAR O ID DO CAMPO // →→→   <label for="field-oiaYE9zikt" class="field-label">Name Correction *</label>
// infChromeActions = { 'e': e, 'action': 'elementGetId', 'body': body, 'nameClass': 'field-label', 'nameLabel': 'POI Validity *' }
// infChromeActions = { 'e': e, 'action': 'elementGetValue1', 'body': body, 'method': 'xpath', 'element': `//*[@id="endereco"]` }
// infChromeActions = { 'e': e, 'action': 'elementGetValue2', 'tabTarget': `*buscacepinter*`, 'method': 'xpath', 'element': `//*[@id="endereco"]` }
// infChromeActions = { 'e': e, 'action': 'elementSet', 'tabTarget': `*buscacepinter*`, 'method': 'xpath', 'element': `//*[@id="endereco"]`, 'value': `22021-001` }
// infChromeActions = { 'e': e, 'action': 'elementClick', 'tabTarget': `*buscacepinter*`, 'method': 'xpath', 'element': `//*[@id="btn_pesquisar"]` }
// retChromeActions = await chromeActions(infChromeActions);
// console.log(retChromeActions)

let e = import.meta.url, ee = e;
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

        let { action, color, text, tabTarget, method, element, value, nameClass, nameLabel, body } = inf; let retTabSearch, code = '', id, retExecuteScript

        if (action == 'badge') {
            action = chrome.browserAction; if (color) { action.setBadgeBackgroundColor({ 'color': color }) } // [25, 255, 71, 255]
            // if (inf.hasOwnProperty('text')) {
            if (text) { action.setBadgeText({ 'text': text }) };
            ret['msg'] = `CHROME ACTIONS [BADGE]: OK`
            ret['ret'] = true
        } else if (action == 'user') {
            action = chrome.identity; let retGetProfileUserInfo = await new Promise((resolve) => {
                action.getProfileUserInfo(function (userInfo) { if (userInfo.email) { resolve(userInfo.email); } else { resolve('NAO_DEFINIDO') } });
            });
            ret['res'] = retGetProfileUserInfo
            ret['msg'] = `CHROME ACTIONS [USER]: OK`
            ret['ret'] = true
        } else if (action == 'getBody' || action == 'elementClick' || action == 'elementSet' || action == 'elementGetValue2') {
            // DEFINIR ID DA ABA ALVO
            if (typeof tabTarget === "number") { id = tabTarget }
            else { retTabSearch = await tabSearch({ 'e': e, 'search': tabTarget, 'openIfNotExist': false }); if (!retTabSearch.ret) { return retTabSearch } id = retTabSearch.res.id }
            if (action == 'getBody') {
                // PEGAR O BODY
                code = `function getBody() {return document.documentElement.outerHTML;}getBody();`;
            } else if (method == 'xpath') {
                if (action == 'elementClick') {
                    // ELEMENTO: CLICAR
                    code = `var eleCode = document.evaluate('${element}', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue; if (eleCode) { eleCode.click(); true; };`
                } else if (action == 'elementSet') {
                    // ELEMENTO: VALOR → DEFINIR
                    code = `var eleCode = document.evaluate('${element}', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue; if (eleCode) { eleCode.value = '${value}' }`
                } else if (action == 'elementGetValue2') {
                    // ELEMENTO: VALOR → PEGAR
                    code = `function getValue(ele) { ele = '${element}'; var eleSelect, retXpath = document.evaluate(ele, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null); if (retXpath.singleNodeValue) {
                            ele = retXpath.singleNodeValue; if (ele.tagName === 'INPUT' || ele.tagName === 'SELECT' || ele.tagName === 'TEXTAREA') { eleSelect = ele.value; } 
                            else if (ele.tagName === 'CHECKBOX' || ele.tagName === 'RADIO') { eleSelect = ele.checked; } else { eleSelect = ele.textContent.trim(); }; return eleSelect; } }; getValue();`;
                }
            }

            // *** EXECUTAR SCRIPT ***
            if (code.includes('document')) {
                retExecuteScript = await new Promise((resolve) => { chrome.tabs.executeScript(id, { 'code': code }, (res) => { resolve(res[0]) }) });
                if ((action == 'getBody' || action == 'elementGetValue2') && retExecuteScript) { ret['res'] = retExecuteScript }
                ret['msg'] = `CHROME ACTIONS [GET BODY/ELEMENT CLICK/ELEMENT SET/ELEMENT GET VALUE 2]: ${retExecuteScript ? 'OK' : 'ERRO | ELEMENTO NÃO ENCONTRADO'}`
                ret['ret'] = retExecuteScript ? true : false
            }
        } else if (action == 'elementGetId' || action == 'elementGetValue1') {
            let documentOrBody = new DOMParser().parseFromString(body, 'text/html');
            if (documentOrBody) {
                if (action == 'elementGetId') {
                    let labels = documentOrBody.querySelectorAll(`label.${nameClass}`); let retIds = [];
                    for (let label of labels) { if (label.textContent.trim() === nameLabel) { retIds.push(label.getAttribute('for')); } };
                    if (retIds.length > 0) { ret['res'] = retIds }
                    ret['msg'] = `CHROME ACTIONS [ELEMENT GET ID]: ${retIds.length > 0 ? 'OK' : 'ERRO | ELEMENTO NÃO ENCONTRADO'}`
                    ret['ret'] = retIds.length > 0 ? true : false
                } else {
                    if (method == 'xpath') {
                        let retXpath = documentOrBody.evaluate(element, documentOrBody, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                        if (retXpath.singleNodeValue) {
                            let ele = retXpath.singleNodeValue; if (ele.tagName === 'INPUT' || ele.tagName === 'SELECT' || ele.tagName === 'TEXTAREA') { retXpath = ele.value; }
                            else if (ele.tagName === 'CHECKBOX' || ele.tagName === 'RADIO') { retXpath = ele.checked; } else { retXpath = ele.textContent.trim(); }
                        } else { retXpath = false; }
                        if (retXpath) { ret['res'] = retXpath }
                        ret['msg'] = `CHROME ACTIONS [ELEMENT GET VALUE1]: ${retXpath ? 'OK' : 'ERRO | ELEMENTO NÃO ENCONTRADO'}`
                        ret['ret'] = retXpath ? true : false
                    }
                }
            } else {
                ret['msg'] = `CHROME ACTIONS [ELEMENT GET ID/VALUE]: ERRO | BODY INVÁLIDO`
                ret['ret'] = false
            }
        }

        // ### LOG FUN ###
        if (inf && inf.logFun) {
            let infFile = { 'e': e, 'action': 'write', 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }
            infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; file(infFile);
        }
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
    window['chromeActions'] = chromeActions;
} else { // NODEJS
    global['chromeActions'] = chromeActions;
}



