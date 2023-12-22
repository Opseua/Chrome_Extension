let e = import.meta.url;
async function peroptyx_Search20(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        let errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; let retRegexE = await regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
    try {
        let infNotification, retNotification, retSniffer, retFile
        if (inf.snifferChrome) {
            let gOEve = async (i) => {
                if (i.inf.sniffer === 2) {
                    gORem(gOEve); chrome.browserAction.setBadgeText({ text: '' }); ret = { 'ret': false };
                    return ret
                }
            }; gOAdd(gOEve);
        }
        if (inf.logFile) { retFile = await file({ 'e': e, 'action': 'read', 'path': inf.logFile }); retSniffer = JSON.parse(retFile.res) }
        else { retSniffer = JSON.parse(inf.sniffer) }
        // if (!retSniffer.tasks[0].taskData.hasOwnProperty('testQuestionInformation')) {
        if (!('testQuestionInformation' in retSniffer.tasks[0].taskData)) {
            infNotification =
            {
                'duration': 2, 'icon': './src/scripts/media/notification_3.png',
                'title': `NÃO TEM A RESPOSTA`,
                'text': `Avaliar manualmente`,
            }; retNotification = await notification(infNotification)
        }
        else {
            let resultList = retSniffer.tasks[0].taskData.resultSet.resultList;
            let testQuestionInformation = retSniffer.tasks[0].taskData.testQuestionInformation.answer.serializedAnswer; let not = true
            let res = await Promise.all(resultList.map(async (v, index) => {
                let idTask = [v.surveyKeys['193']]; let resultado = null
                try { resultado = index + 1 } catch (e) { }; let nome = null
                try { nome = v.value.name } catch (e) { }; let endereco = null
                try { endereco = v.value.address[0] } catch (e) { }; let fechado = null
                try { fechado = testQuestionInformation['Closed-DNE'][idTask].closed_dne.value ? 'SIM' : 'NAO' } catch (e) { }; let relevance = null
                try { relevance = testQuestionInformation.Relevance[idTask].Relevance[0].label } catch (e) { }; let nameAccurracy = null
                try { nameAccurracy = testQuestionInformation.Data[idTask].Name[0].value } catch (e) { }; let addressAccurracy = null
                try { addressAccurracy = testQuestionInformation.Data[idTask].Address[0].value } catch (e) { }; let pinAccurracy = null
                try { pinAccurracy = testQuestionInformation.Data[idTask].Pin[0].value } catch (e) { }; let comentario = null
                try { comentario = resultList[index].comments } catch (e) { }; let comentario1, comentario2
                if (comentario) {
                    if (not) {
                        not = false
                        infNotification =
                        {
                            'duration': 3, 'icon': './src/scripts/media/icon_4.png',
                            'title': `AGUARDE...`,
                            'text': `Traduzindo e alterando o comentário`,
                        }; retNotification = await notification(infNotification)
                    }

                    let infTranslate1 = { 'source': 'auto', 'target': 'pt', 'text': comentario };
                    let retTranslate1 = await translate(infTranslate1); comentario1 = retTranslate1.res

                    // infTranslate2 = { 'source': 'auto', 'target': 'en', 'text': comentario };
                    // retTranslate2 = await translate(infTranslate2)
                    // comentario2 = retTranslate2.res

                    let infChatGpt = { 'provider': 'open.ai', 'input': `REWRITE THIS SENTENCE WITH OTHER WORDS, KEEPING THE SAME MEANING:\n\n ${comentario}` }
                    let retChatGpt = await chatGpt(infChatGpt)
                    if (!retChatGpt.ret) {
                        return ret
                    }; comentario2 = retChatGpt.res.replace(/\n/g, ' ').replace(/\\"/g, "'");
                }

                return {
                    '1_RESULTADO': resultado,
                    '2_NOME': nome,
                    '3_ENDERECO': endereco,
                    '4_FECHADO': fechado,
                    '5_Relevance': relevance,
                    '6_Name_Accurracy': nameAccurracy,
                    '7_Address_Accurracy': addressAccurracy,
                    '8_Pin_Accurracy': pinAccurracy,
                    //'9_COMENTARIO': comentario,
                    'z': ['x'],
                    '10_COMENTARIO_pt': comentario1,
                    'x': ['x'],
                    '11_COMENTARIO_alterado': comentario2,
                };
            }));

            infNotification =
            {
                'duration': 2, 'icon': './src/scripts/media/notification_1.png',
                'title': `CONCLUÍDO: na área de transferência`,
                'text': `${JSON.stringify(res, null, 2)}`,
            }; retNotification = await notification(infNotification)

            await clipboard({ 'value': JSON.stringify(res, null, 2) })
        }
        ret['ret'] = true; ret['msg'] = `PEROPTYX: OK`;
    } catch (e) {
        let retRegexE = await regexE({ 'inf': inf, 'e': e, 'catchGlobal': false });
        ret['msg'] = retRegexE.res
    };
    return {
        ...({ ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}

if (eng) { // CHROME
    window['peroptyx_Search20'] = peroptyx_Search20;
} else { // NODEJS
    // global['peroptyx_Search20'] = peroptyx_Search20;
}