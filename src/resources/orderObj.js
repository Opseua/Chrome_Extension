// let infOrderObj, retOrderObj // 'logFun': true,
// infOrderObj = { 'e': e, 'd': 'VALOR 4', 'c': 'VALOR 3', 'b': 'VALOR 2', 'a': 'VALOR 1' }
// retOrderObj = await orderObj(infOrderObj)
// console.log(retOrderObj)

let e = import.meta.url, ee = e;
async function orderObj(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    try {
        ret['res'] = Object.fromEntries(Object.entries(inf).sort((a, b) => a[0].localeCompare(b[0])))
        ret['msg'] = `ORDEROBJ: OK`;
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
    window['orderObj'] = orderObj;
} else { // NODEJS
    global['orderObj'] = orderObj;
}
