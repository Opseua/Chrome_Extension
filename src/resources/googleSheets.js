// let infGoogleSheets, retGoogleSheets
// infGoogleSheets = {
//     'e': e, 'action': 'get', 'id': `1h0cjCceBBbX6IlDYl7DfRa7_i1__SNC_0RUaHLho7d8`, 'tab': `RESULTADOS`,
//     'range': `E1:F1`, // PERÍMETRO
//     'range': `E:E`, // COLUNA
//     'range': `E1`, // CÉLULA ÚNICA
// }
// infGoogleSheets = {
//     'e': e, 'action': 'send', 'id': `1h0cjCceBBbX6IlDYl7DfRa7_i1__SNC_0RUaHLho7d8`, 'tab': `RESULTADOS`,
//     'range': `D*`, // ÚLTIMA LINHA EM BRANCO DA [COLUNA 'D' ATÉ 'DD']
//     'range': `D**`, // ÚLTIMA LINHA EM BRANCO DA [COLUNA 'D' ATÉ 'D']
//     'range': `D22`, // FUNÇÃO JÁ CALCULA A ÚLTIMA COLUNA DE ACORDO COM O 'values'
//     'values': [['a', 'b', 'c']]
// }
// infGoogleSheets = {
//     'e': e, 'action': 'lastLin', 'id': `1h0cjCceBBbX6IlDYl7DfRa7_i1__SNC_0RUaHLho7d8`, 'tab': `RESULTADOS`,
// }
// retGoogleSheets = await googleSheets(infGoogleSheets); console.log(retGoogleSheets)

let e = import.meta.url, ee = e; let _sheets; let _auth; let g = globalWindow;
async function googleSheets(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    try {
        // IMPORTAR BIBLIOTECA [NODEJS]
        if (typeof _sheets_v4 === 'undefined') { await functionImportLibrary({ 'lib': '_sheets_v4' }); }; if (typeof _GoogleAuth === 'undefined') {
            await functionImportLibrary({ 'lib': '_GoogleAuth' });
            // AUTENTICAR
            _sheets = new _sheets_v4.Sheets({});//  _auth = await new _GoogleAuth({ keyFile: `${letter}:/${g.root}/${g.functions}/${g.conf}`, scopes: ['https://www.googleapis.com/auth/spreadsheets'], }).getClient();
        };

        let id = inf && inf.id ? inf.id : '1h0cjCceBBbX6IlDYl7DfRa7_i1__SNC_0RUaHLho7d8'; let tab = inf && inf.tab ? inf.tab : 'RESULTADOS'
        if (inf.action == 'get') {
            // GET
            let range = inf.range
            // ÚLTIMA LINHA EM BRANCO DA [COLUNA]
            if (range.includes('last**')) { range = range.replace('last**', '').replace('**', ''); range = `${range}1:${range}` } else if (range.includes('last*')) {
                // ÚLTIMA LINHA EM BRANCO DA [PLANILHA]
                range = range.replace('last*', '').replace('*', ''); range = `${range}1:${range}${range}`
            }; range = range == 'last' ? `${tab}!A1:AA` : `${tab}!${range}`; try {
                let retSheet = await _sheets.spreadsheets.values.get({ auth: _auth, 'spreadsheetId': id, range });
                ret['res'] = inf.range.includes('last') ? retSheet.data.values ? retSheet.data.values.length + 1 : 1 : retSheet.data.values
                ret['msg'] = `GOOGLE SHEET [GET]: OK`;
                ret['ret'] = true;
            } catch (catchErr) {
                ret['msg'] = `GOOGLE SHEET [GET]: ERRO | NÃO ENCONTRADO '${range}' E/OU ID '${id}'`; esLintIgnore = catchErr;
            }
        } else if (inf.action == 'send') {
            // SEND
            let col = inf.range.replace(/[^a-zA-Z]/g, ''), values = { 'values': inf.values }, lin = ''
            if (/[0-9]/.test(inf.range)) { lin = inf.range.replace(/[^0-9]/g, '') } else {
                let range = inf.range.includes('**') ? `last**${inf.range}` : inf.range.includes('*') ? `last*${inf.range}` : 'last'
                let retNewGet = await googleSheets({ 'e': e, 'action': 'get', 'id': id, 'tab': tab, 'range': range }); lin = retNewGet.res
            }; let range = `${tab}!${col}${lin}:${String.fromCharCode(col.charCodeAt(0) + values.values[0].length - 1)}${lin}`; try {
                await _sheets.spreadsheets.values.update({ auth: _auth, 'spreadsheetId': id, range, 'valueInputOption': 'USER_ENTERED', 'resource': values });
                ret['msg'] = `GOOGLE SHEET [SEND]: OK`;
                ret['ret'] = true;
            } catch (catchErr) {
                if (JSON.stringify(e).includes(`You are trying to edit a protected`)) {
                    ret['msg'] = `GOOGLE SHEET [SEND]: ERRO | RANGE PROTEGIDO`;
                } else {
                    ret['msg'] = `GOOGLE SHEET [SEND]: ERRO | NÃO ENCONTRADO '${range}' E/OU ID '${id}'`;
                }; esLintIgnore = catchErr;
            }
        } else if (inf.action == 'lastLin') {
            console.log('SIM')
            // LAST LIN
            let googleAppScriptId; infConfigStorage = { 'e': e, 'action': 'get', 'key': 'googleAppScript' }; retConfigStorage = await configStorage(infConfigStorage);
            if (!retConfigStorage.ret) { return retConfigStorage } else { googleAppScriptId = retConfigStorage.res.id; }
            let infApi = {
                'e': e, 'method': 'GET', 'url': `https://script.google.com/macros/s/${googleAppScriptId}/exec?&functionName=sheetNew&infFunction={ "id": "${id}", "tab": "${tab}", "action": "${inf.action}" }`,
                'headers': { 'Content-Type': 'application/json' }, 'max': 10
            }; let retApi = await api(infApi); if (!retApi.ret) { return retApi }; retApi = JSON.parse(retApi.res.body); if (!retApi.ret) { return retApi };
            ret['res'] = {
                'lastLinWithData': retApi.res.lastLinWithData,
                'lastLinSheet': retApi.res.lastLinSheet
            }
            ret['msg'] = `GOOGLE SHEET [LAST LIN]: OK`;
            ret['ret'] = true;
        }

        // TENTAR NOVAMENTE EM CASO DE ERRO
        if (!ret.ret && !inf.newRun) {
            await notification({ 'e': e, 'legacy': true, 'title': `ERRO GOOGLE SHEETS`, 'text': `PRIMEIRA TENTATIVA → ${ret.msg}`, });

            logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `PRIMEIRA TENTATIVA → ${ret.msg}` });
            let retGoogleSheets = await googleSheets({ ...inf, 'newRun': true })
            ret = retGoogleSheets
        }

    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res;
    }; return { ...({ ret: ret.ret }), ...(ret.msg && { msg: ret.msg }), ...(ret.res && { res: ret.res }), };
};

// CHROME | NODEJS
(eng ? window : global)['googleSheets'] = googleSheets;