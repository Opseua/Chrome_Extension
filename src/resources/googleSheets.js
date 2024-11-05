// let infGoogleSheets, retGoogleSheets
// infGoogleSheets = {
//     e, 'action': 'get', 'id': 'ID_AQUI', 'tab': 'ABA_AQUI',
//     // 'range': `A1`, // CÉLULA ÚNICA
//     // 'range': `A1:A2`, // PERÍMETRO
//     // 'range': `A:A`, // COLUNA
// }
// infGoogleSheets = {
//     e, 'action': 'send', 'id': 'ID_AQUI', 'tab': 'ABA_AQUI',
//     // 'range': `A1`, // FUNÇÃO JÁ CALCULA A ÚLTIMA COLUNA DE ACORDO COM O 'values'
//     // 'range': `A*`, // ÚLTIMA LINHA EM BRANCO DA [COLUNA 'A']
//     // 'range': `A**`, // ÚLTIMA LINHA EM BRANCO DA [ABA INTEIRA]
//     'values': [['a', 'b', 'c', 'd',]],
// }
// infGoogleSheets = {
//     e, 'action': 'lastLin', 'id': 'ID_AQUI', 'tab': 'ABA_AQUI',
//     'range': `A1:A10`, // PERÍMETRO
//     // 'range': `A:A`, // COLUNA
// }
// retGoogleSheets = await googleSheets(infGoogleSheets); console.log(retGoogleSheets);

let e = import.meta.url, ee = e; let _auth, _sheets; let g = globalWindow; let googleAppScriptId
async function googleSheets(inf = {}) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    try {
        let { action, id, tab, range, values, newRun, } = inf;

        // IMPORTAR BIBLIOTECA [NODEJS] {auth}
        if (typeof _googleapisAuth === 'undefined') {
            await funLibrary({ 'lib': '_googleapisAuth' }); _auth = new _googleapisAuth.GoogleAuth({ 'keyFile': `${letter}:/${g.root}/${g.functions}/${g.conf}`, 'scopes': ['https://www.googleapis.com/auth/spreadsheets'] });
        }

        // IMPORTAR BIBLIOTECA [NODEJS] {sheets}
        if (typeof _googleapisSheets === 'undefined') {
            await funLibrary({ 'lib': '_googleapisSheets' }); _sheets = _googleapisSheets({ 'version': 'v4', 'auth': _auth })
            let retConfigStorage = await configStorage({ e, 'action': 'get', 'functionLocal': true, 'key': 'googleAppScriptId' }); if (!retConfigStorage.ret) { return retConfigStorage }; googleAppScriptId = retConfigStorage.res
        }

        if (action == 'get') {
            // GET
            try {
                range = `${tab}!${range}`; let retSheet = await _sheets.spreadsheets.values.get({ 'spreadsheetId': id, 'range': range });
                ret['res'] = retSheet.data.values
                ret['msg'] = `GOOGLE SHEET [GET]: OK`;
                ret['ret'] = true;
            } catch (catchErr) {
                ret['msg'] = `GOOGLE SHEET [GET]: ERRO | NÃO ENCONTRADO '${range}' E/OU ID '${id}'`; esLintIgnore = catchErr;
            }
        } else if (action == 'send') {
            // SEND
            let col = range.replace(/[^a-zA-Z]/g, ''), lin = ''; values = { 'values': values }; if (/[0-9]/.test(range)) { lin = range.replace(/[^0-9]/g, '') } else if (range.includes('*')) {
                range = `${range}:${range}`; range = range.replace(/\*/g, ''); lin = await googleSheets({ e, 'action': 'lastLin', 'id': id, 'tab': tab, ...(!inf.range.includes('**') ? { 'range': range } : { 'a': 'a' }) });
                if (!lin.ret) { return lin }; lin = lin.res.lastLineWithData + 1
            } else {
                ret['msg'] = `GOOGLE SHEET [SENC]: ERRO | 'range' INVÁLIDO`; return ret
            }
            range = `${tab}!${col}${lin}:${String.fromCharCode(col.charCodeAt(0) + values.values[0].length - 1)}${lin}`; try {
                await _sheets.spreadsheets.values.update({ 'spreadsheetId': id, 'range': range, 'valueInputOption': 'USER_ENTERED', 'resource': values });
                ret['msg'] = `GOOGLE SHEET [SEND]: OK`;
                ret['ret'] = true;
            } catch (catchErr) {
                if (JSON.stringify(e).includes(`You are trying to edit a protected`)) {
                    ret['msg'] = `GOOGLE SHEET [SEND]: ERRO | RANGE PROTEGIDO`;
                } else {
                    ret['msg'] = `GOOGLE SHEET [SEND]: ERRO | NÃO ENCONTRADO '${range}' E/OU ID '${id}'`;
                }; esLintIgnore = catchErr;
            }
        } else if (action == 'lastLin') {
            // LAST LIN
            let infApi = {
                e, 'method': 'GET', 'headers': { 'Content-Type': 'application/json' }, 'max': 10,
                'url': `https://script.google.com/macros/s/${googleAppScriptId}/exec?inf=  { "action": "run", "name": "sheetInfTab", "par": { "id":"${id}", "tab": "${tab}" , "${range ? 'range' : 'a'}": "${range}" } }`,
            }; let retApi = await api(infApi); if (!retApi.ret) { return retApi }; retApi = JSON.parse(retApi.res.body); if (!retApi.ret) { return retApi };
            ret['res'] = {
                'lastLineWithData': retApi.res.lastLineWithData,
                'maxLines': retApi.res.maxLines,
            }
            ret['msg'] = `GOOGLE SHEET [LAST LIN] {GOOGLE APP SCRIPT}: OK`;
            ret['ret'] = true;
        }

        // TENTAR NOVAMENTE EM CASO DE ERRO
        if (!ret.ret && !newRun) {
            await notification({ e, 'legacy': true, 'title': `ERRO GOOGLE SHEETS`, 'text': `PRIMEIRA TENTATIVA → ${ret.msg}`, });

            logConsole({ e, ee, 'write': true, 'msg': `PRIMEIRA TENTATIVA → ${ret.msg}` });
            let retGoogleSheets = await googleSheets({ ...inf, 'newRun': true })
            ret = retGoogleSheets
        }

    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res;
    };

    return { ...({ 'ret': ret.ret }), ...(ret.msg && { 'msg': ret.msg }), ...(ret.res && { 'res': ret.res }), };
};

// CHROME | NODEJS
(eng ? window : global)['googleSheets'] = googleSheets;