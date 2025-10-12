// → NO FINAL DO ARQUIVO

let e = currentFile(new Error()), ee = e; let keyFile = `${fileProjetos}/${gW.functions}/${gW.conf}`, scopes = ['https://www.googleapis.com/auth/spreadsheets',], googleAppScriptId, retSheet;
let libs = { '@googleapis/sheets': {}, };
async function googleSheets(inf = {}) {
    let ret = { 'ret': false, }; e = inf.e || e;
    let { action, id, tab, range, values, attempts = 2, googleAppScript = false, idOrigin, idDestination, tabOrigin, tabDestination, linStart, linEnd, colsOrigin, colsDestination, isCol,
        linesQtd,
    } = inf; let errAll = '';
    try {
        /* IMPORTAR BIBLIOTECA [NODE] */ if (libs['@googleapis/sheets']) {
            libs['@googleapis/sheets'] = { 'sheets': 1, 'auth': 1, }; libs = await importLibs(libs, 'googleSheets'); _sheets = await _sheets({ version: 'v4', auth: (await new _auth.GoogleAuth({ keyFile, scopes, })), });
            let r = await configStorage({ e, 'action': 'get', 'key': 'googleAppScriptId', }); if (!r.ret) { return r; } googleAppScriptId = r.res;
        }

        function identifyErr(err) {
            errAll = err.toString(); return (errAll.includes('entity was not found') || errAll.includes('Unable to parse range')
                || errAll.includes('contains an invalid argument')) ? 'NÃO ENCONTRADO' : (errAll.includes('not have permission') || errAll.includes('to edit a protected')) ? 'SEM PERMISSÃO' : 'OUTRO ERRO';
        } async function getIdTab(inf = {}) {
            let ret = { 'ret': false, }; let { id, tab, } = inf; let res = await _sheets.spreadsheets.get({ 'spreadsheetId': id, }); let aba = res.data.sheets.find(s => s.properties.title === tab);
            if (!aba) { ret['msg'] = `GET ID TAB: ERRO | ABA '${tab}' NÃO ENCONTRADA`; } else { ret['ret'] = true; ret['msg'] = `GET ID TAB: OK`; ret['res'] = { 'tab': aba.properties.sheetId, }; } return ret;
        } // function parseRange(range = 'A') { let [rangeStart, rangeEnd,] = range.split(':'); if (!rangeEnd) { rangeEnd = rangeStart; } return { rangeStart, rangeEnd, }; }

        if (action === 'get') {
            // →→→ GET
            let act = `SEND`; range = `${tab}!${range}`; try {
                retSheet = await _sheets.spreadsheets.values.get({ 'spreadsheetId': id, range, }); retSheet = retSheet.data.values; ret['res'] = retSheet; ret['msg'] = `GOOGLE SHEET [${act}]: OK`; ret['ret'] = true;
            } catch (catchErr) { ret['msg'] = `GOOGLE SHEET [${act}]: ERRO | ${identifyErr(catchErr)} '${id}' '${range}'`; }
        } else if (action === 'send') {
            // →→→  SEND
            let act = `SEND`; values = { values, }; if (!isCol) {
                let col = range.replace(/[^a-zA-Z]/g, ''), lin = ''; if (/[0-9]/.test(range)) { lin = range.replace(/[^0-9]/g, ''); } else if (range.includes('*')) {
                    range = `${range}:${range}`; range = range.replace(/\*/g, ''); lin = await googleSheets({ e, 'action': 'lastLin', id, tab, range, }); if (!lin.ret) { return lin; } lin = lin.res.lastLineWithData + 1;
                } else { ret['msg'] = `GOOGLE SHEET [${act}]: ERRO | 'range' INVÁLIDO`; return ret; }
                range = `${tab}!${col}${lin}:${String.fromCharCode(col.charCodeAt(0) + values.values[0].length - 1)}${lin}`;
            } try { await _sheets.spreadsheets.values.update({ 'spreadsheetId': id, range, 'valueInputOption': 'USER_ENTERED', 'resource': values, }); ret['msg'] = `GOOGLE SHEET [${act}]: OK`; ret['ret'] = true; }
            catch (catchErr) { ret['msg'] = `GOOGLE SHEET [${act}]: ERRO | ${identifyErr(catchErr)} '${id}' '${range}'`; }
        } else if (action === 'lastLin') {
            // →→→  LAST LIN
            let act = `LAST LIN`; try {
                if (!googleAppScript) { // CONTANDO PELA QUANTIDADE DE VALORES
                    range = `${tab}!${range.includes(':') ? range : `${range}:${range}`}`; retSheet = await _sheets.spreadsheets.values.get({ 'spreadsheetId': id, range, }); retSheet = retSheet.data.values;
                    ret['res'] = { 'lastLineWithData': (!retSheet || retSheet.length === 0) ? 0 : retSheet.length, };
                } else {
                    let infApi = { // GOOGLE APP SCRIPT
                        e, 'method': 'POST', 'headers': { 'Content-Type': 'application/json', }, 'maxConnect': 20, 'url': `https://script.google.com/macros/s/${googleAppScriptId}/exec`,
                        'body': { 'action': 'run', 'name': 'sheetInfTab', 'par': { id, tab, range, }, }, 'object': true,
                    }; let retApi = await api(infApi); if (!retApi.ret) { return retApi; } retApi = retApi.res.body; if (!retApi.ret) { return retApi; } retApi = retApi.res;
                    ret['res'] = { 'lastLineWithData': retApi.lastLineWithData, 'maxLines': retApi.maxLines, };
                } ret['msg'] = `GOOGLE SHEET [${act}] {${googleAppScript ? 'GOOGLE APP SCRIPT' : 'QTD DE LINHAS'}}: OK`; ret['ret'] = true;
            } catch (catchErr) { ret['msg'] = `GOOGLE SHEET [${act}]: ERRO | ${identifyErr(catchErr)} '${id}' '${range}'`; }
        } else if (action === 'addLines') {
            // →→→  ADD LINE (append automático)
            let act = `ADD LINES`; if (!values || !Array.isArray(values) || !Array.isArray(values[0])) { ret['msg'] = `GOOGLE SHEET [${act}]: ERRO | 'values' INVÁLIDO/NÃO É ARRAY`; return ret; } range = tab; try {
                await _sheets.spreadsheets.values.append({ 'spreadsheetId': id, range, 'valueInputOption': 'USER_ENTERED', 'insertDataOption': 'INSERT_ROWS', 'resource': { values, }, });
                ret['msg'] = `GOOGLE SHEET [${act}]: OK`; ret['ret'] = true;
            } catch (catchErr) { ret['msg'] = `GOOGLE SHEET [${act}]: ERRO | ${identifyErr(catchErr)} '${id}' '${range}'`; }
        } else if (action === 'addInLastLine') {
            // →→→  ADD IN LAST LINE (MAIS RÁPIDO: NÃO) *** [USA A LINHA DISPONÍVEL: SIM] {ABAIXO DA ÚLTIMA LINHA PREENCHIDA}
            let act = `ADD IN LAST LINE {SLOW}`; try {
                let isNumber = v => typeof v === 'number' || typeof v === 'string' && v.trim() !== '' && !isNaN(v); // BUSCAR ID DA ABA CASO 'tab' NÃO SEJA UM NÚMERO (ACEITA TAMBÉM '1234' EM STRING)
                if (!isNumber(tab)) { logConsole({ e, ee, 'txt': `*** BUSCANDO ID DA ABA ***`, }); let rIdTab = await getIdTab({ id, tab, }); if (!rIdTab.ret) { return rIdTab; } tab = rIdTab.res.tab; } let data = [{
                    'appendCells': {
                        'sheetId': Number(tab), 'rows': values.map(row => ({
                            'values': row.map(cel => {
                                let v = cel.value; if (typeof v === 'string' && v.trim().startsWith('=')) { return { 'userEnteredValue': { 'formulaValue': v, }, }; }
                                if (['', undefined,].includes(v)) { return { 'userEnteredValue': null, }; } if (typeof v === 'number') { return { 'userEnteredValue': { 'numberValue': v, }, }; }
                                return { 'userEnteredValue': { 'stringValue': String(v), }, };
                            }),
                        })), 'fields': 'userEnteredValue',
                    },
                },]; await _sheets.spreadsheets.batchUpdate({ 'spreadsheetId': id, 'resource': { 'requests': data, }, }); ret['msg'] = `GOOGLE SHEET [${act}]: OK`; ret['ret'] = true;
            } catch (catchErr) { ret['msg'] = `GOOGLE SHEET [[${act}]: ERRO | ${identifyErr(catchErr)} '${id}' '${tab}'`; }
        } else if (action === 'addInNewLine') {
            // →→→  ADD IN NEW LINE (MAIS RÁPIDO: SIM) *** [USA A LINHA DISPONÍVEL: NÃO] {ABAIXO DA ÚLTIMA LINHA PREENCHIDA NA COLUNA 'A'!!!}
            let act = `ADD IN LAST LINE {FAST}`; range = `${tab}!A:A`; try {
                let data = values.map(lin => lin.map(cel => ['', undefined,].includes(cel.value) ? '' : cel.value === null ? 'null' : cel.value)); let res = await _sheets.spreadsheets.values.append({
                    'spreadsheetId': id, 'range': `${range}`, 'valueInputOption': 'USER_ENTERED', 'insertDataOption': 'INSERT_ROWS', 'resource': { 'values': data, },
                }); let line = res.data.updates.updatedRange; ret['msg'] = `GOOGLE SHEET [${act}]: OK`; ret['ret'] = true; ret['res'] = { line, };
            } catch (catchErr) { ret['msg'] = `GOOGLE SHEET [${act}]: ERRO | ${identifyErr(catchErr)} '${id}' '${range}'`; }
        } else if (action === 'syncRanges') {
            let act = `SYNC RANGES`; try {
                let ranges = colsOrigin.map(col => `${tabOrigin}!${col}${linStart}:${col}${linEnd}`); let res = await _sheets.spreadsheets.values.batchGet({ 'spreadsheetId': idOrigin, ranges, });
                let valores = Array.from({ 'length': linEnd - linStart + 1, }, (_, i) => colsOrigin.map((_, j) => res.data.valueRanges[j].values?.[i]?.[0] || '')); await _sheets.spreadsheets.values.update({
                    'spreadsheetId': idDestination, 'range': `${tabDestination}!${colsDestination[0]}${linStart}:${colsDestination[colsDestination.length - 1]}${linEnd}`,
                    'valueInputOption': 'RAW', 'requestBody': { 'values': valores, },
                }); ret['msg'] = `GOOGLE SHEET [${act}]: OK`; ret['ret'] = true;
            } catch (catchErr) { ret['msg'] = `GOOGLE SHEET [${act}]: ERRO | ${identifyErr(catchErr)}`; }
        } else if (action === 'deleteLines') {
            // →→→ DELETE LINES
            let act = `DELETE LINES`; try {
                if (typeof linStart !== 'number' || linStart < 1) { ret['msg'] = `GOOGLE SHEET [${act}]: ERRO | INFORMAR O 'linStart'`; return ret; }
                if (typeof linesQtd !== 'number' || linesQtd < 1) { ret['msg'] = `GOOGLE SHEET [${act}]: ERRO | INFORMAR O 'linesQtd'`; return ret; }
                let data = [{ 'deleteDimension': { 'range': { 'sheetId': Number(tab), 'dimension': 'ROWS', 'startIndex': linStart - 1, 'endIndex': linStart - 1 + linesQtd, }, }, },];
                await _sheets.spreadsheets.batchUpdate({ 'spreadsheetId': id, 'resource': { 'requests': data, }, });
                ret['msg'] = `GOOGLE SHEET [${act}]: OK | LINHAS ${linStart} A ${linStart + linesQtd - 1} DELETADAS`; ret['ret'] = true;
            } catch (catchErr) { ret['msg'] = `GOOGLE SHEET [${act}]: ERRO | ${identifyErr(catchErr)} '${id}' '${tab}'`; }
        } else {
            ret['msg'] = `GOOGLE SHEET: ERRO | 'action' INVÁLIDO`; return ret;
        }

        // TENTAR NOVAMENTE EM CASO DE ERRO | MANTER 'legacy' true PORQUE NO WebScraper O WEBSOCKET NÃO ESTÁ CONECTADO
        if (!ret.ret) {
            attempts--; let text = `TENTATIVAS RESTANTES [${attempts}] → ${ret.msg}`; if (attempts === 0) { await notification({ e, 'legacy': true, 'title': `# SHEETS (${gW.devMaster}) [NODE]`, text, }); }
            logConsole({ e, ee, 'txt': `${text}${!text.includes('OUTRO') ? '' : `\n\n*** ERRO SHEETS\n${errAll}`}`, }); if (attempts > 0) { let r = await googleSheets({ ...inf, attempts, }); ret = r; }
        }

    } catch (catchErr) {
        let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    }

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.hasOwnProperty('res') && { 'res': ret.res, }), };
}

// CHROME | NODE
globalThis['googleSheets'] = googleSheets;


// let infGoogleSheets, retGoogleSheets;
// infGoogleSheets = {
//     e, 'action': 'get', 'id': `1BKI7XsKTq896JcA-PLnrSIbyIK1PaakiAtoseWmML-Q`, 'tab': `abaNome`,
//     'range': `xx`, // 'A1' → CÉLULA ÚNICA | 'A1:A2' → PERÍMETRO | 'A:A' → COLUNA
// };
// infGoogleSheets = {
//     e, 'action': 'send', 'id': `1BKI7XsKTq896JcA-PLnrSIbyIK1PaakiAtoseWmML-Q`, 'tab': `abaNome`,
//     'range': `xx`, // 'A1' → JÁ CALCULA A ÚLTIMA COLUNA | 'A*' →  ÚLTIMA LINHA EM BRANCO DA COLUNA
//     'values': [[`A1`, `B1`, `C1`,],],
// };
// infGoogleSheets = { // 'googleAppScript': false,
//     e, 'action': 'lastLin', 'id': `1BKI7XsKTq896JcA-PLnrSIbyIK1PaakiAtoseWmML-Q`, 'tab': `abaNome`,
//     'range': `A1:A10`, // 'A1:A10' → PERÍMETRO | 'A:A' → COLUNA
// };
// infGoogleSheets = {
//     e, 'action': 'addLines', 'id': `1BKI7XsKTq896JcA-PLnrSIbyIK1PaakiAtoseWmML-Q`, 'tab': `abaNome`,
//     'values': [[`A1`, `B1`, `C1`,], [`A2`, `B2`, `C2`,],], // ADICIONAR DUAS LINHAS A PARTIR DA COLUNA 'A'
// };
// infGoogleSheets = { // (MAIS RÁPIDO: NÃO) *** [USA A LINHA DISPONÍVEL: SIM] {ABAIXO DA ÚLTIMA LINHA PREENCHIDA}
//     e, 'action': 'addInLastLine', 'id': `1BKI7XsKTq896JcA-PLnrSIbyIK1PaakiAtoseWmML-Q`, 'tab': `abaNome`, // (USAR O ID DA ABA É MAIS RÁPIDO!!!)
//     'values': [
//         //                                 ___ANTES___                                                                     ___DEPOIS___
//         //             [     A     B     C     D    E     F     G     H     ]                          [     A     B     C     D     E     F     G     H     ]
//         // [LINHA 1]         A1    B1    C1    D1   E1    F1                               [LINHA 1]               A1    B1    C1    D1    E1    F1
//         // [LINHA 2]               B2    C2    D2   E2    F2                               [LINHA 2]                     B2    C2    D2    E2    F2
//         // [LINHA 3]                                                                       [LINHA 3]         A3    B3           4     1   TRUE  FALSE  null
//         [{ 'value': `A3`, }, { 'value': `B3`, }, { 'value': ``, }, { 'value': `=SOMA(1;3)`, }, { 'value': 1, }, { 'value': true, }, { 'value': false, }, { 'value': null, },],
//     ],
// };
// infGoogleSheets = { // (MAIS RÁPIDO: SIM) *** [USA A LINHA DISPONÍVEL: NÃO] {ABAIXO DA ÚLTIMA LINHA PREENCHIDA NA COLUNA 'A'!!!}
//     e, 'action': 'addInNewLine', 'id': `1BKI7XsKTq896JcA-PLnrSIbyIK1PaakiAtoseWmML-Q`, 'tab': `abaNome`,
//     'values': [
//         //                                     ___ANTES___                                                                 ___DEPOIS___
//         //             [     A     B     C     D    E     F     G     H     ]                          [     A     B     C     D     E     F     G     H     ]
//         // [LINHA 1]         A1    B1    C1    D1   E1    F1                               [LINHA 1]               A1    B1    C1    D1    E1    F1
//         // [LINHA 2]               B2    C2    D2   E2    F2                               [LINHA 2]         A3    B3           4     1   TRUE  FALSE  null
//         // [LINHA 3]                                                                       [LINHA 3]               B2    C2    D2    E2    F2
//         //                                                                                 [LINHA 4]
//         [{ 'value': `A3`, }, { 'value': `B3`, }, { 'value': ``, }, { 'value': `=SOMA(1;3)`, }, { 'value': 1, }, { 'value': true, }, { 'value': false, }, { 'value': null, },],
//     ],
// };
// infGoogleSheets = {
//     e, 'action': 'syncRanges', 'linStart': 2, 'linEnd': 401,
//     'idOrigin': '1UzSX3jUbmGxVT4UbrVIB70na3jJ5qYhsypUeDQsXmjc', 'tabOrigin': 'INDICAR_AUTOMATICO', 'colsOrigin': ['N', 'S',],
//     'idDestination': '19itKQqFsvKp7Y8nlTycO1X5OqRz4r0ekHcg_FzTtz0Y', 'tabDestination': 'INDICACOES_STATUS', 'colsDestination': ['K', 'L',],
// };
// infGoogleSheets = {
//     e, 'action': 'deleteLines', 'linStart': 1, 'linesQtd': 3, 'id': '1Rj_eyyhJtwY-XyEoNYeOAQ_nESrtmskPNyCLO0bTRak', 'tab': '1260776603',
// };
// retGoogleSheets = await googleSheets(infGoogleSheets); console.log(retGoogleSheets);
// retGoogleSheets = await googleSheets(infGoogleSheets); console.log(retGoogleSheets);


