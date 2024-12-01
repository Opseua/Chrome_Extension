// → NO FINAL DA PÁGINA

// IMPORTAR OBJETOS COM AS AÇÕES
let acts = {}; let imp = ['AIGeneratedTextEvaluationPortuguese', 'BroadMatchRatings', 'Ratingoftransformedtext', 'TextErrorCategorizationptBR',]
for (let [index, value] of imp.entries()) { await import(`./objects/tryRating/act_${value}.js`); acts[value] = (eng ? window : global)[`act_${value}`]; delete (eng ? window : global)[`act_${value}`]; };

let e = import.meta.url, ee = e;
async function tryRatingSet(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        let { hitApp = 'x', elements = [], } = inf;

        // RETORNAR CASO O OBJ DO HITAPP NÃO EXISTA
        if (!acts[hitApp]) { ret['msg'] = `TRYRATING SET: ERRO | FALTA O OBJ DO HITAPP '${hitApp}'`; return ret; };

        let elementsObj = acts[hitApp].elementsObj; let target = `*${hitApp}/page_tryrating.mhtml*`;

        let infChromeActions, retChromeActions;

        // EXECUTAR AÇÕES [ELEMENTS POR ELEMENTS]
        for (let [index, val] of elements.entries()) {
            // VALORES PASSADOS PARA A FUNÇÃO
            let { element, elements1, } = val;

            // VALORES DO OBJ
            let elementObj = elementsObj[element];

            console.log(`#### ELEMENTO 1 ####\n${element}`,);

            // EXECUTAR AÇÕES [ELEMENTS1 POR ELEMENTS1]
            for (let [index3, val3] of elements1.entries()) {
                let { element1, actions, } = val3;

                console.log(`  *** ELEMENTO 2 ***\n  → ${element1}`,);

                // EXECUTAR AÇÕES [ACTION POR ACTION]
                for (let [index4, val4] of actions.entries()) {
                    // DEFINIR VALORES PASSADOS OU DO OBJ
                    let element1Obj = elementObj[element1].element1Obj;
                    let actionObj = elementObj[element1].actionsObj[index4].action;
                    let awaitFor = val4.awaitFor || elementObj[element1].actionsObj[index4].awaitFor;
                    let value = val4.value || elementObj[element1].actionsObj[index4].value;

                    let infChromeActionsNew = JSON.parse(JSON.stringify(elementsObj[element].infObj).replace(`###_REPLACE_1_###`, `${element1Obj}`));

                    console.log(`    ++ AÇÃO ++\n    → ${awaitFor.toString()} | ${actionObj}\n    ${value}`,);

                    infChromeActions = { e, 'action': 'inject', 'target': target, 'fun': chromeActionsNew, 'funInf': { ...infChromeActionsNew, ...{ 'action': actionObj } }, };
                    retChromeActions = await chromeActions(infChromeActions); if (!retChromeActions.ret) { return retChromeActions }; // console.log(retChromeActions);

                }

            }

        }

        return retChromeActions

        ret['ret'] = true;
        ret['msg'] = `TRYRATING SET: OK`;

    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    };

    return { ...({ 'ret': ret.ret }), ...(ret.msg && { 'msg': ret.msg }), ...(ret.res && { 'res': ret.res }), };
};

// CHROME | NODEJS
(eng ? window : global)['tryRatingSet'] = tryRatingSet;


// let infTryRatingSet, retTryRatingSet
// infTryRatingSet = {
//     'hitApp': `Ratingoftransformedtext`,
//     'elements': [

//         {
//             'element': 'Does_the_output_meet_the_expectation',
//             'elements1': [
//                 {
//                     'element1': 'Yes_it_does',
//                     'actions': [
//                         { 'awaitFor': undefined, 'value': undefined, },
//                     ],
//                 },
//                 {
//                     'element1': 'No_it_does_not',
//                     'actions': [
//                         { 'awaitFor': undefined, 'value': undefined, },
//                     ],
//                 },
//             ],
//         },

//         // ****************************************** ENVIAR RESPOSTA ******************************************
//         {
//             'element': 'Submit_Rating',
//             'elements1': [
//                 {
//                     'element1': 'up',
//                     'actions': [
//                         { 'awaitFor': undefined, 'value': undefined, },
//                     ],
//                 },
//                 {
//                     'element1': 'down',
//                     'actions': [
//                         { 'awaitFor': undefined, 'value': undefined, },
//                     ],
//                 },
//             ],
//         },

//     ]
// }

// retTryRatingSet = await tryRatingSet(infTryRatingSet); console.log(retTryRatingSet);