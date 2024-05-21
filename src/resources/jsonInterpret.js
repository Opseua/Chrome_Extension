// *************** EXPORTAR GLOBALMENTE PRIMEIRO NO '@functions' ***************
// let infGlobal = { 'var1': 'LUA', 'var2': 'SOL' }

// window['infGlobal'] = infGlobal;
// global['infGlobal'] = infGlobal;
// *****************************************************************************

// let infJsonInterpret, retJsonInterpret, json
// infGlobal['var1'] = 'LUA'; infGlobal['var2'] = 'SOL';
// json = `{ "nasa": "Tanto a $[var1] quanto o $[var2] são redondos" }`;
// infJsonInterpret = { 'e': e, 'json': json, 'vars': infGlobal };
// retJsonInterpret = await jsonInterpret(infJsonInterpret); console.log(retJsonInterpret)

let e = import.meta.url, ee = e;
async function jsonInterpret(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    try {
        let json = JSON.stringify(inf.json);
        let res = json.replace(/\$\[(.*?)\]/g, (match, p1) => infGlobal[p1])
        ret['res'] = res;
        ret['msg'] = `JSON INTERPRET: OK`;
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
    window['jsonInterpret'] = jsonInterpret;
} else { // NODEJS
    global['jsonInterpret'] = jsonInterpret;
}
