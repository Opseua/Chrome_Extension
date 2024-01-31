// *************** EXPORTAR GLOBALMENTE PRIMEIRO NO '@functions' ***************
// let infGlobal = { 'var1': 'LUA', 'var2': 'SOL' }

// window['infGlobal'] = infGlobal;
// global['infGlobal'] = infGlobal;
// *****************************************************************************

// let infJsonInterpret, retJsonInterpret, json // 'logFun': true,
// infGlobal['var1'] = 'LUA'; infGlobal['var2'] = 'SOL';
// json = `{ "nasa": "Tanto a $[var1] quanto o $[var2] são redondos" }`;
// infJsonInterpret = { 'e': e, 'json': json, 'vars': infGlobal };
// retJsonInterpret = await jsonInterpret(infJsonInterpret)
// console.log(retJsonInterpret)

let e = import.meta.url;
async function jsonInterpret(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        let errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; let retRegexE = await regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
    try {
        let json = JSON.stringify(inf.json);
        let res = json.replace(/\$\[(.*?)\]/g, (match, p1) => infGlobal[p1])
        ret['res'] = res;
        ret['msg'] = `JSON INTERPRET: OK`;
        ret['ret'] = true;

        // ### LOG FUN ###
        if (inf && inf.logFun) {
            let infFile = { 'e': e, 'action': 'write', 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }, retFile
            infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; retFile = await file(infFile);
        }
    } catch (e) {
        let retRegexE = await regexE({ 'inf': inf, 'e': e, 'catchGlobal': false });
        ret['msg'] = retRegexE.res
    };
    return {
        ...({ ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}

if (eng) { // CHROME
    window['jsonInterpret'] = jsonInterpret;
} else { // NODEJS
    global['jsonInterpret'] = jsonInterpret;
}
