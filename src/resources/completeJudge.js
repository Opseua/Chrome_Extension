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
    if (catchGlobal) {
        let errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
    try {
        if (!`rodar no → CHROME`.includes(engName)) { // [ENCAMINHAR PARA DEVICE]
            let infDevAndFun = { 'e': e, 'enc': true, 'data': { 'name': 'completeJudge', 'par': inf, 'retInf': inf.retInf } };
            let retDevAndFun = await devFun(infDevAndFun); return retDevAndFun
        };

        let { urlGoogleMaps } = inf; let retChromeActions, infChromeActions, attributeValue, judges = []; let options = { 'POIEvaluation': optTryRating_POIEvaluation, 'Search20': optTryRating_Search20 }

        // PEGAR O NOME DO HIT APP
        infChromeActions = { 'e': e, 'action': 'elementGetValueXpath', 'tabTarget': `*tryrating*`, 'elementName': `//*[@id="app-root"]/div/div[4]/div[2]/div[1]/div/div[1]/div/div[1]/span[2]/span`, }
        retChromeActions = await chromeActions(infChromeActions); if (!retChromeActions.ret) { return retChromeActions }; let hitApp = retChromeActions.res.replace(/[^a-zA-Z0-9]/g, '')

        if (!['POIEvaluation', 'Search20',].includes(hitApp)) {
            ret['msg'] = `COMPLETE JUDGE: ERRO NÃO EXISTE '${hitApp}'`;
        } else {
            async function commentCreate(inf) {
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
                }; return { 'ret': true, 'msg': 'COMMENT CREAT: OK', 'res': { 'urlGoogleMaps': urlGoogleMaps, 'judges': judges, } }
            }

            let retCommentCreate = await commentCreate({ 'options': options[hitApp] }); if (!retCommentCreate.ret) { return retCommentCreate }
            ret['res'] = retCommentCreate.res;
            ret['msg'] = `COMPLETE JUDGE: OK`;
            ret['ret'] = true;
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
    window['completeJudge'] = completeJudge;
} else { // NODEJS
    global['completeJudge'] = completeJudge;
}

