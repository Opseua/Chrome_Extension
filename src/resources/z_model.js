// await import('./resources/@export.js'); // TESTES

// let infModel, retModel // 'logFun': true,
// infModel = { 'e': e, 'chaveUm': 'valorUm', 'chaveDois': 'valorDois' }
// retModel = await model(infModel)
// console.log(retModel)

let e = import.meta.url, ee = e;
async function model(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        let errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
    try {
        // let infTranslate = { 'source': 'auto', 'target': 'pt', 'text': `Hi, what your name?` };
        // let retTranslate = await translate(infTranslate); if (!retTranslate.ret) { return retTranslate } else { retTranslate = retTranslate.res }

        ret['res'] = `resposta aqui`;
        ret['msg'] = `MODEL: OK`;
        ret['ret'] = true;

    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, 'catchGlobal': false });
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

