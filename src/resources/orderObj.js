// let infOrderObj, retOrderObj // 'logFun': true,
// infOrderObj = { 'd': 'VALOR 4', 'c': 'VALOR 3', 'b': 'VALOR 2', 'a': 'VALOR 1' }
// retOrderObj = await orderObj(infOrderObj)
// console.log(retOrderObj)

let e = import.meta.url;
async function orderObj(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        const errs = async (err, ret) => { if (!ret.stop) { ret['stop'] = true; let retRegexE = await regexE({ 'e': err, 'inf': inf, 'catchGlobal': true }) } }
        if (typeof window !== 'undefined') { window.addEventListener('error', (err) => errs(err, ret)); window.addEventListener('unhandledrejection', (err) => errs(err, ret)) }
        else { process.on('uncaughtException', (err) => errs(err, ret)); process.on('unhandledRejection', (err) => errs(err, ret)) }
    }
    try {
        // ret['res'] = Object.fromEntries(Object.entries(inf).sort((a, b) => a[0].localeCompare(b[0])))
        // ret['msg'] = `ORDEROBJ: OK`;
        // ret['ret'] = true;

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

// if (eng) { // CHROME
//     window['orderObj'] = orderObj;
// } else { // NODEJS
//     global['orderObj'] = orderObj;
// }
export default orderObj;


const quemChamou = () => {
    const erro = new Error();
    const linhasPilha = erro.stack.split('\n');
    const chamador = linhasPilha[2].trim();
    console.log('QUEM CHAMOU FOI', chamador);
};

export { quemChamou };