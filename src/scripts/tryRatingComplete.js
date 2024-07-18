// let infTryRatingComplete, retTryRatingComplete
// infTryRatingComplete = { 'e': e, 'urlGoogleMaps': 'https://maps.app.goo.gl/' }
// retTryRatingComplete = await tryRatingComplete(infTryRatingComplete); console.log(retTryRatingComplete)

// IMPORTAR OBJETOS COM AS OPÇÕES E RESPOSTAS
import optTryRating_POIEvaluation from './objects/optTryRating_POIEvaluation.js'
import optTryRating_Search20 from './objects/optTryRating_Search20.js'

let e = import.meta.url, ee = e;
async function tryRatingComplete(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    try {
        let { urlGoogleMaps } = inf; let infChromeActions, retChromeActions, judgesValues = { 'current': -1, 'comments': [], 'responses': [], 'values': [] };
        let optionsHitApp = { 'POIEvaluation': optTryRating_POIEvaluation, 'Search20': optTryRating_Search20 }

        // PEGAR O NOME DO HIT APP | ############ (XPATH) ELEMENTO: PEGAR VALOR ############
        infChromeActions = { 'e': e, 'action': 'elementGetValue', 'target': `*tryrating*`, 'elementName': `//*[@id="app-root"]/div/div[4]/div[2]/div[1]/div/div[1]/div/div[1]/span[2]/span`, }
        retChromeActions = await chromeActions(infChromeActions); if (!retChromeActions.ret) { return retChromeActions }; let hitApp = retChromeActions.res[0].replace(/[^a-zA-Z0-9]/g, '')

        if (!['POIEvaluation', 'Search20',].includes(hitApp)) {
            ret['msg'] = `COMPLETE JUDGE: ERRO NÃO EXISTE '${hitApp}'`;
        } else {
            // ETAPA 1: PEGAR A DIV DOS JUDGES
            optionsHitApp = optionsHitApp[hitApp]; let judgesDiv = []; for (let index = 0; index < 10; index++) {
                infChromeActions = { 'e': e, 'action': 'elementGetDivXpath', 'target': `*tryrating*`, 'elementName': `${optionsHitApp.judgeXpath.replace('_INDEX_', index + 1)}`, }
                retChromeActions = await chromeActions(infChromeActions); if (!retChromeActions.ret) { break } else { judgesDiv.push(retChromeActions.res[0]) };
            }; if (judgesDiv.length == 0) { ret['msg'] = `JUDGE COMPLETE: ERRO | NENHUM JULGAMENTO ENCONTRADO`; }; // console.log(judgesDiv)

            // ETAPA 2: PEGAR VALOR DOS ELEMENTOS
            async function judgeGetValues(inf) {
                let { div } = inf; let judgeValues = []; for (let [index, value] of optionsHitApp.judgeOptions.entries()) {
                    let lastValue = '###'; for (let [index1, value1] of value.actions.entries()) {
                        if (value.actionsMode == 'subDiv+content+attributeValue') {
                            if (value1.action == 'elementGetDiv') {
                                // → DIV: PEGAR (BRUTA) *** QUESTION
                                infChromeActions = { 'e': e, 'action': value1.action, 'target': div, 'tag': value1.tag, 'content': value1.content, 'tagFather': value1.tagFather }
                                retChromeActions = await chromeActions(infChromeActions); if (!retChromeActions.ret) {
                                    lastValue = '###'; judgeValues.push({ 'valid': false, 'elementIndex': index, 'elementName': value1.content, 'elementId': '###', 'elementValue': '###', })
                                } else { lastValue = retChromeActions.res[0]; }; // console.log(lastValue)
                            } else if (value1.action == 'attributeGetValue' && lastValue !== '###') {
                                // → ATRIBUTO: PEGAR VALOR
                                infChromeActions = { 'e': e, 'action': value1.action, 'target': lastValue, 'tag': value1.tag, 'attribute': value1.attribute, 'content': value1.content, }
                                retChromeActions = await chromeActions(infChromeActions); if (!retChromeActions.ret) {
                                    lastValue = '###'; judgeValues.push({ 'valid': false, 'elementIndex': index, 'elementName': value1.content, 'elementId': '###', 'elementValue': '###', })
                                } else { lastValue = retChromeActions.res[0]; }; // console.log(lastValue)
                            } else if (value1.action == 'elementGetValue' && lastValue !== '###') {
                                // // → ELEMENTO: PEGAR VALOR
                                infChromeActions = {
                                    'e': e, 'action': value1.action, 'target': `*tryrating*`, 'attribute': value1.attribute, 'attributeValue': lastValue,
                                    'attributeAdd': value1.attributeAdd, 'attributeValueAdd': value1.attributeValueAdd,
                                }; retChromeActions = await chromeActions(infChromeActions); let lastValueOld = lastValue; let valid = retChromeActions.ret; let elementName = value.actions[0].content;
                                if (!retChromeActions.ret) { lastValue = '###'; } else { lastValue = retChromeActions.res[0]; }; // console.log(lastValue)
                                judgeValues.push({ 'valid': valid, 'elementIndex': index, 'elementName': elementName, 'elementId': lastValueOld, 'elementValue': lastValue, })
                            }
                        }
                    }
                }; return { 'ret': true, 'msg': 'JUDGE GET VALUES: OK', 'res': judgeValues }
            }

            // ETAPA 3: CRIAR AS RESPOSTAS
            async function judgeMakeResponse(inf) {
                let { values } = inf; let judgeResponses = []; for (let [index, value] of values.entries()) {
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
            async function judgeMakeComment(inf) {
                let { indexDiv, responses } = inf; let comment = ''; for (let [index, value] of responses.entries()) {
                    if (value.valid && value.elementResponse !== 'AAA') {
                        if (hitApp == 'Search20') {
                            if (value.elementName !== 'Comment and Link') { comment = `${comment}\n${value.elementResponse}` }
                            else if (value.elementName == 'Comment and Link') {
                                // PEGAR O NOME DO HIT APP | ############ (XPATH) ELEMENTO: PEGAR VALOR ############
                                let viewport; infChromeActions = { 'e': e, 'action': 'elementGetValue', 'target': `*tryrating*`, 'elementName': `/html/body/div[1]/div/div[4]/div[2]/div[2]/div/div/div/div/div/div/div/div/div[1]/div/div/div/div/div[3]/div[1]/div[1]/div[2]/div/div/div/div/div/div/div/div[2]/div/div/div/table/tbody/tr[2]/td[2]/div/div/div/div/div/div/div/div/div/div/p/span[2]/strong`, }
                                retChromeActions = await chromeActions(infChromeActions); if (!retChromeActions.ret) { viewport = '############## NÃO ENCONTRADA VIEWPORT ##############' } else { viewport = retChromeActions.res[0] };
                                viewport = viewport == 'FRESH' ? 'NEW' : 'OLD'; if (value.elementValue == '' && judgesValues.current == -1) { judgesValues.current = indexDiv };
                                comment = `Visualization is ${viewport} and the user is IN OUT\n${comment}${comment.includes('place is permanently closed or does not exist') ? '' : `\n\n${urlGoogleMaps}`}`
                            }
                        }
                    }
                }; return { 'ret': true, 'msg': 'JUDGE MAKE RESPONSE: OK', 'res': comment }
            }

            for (let [index, value] of judgesDiv.entries()) {
                let retJudgeGetValues = await judgeGetValues({ 'indexDiv': index, 'div': value }); // console.log(retJudgeGetValues)
                let retJudgeMakeResponse = await judgeMakeResponse({ 'indexDiv': index, 'values': retJudgeGetValues.res }); // console.log(retJudgeMakeResponse)
                let retJudgeMakeComment = await judgeMakeComment({ 'indexDiv': index, 'responses': retJudgeMakeResponse.res }); // console.log(JSON.stringify(retJudgeMakeComment.res, null, 2).replace(/\\n/g, '\n').replace(/"/g, ''))
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
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res;
    }; return { ...({ ret: ret.ret }), ...(ret.msg && { msg: ret.msg }), ...(ret.res && { res: ret.res }), };
};

// CHROME | NODEJS
(eng ? window : global)['tryRatingComplete'] = tryRatingComplete;



