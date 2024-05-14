// → NO FINAL DA PÁGINA

let e = import.meta.url, ee = e;
async function chromeActions(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    try {
        let { action, color, text, target, elementName, elementValue, attribute, attributeAdd, content, tag, attributeValue, attributeValueAdd, tagFather, fun, funInf } = inf;
        let retTabSearch, code = '', retExecuteScript, tabId, divTemp

        if (action == 'badge') {
            action = chrome.browserAction; if (color) { action.setBadgeBackgroundColor({ 'color': color }) } // [25, 255, 71, 255]
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
        } else if (['getBody', 'attributeGetValue', 'elementGetValue', 'elementSetValue', 'elementClick', 'elementGetDivXpath', 'elementGetDiv', 'elementIsHidden', 'inject'].includes(action)) {
            let targetMode = (target.includes('<') || target.includes('>')) ? 'HTML' : 'INJECT'

            // →→→ ONDE EXECUTAR? HTML BRUTO FOI PASSADO (CRIAR DIV TEMPORÁRIA) | EXECUTAR NA PÁGINA (INJETANDO SCRIPT - DEFINIR ID DA ABA ALVO)
            if (targetMode == 'HTML') { divTemp = document.createElement('div'); divTemp.innerHTML = target; document.body.appendChild(divTemp); }
            else {
                if (typeof target === "number") { tabId = target }
                else { retTabSearch = await tabSearch({ 'e': e, 'search': target, 'openIfNotExist': false }); if (!retTabSearch.ret) { return retTabSearch } tabId = retTabSearch.res.id }
            }

            // **************************************************************************************************************************************
            function getBody() { return document.documentElement.outerHTML; }
            // ###
            function elementAction({ action, elementName, elementValue, attribute, attributeAdd, content, tag, attributeValue, attributeValueAdd, }) {
                // → ################ MODO SIMPLES (XPATH) | → ################ MODO AVANÇADO
                let elements; if (!(tag || attributeValue)) {
                    elements = document.evaluate(elementName, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null); let elementsNew = [];
                    for (let i = 0; i < elements.snapshotLength; i++) { elementsNew.push(elements.snapshotItem(i)); }; elements = elementsNew;
                } else { elements = attribute ? document.querySelectorAll(`${tag ? tag : ''}[${attribute}${attributeValue ? `="${attributeValue}"` : ''}]`) : document.getElementsByTagName(tag) }
                if (elements && elements.length > 0) {
                    if (action == 'attributeGetValue') {
                        // ATRIBUTO: PEGAR VALOR
                        return Array.from(elements).map(element => {
                            let contentOk = content ? element.innerText.trim() === content : true
                            if ((element.tagName.toLowerCase() === 'label' || element.tagName.toLowerCase() === 'span' || element.tagName.toLowerCase() === tag.toLowerCase()) && contentOk) {
                                return element.getAttribute(attribute);
                            }
                        }).filter(value => value !== undefined);
                    } else if (action == 'elementGetValue') {
                        // ELEMENTO: PEGAR VALOR
                        return Array.from(elements).map(element => {
                            let find = false; if (!attributeAdd) { find = true } else { find = element.hasAttribute(attributeAdd) && element.getAttribute(attributeAdd) === attributeValueAdd }; if (find) {
                                if (element.tagName.toLowerCase() === 'select') { return Array.from(element.selectedOptions).map(option => option.value); }
                                else if (element.tagName.toLowerCase() === 'textarea') { return element.value; }
                                else if (element.type === 'checkbox' || element.type === 'radio') { return element.checked; } else { return element.value || element.innerText; }
                            }
                        }).filter(value => value !== undefined);
                    } else if (action == 'elementSetValue') {
                        // ELEMENTO: DEFINIR VALOR
                        elements.forEach(element => { if (element.type === 'checkbox' || element.type === 'radio') { element.checked = elementValue; } else { element.value = elementValue; } }); return true;
                    } else if (action == 'elementClick') {
                        // ELEMENTO: CLICAR
                        elements.forEach(element => { element.click() }); return true;
                    } else if (action == 'elementGetDivXpath') {
                        // DIV: PEGAR (BRUTA)
                        return Array.from(elements).map(element => { return element.outerHTML; });
                    } else if (action == 'elementIsHidden') {
                        // ELEMENTO OCULTO
                        return Array.from(elements).map(element => { return element.hidden; });
                    }
                }; return `ELEMENTO_NAO_ENCONTRADO`;
            }
            // **************************************************************************************************************************************

            if (action == 'getBody') {
                // PEGAR O BODY
                code = `(${getBody.toString()})();`;
            } else if (['attributeGetValue', 'elementGetValue', 'elementSetValue', 'elementClick', 'elementGetDivXpath', 'elementIsHidden'].includes(action)) {
                // ATRIBUTO: PEGAR VALOR | ELEMENTO: PEGAR VALOR | ELEMENTO: DEFINIR VALOR | ELEMENTO: CLICAR | DIV: PEGAR (BRUTA)
                let infElementAction = {
                    'e': e, 'action': action, 'elementName': elementName, 'elementValue': elementValue, 'attribute': attribute, 'attributeAdd': attributeAdd,
                    'content': content, 'tag': tag, 'attributeValue': attributeValue, 'attributeValueAdd': attributeValueAdd,
                }
                // INJECT | HTML RENDERIZAR
                if (targetMode == 'INJECT') { code = `(${elementAction.toString()})(${JSON.stringify(infElementAction)});`; } else { retExecuteScript = elementAction(infElementAction); }
            } else if (action == 'elementGetDiv') {
                function elementGetDivFun(valor, tagName, attributeName, attributeValue, parentTagName) {
                    let elements = document.querySelectorAll(tagName); let elementsFind = []; elements.forEach(element => {
                        if (element.textContent.trim() === valor) {
                            if (!attributeName || element.getAttribute(attributeName) === attributeValue) {
                                if (tagName !== parentTagName) { if (!parentTagName || element.parentElement.tagName.toLowerCase() === parentTagName) { elementsFind.push(element.parentElement.outerHTML); } }
                                else { elementsFind.push(element.outerHTML); }
                            }
                        }
                    }); return elementsFind;
                }; retExecuteScript = elementGetDivFun(content, tag, null, null, tagFather)
            } else if (action == 'inject') {
                // INJECT
                code = `(${fun.toString()})(${JSON.stringify(funInf)});`;
            }

            if (targetMode == 'INJECT') {
                // INJETAR SCRIPT E EXECUTAR
                retExecuteScript = await new Promise((resolve) => { chrome.tabs.executeScript(tabId, { 'code': code }, (res) => { resolve(res[0]) }) });
            }

            let retExecuteScriptBoolean = retExecuteScript instanceof Array; retExecuteScriptBoolean = retExecuteScriptBoolean && retExecuteScript.length ? true : false
            if (['getBody', 'attributeGetValue', 'elementGetValue', 'elementGetDivXpath', 'elementGetDiv', 'elementIsHidden', 'inject'].includes(action) && retExecuteScriptBoolean) { ret['res'] = retExecuteScript }
            ret['msg'] = `CHROME ACTIONS [SCRIPT → ${targetMode}]: ${retExecuteScriptBoolean ? 'OK' : 'ERRO | ELEMENTO NÃO ENCONTRADO'}`
            ret['ret'] = retExecuteScriptBoolean

            // REMOVER DIV TEMPORÁRIA (NECESSÁRIO PARA EVITAR VALORES DUPLICADOS!!!)
            if (targetMode == 'HTML') { document.body.removeChild(divTemp); document.body.innerHTML = ''; }
        }

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
    window['chromeActions'] = chromeActions;
} else { // NODEJS
    global['chromeActions'] = chromeActions;
}



// // → HTML para teste em: "D:\ARQUIVOS\PROJETOS\Chrome_Extension\src\resources\z_HTML.html"

// let infChromeActions, retChromeActions
// // ### badge | user
// infChromeActions = { 'e': e, 'action': 'badge', 'text': `OLA` }
// infChromeActions = { 'e': e, 'action': 'badge', 'color': [25, 255, 71, 255] }
// infChromeActions = { 'e': e, 'action': 'user' }

// // ************************************************************************************************************

// // ### getBody
// infChromeActions = { 'e': e, 'action': 'getBody', 'target': `*file:///*` }

// // ************************************************************************************************************

// // ### element [MODO SIMPLES (XPATH)]
// // → ATRIBUTO: PEGAR VALOR
// infChromeActions = { 'e': e, 'action': 'attributeGetValue', 'target': `*file:///*`, 'elementName': `//*[@id="idNome4Label"]`, 'attribute': `class`, 'content': `LABEL 4`, }

// // → ELEMENTO: PEGAR VALOR
// infChromeActions = { 'e': e, 'action': 'elementGetValue', 'target': `*file:///*`, 'elementName': `//*[@id="idNome1"]`, }
// infChromeActions = { 'e': e, 'action': 'elementGetValue', 'target': `*file:///*`, 'elementName': `//*[@id="idNome4Checkbox"]`, }
// infChromeActions = { 'e': e, 'action': 'elementGetValue', 'target': `*file:///*`, 'elementName': `//*[@id="idNome4Radio"]`, }
// infChromeActions = { 'e': e, 'action': 'elementGetValue', 'target': `*file:///*`, 'elementName': `//*[@id="idNome4Text"]`, }

// // → ELEMENTO: DEFINIR VALOR
// infChromeActions = { 'e': e, 'action': 'elementSetValue', 'target': `*file:///*`, 'elementName': `//*[@id="idNome4Text"]`, 'elementValue': `ISSO É UM TESTE A`, }

// // → ELEMENTO: CLICAR
// infChromeActions = { 'e': e, 'action': 'elementClick', 'target': `*file:///*`, 'elementName': `//*[@id="idNome4Button"]`, }

// // → DIV: PEGAR (BRUTA)
// infChromeActions = { 'e': e, 'action': 'elementGetDivXpath', 'target': `*file:///*`, 'elementName': `//*[@id="DivTeste"]`, }

// // ************************************************************************************************************

// // ### element [MODO AVANÇADO] | TAGS →→→ [input/select/textarea/button/div/label/span] | ATRIBUTOS →→→ [id/class/name/type/for/nomeDoAtributo] | CONTEÚDO →→→ [nomeDoConteudo]
// // → ATRIBUTO: PEGAR VALOR
// infChromeActions = { 'e': e, 'action': 'attributeGetValue', 'target': `*file:///*`, 'tag': `label`, 'attribute': `class`, 'content': `LABEL 4`, } // (tag + atributo + conteúdo)

// // → ELEMENTO: PEGAR VALOR
// infChromeActions = { 'e': e, 'action': 'elementGetValue', 'target': `*file:///*`, 'tag': `input`, } // (tag)
// infChromeActions = { 'e': e, 'action': 'elementGetValue', 'target': `*file:///*`, 'tag': `textarea`, 'attribute': `class`, } // (tag + atributo)
// infChromeActions = { 'e': e, 'action': 'elementGetValue', 'target': `*file:///*`, 'attribute': `id`, 'attributeValue': `idNome1`, } // (atributo + valor do atributo)
// infChromeActions = { 'e': e, 'action': 'elementGetValue', 'target': `*file:///*`, 'tag': `textarea`, 'attribute': `id`, 'attributeValue': `idNome1`, } // (tag + atributo + valor do atributo)
// infChromeActions = { 'e': e, 'action': 'elementGetValue', 'target': `*file:///*`, 'tag': `textarea`, 'attribute': `id`, 'attributeValue': `idNome1`, 'attributeAdd': `class`, 'attributeValueAdd': `className1`, } // (tag + atributo + valor do atributo + atributo2 + valor do atributo2)

// // → ELEMENTO: DEFINIR VALOR
// infChromeActions = { 'e': e, 'action': 'elementSetValue', 'target': `*file:///*`, 'attribute': `id`, 'attributeValue': `idNome4Text`, 'elementValue': `ISSO É UM TESTE B` } // (atributo + valor do atributo)

// // → ELEMENTO: CLICAR
// infChromeActions = { 'e': e, 'action': 'elementClick', 'target': `*file:///*`, 'attribute': `id`, 'attributeValue': `idNome4Button`, } // (atributo + valor do atributo)

// // ************************************************************************************************************

// // → INJECT
// function teste(funInf) { console.log('FUNCAO TESTE: OK', funInf); return document.documentElement.outerHTML; } let funInf = { 'A': '' };
// infChromeActions = { 'e': e, 'action': 'inject', 'target': '*file:///*', 'fun': teste, 'funInf': funInf, };

// retChromeActions = await chromeActions(infChromeActions);
// console.log(retChromeActions)




