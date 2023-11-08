// let infGoogleSheet
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
// const retGoogleSheet = await googleSheets(infGoogleSheet)
// console.log(retGoogleSheet)

const { google } = await import('googleapis');
const sheets = google.sheets('v4');
const authClient = new google.auth.GoogleAuth({ keyFile: 'googleOAuth.json', scopes: ['https://www.googleapis.com/auth/spreadsheets'] });
const auth = await authClient.getClient();

async function googleSheets(inf) {
    await import('./@functions.js');
    let ret = { 'ret': false };
    try {
        if (typeof window !== 'undefined') { // [ENCAMINHAR PARA DEVICE → NODEJS]
            const infDevAndFun = {
                'name': 'googleSheets', 'retInf': inf.retInf,
                'par': { 'action': inf.action, 'id': inf.id, 'tab': inf.tab, 'range': inf.range, 'values': inf.values }
            }; const retDevAndFun = await devAndFun(infDevAndFun); return retDevAndFun
        };
        const id = inf && inf.id ? inf.id : '1h0cjCceBBbX6IlDYl7DfRa7_i1__SNC_0RUaHLho7d8'
        const tab = inf.tab
        if (inf.action == 'get') { // GET
            const range = inf.range == 'last' ? 'A1:AA' : `${tab}!${inf.range}`
            // const auth = await authClient.getClient();
            const retSheet = await sheets.spreadsheets.values.get({ auth, 'spreadsheetId': id, range });
            ret['res'] = inf.range == 'last' ? retSheet.data.values.length + 1 : retSheet.data.values
            ret['ret'] = true;
            ret['msg'] = `GOOGLE SHEETS GET: OK`;
        } else if (inf.action == 'send') { // SEND
            const col = inf.range.replace(/[^a-zA-Z]/g, '')
            const values = { 'values': inf.values }
            let lin = ''
            if (/[0-9]/.test(inf.range)) {
                lin = inf.range.replace(/[^0-9]/g, '')
            } else {
                const retNewGet = await googleSheets({ 'action': 'get', 'id': id, 'tab': 'CNPJ_DO_DIA', 'range': 'last' })
                lin = retNewGet.res
            }
            const range = `${tab}!${col}${lin}:${String.fromCharCode(col.charCodeAt(0) + values.values[0].length - 1)}${lin}`
            // const auth = await authClient.getClient();
            const retSheet = await sheets.spreadsheets.values.update({ auth, 'spreadsheetId': id, range, 'valueInputOption': 'USER_ENTERED', 'resource': values });
            ret['ret'] = true;
            ret['msg'] = `GOOGLE SHEETS SEND: OK`;
        }
    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; return ret
}

if (typeof window !== 'undefined') { // CHROME
    window['googleSheets'] = googleSheets;
} else { // NODEJS
    global['googleSheets'] = googleSheets;
}


