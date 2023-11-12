// let infGoogleSheet, retGoogleSheet
// infGoogleSheet = {
//     'action': 'get',
//     'id': '1h0cjCceBBbX6IlDYl7DfRa7_i1__SNC_0RUaHLho7d8',
//     'tab': 'CNPJ_DO_DIA',
//     'range': 'E1:F1', // PERÍMETRO
//     'range': 'E1', // CÉLULA ÚNICA
// }
// infGoogleSheet = {
//     'action': 'send',
//     'id': '1h0cjCceBBbX6IlDYl7DfRa7_i1__SNC_0RUaHLho7d8',
//     'tab': 'CNPJ_DO_DIA',
//     'range': 'D', // ÚLTIMA LINHA EM BRANCO DA COLUNA 'D'
//     'range': 'D22', // FUNÇÃO JÁ CALCULA A ÚLTIMA COLUNA DE ACORDO COM O 'values'
//     'values': [['a', 'b', 'c']]
// }
// retGoogleSheet = await googleSheet(infGoogleSheet)
// console.log(retGoogleSheet)

async function googleSheet(inf) {
    await import('./@functions.js');
    let ret = { 'ret': false };

    try {
        if (!`rodar no → NODEJS`.includes(engName)) { // [ENCAMINHAR PARA DEVICE]
            let infDevAndFun = { 'enc': true, 'data': { 'name': 'googleSheet', 'par': inf, 'retInf': inf.retInf } };
            let retDevAndFun = await devFun(infDevAndFun); return retDevAndFun
        };
        const pathOAuth = `${conf[1]}:/${conf[2]}/src/googleOAuth.json`
        const { google } = await import('googleapis');
        let _sheet = google.sheets('v4');
        let _authClient = new google.auth.GoogleAuth({ keyFile: pathOAuth, scopes: ['https://www.googleapis.com/auth/spreadsheets'] });
        let _auth = await _authClient.getClient();
        let id = inf && inf.id ? inf.id : '1h0cjCceBBbX6IlDYl7DfRa7_i1__SNC_0RUaHLho7d8'
        let tab = inf.tab
        if (inf.action == 'get') { // GET
            let range = inf.range == 'last' ? 'A1:AA' : `${tab}!${inf.range}`
            // let auth = await _authClient.getClient();
            let retSheet = await _sheet.spreadsheets.values.get({ auth: _auth, 'spreadsheetId': id, range });
            ret['res'] = inf.range == 'last' ? retSheet.data.values.length + 1 : retSheet.data.values
            ret['ret'] = true;
            ret['msg'] = `GOOGLE SHEET GET: OK`;
            return ret
        } else if (inf.action == 'send') { // SEND
            let col = inf.range.replace(/[^a-zA-Z]/g, '')
            let values = { 'values': inf.values }
            let lin = ''
            if (/[0-9]/.test(inf.range)) {
                lin = inf.range.replace(/[^0-9]/g, '')
            } else {
                let retNewGet = await googleSheet({ 'action': 'get', 'id': id, 'tab': 'CNPJ_DO_DIA', 'range': 'last' })
                lin = retNewGet.res
            }
            let range = `${tab}!${col}${lin}:${String.fromCharCode(col.charCodeAt(0) + values.values[0].length - 1)}${lin}`
            // let auth = await _authClient.getClient();
            let retSheet = await _sheet.spreadsheets.values.update({ auth: _auth, 'spreadsheetId': id, range, 'valueInputOption': 'USER_ENTERED', 'resource': values });
            ret['msg'] = `GOOGLE SHEET SEND: OK`;
            ret['ret'] = true;
        }
    } catch (e) {
        let m = await regexE({ 'e': e });
        ret['msg'] = m.res
    };
    return ret
}

if (typeof eng === 'boolean') {
    if (eng) { // CHROME
        window['googleSheet'] = googleSheet;
    } else { // NODEJS
        global['googleSheet'] = googleSheet;
    }
}