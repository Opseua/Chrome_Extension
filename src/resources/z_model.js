// await import('./resources/@export.js'); // TESTES

let e = import.meta.url;
async function model(inf) {
    let ret = { 'ret': false };
    e = inf && inf.e ? inf.e : e
    try {
        // if (!`rodar no → CHROME ou NODEJS`.includes(engName)) { // [ENCAMINHAR PARA DEVICE]
        //     let infDevAndFun = { 'enc': true, 'data': { 'name': 'model', 'par': inf, 'retInf': inf.retInf } };
        //     let retDevAndFun = await devFun(infDevAndFun); return retDevAndFun
        // };

        // let infTranslate = { 'source': 'auto', 'target': 'pt', 'text': `Hi, what your name?` };
        // let retTranslate = await translate(infTranslate); if (!retTranslate.ret) { return retTranslate } else { retTranslate = retTranslate.res }

        ret['res'] = `resposta aqui`;
        ret['msg'] = `MODEL: OK`;
        ret['ret'] = true;

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
    window['model'] = model;
} else { // NODEJS
    global['model'] = model;
}

// TESTES
async function run() {
    let infModel, retModel
    infModel = { 'nire': '35132685930', 'aut': 'ASP.NET_SessionId=wivpxhlq3b45tgtb12dcgk4t' }
    retModel = await model(infModel)
    console.log(retModel)
}
await run()
