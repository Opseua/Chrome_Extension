// let infCompleteJudge, retCompleteJudge // 'logFun': true,
// infCompleteJudge = { 'e': e, 'hitApp': 'POIEvaluation' }
// retCompleteJudge = await completeJudge(infCompleteJudge)
// console.log(retCompleteJudge)

// IMPORTAR OBJETOS COM AS OPÇÕES E RESPOSTAS
import optTryRating_POIEvaluation from '../scripts/objects/optTryRating_POIEvaluation.js'
import optTryRating_Search20 from '../scripts/objects/optTryRating_Search20.js'

let e = import.meta.url, ee = e;
async function completeJudge(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    try {
        let { urlGoogleMaps } = inf; let retChromeActions, infChromeActions, attributeValue; let options = { 'POIEvaluation': optTryRating_POIEvaluation, 'Search20': optTryRating_Search20 }

        // PEGAR O NOME DO HIT APP
        infChromeActions = { 'e': e, 'action': 'elementGetValueXpath', 'tabTarget': `*tryrating*`, 'elementName': `//*[@id="app-root"]/div/div[4]/div[2]/div[1]/div/div[1]/div/div[1]/span[2]/span`, }
        retChromeActions = await chromeActions(infChromeActions); if (!retChromeActions.ret) { return retChromeActions }; let hitApp = retChromeActions.res.replace(/[^a-zA-Z0-9]/g, '')

        if (!['POIEvaluation', 'Search20',].includes(hitApp)) {
            ret['msg'] = `COMPLETE JUDGE: ERRO NÃO EXISTE '${hitApp}'`;
        } else {
            async function getJudges(inf) {
                let { options } = inf; for (let [index, value] of options.entries()) {
                    let actions = value; let indexOk = index; for (let [index, value] of actions.actions.entries()) {
                        if (value.action == 'attributeGetValue') {
                            // ############ ATRIBUTO: PEGAR VALOR  ############
                            infChromeActions = { 'e': e, 'action': value.action, 'tabTarget': `*tryrating*`, 'tag': value.tag, 'attribute': value.attribute, 'content': value.content, }
                            retChromeActions = await chromeActions(infChromeActions); if (retChromeActions.ret) { attributeValue = retChromeActions.res[0]; };  // console.log(retChromeActions.res);
                        } else if (value.action == 'elementGetValue') {
                            // ############ ELEMENTO: PEGAR VALOR ############
                            infChromeActions = { 'e': e, 'action': value.action, 'tabTarget': `*tryrating*`, 'attribute': value.attribute, 'attributeValue': value.attributeValue == "OLD" ? attributeValue : value.attributeValue, }
                            retChromeActions = await chromeActions(infChromeActions); let actionsOk = actions.actions[0]; actionsOk = actionsOk.content ? actionsOk.content : actionsOk.attributeValue
                            if (retChromeActions.ret) { // DEFINIR COMENTÁRIO
                                let judgesOk = [], judgesArr = retChromeActions.res; // judgesArr = [retChromeActions.res[0], retChromeActions.res[0], retChromeActions.res[0],];
                                for (let [index, value] of judgesArr.entries()) {
                                    let retChromeActionsOk = typeof value == 'boolean' ? JSON.stringify(value) : value;  // console.log(retChromeActions.res)
                                    if (retChromeActionsOk == '' || retChromeActionsOk == 'Select...') { judgesOk.push(`############ PERGUNTA [${indexOk + 1}] → ${actionsOk.content}`) }
                                    else if (actions[retChromeActionsOk] !== 'AAA') { judgesOk.push(`${actions[retChromeActionsOk]} → ${actionsOk}`) };
                                }; judges.push({ [actionsOk]: judgesOk });
                            }
                        }
                    };
                }; return { 'ret': true, 'msg': 'COMMENT CREAT: OK', 'res': { 'judges': judges, } }
            }

            let retGetJudges = await getJudges({ 'options': options[hitApp] }); if (!retGetJudges.ret) { return retGetJudges }

            // DESMEMBRAR ARRAY COM JUDGES
            let oa = retGetJudges.res.judges; let keys = oa.map(obj => Object.keys(obj)[0]); let judges = []; let comment = ''; let search = 'Comment and Link'
            for (let i = 0; i < oa[0][keys[0]].length; i++) { let newArray = []; for (let j = 0; j < keys.length; j++) { let per = keys[j]; let resposta = oa[j][per][i]; newArray.push({ [per]: resposta }); }; judges.push(newArray) }

            // JULGAMENTO ATUAL + JUDGES
            let c = -1; for (let [ia, va] of judges.entries()) { for (let [/*ib*/, vb] of va.entries()) { let k = Object.keys(vb)[0]; let s = search; if (k == s && vb[s].includes('###')) { c = ia; break; } }; if (c !== -1) { break } }

            // CRIAR COMENTÁRIO
            if (c == -1) { comment = { 'index': c, 'comment': 'Nenhum julgamento pendente', 'judges': judges } }
            else { for (let [index, value] of judges[c].entries()) { let key = Object.keys(value)[0]; comment = `${comment}${value[key]}\n`; }; comment = { 'index': c, 'comment': `${comment}\n\n${urlGoogleMaps}`, 'judges': judges } }

            console.log(comment);

            ret['res'] = judges;
            ret['msg'] = `COMPLETE JUDGE: OK`;
            ret['ret'] = true;
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
    window['completeJudge'] = completeJudge;
} else { // NODEJS
    global['completeJudge'] = completeJudge;
}

