// let infGoogleSheets, retGoogleSheets;
// infGoogleSheets = {
//     e, 'action': 'get', 'id': '1BKI7XsKTq896JcA-PLnrSIbyIK1PaakiAtoseWmML-Q', 'tab': 'MASTER',
//     // 'range': `A1`, // CÉLULA ÚNICA
//     // 'range': `A1:A2`, // PERÍMETRO
//     // 'range': `A:A`, // COLUNA
// };
// infGoogleSheets = {
//     e, 'action': 'send', 'id': '1BKI7XsKTq896JcA-PLnrSIbyIK1PaakiAtoseWmML-Q', 'tab': 'MASTER',
//     // 'range': `A1`, // FUNÇÃO JÁ CALCULA A ÚLTIMA COLUNA DE ACORDO COM O 'values'
//     // 'range': `A*`, // ÚLTIMA LINHA EM BRANCO DA [COLUNA 'A']
//     'values': [['a', 'b', 'c', 'd',],],
// };
// infGoogleSheets = { // 'googleAppScript': false,
//     e, 'action': 'lastLin', 'id': '1BKI7XsKTq896JcA-PLnrSIbyIK1PaakiAtoseWmML-Q', 'tab': 'MASTER',
//     'range': `A1:A10`, // PERÍMETRO
//     'range': `A:A`, // COLUNA
// };
// retGoogleSheets = await googleSheets(infGoogleSheets); console.log(retGoogleSheets);

let e = import.meta.url, ee = e; let _auth, _sheets, googleAppScriptId, scopeUrl = 'https://www.googleapis.com/auth/spreadsheets', retSheet;
async function googleSheets(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        let { action, id, tab, range, values, attempts = 1, googleAppScript = false, } = inf;

        // IMPORTAR BIBLIOTECA [NODEJS] {auth}
        if (typeof _googleapisAuth === 'undefined') {
            await funLibrary({ 'lib': '_googleapisAuth', }); _auth = new _googleapisAuth.GoogleAuth({ 'keyFile': `${letter}:/${gW.root}/${gW.functions}/${gW.conf}`, 'scopes': [scopeUrl,], });
        }

        // IMPORTAR BIBLIOTECA [NODEJS] {sheets}
        if (typeof _googleapisSheets === 'undefined') {
            await funLibrary({ 'lib': '_googleapisSheets', }); _sheets = _googleapisSheets({ 'version': 'v4', 'auth': _auth, });
            let retCS = await configStorage({ e, 'action': 'get', 'key': 'googleAppScriptId', }); if (!retCS.ret) { return retCS; } googleAppScriptId = retCS.res;
        }

        function identifyErr(err) {
            err = err.toString(); return (err.includes('entity was not found') || err.includes('Unable to parse range') || err.includes('contains an invalid argument')) ? 'PLANILHA/ABA NÃO ENCONTRADA' :
                (err.includes('not have permission') || err.includes('to edit a protected')) ? 'SEM PERMISSÃO' : 'OUTRO PROBLEMA';
        }

        if (action === 'get') {
            // →→→ GET
            range = `${tab}!${range}`; try {
                retSheet = await _sheets.spreadsheets.values.get({ 'spreadsheetId': id, range, }); retSheet = retSheet.data.values; ret['res'] = retSheet; ret['msg'] = `GOOGLE SHEET [GET]: OK`; ret['ret'] = true;
            } catch (catchErr) { logConsole({ e, ee, 'msg': `ERRO SHEETS\n${catchErr.toString()}`, }); ret['msg'] = `GOOGLE SHEET [GET]: ERRO | ${identifyErr(catchErr)} '${range}' '${id}'`; }
        } else if (action === 'send') {
            // →→→  SEND
            let col = range.replace(/[^a-zA-Z]/g, ''), lin = ''; values = { values, }; if (/[0-9]/.test(range)) { lin = range.replace(/[^0-9]/g, ''); } else if (range.includes('*')) {
                range = `${range}:${range}`; range = range.replace(/\*/g, ''); lin = await googleSheets({ e, 'action': 'lastLin', id, tab, range, });
                if (!lin.ret) { return lin; } lin = lin.res.lastLineWithData + 1;
            } else { ret['msg'] = `GOOGLE SHEET [SENC]: ERRO | 'range' INVÁLIDO`; return ret; }
            range = `${tab}!${col}${lin}:${String.fromCharCode(col.charCodeAt(0) + values.values[0].length - 1)}${lin}`; try {
                await _sheets.spreadsheets.values.update({ 'spreadsheetId': id, range, 'valueInputOption': 'USER_ENTERED', 'resource': values, });
                ret['msg'] = `GOOGLE SHEET [SEND]: OK`; ret['ret'] = true;
            } catch (catchErr) { logConsole({ e, ee, 'msg': `ERRO SHEETS\n${catchErr.toString()}`, }); ret['msg'] = `GOOGLE SHEET [SEND]: ERRO | ${identifyErr(catchErr)} '${range}' '${id}'`; }
        } else if (action === 'lastLin') {
            // →→→  LAST LIN
            try {
                if (!googleAppScript) {
                    // CONTANDO PELA QUANTIDADE DE VALORES
                    range = `${tab}!${range.includes(':') ? range : `${range}:${range}`}`; retSheet = await _sheets.spreadsheets.values.get({ 'spreadsheetId': id, range, }); retSheet = retSheet.data.values;
                    ret['res'] = { 'lastLineWithData': (!retSheet || retSheet.length === 0) ? 0 : retSheet.length, };
                } else {
                    // GOOGLE APP SCRIPT
                    let infApi = {
                        e, 'method': 'POST', 'headers': { 'Content-Type': 'application/json', }, 'max': 20, 'url': `https://script.google.com/macros/s/${googleAppScriptId}/exec`,
                        'body': { 'action': 'run', 'name': 'sheetInfTab', 'par': { id, tab, range, }, }, 'bodyObject': true,
                    }; let retApi = await api(infApi); if (!retApi.ret) { return retApi; } retApi = retApi.res.body; if (!retApi.ret) { return retApi; } retApi = retApi.res;
                    ret['res'] = { 'lastLineWithData': retApi.lastLineWithData, 'maxLines': retApi.maxLines, };
                }
                ret['msg'] = `GOOGLE SHEET [LAST LIN] {${googleAppScript ? 'GOOGLE APP SCRIPT' : 'QTD DE LINHAS'}}: OK`; ret['ret'] = true;
            } catch (catchErr) { logConsole({ e, ee, 'msg': `ERRO SHEETS\n${catchErr.toString()}`, }); ret['msg'] = `GOOGLE SHEET [LAST LIN]: ERRO | ${identifyErr(catchErr)} '${range}' '${id}'`; }
        }

        // TENTAR NOVAMENTE EM CASO DE ERRO | MANTER 'legacy' true PORQUE NO WebScraper O WEBSOCKET NÃO ESTÁ CONECTADO
        if (!ret.ret && attempts < 3) {
            let text = `TENTATIVA [${attempts}] → ${ret.msg}`; await notification({ e, 'legacy': true, 'title': `# SHEETS (${gW.devMaster}) [NODEJS]`, text, });

            logConsole({ e, ee, 'msg': text, }); let retGoogleSheets = await googleSheets({ ...inf, 'attempts': (attempts + 1), }); ret = retGoogleSheets;
        }

    } catch (catchErr) {
        let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    }

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.res && { 'res': ret.res, }), };
}

// CHROME | NODEJS
(eng ? window : global)['googleSheets'] = googleSheets;


