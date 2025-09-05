// let infModel, retModel
// infModel = { e, 'chaveUm': 'valorUm', 'chaveDois': 'valorDois' }
// retModel = await elementoSearch(infModel); console.log(retModel)

// IGUAL AO 'Chrome_Extension/src/resources/clientImputChromeNew.js'
async function elementAction(inf = {}) {
    let nameSearch = inf.nameSearch || 'xx', maxReturn = Number(inf.element?.maxReturn) || 10, indexTarget = (inf.element?.indexTarget !== undefined) ? inf.element.indexTarget : -1;
    let element = inf.element || {}, maxAwaitMil = element.maxAwaitMil || 50; function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

    function getElementXPath(el) {
        let parts = []; while (el && el.nodeType === Node.ELEMENT_NODE) {
            let index = 1, sibling = el.previousSibling; while (sibling) { if (sibling.nodeType === Node.ELEMENT_NODE && sibling.nodeName === el.nodeName) { index++; } sibling = sibling.previousSibling; }
            parts.unshift(el.nodeName.toLowerCase() + (index > 1 ? `[${index}]` : '')); el = el.parentNode;
        } return '/' + parts.join('/');
    }

    async function simularDigitacao(el, texto, intervalo = 50, teclaFinal = null) {
        let valorAtual = ''; for (let i = 0; i < texto.length; i++) {
            let char = texto[i]; el.dispatchEvent(new KeyboardEvent('keydown', { key: char, bubbles: true, })); el.dispatchEvent(new KeyboardEvent('keypress', { key: char, bubbles: true, }));
            valorAtual += char; el.value = valorAtual; el.dispatchEvent(new Event('input', { bubbles: true, })); el.dispatchEvent(new KeyboardEvent('keyup', { key: char, bubbles: true, })); await sleep(intervalo);
        } el.dispatchEvent(new Event('change', { bubbles: true, })); if (teclaFinal === 'ENTER') {
            el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, })); el.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter', bubbles: true, }));
            el.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true, }));
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
                    } if (ok && inf.propriedades && inf.propriedades.length > 0) {
                        for (let prop of inf.propriedades) { // propriedades: todos devem ser atendidos
                            let nomeOk = true, valorOk = true; if (prop.atributoNome) { nomeOk = el.hasAttribute(prop.atributoNome); } if (prop.atributoValor) {
                                valorOk = false; for (let attr of el.attributes) { if (attr.value.includes(prop.atributoValor)) { valorOk = true; break; } }
                            } if (!(nomeOk && valorOk)) { ok = false; break; }
                        }
                    } if (ok) { resultadoBase.add(el); }
                } if (resultadoBase.size > 0 || maxAwaitMil === 0) {   // Aplicar filtro de elementoParente, se houver
                    clearInterval(intervalo); if (!inf.elementoParente) { return resolve([...resultadoBase,]); } let resultadoFinal = new Set(); for (let baseEl of resultadoBase) {
                        let candidatos = new Set(), tipo = inf.elementoParente.tipo;
                        if (tipo === 'pai') { let atual = baseEl.parentElement; while (atual) { for (let el of getAllElementsIncludingShadowDOM(atual)) { candidatos.add(el); } atual = atual.parentElement; } }
                        if (tipo === 'filho') { for (let el of getAllElementsIncludingShadowDOM(baseEl)) { candidatos.add(el); } } for (let el of candidatos) {
                            let tagOk = true; if (inf.elementoParente.tag) { tagOk = el.tagName.toLowerCase() === inf.elementoParente.tag.toLowerCase(); } let propOk = true;
                            if (inf.elementoParente.propriedades) {
                                propOk = inf.elementoParente.propriedades.every(p => {
                                    let achou = false; for (let attr of el.attributes) {
                                        if (p.atributoNome && !p.atributoValor) { if (attr.name === p.atributoNome) { achou = true; } } else if (!p.atributoNome && p.atributoValor) {
                                            if (attr.value.includes(p.atributoValor)) { achou = true; }
                                        } else if (p.atributoNome && p.atributoValor) { if (attr.name === p.atributoNome && attr.value.includes(p.atributoValor)) { achou = true; } }
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
    if ((!elementos || elementos.length === 0) && !ehBodyIncludes) { return [{ 'ret': false, 'msg': `ELEMENT ACTION: ERRO | NÃO ENCONTRADO/NÃO APARECEU A TEMPO (${nameSearch})`, },]; }
    if (ehBodyIncludes) { elementos = [document.body,]; }

    if (indexTarget > -1) { elementos = [elementos[indexTarget],]; } elementos = elementos.slice(0, maxReturn || elementos.length); for (let el of elementos) {
        for (let [index, value,] of actions.entries()) {
            let acao = value; try {
                if (!el.isConnected) {
                    resultados.push({ 'ret': false, 'msg': `ELEMENT ACTION [${acao.action}]: ERRO | ELEMENTO NÃO ESTÁ MAIS NO DOM (${nameSearch})`, }); continue;
                }
                switch (acao.action) {
                    case 'elementGetXpath':
                        resultados.push({ 'ret': true, 'msg': `ELEMENT ACTION [${acao.action}]: OK (${nameSearch})`, 'res': getElementXPath(el), }); break;

                    case 'elementClick':
                        el.click(); // PADRÃO
                        resultados.push({ 'ret': true, 'msg': `ELEMENT ACTION [${acao.action}]: OK (${nameSearch})`, }); break;

                    case 'elementGetValue':
                        resultados.push({ 'ret': true, 'msg': `ELEMENT ACTION [${acao.action}]: OK (${nameSearch})`, 'res': el.value?.trim() ? el.value : el.textContent, }); break;

                    case 'attributeGetValue':
                        if (acao.attribute) { resultados.push({ 'ret': true, 'msg': `ELEMENT ACTION [${acao.action}]: OK (${nameSearch})`, 'res': el.getAttribute(acao.attribute), }); }
                        else { resultados.push({ 'ret': false, 'msg': `ELEMENT ACTION [${acao.action}]: ERRO | INFORMAR O 'attribute' (${nameSearch})`, }); }
                        break;

                    case 'elementSetValue':
                        if ('elementValue' in acao) {
                            let ehComboFake = el.tagName.toLowerCase() === 'button' && el.getAttribute('role') === 'combobox';
                            if (ehComboFake) {
                                try {
                                    el.click(); await sleep(500); /* espera abrir dropdown */ await simularDigitacao(el, `${acao.elementValue}`, 50, 'ENTER');
                                    resultados.push({ 'ret': true, 'msg': `ELEMENT ACTION [${acao.action}]: OK (${nameSearch})`, });
                                } catch (err) {
                                    resultados.push({ 'ret': false, 'msg': `ELEMENT ACTION [${acao.action}]: ERRO AO DEFINIR VALOR (${nameSearch}) → ${err.message}`, });
                                }
                            } else if ('value' in el) {
                                el.focus(); let valor = acao.elementValue; el.value = valor;
                                el.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true, })); el.dispatchEvent(new KeyboardEvent('keyup', { key: 'a', bubbles: true, }));
                                el.dispatchEvent(new Event('input', { bubbles: true, })); el.dispatchEvent(new Event('change', { bubbles: true, })); el.blur();

                                resultados.push({ 'ret': true, 'msg': `ELEMENT ACTION [${acao.action}]: OK (${nameSearch})`, });
                            } else {
                                resultados.push({ 'ret': false, 'msg': `ELEMENT ACTION [${acao.action}]: ERRO | ELEMENTO NÃO ACEITA IMPUT (${nameSearch})`, });
                            }
                        } else {
                            resultados.push({ 'ret': false, 'msg': `ELEMENT ACTION [${acao.action}]: ERRO | INFORMAR O 'elementValue' (${nameSearch}) `, });
                        }
                        break;

                    case 'awaitMil':
                        await sleep(acao.time || 1000); resultados.push({ 'ret': true, 'msg': `ELEMENT ACTION [${acao.action}]: OK (${nameSearch})`, });
                        break;

                    case 'elementHover':
                        let event = new MouseEvent('mouseover', { 'bubbles': true, 'cancelable': true, 'view': window, }); el.dispatchEvent(event);
                        resultados.push({ 'ret': true, 'msg': `ELEMENT ACTION [${acao.action}]: OK (${nameSearch})`, });
                        break;

                    case 'getBody':
                        resultados.push({ 'ret': true, 'msg': `ELEMENT ACTION [${acao.action}]: OK (${nameSearch})`, 'res': (document.body.textContent || ''), });
                        break;

                    case 'bodyIncludes':
                        let inicio = Date.now(), encontrou = false; while ((Date.now() - inicio) < maxAwaitMil) {
                            let body = (document.body.textContent || ''); if (acao.lowerCase) { body = body.toLowerCase(); }
                            if (body.includes(acao.text)) { encontrou = true; break; } await sleep(250);
                        } if (encontrou) { resultados.push({ 'ret': true, 'msg': `ELEMENT ACTION [${acao.action}]: OK | TEXTO ENCONTRADO (${nameSearch})`, 'res': acao.text, }); }
                        else { resultados.push({ 'ret': false, 'msg': `ELEMENT ACTION [${acao.action}]: ERRO | TEXTO NÃO ENCONTRADO/NÃO APARECEU A TEMPO (${nameSearch})`, }); }
                        break;

                    default:
                        resultados.push({ 'ret': false, 'msg': `ELEMENT ACTION [${acao.action}]: ERRO | AÇÃO INVÁLIDA (${nameSearch})`, });
                }
            } catch (err) {
                resultados.push({ 'ret': false, 'msg': `ELEMENT ACTION [${acao.action}]: ERRO | (${nameSearch}) ${err.message}`, });
            }
        }

    }

    return resultados;

}

// CHROME | NODE
globalThis['elementAction'] = elementAction;


// let params;

// params = { // [DIV] 'Resultado lupa (lead encontrado)'
//     'nameSearch': `{INDICADO}`, 'element': {
//         'maxAwaitMil': 2000, 'tag': 'records-entity-label',
//         'propriedades': [{ 'atributoNome': 'slot', 'atributoValor': 'entityLabel', },],
//     }, 'actions': [{ 'action': 'elementGetValue', },],
// };

// let encontrados = await elementAction(params); console.log(encontrados);

// {/* <div lwc-3mmmrd7j9v4="" class="entityNameTitle slds-line-height--reset">
//   <slot lwc-3mmmrd7j9v4="" name="entityLabel">
//     <records-entity-label slot="entityLabel">Lead</records-entity-label>
//   </slot>
// </div> */}