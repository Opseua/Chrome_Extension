await import('./resources/@export.js');

let e = import.meta.url, ee = e;
async function serverRun(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    try {
        logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `**************** SERVER ****************` })

        // LIMPAR O BADGE
        chromeActions({ 'e': e, 'action': 'badge', 'text': '' });

        // EXCLUIR DOWNLOAD SE TIVER '[KEEP]' NO TITULO DO ARQUIVO
        chrome.downloads.onChanged.addListener(async function (...inf) {
            if (inf[0].state && inf[0].state.current === 'complete') {
                chrome.downloads.search({ id: inf.id }, async function (inf) {
                    if (inf.length > 0) {
                        let d = inf[0]; if (d.byExtensionName.includes('BOT') && !d.filename.includes('[KEEP]')) {
                            setTimeout(function () {
                                chrome.downloads.erase({ id: d.id });
                                // logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `DOWNLOAD REMOVIDO DA LISTA` }); URL.revokeObjectURL(d.url)
                            }, 5000);
                        }
                    }
                });
            }
        });

        // ATALHO PRESSIONADO
        chrome.commands.onCommand.addListener(async function (...inf) {
            try {
                let infShortcutPressed = { 'shortcut': inf[0] }; // logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `ON START: ATALHO PRESSIONADO` })
                if (infShortcutPressed.shortcut == 'atalho_1') { command1(); }
                else if (infShortcutPressed.shortcut == 'atalho_2') { command2(); }
                else { logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `ACAO DO ATALHO NAO DEFINIDA` }) }
            } catch (catchErr) {
                await regexE({ 'inf': inf, 'e': catchErr, });
            };
        });

        // *************************

        // MANTER NO FINAL PARA GARANTIR QUE O ATALHO VAI FUNCIONAR ANTES DO WEBSOCKET SER CONECTADO | CLIENT (NÃO POR COMO 'await'!!!)
        // client({ 'e': e }); await new Promise(resolve => { setTimeout(resolve, 2000) })

        ret['ret'] = true;
        ret['msg'] = `SERVER: OK`;

        // let infJudgeComplete, retJudgeComplete
        // infJudgeComplete = { 'e': e, 'urlGoogleMaps': 'https://maps.app.goo.gl/' }
        // retJudgeComplete = await judgeComplete(infJudgeComplete); console.log(retJudgeComplete)

        // let retClipboard = await clipboard({ 'e': e, 'value': retJudgeComplete.ret ? retJudgeComplete.res.comment : retJudgeComplete.msg });
        // let infNotification, retNotification
        // infNotification = {
        //     'e': e, 'duration': 4, 'icon': `./src/scripts/media/icon_${retJudgeComplete.ret ? 3 : 2}.png`, 'retInf': false,
        //     'title': `Complete Judge`, 'text': retJudgeComplete.msg,
        // }; retNotification = await notification(infNotification);
        // // console.log(JSON.stringify(retJudgeComplete, null, 2))



        let infChromeActions, retChromeActions, htmlDiv
        // // → DIV: PEGAR (BRUTA) [XPATH] *** JUDGE
        // infChromeActions = { 'e': e, 'action': 'elementGetDivXpath', 'target': `*tryrating*`, 'elementName': `//*[@id="app-root"]/div/div[4]/div[2]/div[2]/div/div/div/div/div/div/div/div/div[1]/div/div/div/div/div[3]/div[1]/div[1]/div[2]/div/div/div/div/div/div/div/div[6]/div/div/div/div/div[1]/div/div/div/div/div/div/div/div/div/div/div`, }
        // retChromeActions = await chromeActions(infChromeActions); htmlDiv = retChromeActions.res[0]; // console.log(retChromeActions)

        // // ******************

        // // → DIV: PEGAR (BRUTA) *** QUESTION
        // infChromeActions = { 'e': e, 'action': 'elementGetDiv', 'target': htmlDiv, 'tag': `label`, 'content': `Result name/title is in unexpected language or script`, 'tagFather': 'div' }
        // retChromeActions = await chromeActions(infChromeActions); // console.log(retChromeActions)

        // // → ATRIBUTO: PEGAR VALOR
        // infChromeActions = { 'e': e, 'action': 'attributeGetValue', 'target': retChromeActions.res[0], 'tag': `input`, 'attribute': `name`, 'contentA': `User intent issue`, }
        // retChromeActions = await chromeActions(infChromeActions); // console.log(retChromeActions)

        // // → ELEMENTO: PEGAR VALOR
        // infChromeActions = { 'e': e, 'action': 'elementGetValue', 'target': `*tryrating*`, 'attribute': `name`, 'attributeValue': retChromeActions.res[0], }
        // retChromeActions = await chromeActions(infChromeActions); console.log(retChromeActions)

        // // ******************

        // // → DIV: PEGAR (BRUTA) *** QUESTION
        // infChromeActions = { 'e': e, 'action': 'elementGetDiv', 'target': htmlDiv, 'tag': `label`, 'content': `Business/POI is closed or does not exist`, 'tagFather': 'div' }
        // retChromeActions = await chromeActions(infChromeActions); // console.log(retChromeActions)

        // // → ATRIBUTO: PEGAR VALOR
        // infChromeActions = { 'e': e, 'action': 'attributeGetValue', 'target': retChromeActions.res[0], 'tag': `input`, 'attribute': `name`, }
        // retChromeActions = await chromeActions(infChromeActions); // console.log(retChromeActions)

        // // → ELEMENTO: PEGAR VALOR
        // infChromeActions = { 'e': e, 'action': 'elementGetValue', 'target': `*tryrating*`, 'attribute': `name`, 'attributeValue': retChromeActions.res[0], }
        // retChromeActions = await chromeActions(infChromeActions); console.log(retChromeActions)

        // // ******************

        // // → DIV: PEGAR (BRUTA) *** QUESTION
        // infChromeActions = { 'e': e, 'action': 'elementGetDiv', 'target': htmlDiv, 'tag': `label`, 'content': `Relevance`, 'tagFather': 'div' }
        // retChromeActions = await chromeActions(infChromeActions); console.log(retChromeActions)

        // // → ATRIBUTO: PEGAR VALOR
        // infChromeActions = { 'e': e, 'action': 'attributeGetValue', 'target': retChromeActions.res[0], 'tag': `div`, 'attribute': `class`, }
        // retChromeActions = await chromeActions(infChromeActions); console.log(retChromeActions)

        // → ELEMENTO: PEGAR VALOR
        infChromeActions = { 'e': e, 'action': 'elementGetValue', 'target': `*tryrating*`, 'tag': `div`, 'attribute': `class`, 'attributeValue': `css-151xaom-placeholder react-select__placeholder`, }
        retChromeActions = await chromeActions(infChromeActions); console.log(retChromeActions)



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
// TODAS AS FUNÇÕES PRIMÁRIAS DO 'server.js' / 'serverC6.js' / 'serverJsf.js' DEVEM SE CHAMAR 'serverRun'!!!
serverRun()


