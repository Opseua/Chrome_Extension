// let infCompleteJudge, retCompleteJudge // 'logFun': true,
// infCompleteJudge = { 'e': e, 'hitApp': 'POI_Evaluation' }
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

        let { hitApp } = inf; let body, infChromeActions, retChromeActions, elementId, elementValue, comment = ''

        if (hitApp == 'POI_Evaluation' | hitApp == 'B') {
            // PEGAR [BODY]
            infChromeActions = { 'e': e, 'action': 'getBody', 'tabTarget': `*tryrating*` }; retChromeActions = await chromeActions(infChromeActions); body = retChromeActions.res; // console.log(body)

            async function commentCreate(inf) {
                let { options } = inf; let elementsNamesLabel = [], elementsValues = {}; Object.keys(options).forEach((key, /*index*/) => { elementsNamesLabel.push(key) })
                for (let [index, value] of elementsNamesLabel.entries()) {
                    // PEGAR ELEMENTO [ID] || PEGAR ELEMENTO [VALOR] *modo1 → valor direto do body (EM BRANCO: 'Select...')
                    infChromeActions = { 'e': e, 'action': 'elementGetId', 'body': body, 'nameClass': 'field-label', 'nameLabel': value }
                    retChromeActions = await chromeActions(infChromeActions); elementId = retChromeActions.ret ? retChromeActions.res[0] : 0; elementsValues[value] = elementId; // console.log(elementId)
                    if (elementId) {
                        infChromeActions = { 'e': e, 'action': 'elementGetValue1', 'body': body, 'method': 'xpath', 'element': `//*[@id="${elementId}"]` }
                        retChromeActions = await chromeActions(infChromeActions); elementValue = retChromeActions.ret ? retChromeActions.res : 0; elementsValues[value] = elementValue; // console.log(retChromeActions)
                    }; // DEFINIR O COMENTÁRIO DE ACORDO COM AS OPÇÕES MARCADAS
                }; Object.keys(elementsValues).forEach((key, /*index*/) => {
                    if (!options[key][elementsValues[key]] || elementsValues[key] == 'Select...') { comment = `${comment}${key}: ###\n` }
                    else if (options[key][elementsValues[key]] !== 'AAA') { comment = `${comment}${options[key][elementsValues[key]]}\n` }
                }); return { 'ret': true, 'msg': 'COMMENT CREAT: OK', 'res': `${comment}\nLINK_GOOGLE_MAPS` }
            }

            let options = {
                "POI_Evaluation": {
                    "POI Validity *": {
                        "Yes": "AAA",
                        "Yes - temporary closure": "The POI is temporarily closed.",
                        "No - closed": "After searching the internet, it was possible to confirm that the place is permanently closed",
                        "No - no physical location": "The POI does not have a physical location",
                        "No - mobile business": "The POI is an itinerant place that is constantly moving",
                        "No - service business out of a home": "It is a POI that does not have a physical location and offers its services during visits",
                        "No - not a POI": "The result is not a valid POI",
                        "Can't Verify": "After searching online, it was not possible to confirm that the location exists",
                    },
                    "Name *": {
                        "Correct": "AAA",
                        "Partially Correct": "Problem: The name is PARTIALLY CORRECY",
                        "Incorrect": "Problem: The name is WRONG",
                    },
                    "Address *": { // ['Street Number'] | ['Unit/Apt'] | ['Street Name'] | ['Sub-Locality'] | ['Locality'] | ['Region'] | ['Postal Code'] | ['Other/Market Specific'] | ['Country']
                        "Correct": "AAA",
                        "Correct - formatting issues": "Problem: The address has small FORMAT ERRORS",
                        "OK without": "AAA",
                        "Incorrect": "Problem: The address is INCORRECT",
                    },
                    "Phone *": {
                        "Correct": "AAA",
                        "Incorrect": "Problem: The phone is WRONG",
                        "Can't Verify": "Problem: UNABLE to confirm correct number",
                    },
                    "URL *": {
                        "Correct": "AAA",
                        "Partially Correct": "Problem: The website is PARTIALLY RIGHT",
                        "Incorrect": "Problem: The url is WRONG",
                        "Can't Verify": "Problem: UNABLE to confirm url",
                    },
                    "Category *": {
                        "Correct": "AAA",
                        "Approximate - too general": "Problem: Category is TOO GENERAL for POI",
                        "Approximate - too specific": "Problem: The category is TOO SPECIFIC to the POI",
                        "Incorrect": "Problem: The category is NOT CORRECT",
                        "Missing": "Problem: The category is MISSING and cannot be determined",
                    },
                    "Pin *": {
                        "Perfect": "AAA",
                        "Approximate": "Problem: Pin is NEAR the correct location",
                        "Next Door": "Problem: The pin is located in the NEXT DOOR",
                        "Wrong": "Problem: Pin is NOT RIGHT",
                        "Can't Verify": "Problem: UNABLE to determine correct pin location",
                    },
                    "Hours *": {
                        "Correct": "AAA",
                        "Incorrect": "Problem: The opening hours are WRONG",
                        "Can't Verify": "Problem: UNABLE to determine correct opening hours",
                    },
                }
            };

            let retCommentCreate = await commentCreate({ 'options': options[hitApp] });

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

