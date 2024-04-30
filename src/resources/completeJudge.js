// let infCompleteJudge, retCompleteJudge // 'logFun': true,
// infCompleteJudge = { 'e': e, 'hitApp': 'POIEvaluation' }
// retCompleteJudge = await completeJudge(infCompleteJudge)
// console.log(retCompleteJudge)

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

        let { hitApp } = inf;

        if (!['POIEvaluation', 'Search20',].includes(hitApp)) {
            ret['msg'] = `COMPLETE JUDGE: ERRO NÃO EXISTE '${hitApp}'`;
        } else {
            async function commentCreate(inf) {
                let { options } = inf; let comment = ''; for (let [index, value] of options.entries()) {
                    let retChromeActions, infChromeActions
                    // ############ ATRIBUTO: PEGAR VALOR  ############
                    infChromeActions = { 'e': e, 'action': 'attributeGetValue', 'tabTarget': `*tryrating*`, 'tag': `${value.action.tag}`, 'attribute': `${value.action.attribute}`, 'content': `${value.action.content}`, }
                    retChromeActions = await chromeActions(infChromeActions); // console.log(retChromeActions)
                    // ############ ELEMENTO: PEGAR VALOR ############
                    if (!retChromeActions.ret) { return retChromeActions }
                    infChromeActions = { 'e': e, 'action': 'elementGetValue', 'tabTarget': `*tryrating*`, 'attribute': `id`, 'attributeValue': `${retChromeActions.res[0]}`, }
                    retChromeActions = await chromeActions(infChromeActions); // console.log(retChromeActions)
                    // DEFINIR COMENTÁRIO
                    if (!retChromeActions.ret || retChromeActions.res[0] == '' || retChromeActions.res[0] == 'Select...') { comment = `${comment}${value.action.content}: ###\n` }
                    else if (value[retChromeActions.res[0]] !== 'AAA') { comment = `${comment}${value[retChromeActions.res[0]]}\n` }
                }; return { 'ret': true, 'msg': 'COMMENT CREAT: OK', 'res': `${comment}\nLINK_GOOGLE_MAPS` }
            }

            let options = {
                "POIEvaluation":
                    [
                        {
                            "action": { "content": "POI Validity *", "tag": "label", "attribute": "for", },
                            "Yes": "AAA",
                            "Yes - temporary closure": "The POI is temporarily closed.",
                            "No - closed": "After searching the internet, it was possible to confirm that the place is permanently closed",
                            "No - no physical location": "The POI does not have a physical location",
                            "No - mobile business": "The POI is an itinerant place that is constantly moving",
                            "No - service business out of a home": "It is a POI that does not have a physical location and offers its services during visits",
                            "No - not a POI": "The result is not a valid POI",
                            "Can't Verify": "After searching online, it was not possible to confirm that the location exists",
                        },
                        {
                            "action": { "content": "Name *", "tag": "label", "attribute": "for", },
                            "Correct": "AAA",
                            "Partially Correct": "Problem: The name is PARTIALLY CORRECY",
                            "Incorrect": "Problem: The name is WRONG",
                        },
                        {  // ['Street Number'] | ['Unit/Apt'] | ['Street Name'] | ['Sub-Locality'] | ['Locality'] | ['Region'] | ['Postal Code'] | ['Other/Market Specific'] | ['Country']
                            "action": { "content": "Address *", "tag": "label", "attribute": "for", },
                            "Correct": "AAA",
                            "Correct - formatting issues": "Problem: The address has small FORMAT ERRORS",
                            "OK without": "AAA",
                            "Incorrect": "Problem: The address is INCORRECT",
                        },
                        {
                            "action": { "content": "Phone *", "tag": "label", "attribute": "for", },
                            "Correct": "AAA",
                            "Incorrect": "Problem: The phone is WRONG",
                            "Can't Verify": "Problem: UNABLE to confirm correct number",
                        },
                        {
                            "action": { "content": "URL *", "tag": "label", "attribute": "for", },
                            "Correct": "AAA",
                            "Partially Correct": "Problem: The website is PARTIALLY RIGHT",
                            "Incorrect": "Problem: The url is WRONG",
                            "Can't Verify": "Problem: UNABLE to confirm url",
                        },
                        {
                            "action": { "content": "Category *", "tag": "label", "attribute": "for", },
                            "Correct": "AAA",
                            "Approximate - too general": "Problem: Category is TOO GENERAL for POI",
                            "Approximate - too specific": "Problem: The category is TOO SPECIFIC to the POI",
                            "Incorrect": "Problem: The category is NOT CORRECT",
                            "Missing": "Problem: The category is MISSING and cannot be determined",
                        },
                        {
                            "action": { "content": "Pin *", "tag": "label", "attribute": "for", },
                            "Perfect": "AAA",
                            "Approximate": "Problem: Pin is NEAR the correct location",
                            "Next Door": "Problem: The pin is located in the NEXT DOOR",
                            "Wrong": "Problem: Pin is NOT RIGHT",
                            "Can't Verify": "Problem: UNABLE to determine correct pin location",
                        },
                        {
                            "action": { "content": "Hours *", "tag": "label", "attribute": "for", },
                            "Correct": "AAA",
                            "Incorrect": "Problem: The opening hours are WRONG",
                            "Can't Verify": "Problem: UNABLE to determine correct opening hours",
                        },
                    ],
            }

            let retCommentCreate = await commentCreate({ 'options': options[hitApp] });
            if (!retCommentCreate.ret) {
                ret = retCommentCreate
            } else {
                ret['res'] = retCommentCreate.res;
                ret['msg'] = `COMPLETE JUDGE: OK`;
                ret['ret'] = true;
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
    window['completeJudge'] = completeJudge;
} else { // NODEJS
    global['completeJudge'] = completeJudge;
}

