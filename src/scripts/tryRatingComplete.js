// let infTryRatingComplete, retTryRatingComplete
// infTryRatingComplete = { e, 'infTryRatingComplete': 'https://maps.app.goo.gl/' }
// retTryRatingComplete = await tryRatingComplete(infTryRatingComplete); console.log(retTryRatingComplete)

// IMPORTAR OBJETOS COM AS OPÇÕES E RESPOSTAS
import optTryRating_POIEvaluation from './objects/optTryRating_POIEvaluation.js'
import optTryRating_Search20 from './objects/optTryRating_Search20.js'

let e = import.meta.url, ee = e;
async function tryRatingComplete(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        let { infTryRatingComplete, } = inf; let infChromeActions, retChromeActions, judgesValues = { 'current': -1, 'comments': [], 'responses': [], 'values': [] };
        let optionsHitApp = { 'POIEvaluation': optTryRating_POIEvaluation, 'Search20': optTryRating_Search20 };

        // PEGAR O NOME DO HIT APP | ############ (XPATH) ELEMENTO: PEGAR VALOR ############
        infChromeActions = { e, 'action': 'elementGetValue', 'target': `*tryrating*`, 'elementName': `//*[@id="app-root"]/div/div[4]/div[2]/div[1]/div/div[1]/div/div[1]/span[2]/span`, }
        retChromeActions = await chromeActions(infChromeActions); if (!retChromeActions.ret) { return retChromeActions }; let hitApp = retChromeActions.res[0].replace(/[^a-zA-Z0-9]/g, '')

        if (!['POIEvaluation', 'Search20',].includes(hitApp)) {
            ret['msg'] = `COMPLETE JUDGE: ERRO NÃO EXISTE '${hitApp}'`;
        } else {
            let infOk = {}; if (infTryRatingComplete.includes('{"')) { infOk = JSON.parse(infTryRatingComplete); } else if (infTryRatingComplete.includes(' 🟢 ')) {
                let gM = infTryRatingComplete.split(' 🟢 '); infOk['name'] = gM[0]; infOk['category'] = gM[1]; infOk['address'] = gM[2]; infOk['urlGoogleMaps'] = gM[3];
            } else { if (hitApp == 'Search20') { let gM = infTryRatingComplete; infOk['urlGoogleMaps'] = gM.includes('https://maps.app.goo.gl/') ? gM : false } }

            // ETAPA 1: PEGAR A DIV DOS JUDGES
            optionsHitApp = optionsHitApp[hitApp]; let judgesDiv = []; for (let index = 0; index < 10; index++) {
                infChromeActions = { e, 'action': 'elementGetDivXpath', 'target': `*tryrating*`, 'elementName': `${optionsHitApp.judgeXpath.replace('_INDEX_', index + 1)}`, }
                retChromeActions = await chromeActions(infChromeActions); if (!retChromeActions.ret) { break } else { if (!retChromeActions.res[0].startsWith('<div')) { break } else { judgesDiv.push(retChromeActions.res[0]) } };
            }; if (judgesDiv.length == 0) { ret['msg'] = `JUDGE COMPLETE: ERRO | NENHUM JULGAMENTO ENCONTRADO`; };

            // ETAPA 2: PEGAR VALOR DOS ELEMENTOS
            async function judgeGetValues(inf = {}) {
                let { div, } = inf; let judgeValues = []; for (let [index, value] of optionsHitApp.judgeOptions.entries()) {
                    let lastValue = '###'; for (let [index1, value1] of value.actions.entries()) {
                        if (value.actionsMode == 'subDiv+content+attributeValue') {
                            if (value1.action == 'elementGetDiv') {
                                // → DIV: PEGAR (BRUTA) *** QUESTION
                                infChromeActions = { e, 'action': value1.action, 'target': div, 'tag': value1.tag, 'content': value1.content, 'tagFather': value1.tagFather }
                                retChromeActions = await chromeActions(infChromeActions); if (!retChromeActions.ret) {
                                    lastValue = '###'; judgeValues.push({ 'valid': false, 'elementIndex': index, 'elementName': value1.content, 'elementId': '###', 'elementValue': '###', })
                                } else { lastValue = retChromeActions.res[0]; };
                            } else if (value1.action == 'attributeGetValue' && lastValue !== '###') {
                                // → ATRIBUTO: PEGAR VALOR
                                infChromeActions = { e, 'action': value1.action, 'target': lastValue, 'tag': value1.tag, 'attribute': value1.attribute, 'content': value1.content, }
                                retChromeActions = await chromeActions(infChromeActions); if (!retChromeActions.ret) {
                                    lastValue = '###'; judgeValues.push({ 'valid': false, 'elementIndex': index, 'elementName': value1.content, 'elementId': '###', 'elementValue': '###', })
                                } else { lastValue = retChromeActions.res[0]; };
                            } else if (value1.action == 'elementGetValue' && lastValue !== '###') {
                                // // → ELEMENTO: PEGAR VALOR
                                infChromeActions = {
                                    e, 'action': value1.action, 'target': `*tryrating*`, 'attribute': value1.attribute, 'attributeValue': lastValue,
                                    'attributeAdd': value1.attributeAdd, 'attributeValueAdd': value1.attributeValueAdd,
                                }; retChromeActions = await chromeActions(infChromeActions); let lastValueOld = lastValue; let valid = retChromeActions.ret; let elementName = value.actions[0].content;
                                if (!retChromeActions.ret) { lastValue = '###'; } else { lastValue = retChromeActions.res[0]; };
                                judgeValues.push({ 'valid': valid, 'elementIndex': index, 'elementName': elementName, 'elementId': lastValueOld, 'elementValue': lastValue, })
                            }
                        }
                    }
                }; return { 'ret': true, 'msg': 'JUDGE GET VALUES: OK', 'res': judgeValues }
            }

            // ETAPA 3: CRIAR AS RESPOSTAS
            async function judgeMakeResponse(inf = {}) {
                let { values, } = inf; let judgeResponses = []; for (let [index, value] of values.entries()) {
                    let breakBoolen = false; for (let [index1, value1] of optionsHitApp.judgeOptions.entries()) {
                        for (let [index2, value2] of value1.actions.entries()) {
                            if (value1.actionsMode == 'subDiv+content+attributeValue' && value2.action == 'elementGetDiv' && value.elementName == value2.content) { breakBoolen = true; }; if (breakBoolen) {
                                let response = value1[value.elementValue]; response = response !== undefined ? response : `############## FALTA RESPOSTA: ${value.elementName}`
                                let valueOk = value; valueOk['elementResponse'] = response; judgeResponses.push(valueOk); break
                            }
                        }; if (breakBoolen) { break }
                    }
                }; return { 'ret': true, 'msg': 'JUDGE MAKE RESPONSES: OK', 'res': judgeResponses }
            }

            // ETAPA 3: CRIAR COMENTÁRIO (COM AS RESPOSTAS ANTERIORES)
            async function judgeMakeComment(inf = {}) {
                let { indexDiv, responses, } = inf; let comment = ''; let optionsErr = {}; let replaceIs = '#REP#'; for (let [index, value] of responses.entries()) {
                    if (hitApp == 'Search20') {
                        if (value.valid && value.elementResponse !== 'AAA') {
                            // // After researching on the internet, it was possible to determine that the place is permanently closed or does not exist.
                            if (value.elementName == 'Business/POI is closed or does not exist') { replaceIs = infOk.urlGoogleMaps ? ' or does not exist' : ' is permanently closed or' }
                            else if (value.elementName == 'Name Issue' && infOk.name) { optionsErr['name'] = `\n\nCorrect name is:\n${infOk.name}` }
                            else if (value.elementName == 'Category Issue' && infOk.category) { optionsErr['category'] = `\n\nThis is the correct category:\n${infOk.category}` }
                            else if (value.elementName == 'Address Accuracy' && infOk.address) { optionsErr['address'] = `\n\nCorrect address:\n${infOk.address}` }; // NÃO UNIR COM O IF A SEGUIR
                            if (value.elementName !== 'Comment and Link') { comment = `${comment}\n${value.elementResponse}` } else if (value.elementName == 'Comment and Link') {
                                // PEGAR O NOME DO HIT APP | ############ (XPATH) ELEMENTO: PEGAR VALOR ############
                                let viewport; infChromeActions = { e, 'action': 'elementGetValue', 'target': `*tryrating*`, 'elementName': `/html/body/div[1]/div/div[4]/div[2]/div[2]/div/div/div/div/div/div/div/div/div[1]/div/div/div/div/div[3]/div[1]/div[1]/div[2]/div/div/div/div/div/div/div/div[2]/div/div/div/table/tbody/tr[2]/td[2]/div/div/div/div/div/div/div/div/div/div/p/span[2]/strong`, }
                                retChromeActions = await chromeActions(infChromeActions); if (!retChromeActions.ret) { viewport = '############## NÃO ENCONTRADA VIEWPORT ##############' } else { viewport = retChromeActions.res[0] };
                                viewport = viewport == 'FRESH' ? 'NEW' : 'OLD'; if (value.elementValue == '' && judgesValues.current == -1) { judgesValues.current = indexDiv };
                                comment = `Visualization is ${viewport} and the user is IN OUT of the viewport\n${comment}`; comment = `${comment}${optionsErr.name || ''}${optionsErr.category || ''}${optionsErr.address || ''}`
                                comment = `${comment}${infOk.urlGoogleMaps ? `\n\n${infOk.urlGoogleMaps}` : ''}`; comment = comment.replace(replaceIs, '')
                            }
                        }
                    }
                }; return { 'ret': true, 'msg': 'JUDGE MAKE RESPONSE: OK', 'res': comment }
            }

            for (let [index, value] of judgesDiv.entries()) {
                let retJudgeGetValues = await judgeGetValues({ 'indexDiv': index, 'div': value }); let retJudgeMakeResponse = await judgeMakeResponse({ 'indexDiv': index, 'values': retJudgeGetValues.res });
                let retJudgeMakeComment = await judgeMakeComment({ 'indexDiv': index, 'responses': retJudgeMakeResponse.res });
                judgesValues.comments.push(retJudgeMakeComment.res); judgesValues.responses.push(retJudgeGetValues.res); judgesValues.values.push(retJudgeGetValues.res)
            };

            if (judgesValues.current == -1) {
                ret['msg'] = `Nenhum julgamento pendente`;
            } else if (JSON.stringify(judgesValues.comments[judgesValues.current]).includes('##############')) {
                ret['msg'] = `Falta resposta`;
            } else {
                ret['res'] = judgesValues;
                ret['msg'] = `TRYRATING COMPLET: OK`;
                ret['ret'] = true;
            }
        }
    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    };

    return { ...({ 'ret': ret.ret }), ...(ret.msg && { 'msg': ret.msg }), ...(ret.res && { 'res': ret.res }), };
};

// CHROME | NODEJS
(eng ? window : global)['tryRatingComplete'] = tryRatingComplete;



