// *************** EXPORTAR GLOBALMENTE PRIMEIRO NO '@functions' ***************
// let infGlobal = { 'var1': 'LUA', 'var2': 'SOL' }

// window['infGlobal'] = infGlobal;
// global['infGlobal'] = infGlobal;
// *****************************************************************************

// infGlobal['var1'] = 'LUA'; infGlobal['var2'] = 'SOL';
// let json = `{ "nasa": "Tanto a $[var1] quanto o $[var2] são redondos" }`;
// let infJsonInterpret = { 'json': json, 'vars': infGlobal };
// let retJsonInterpret = await jsonInterpret(infJsonInterpret)
// console.log(retJsonInterpret)

async function jsonInterpret(inf) {
    let ret = { 'ret': false };
    try {
        let json = JSON.stringify(inf.json);
        let res = json.replace(/\$\[(.*?)\]/g, (match, p1) => infGlobal[p1])
        ret['res'] = res;
        ret['msg'] = `JSON INTERPRET: OK`;
        ret['ret'] = true;
    } catch (e) {
        let m = await regexE({ 'e': e });
        ret['msg'] = m.res
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
