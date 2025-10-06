// → NO FINAL DO ARQUIVO

async function elementAction(inf = {}) {
    let paramId = inf.paramId || 'xx', maxReturn = Number(inf.element?.maxReturn) || 10, indexTarget = (inf.element?.indexTarget !== undefined) ? inf.element.indexTarget : -1;
    let element = inf.element || {}, maxAwaitMil = element.maxAwaitMil || 50; function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

    function getElementXPath(el) {
        let parts = []; while (el && el.nodeType === Node.ELEMENT_NODE) {
            let index = 1, sibling = el.previousSibling; while (sibling) { if (sibling.nodeType === Node.ELEMENT_NODE && sibling.nodeName === el.nodeName) { index++; } sibling = sibling.previousSibling; }
            parts.unshift(el.nodeName.toLowerCase() + (index > 1 ? `[${index}]` : '')); el = el.parentNode;
        } return '/' + parts.join('/');
    }

    async function simulateTyping(el, texto, intervalo = 50, teclaFinal = null) {
        let valorAtual = ''; for (let i = 0; i < texto.length; i++) {
            let char = texto[i]; el.dispatchEvent(new KeyboardEvent('keydown', { 'key': char, 'bubbles': true, })); el.dispatchEvent(new KeyboardEvent('keypress', { 'key': char, 'bubbles': true, }));
            valorAtual += char; el.value = valorAtual; el.dispatchEvent(new Event('input', { 'bubbles': true, })); el.dispatchEvent(new KeyboardEvent('keyup', { 'key': char, 'bubbles': true, })); await sleep(intervalo);
        } el.dispatchEvent(new Event('change', { 'bubbles': true, })); if (teclaFinal === 'ENTER') {
            el.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'Enter', 'bubbles': true, })); el.dispatchEvent(new KeyboardEvent('keypress', { 'key': 'Enter', 'bubbles': true, }));
            el.dispatchEvent(new KeyboardEvent('keyup', { 'key': 'Enter', 'bubbles': true, }));
        }
    }

    async function elementSearch(inf = {}) {
        let inicio = Date.now(); return await new Promise(resolve => {
            let intervalo = setInterval(() => {
                if (inf.xpath) {  // ⬇️ Busca por XPath, se definido
                    let xpathResult = document.evaluate(inf.xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null), encontrados = [];
                    for (let i = 0; i < xpathResult.snapshotLength; i++) { encontrados.push(xpathResult.snapshotItem(i)); } if (encontrados.length > 0) { clearInterval(intervalo); return resolve(encontrados); }
                } let getAllElementsIncludingShadowDOM = (root = document) => {
                    let result = new Set(), walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT); while (walker.nextNode()) {
                        let node = walker.currentNode; result.add(node); if (node.shadowRoot) { for (let el of getAllElementsIncludingShadowDOM(node.shadowRoot)) { result.add(el); } }
                    } return [...result,];
                }; let todos = getAllElementsIncludingShadowDOM(), resultadoBase = new Set(); for (let el of todos) {
                    let ok = true; if (ok && inf.buscaRapida && inf.buscaRapida.length > 0) {  // buscaRapida: todos os termos devem estar no outerHTML
                        let html = (el.outerHTML || '').toLowerCase(); for (let termo of inf.buscaRapida) { if (!html.includes(termo.toLowerCase())) { ok = false; break; } }
                    } if (ok && inf.tag) { if (el.tagName.toLowerCase() !== inf.tag.toLowerCase()) { ok = false; } /* tag: deve ser uma das informadas */ }
                    if (ok && inf.content) { // content: todos os termos devem estar no textContent ou value
                        let termo = inf.content.toLowerCase(); if (!(((el.textContent || '').toLowerCase()).includes(termo) || ((el.value || '').toLowerCase()).includes(termo))) { ok = false; }
                    } if (ok && inf.properties && inf.properties.length > 0) {
                        for (let prop of inf.properties) { // properties: todos devem ser atendidos
                            let nomeOk = true, valorOk = true; if (prop.attributeName) { nomeOk = el.hasAttribute(prop.attributeName); } if (prop.attributeValue) {
                                valorOk = false; for (let attr of el.attributes) { if (attr.value.includes(prop.attributeValue)) { valorOk = true; break; } }
                            } if (!(nomeOk && valorOk)) { ok = false; break; }
                        }
                    } if (ok) { resultadoBase.add(el); }
                } if (resultadoBase.size > 0 || maxAwaitMil === 0) {   // Aplicar filtro de elementoParente, se houver
                    clearInterval(intervalo); if (!inf.elementoParente) { return resolve([...resultadoBase,]); } let resultadoFinal = new Set(); for (let baseEl of resultadoBase) {
                        let candidatos = new Set(), tipo = inf.elementoParente.tipo;
                        if (tipo === 'pai') { let atual = baseEl.parentElement; while (atual) { for (let el of getAllElementsIncludingShadowDOM(atual)) { candidatos.add(el); } atual = atual.parentElement; } }
                        if (tipo === 'filho') { for (let el of getAllElementsIncludingShadowDOM(baseEl)) { candidatos.add(el); } } for (let el of candidatos) {
                            let tagOk = true; if (inf.elementoParente.tag) { tagOk = el.tagName.toLowerCase() === inf.elementoParente.tag.toLowerCase(); } let propOk = true;
                            if (inf.elementoParente.properties) {
                                propOk = inf.elementoParente.properties.every(p => {
                                    let achou = false; for (let attr of el.attributes) {
                                        if (p.attributeName && !p.attributeValue) { if (attr.name === p.attributeName) { achou = true; } } else if (!p.attributeName && p.attributeValue) {
                                            if (attr.value.includes(p.attributeValue)) { achou = true; }
                                        } else if (p.attributeName && p.attributeValue) { if (attr.name === p.attributeName && attr.value.includes(p.attributeValue)) { achou = true; } }
                                    } return achou;
                                });
                            } if (tagOk && propOk) { resultadoFinal.add(el); }
                        }
                    } return resolve([...resultadoFinal,]);
                } if (Date.now() - inicio >= maxAwaitMil) { clearInterval(intervalo); return resolve([]); }
            }, 250); // intervalo de verificação
        });
    }

    let elementos = await elementSearch(element), resultados = [], actions = inf.actions || [], ehBodyIncludes = actions.some(a => a.action === 'bodyIncludes');
    if ((!elementos || elementos.length === 0) && !ehBodyIncludes) { return [{ 'ret': false, 'msg': `ELEMENT ACTION: ERRO | NÃO ENCONTRADO/NÃO APARECEU A TEMPO (${paramId})`, },]; }
    if (ehBodyIncludes) { elementos = [document.body,]; }

    if (indexTarget > -1) { elementos = [elementos[indexTarget],]; } elementos = elementos.slice(0, maxReturn || elementos.length); for (let el of elementos) {
        for (let [idx, valueOk,] of actions.entries()) {
            let { action, elementValue, elementIndex, attribute, time, text, textId, lowerCase, } = valueOk;
            try {
                if (!el.isConnected) { resultados.push({ 'ret': false, 'msg': `ELEMENT ACTION [${action}]: ERRO | ELEMENTO NÃO ESTÁ MAIS NO DOM (${paramId})`, }); continue; }
                // -------------------
                switch (action) {
                    case 'elementGetXpath':
                        resultados.push({ 'ret': true, 'msg': `ELEMENT ACTION [${action}]: OK (${paramId})`, 'res': getElementXPath(el), }); break;

                    case 'elementClick':
                        // el.click(); // ANTIGO
                        // ------------------------------------------------------------- NOVO
                        if (el.tagName.toLowerCase() === 'input') {
                            let tipo = el.type.toLowerCase(); if (tipo === 'button' || tipo === 'submit' || tipo === 'checkbox' || tipo === 'radio') { el.click(); } else { el.focus(); }
                        } else { el.click(); }
                        // ------------------------------------------------------------- 
                        resultados.push({ 'ret': true, 'msg': `ELEMENT ACTION [${action}]: OK (${paramId})`, });
                        break;

                    case 'elementGetValue':
                        resultados.push({ 'ret': true, 'msg': `ELEMENT ACTION [${action}]: OK (${paramId})`, 'res': el.value?.trim() ? el.value : el.textContent, });
                        break;

                    case 'attributeGetValue':
                        if (attribute) { resultados.push({ 'ret': true, 'msg': `ELEMENT ACTION [${action}]: OK (${paramId})`, 'res': el.getAttribute(attribute), }); }
                        else { resultados.push({ 'ret': false, 'msg': `ELEMENT ACTION [${action}]: ERRO | INFORMAR O 'attribute' (${paramId})`, }); }
                        break;

                    case 'elementSetValue':
                        if (elementValue) {
                            let ehComboFake = el.tagName.toLowerCase() === 'button' && el.getAttribute('role') === 'combobox';
                            if (ehComboFake) {
                                try {
                                    el.click(); await sleep(500); /* espera abrir dropdown */ await simulateTyping(el, `${elementValue}`, 50, 'ENTER');
                                    resultados.push({ 'ret': true, 'msg': `ELEMENT ACTION [${action}]: OK (${paramId})`, });
                                } catch (err) {
                                    resultados.push({ 'ret': false, 'msg': `ELEMENT ACTION [${action}]: ERRO AO DEFINIR VALOR (${paramId}) → ${err.message}`, });
                                }
                            } else if ('value' in el) {
                                el.focus(); el.value = elementValue;
                                el.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'a', 'bubbles': true, })); el.dispatchEvent(new KeyboardEvent('keyup', { 'key': 'a', 'bubbles': true, }));
                                el.dispatchEvent(new Event('input', { 'bubbles': true, })); el.dispatchEvent(new Event('change', { 'bubbles': true, })); el.blur();
                                resultados.push({ 'ret': true, 'msg': `ELEMENT ACTION [${action}]: OK (${paramId})`, });
                            } else {
                                resultados.push({ 'ret': false, 'msg': `ELEMENT ACTION [${action}]: ERRO | ELEMENTO NÃO ACEITA INPUT (${paramId})`, });
                            }
                        } else {
                            resultados.push({ 'ret': false, 'msg': `ELEMENT ACTION [${action}]: ERRO | INFORMAR O 'elementValue' (${paramId}) `, });
                        }
                        break;

                    case 'awaitMil':
                        await sleep(time || 1000); resultados.push({ 'ret': true, 'msg': `ELEMENT ACTION [${action}]: OK (${paramId})`, });
                        break;

                    case 'elementHover':
                        let event = new MouseEvent('mouseover', { 'bubbles': true, 'cancelable': true, 'view': window, }); el.dispatchEvent(event);
                        resultados.push({ 'ret': true, 'msg': `ELEMENT ACTION [${action}]: OK (${paramId})`, });
                        break;

                    case 'getBody':
                        resultados.push({ 'ret': true, 'msg': `ELEMENT ACTION [${action}]: OK (${paramId})`, 'res': (document.body.textContent || ''), });
                        break;

                    case 'bodyIncludes':
                        let inicio = Date.now(), encontrou = false; while ((Date.now() - inicio) < maxAwaitMil) {
                            let body = (document.body.textContent || ''); if (lowerCase) { body = body.toLowerCase(); } if (body.includes(text)) { encontrou = true; break; } await sleep(250);
                        } if (encontrou) { resultados.push({ 'ret': true, 'msg': `ELEMENT ACTION [${action}]: OK | TEXTO ENCONTRADO (${paramId})`, 'res': textId || text, }); }
                        else { resultados.push({ 'ret': false, 'msg': `ELEMENT ACTION [${action}]: ERRO | TEXTO NÃO ENCONTRADO/NÃO APARECEU A TEMPO (${paramId})`, }); }
                        break;

                    case 'elementScrollIntoView':
                        el.scrollIntoView({ 'behavior': 'smooth', 'block': 'center', 'inline': 'nearest', });
                        resultados.push({ 'ret': true, 'msg': `ELEMENT ACTION [${action}]: OK (${paramId})`, });
                        break;

                    case 'elementSelectOption':
                        let errOption = false; if (el.tagName.toLowerCase() === 'select') {
                            if (elementValue !== undefined) { // SELECIONAR POR [VALOR]
                                let option = Array.from(el.options).find(o => o.value === elementValue);
                                if (option) { el.value = option.value; el.dispatchEvent(new Event('input', { 'bubbles': true, })); el.dispatchEvent(new Event('change', { 'bubbles': true, })); }
                                else { errOption = `Valor não encontrado (${paramId})`; }
                            } else if (elementIndex !== undefined) { // SELECIONAR POR [ÍNDICE]
                                if (elementIndex >= 0 && elementIndex < el.options.length) {
                                    el.selectedIndex = elementIndex; el.dispatchEvent(new Event('input', { 'bubbles': true, })); el.dispatchEvent(new Event('change', { 'bubbles': true, }));
                                } else { errOption = `Índice não encontrado (${paramId})`; }
                            } else { errOption = `Informar 'elementValue' ou 'elementIndex' (${paramId})`; }
                        } else { errOption = `Elemento não é <select> (${paramId})`; }
                        if (errOption) { resultados.push({ 'ret': false, 'msg': `ELEMENT ACTION [${action}]: ERRO | ${errOption}`, }); }
                        else { resultados.push({ 'ret': true, 'msg': `ELEMENT ACTION [${action}]: OK (${paramId})`, }); }
                        break;



                    // ------------------------------------------------------------------------------------------------------------------------
                    default:
                        resultados.push({ 'ret': false, 'msg': `ELEMENT ACTION [${action}]: ERRO | AÇÃO INVÁLIDA (${paramId})`, });
                    // ------------------------------------------------------------------------------------------------------------------------
                }
            } catch (err) {
                resultados.push({ 'ret': false, 'msg': `ELEMENT ACTION [${action}]: ERRO | (${paramId}) ${err.message}`, });
            }
        }

    }

    return resultados;

}

// CHROME | NODE
globalThis['elementAction'] = elementAction;


// let params, retElementAction;

// // [elementGetValue]
// params = {
//     'paramId': `{INDICADO}`, 'element': {
//         'maxAwaitMil': 2000, 'tag': 'records-entity-label',
//         'properties': [
//             { 'attributeName': 'slot', 'attributeValue': 'entityLabel', },
//         ],
//     }, 'actions': [{ 'action': 'elementGetValue', },],
// };
// retElementAction = await elementAction(params); console.log(retElementAction);

// // [elementGetXpath]
// params = {
//     'paramId': '{EXEMPLO_XPATH}', 'element': {
//         'maxAwaitMil': 2000, 'tag': 'input',
//         'properties': [
//             { 'attributeName': 'type', 'attributeValue': 'text', },
//         ],
//     },
//     'actions': [{ 'action': 'elementGetXpath', },],
// };
// retElementAction = await elementAction(params); console.log(retElementAction);

// // [elementClick]
// params = {
//     'paramId': '{EXEMPLO_CLICK}', 'element': {
//         'tag': 'button', 'content': 'Enviar',
//         'properties': [

//         ],
//     },
//     'actions': [{ 'action': 'elementClick', },],
// };
// retElementAction = await elementAction(params); console.log(retElementAction);

// // [attributeGetValue]
// params = {
//     'paramId': '{EXEMPLO_ATTRIBUTE}', 'element': {
//         'tag': 'a', 'content': 'Clique aqui',
//         'properties': [

//         ],
//     },
//     'actions': [{ 'action': 'attributeGetValue', 'attribute': 'href', },],
// };
// retElementAction = await elementAction(params); console.log(retElementAction);

// // [elementSetValue]
// params = {
//     'paramId': '{EXEMPLO_SET_VALUE}', 'element': {
//         'tag': 'input',
//         'properties': [
//             { 'attributeName': 'name', 'attributeValue': 'username', },
//         ],
//     },
//     'actions': [{ 'action': 'elementSetValue', 'elementValue': 'orlando_user', },],
// };
// retElementAction = await elementAction(params); console.log(retElementAction);

// // [awaitMil]
// params = {
//     'paramId': '{EXEMPLO_AWAIT}',
//     'element': {
//         'tag': 'body',
//         'properties': [

//         ],
//     },
//     'actions': [{ 'action': 'awaitMil', 'time': 1500, },],
// };
// retElementAction = await elementAction(params); console.log(retElementAction);

// // [elementHover]
// params = {
//     'paramId': '{EXEMPLO_HOVER}',
//     'element': {
//         'tag': 'div',
//         'properties': [
//             { 'attributeName': 'class', 'attributeValue': 'menu-item', },
//         ],
//     },
//     'actions': [{ 'action': 'elementHover', },],
// };
// retElementAction = await elementAction(params); console.log(retElementAction);

// // [getBody]
// params = {
//     'paramId': '{EXEMPLO_GET_BODY}',
//     'element': {},
//     'actions': [{ 'action': 'getBody', },],
// };
// retElementAction = await elementAction(params); console.log(retElementAction);

// // [bodyIncludes]
// params = {
//     'paramId': '{EXEMPLO_BODY_INCLUDES}',
//     'element': {},
//     'actions': [{ 'action': 'bodyIncludes', 'text': 'Bem-vindo', 'lowerCase': true, },],
// };
// retElementAction = await elementAction(params); console.log(retElementAction);

// // [elementScrollIntoView]
// params = {
//     'paramId': '{EXEMPLO_SCROLL}',
//     'element': {
//         'tag': 'div',
//         'properties': [
//             { 'attributeName': 'class', 'attributeValue': 'menu-item', },
//         ],
//     },
//     'actions': [{ 'action': 'elementScrollIntoView', },],
// };
// retElementAction = await elementAction(params); console.log(retElementAction);

// // [elementSelectOption]
// params = {
//     'paramId': `TESTES`, 'element': {
//         'maxAwaitMil': 250, 'tag': 'select',
//         'properties': [
//             { 'attributeName': 'id', 'attributeValue': 'idNome1', },
//         ],
//     }, 'actions': [
//         { 'action': 'elementSelectOption', 'elementValue': 'SELECT 2', /* OU */ 'elementIndex': 2, },
//     ],
// };
// retElementAction = await elementAction(params); console.log(retElementAction);


