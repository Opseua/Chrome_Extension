// let infJudgeComplete, retJudgeComplete
// infJudgeComplete = { 'e': e, 'hitApp': 'POIEvaluation' }
// retJudgeComplete = await judgeComplete(infJudgeComplete)
// console.log(retJudgeComplete)

// IMPORTAR OBJETOS COM AS OPÇÕES E RESPOSTAS
import optTryRating_POIEvaluation from '../scripts/objects/optTryRating_POIEvaluation.js'
import optTryRating_Search20 from '../scripts/objects/optTryRating_Search20.js'

let e = import.meta.url, ee = e;
async function judgeComplete(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    try {
        let { urlGoogleMaps } = inf; let infChromeActions, retChromeActions, attributeValue, judgesValues = { 'current': -1, 'comments': {}, 'judges': {} };
        let optionsHitApp = { 'POIEvaluation': optTryRating_POIEvaluation, 'Search20': optTryRating_Search20 }

        // PEGAR O NOME DO HIT APP | ############ (XPATH) ELEMENTO: PEGAR VALOR  ############
        infChromeActions = { 'e': e, 'action': 'elementGetValue', 'target': `*tryrating*`, 'elementName': `//*[@id="app-root"]/div/div[4]/div[2]/div[1]/div/div[1]/div/div[1]/span[2]/span`, }
        retChromeActions = await chromeActions(infChromeActions); if (!retChromeActions.ret) { return retChromeActions }; let hitApp = retChromeActions.res[0].replace(/[^a-zA-Z0-9]/g, '')

        if (!['POIEvaluation', 'Search20',].includes(hitApp)) {
            ret['msg'] = `COMPLETE JUDGE: ERRO NÃO EXISTE '${hitApp}'`;
        } else {
            async function getJudges(inf) {
                let { optionsHitApp } = inf;
                // PEGAR A DIV DOS JUDGES | RETORNAR SE NENHUM JUDGE FOR ENCONTRADO
                let judgesDiv = []; for (let index = 0; index < 10; index++) {
                    infChromeActions = { 'e': e, 'action': 'elementGetDivXpath', 'target': `*tryrating*`, 'elementName': `${optionsHitApp.judgeXpath.replace('_INDEX_', index + 1)}`, }
                    retChromeActions = await chromeActions(infChromeActions); if (!retChromeActions.ret) { break } else { judgesDiv.push(retChromeActions.res[0]) }; // console.log(retChromeActions)
                }; if (judgesDiv.length == 0) { ret['msg'] = `JUDGE COMPLETE: ERRO | NENHUM JULGAMENTO ENCONTRADO`; return ret }

                // ETAPA 1: PEGAR ID DOS ELEMENTOS
                async function judgeGetIds(inf) {
                    let { div } = inf; let judgeIds = []; let elementId; for (let [index, value] of optionsHitApp.judgeOptions.entries()) {
                        for (let [index1, value1] of value.actions.entries()) {
                            if (value1.action == 'attributeGetValue') {
                                // → ATRIBUTO: PEGAR VALOR
                                infChromeActions = { 'e': e, 'action': value1.action, 'target': div, 'tag': value1.tag, 'attribute': value1.attribute, 'content': value1.content, }
                                retChromeActions = await chromeActions(infChromeActions); // console.log(retChromeActions)
                                elementId = retChromeActions.ret ? retChromeActions.res[0] : false
                                judgeIds.push({ 'valid': value1.invalid ? false : elementId ? true : false, 'elementIndex': index, 'elementName': value1.content, 'elementId': elementId, })
                            }; if (value.actions.length < 2) { judgeIds.push({ 'valid': true, 'elementIndex': index, 'elementName': value1.attributeValue, 'elementId': false, }) }
                        }
                    }; return { 'ret': true, 'msg': 'JUDGE GET IDS: OK', 'res': judgeIds }
                }
                let retJudgeGetIds = await judgeGetIds({ 'div': judgesDiv[0] })
                console.log(retJudgeGetIds)

                // ETAPA 2: PEGAR VALOR ELEMENTOS (PELO ID ANTERIOR) E CRIAR AS RESPOSTAS
                async function judgeGetValues(inf) {
                    let { ids } = inf; let judgeValues = []; let elementValue, elementResponse; for (let [index, value] of optionsHitApp.judgeOptions.entries()) {
                        for (let [index1, value1] of value.actions.entries()) {
                            if (value1.action == 'elementGetValue' && value1.elementName) {
                                // → ELEMENTO: PEGAR VALOR
                                infChromeActions = { 'e': e, 'action': value1.action, 'target': `*tryrating*`, 'elementName': value1.elementName, }
                                retChromeActions = await chromeActions(infChromeActions); elementValue = retChromeActions.ret ? retChromeActions.res[0] : '###'; // console.log(retChromeActions)
                                elementResponse = elementValue == '###' ? '###' : value[elementValue] == undefined ? '###' : value[elementValue]; judgeValues.push({
                                    'valid': value.invalid ? false : elementValue == '###' ? true : false, 'elementIndex': ids[index].elementIndex, 'nameQuestion': value.nameQuestion,
                                    'elementValue': elementValue, 'elementResponse': elementResponse,
                                })
                                console.log(`valid → ${value.invalid ? false : true}\n→ ${value.nameQuestion}\n→ ${elementValue}\n`)
                            }
                        }
                    }; return { 'ret': true, 'msg': 'JUDGE GET VALUES: OK', 'res': judgeValues }
                }
                let retJudgeGetValues = await judgeGetValues({ 'ids': retJudgeGetIds.res }); console.log(retJudgeGetValues)

                // ETAPA 3: CRIAR COMENTÁRIO (COM AS RESPOSTAS ANTERIORES)
                async function judgeMakeComment(inf) {
                    let { values } = inf; let comment = ''; let elementResponse; for (let [index, value] of values.entries()) {
                        if (value.valid && value.elementResponse !== 'AAA') {
                            elementResponse = value.elementResponse == '###' ? `### PERGUNTA [${JSON.stringify(value.elementIndex).padStart(2, '0')}]: ${value.elementName}` : value.elementResponse
                            comment = `${comment}${elementResponse}\n`
                        }
                    }; return { 'ret': true, 'msg': 'JUDGE MAKE COMMENT: OK', 'res': comment }
                }
                let retJudgeMakeComment = await judgeMakeComment({ 'values': retJudgeGetValues.res }); console.log(JSON.stringify(retJudgeMakeComment.res, null, 2).replace(/\\n/g, '\n').replace(/"/g, ''))


                return { 'ret': true, 'msg': 'GET JUDGES: OK', 'res': 'judgesValues' }



                for (let [index, value] of optionsHitApp.entries()) {
                    let actions = value; for (let [index1, value1] of actions.actions.entries()) {
                        // if (value1.action == 'attributeGetValue') {
                        //     // ############ ATRIBUTO: PEGAR VALOR  ############
                        //     infChromeActions = { 'e': e, 'action': value1.action, 'target': `*tryrating*`, 'tag': value1.tag, 'attribute': value1.attribute, 'content': value1.content, }
                        //     retChromeActions = await chromeActions(infChromeActions); // console.log(retChromeActions.res);
                        //     if (retChromeActions.ret) {
                        //         attributeValue = retChromeActions.res;
                        //     };
                        // } else if (value1.action == 'elementGetValue') {
                        //     // ############ ELEMENTO: PEGAR VALOR ############
                        //     attributeValue = value1.attributeValue == "OLD" ? attributeValue : [value1.attributeValue]
                        //     for (let [index2, value2] of attributeValue.entries()) {
                        //         infChromeActions = { 'e': e, 'action': value1.action, 'target': `*tryrating*`, 'attribute': value1.attribute, 'attributeValue': value2 }
                        //         retChromeActions = await chromeActions(infChromeActions); // console.log(retChromeActions.res);
                        //         let elementGetName;
                        //         if (retChromeActions.ret) {
                        //             // DEFINIR ARRAYS SEPARADAS PARA CADA JULGAMENTO JÁ COM O ELEMENTO, VALOR E RESPOSTA DO COMENTÁRIO
                        //             elementGetName = actions.actions[0];
                        //             elementGetName = elementGetName.content ? elementGetName.content : elementGetName.attributeValue
                        //             if (!judgesValues.comments[index2]) {
                        //                 judgesValues.comments[index2] = ''
                        //             };
                        //             if (!judgesValues.judges[index2]) {
                        //                 judgesValues.judges[index2] = []
                        //             };
                        //             let judgeValue = { 'elementIndex': index, 'elementName': [elementGetName], 'elementValue': retChromeActions.res, 'elementResponse': [actions[retChromeActions.res]] }
                        //             let eleResponse = judgeValue.elementResponse[0]
                        //             let elementResponse = eleResponse == undefined || eleResponse == '' || eleResponse == 'Select...' ? `### PERGUNTA [${judgeValue.elementIndex + 1}] → ${judgeValue.elementName[0]}` : eleResponse
                        //             judgeValue['elementResponse'] = [elementResponse];
                        //             if (judgeValue.elementResponse[0] !== 'AAA' && judgeValue.elementName[0] !== 'Comment and Link') {
                        //                 judgesValues.comments[index2] = `${judgesValues.comments[index2]}${judgeValue.elementResponse[0]}\n`;
                        //             }
                        //             judgesValues.judges[index2].push(judgeValue)
                        //         };
                        //     }
                        // }
                    };
                }
                return { 'ret': true, 'msg': 'GET JUDGES: OK', 'res': judgesValues }
            }

            let retGetJudges = await getJudges({ 'optionsHitApp': optionsHitApp[hitApp] }); if (!retGetJudges.ret) { return retGetJudges }; judgesValues = retGetJudges.res

            return retGetJudges

            // ENCONTRAR JULGAMENTO ATUAL (O PRIMEIRO PENDENTE)
            for (let [index, value] of Object.keys(judgesValues.judges).entries()) {
                for (let [index1, value1] of judgesValues.judges[value].entries()) { if (value1.elementName[0] == 'Comment and Link' && value1.elementValue[0] == '') { judgesValues.current = index; break }; };
                if (judgesValues.current > -1) { break }
            }

            // CRIAR COMENTÁRIO
            if (judgesValues.current == -1) {
                ret['msg'] = `Nenhum julgamento pendente`;
            } else {
                // PEGAR A VIEWPORT ('Search20') | ############ (XPATH) ELEMENTO: PEGAR VALOR  ############
                if (hitApp == 'Search20') {
                    infChromeActions = { 'e': e, 'action': 'elementGetValueXpath', 'target': `*tryrating*`, 'elementName': `//*[@id="app-root"]/div/div[4]/div[2]/div[2]/div/div/div/div/div/div/div/div/div[1]/div/div/div/div/div[3]/div[1]/div[1]/div[2]/div/div/div/div/div/div/div/div[2]/div/div/div`, }
                    retChromeActions = await chromeActions(infChromeActions); let viewport = 'VIEWPORT_NAO_IDENTIFICADA'; let comment = judgesValues.comments[judgesValues.current]; if (retChromeActions.ret) {
                        let retRegex = regex({ 'e': e, 'pattern': `Viewport Age\n(.*?)\nLocale`, 'text': retChromeActions.res });
                        if (retRegex.ret && retRegex.res && retRegex.res['1']) { viewport = retRegex.res['1'] == 'FRESH' ? 'NEW' : retRegex.res['1'] }
                    }; judgesValues.comments[judgesValues.current] = `Visualization is ${viewport} and the user is IN OUT\n\n${comment.replace(/undefined\n/g, '')}\n${urlGoogleMaps}`
                }

                ret['res'] = judgesValues;
                ret['msg'] = `JUDGE COMPLETE: OK`;
                ret['ret'] = true;
                console.log(judgesValues)
            }
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
    window['judgeComplete'] = judgeComplete;
} else { // NODEJS
    global['judgeComplete'] = judgeComplete;
}

