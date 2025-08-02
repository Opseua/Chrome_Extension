// let infModel, retModel
// infModel = { e, 'chaveUm': 'valorUm', 'chaveDois': 'valorDois' }
// retModel = await model(infModel); console.log(retModel)

let libs = { 'net': {}, };

let e = currentFile(), ee = e;
async function model(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        /* IMPORTAR BIBLIOTECA [NODE] */  if (libs['net']) { libs['net']['net'] = 1; libs = await importLibs(libs, 'serverRun [Sniffer_Python]'); }

        let { text = 'aaa', folder = 'bbb', } = inf;

        let retRegex = regex({ e, 'pattern': `UM(.*?)TRES`, text, 'nada': folder, }); console.log(retRegex);

        ret['res'] = `resposta aqui`;
        ret['msg'] = `MODEL: OK`;
        ret['ret'] = true;

    } catch (catchErr) {
        let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    }

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.hasOwnProperty('res') && { 'res': ret.res, }), };
    // return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.res && { 'res': ret.res, }), }; // return ANTIGO
}

// CHROME | NODE
globalThis['model'] = model;


