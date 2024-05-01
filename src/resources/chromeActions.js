// → HTML para teste em: "D:\ARQUIVOS\PROJETOS\Chrome_Extension\src\resources\z_HTML.html"

// let infChromeActions, retChromeActions // 'logFun': true,
// infChromeActions = { 'e': e, 'action': 'badge', 'text': `OLA` }
// infChromeActions = { 'e': e, 'action': 'badge', 'color': [25, 255, 71, 255] }
// infChromeActions = { 'e': e, 'action': 'user' }
// infChromeActions = { 'e': e, 'action': 'getBody', 'tabTarget': `*buscacepinter*` }

// // ############ PEGAR O BODY  ############
// infChromeActions = { 'e': e, 'action': 'getBody', 'tabTarget': `*file:///*`, }
// // ############ ATRIBUTO: PEGAR VALOR  ############
// // → todos com a (tag + atributo + conteúdo) TAGS →→→ [input/select/textarea/button/div/label/span] | ATRIBUTOS →→→ [id/class/name/type/for/nomeDoAtributo] | CONTEÚDO →→→ [nomeDoConteudo]
// infChromeActions = { 'e': e, 'action': 'attributeGetValue', 'tabTarget': `*file:///*`, 'tag': `label`, 'attribute': `name`, 'content': `LABEL 2`, }
// // ############ ELEMENTO: PEGAR VALOR  ############
// // → todos com a (tag) TAGS →→→ [input/select/textarea/button/div/label/span]
// infChromeActions = { 'e': e, 'action': 'elementGetValue', 'tabTarget': `*file:///*`, 'tag': `input`, }
// // → todos com a (tag + atributo) TAGS →→→ [input/select/textarea/button/div/label/span] | ATRIBUTOS →→→ [type/id/class/name/for/nomeDoAtributo]
// infChromeActions = { 'e': e, 'action': 'elementGetValue', 'tabTarget': `*file:///*`, 'tag': `textarea`, 'attribute': `class`, }
// // → todos com a (atributo + valor do atributo) ATRIBUTOS →→→ [type/id/class/name/for/nomeDoAtributo] | ATRIBUTOS VALOR →→→ [text/checkbox/nomeDoAtributo]
// infChromeActions = { 'e': e, 'action': 'elementGetValue', 'tabTarget': `*file:///*`, 'attribute': `id`, 'attributeValue': `idNome1`, }
// // → todos com a (tag + atributo + valor do atributo) TAGS →→→ [input/select/textarea/button/div/label/span] | ATRIBUTOS →→→ [type/id/class/name/for/nomeDoAtributo] | ATRIBUTOS VALOR →→→ [text/checkbox/nomeDoAtributo]
// infChromeActions = { 'e': e, 'action': 'elementGetValue', 'tabTarget': `*file:///*`, 'tag': `textarea`, 'attribute': `id`, 'attributeValue': `idNome1`, }
// // ############ ELEMENTO: DEFINIR VALOR  ############
// // → todos com o (atributo + valor do atributo) ATRIBUTOS →→→ [id/class/name/type/for/nomeDoAtributo] | ATRIBUTOS VALOR →→→ [text/checkbox/nomeDoAtributo]
// infChromeActions = { 'e': e, 'action': 'elementSetValue', 'tabTarget': `*file:///*`, 'attribute': `class`, 'attributeValue': `classNome3`, 'elementValue': `VALOR NOVO` }
// // ############ ELEMENTO: CLICAR  ############
// // → todos com o (atributo + valor do atributo) ATRIBUTOS →→→ [id/class/name/type/for/nomeDoAtributo] | ATRIBUTOS VALOR →→→ [text/checkbox/nomeDoAtributo]
// infChromeActions = { 'e': e, 'action': 'elementClick', 'tabTarget': `*file:///*`, 'attribute': `nomeDoAtributo`, 'attributeValue': `atributoNome2Botao`, }

// // ############ (XPATH) ELEMENTO: PEGAR VALOR  ############
// infChromeActions = { 'e': e, 'action': 'elementGetValueXpath', 'tabTarget': `*file:///*`, 'elementName': `//*[@id="app-root"]/div/div[4]/div[2]/div[1]/div/div[1]/div/div[1]/span[2]/span`, }

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

        let { action, color, text, tabTarget, tag, attribute, attributeValue, elementValue, content, elementName } = inf; let retTabSearch, code = '', retExecuteScript, tabId

        if (action == 'badge') {
            action = chrome.browserAction; if (color) { action.setBadgeBackgroundColor({ 'color': color }) } // [25, 255, 71, 255]
            // if (inf.hasOwnProperty('text')) {
            if (text || text == '') { action.setBadgeText({ 'text': text }) };
            ret['msg'] = `CHROME ACTIONS [BADGE]: OK`
            ret['ret'] = true
        } else if (action == 'user') {
            action = chrome.identity; let retGetProfileUserInfo = await new Promise((resolve) => {
                action.getProfileUserInfo(function (userInfo) { if (userInfo.email) { resolve(userInfo.email); } else { resolve('NAO_DEFINIDO') } });
            });
            ret['res'] = retGetProfileUserInfo
            ret['msg'] = `CHROME ACTIONS [USER]: OK`
            ret['ret'] = true
        } else if (action == 'getBody' || action == 'attributeGetValue' || action == 'elementGetValue' || action == 'elementSetValue' || action == 'elementClick' || action == 'elementGetValueXpath') {
            // DEFINIR ID DA ABA ALVO
            if (typeof tabTarget === "number") { tabId = tabTarget }
            else { retTabSearch = await tabSearch({ 'e': e, 'search': tabTarget, 'openIfNotExist': false }); if (!retTabSearch.ret) { return retTabSearch } tabId = retTabSearch.res.id }

            // **************************************************************************************************************************************
            function elementAction({ action, tag, attribute, attributeValue, elementValue, content }) {
                let elementos = attribute ? document.querySelectorAll(`${tag ? tag : ''}[${attribute}${attributeValue ? `="${attributeValue}"` : ''}]`) : document.getElementsByTagName(tag)
                if (elementos && elementos.length > 0) {
                    if (action == 'attributeGetValue') {
                        // ATRIBUTO: PEGAR VALOR
                        return Array.from(elementos).map(elemento => {
                            if ((elemento.tagName.toLowerCase() === 'label' || elemento.tagName.toLowerCase() === 'span') && elemento.innerText.trim() === content) { return elemento.getAttribute(attribute); }
                        }).filter(value => value !== undefined);
                    } else if (action == 'elementGetValue') {
                        // ELEMENTO: PEGAR VALOR
                        return Array.from(elementos).map(elemento => {
                            if (elemento.tagName.toLowerCase() === 'select') { return Array.from(elemento.selectedOptions).map(option => option.value); }
                            else if (elemento.tagName.toLowerCase() === 'textarea') { return elemento.value; } else if (elemento.type === 'checkbox' || elemento.type === 'radio') { return elemento.checked; }
                            else { return elemento.value || elemento.innerText; }
                        });
                    } else if (action == 'elementSetValue' || action == 'elementClick') {
                        // ELEMENTO: DEFINIR VALOR | CLICAR
                        elementos.forEach(elemento => {
                            if (action == 'elementClick') { elemento.click() } else if (elemento.type === 'checkbox' || elemento.type === 'radio') { elemento.checked = elementValue; } else { elemento.value = elementValue; }
                        }); return true;
                    }
                }; return false;
            }
            // ###
            function xpathElementGetValue({ elementName }) {
                let eleSelect, retXpath = document.evaluate(elementName, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null); if (retXpath.singleNodeValue) {
                    elementName = retXpath.singleNodeValue; if (elementName.tagName === 'INPUT' || elementName.tagName === 'SELECT' || elementName.tagName === 'TEXTAREA') { eleSelect = elementName.value; }
                    else if (elementName.tagName === 'CHECKBOX' || elementName.tagName === 'RADIO') { eleSelect = elementName.checked; } else { eleSelect = elementName.textContent.trim(); }; return eleSelect;
                }
            };
            // **************************************************************************************************************************************

            if (action == 'getBody') {
                // PEGAR O BODY
                code = `function getBody() {return document.documentElement.outerHTML;}getBody();`;
            } else if (action == 'elementGetValueXpath') {
                // (XPATH) ELEMENTO: VALOR → PEGAR
                let infXpathElementGetValue = { 'elementName': elementName };
                code = `(${xpathElementGetValue.toString()})(${JSON.stringify(infXpathElementGetValue)});`;
            } else {
                // OUTRO TIPO DE AÇÃO
                let infElementAction = { 'action': action, 'tag': tag, 'attribute': attribute, 'attributeValue': attributeValue, 'elementValue': elementValue, 'content': content };
                code = `(${elementAction.toString()})(${JSON.stringify(infElementAction)});`;
            }

            // INJETAR SCRIPT
            retExecuteScript = await new Promise((resolve) => { chrome.tabs.executeScript(tabId, { 'code': code }, (res) => { resolve(res[0]) }) });

            if ((action == 'getBody' || action == 'attributeGetValue' || action == 'elementGetValue' || action == 'elementGetValueXpath') && retExecuteScript) { ret['res'] = retExecuteScript }
            ret['msg'] = `CHROME ACTIONS [INJECT]: ${retExecuteScript ? 'OK' : 'ERRO | ELEMENTO NÃO ENCONTRADO'}`
            ret['ret'] = retExecuteScript ? true : false
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



