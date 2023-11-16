// let infGoogleSheet, retGoogleSheet
// infGoogleSheet = {
//     'action': 'get',
//     'id': '1h0cjCceBBbX6IlDYl7DfRa7_i1__SNC_0RUaHLho7d8',
//     'tab': 'RESULTADOS_CNPJ_NEW',
//     'range': 'E1:F1', // PERÍMETRO
//     'range': 'E1', // CÉLULA ÚNICA
// }
// infGoogleSheet = {
//     'action': 'send',
//     'id': '1h0cjCceBBbX6IlDYl7DfRa7_i1__SNC_0RUaHLho7d8',
//     'tab': 'RESULTADOS_CNPJ_NEW',
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
        let infConfigStorage, retConfigStorage, makeNewToken = true

        const { google } = await import('googleapis');
        let pathOAuth = `${conf[1]}:/${conf[2]}/src/googleOAuth.json`
        let _authClient = new google.auth.GoogleAuth({ keyFile: pathOAuth, scopes: ['https://www.googleapis.com/auth/spreadsheets'] });
        let _auth = await _authClient.getClient();
        let _sheet = google.sheets('v4');

        infConfigStorage = { 'action': 'get', 'key': 'googleApi' }
        retConfigStorage = await configStorage(infConfigStorage);
        if (retConfigStorage.ret) {
            let timestamp = Math.floor(new Date().getTime());
            if (retConfigStorage.res.tim - 60000 > timestamp) {
                makeNewToken = false
            }
        }

        // GERAR NOVO TOKEN
        if (makeNewToken) {
            console.log('ATUALIZANDO TOKEN')
            await _auth.authorize();
            const date = new Date(_auth.credentials.expiry_date);
            const day = ('0' + date.getDate()).slice(-2);
            const mon = ('0' + (date.getMonth() + 1)).slice(-2);
            const hou = ('0' + date.getHours()).slice(-2);
            const min = ('0' + date.getMinutes()).slice(-2);
            const sec = ('0' + date.getSeconds()).slice(-2);
            let retToken = {
                'tim': _auth.credentials.expiry_date,
                'dateHor': `${day}/${mon} ${hou}:${min}:${sec}`,
                // 'token': _auth.credentials.access_token
            };
            infConfigStorage = { 'action': 'set', 'key': 'googleApi', 'value': retToken }
            retConfigStorage = await configStorage(infConfigStorage);
        }

        let id = inf && inf.id ? inf.id : '1h0cjCceBBbX6IlDYl7DfRa7_i1__SNC_0RUaHLho7d8'
        let tab = inf.tab
        if (inf.action == 'get') { // GET
            let range = inf.range
            if (range.includes('last*')) {
                range = range.replace('last*', '').replace('*', '')
                range = `${range}1:${range}${range}`
            }
            range = range == 'last' ? `${tab}!A1:AA` : `${tab}!${range}`
            // let auth = await _authClient.getClient();
            let retSheet = await _sheet.spreadsheets.values.get({ auth: _auth, 'spreadsheetId': id, range });
            ret['res'] = inf.range.includes('last') ? retSheet.data.values.length + 1 : retSheet.data.values
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
                let retNewGet = await googleSheet({ 'action': 'get', 'id': id, 'tab': 'RESULTADOS_CNPJ_NEW', 'range': inf.range.includes('*') ? `last*${inf.range}` : 'last' })
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

// const pathOAuth = "D:/ARQUIVOS/PROJETOS/Chrome_Extension/src/googleOAuth.json";
// const { google } = await import('googleapis');
// const authClient = new google.auth.GoogleAuth({
//     keyFile: pathOAuth,
//     scopes: ['https://www.googleapis.com/auth/spreadsheets']
// });
// const auth = await authClient.getClient();
// await auth.authorize();
// const accessToken = auth.credentials.access_token;
// console.log('Access Token:', accessToken);
// const expirationTime = auth.credentials.expiry_date;
// const expirationDate = new Date(expirationTime);
// console.log('Token expirará em:', expirationDate.toLocaleString());