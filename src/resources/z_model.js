// await import('./resources/@export.js'); // TESTES

// let infModel, retModel
// infModel = { 'e': e, 'chaveUm': 'valorUm', 'chaveDois': 'valorDois' }
// retModel = await model(infModel); console.log(retModel)

let e = import.meta.url, ee = e;
async function model(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    try {
        // let infTranslate = { 'source': 'auto', 'target': 'pt', 'text': `Hi, what your name?` };
        // let retTranslate = await translate(infTranslate); if (!retTranslate.ret) { return retTranslate } else { retTranslate = retTranslate.res }

        ret['res'] = `resposta aqui`;
        ret['msg'] = `MODEL: OK`;
        ret['ret'] = true;

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

if (eng) { // CHROME
    window['model'] = model;
} else { // NODEJS
    global['model'] = model;
}

