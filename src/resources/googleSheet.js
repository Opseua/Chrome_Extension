// let infGoogleSheet, retGoogleSheet // 'logFun': true,
// infGoogleSheet = {
//     'action': 'get',
//     'id': `1h0cjCceBBbX6IlDYl7DfRa7_i1__SNC_0RUaHLho7d8`,
//     'tab': `RESULTADOS_CNPJ_NEW`,
//     'range': `E1:F1`, // PERÍMETRO
//     'range': `E1`, // CÉLULA ÚNICA
// }
// infGoogleSheet = {
//     'action': 'send',
//     'id': `1h0cjCceBBbX6IlDYl7DfRa7_i1__SNC_0RUaHLho7d8`,
//     'tab': `RESULTADOS_CNPJ_NEW`,
//     'range': `D*`, // ÚLTIMA LINHA EM BRANCO DA [COLUNA 'D' ATÉ 'DD']
//     'range': `D**`, // ÚLTIMA LINHA EM BRANCO DA [COLUNA 'D' ATÉ 'D']
//     'range': `D22`, // FUNÇÃO JÁ CALCULA A ÚLTIMA COLUNA DE ACORDO COM O 'values'
//     'values': [['a', 'b', 'c']]
// }
// retGoogleSheet = await googleSheet(infGoogleSheet)
// console.log(retGoogleSheet)

let e = import.meta.url;
async function googleSheet(inf) {
    let ret = { 'ret': false };
    e = inf && inf.e ? inf.e : e
    try {
        if (!`rodar no → NODEJS`.includes(engName)) { // [ENCAMINHAR PARA DEVICE]
            let infDevAndFun = { 'enc': true, 'data': { 'name': 'googleSheet', 'par': inf, 'retInf': inf.retInf } };
            let retDevAndFun = await devFun(infDevAndFun); return retDevAndFun
        };

        let infConfigStorage, retConfigStorage, makeNewToken = true
        let pathOAuth = `${letter}:/${conf[2]}/src/googleOAuth.json`
        let _authClient = new _google.auth.GoogleAuth({ keyFile: pathOAuth, scopes: ['https://www.googleapis.com/auth/spreadsheets'] });
        let _auth = await _authClient.getClient();
        let _sheet = _google.sheets('v4');

        infConfigStorage = { 'e': e, 'action': 'get', 'key': 'googleApi' }
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
            let date = new Date(_auth.credentials.expiry_date);
            let day = ('0' + date.getDate()).slice(-2);
            let mon = ('0' + (date.getMonth() + 1)).slice(-2);
            let hou = ('0' + date.getHours()).slice(-2);
            let min = ('0' + date.getMinutes()).slice(-2);
            let sec = ('0' + date.getSeconds()).slice(-2);
            let retToken = {
                'tim': _auth.credentials.expiry_date,
                'dateHor': `${day}/${mon} ${hou}:${min}:${sec}`,
                // 'token': _auth.credentials.access_token
            };
            infConfigStorage = { 'e': e, 'action': 'set', 'key': 'googleApi', 'value': retToken }
            retConfigStorage = await configStorage(infConfigStorage);
        }

        let id = inf && inf.id ? inf.id : '1h0cjCceBBbX6IlDYl7DfRa7_i1__SNC_0RUaHLho7d8'
        let tab = inf && inf.tab ? inf.tab : 'RESULTADOS_CNPJ_2'
        if (inf.action == 'get') { // GET
            let range = inf.range
            // ÚLTIMA LINHA EM BRANCO DA [COLUNA]
            if (range.includes('last**')) {
                range = range.replace('last**', '').replace('**', '')
                range = `${range}1:${range}`
            } else if (range.includes('last*')) {
                // ÚLTIMA LINHA EM BRANCO DA [PLANILHA]
                range = range.replace('last*', '').replace('*', '')
                range = `${range}1:${range}${range}`
            }
            range = range == 'last' ? `${tab}!A1:AA` : `${tab}!${range}`
            try {
                let retSheet = await _sheet.spreadsheets.values.get({ auth: _auth, 'spreadsheetId': id, range });
                ret['res'] = inf.range.includes('last') ? retSheet.data.values ? retSheet.data.values.length + 1 : 1 : retSheet.data.values
                ret['msg'] = `GOOGLE SHEET GET: OK`;
                ret['ret'] = true;
            } catch (e) {
                ret['msg'] = `NÃO ENCONTRADO '${range}' E/OU ID '${id}'`;
            }
        } else if (inf.action == 'send') { // SEND
            let col = inf.range.replace(/[^a-zA-Z]/g, '')
            let values = { 'values': inf.values }
            let lin = ''
            if (/[0-9]/.test(inf.range)) {
                lin = inf.range.replace(/[^0-9]/g, '')
            } else {
                let range = inf.range.includes('**') ? `last**${inf.range}` : inf.range.includes('*') ? `last*${inf.range}` : 'last'
                let retNewGet = await googleSheet({ 'action': 'get', 'id': id, 'tab': tab, 'range': range })
                lin = retNewGet.res
            }
            let range = `${tab}!${col}${lin}:${String.fromCharCode(col.charCodeAt(0) + values.values[0].length - 1)}${lin}`
            try {
                let retSheet = await _sheet.spreadsheets.values.update({ auth: _auth, 'spreadsheetId': id, range, 'valueInputOption': 'USER_ENTERED', 'resource': values });
                ret['msg'] = `GOOGLE SHEET SEND: OK`;
                ret['ret'] = true;
            } catch (e) {
                ret['msg'] = `NÃO ENCONTRADO '${range}' E/OU ID '${id}'`;
            }
        }

        // ### LOG FUN ###
        if (inf && inf.logFun) {
            let infFile = { 'e': e, 'action': 'write', 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }, retFile
            infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; retFile = await file(infFile);
        }
    } catch (e) {
        let retRegexE = await regexE({ 'inf': inf, 'e': e });
        ret['msg'] = retRegexE.res
    };
    return {
        ...({ ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}

if (eng) { // CHROME
    window['googleSheet'] = googleSheet;
} else { // NODEJS
    global['googleSheet'] = googleSheet;
}


