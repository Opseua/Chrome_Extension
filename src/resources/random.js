// let infRandom, retRandom // 'logFun': true,
// infRandom = { 'min': 3, 'max': 10, 'await': true };
// retRandom = await random(infRandom);
// console.log(retRandom)

let e = import.meta.url;
async function random(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        const errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; let retRegexE = await regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
    try {
        let min = inf.min;
        let max = inf.max;
        let message = inf.await ? true : false
        let number = Math.floor(Math.random() * (max - min + 1) + min) * 1000;
        if (message) {
            console.log(`AGUARDANDO: ${number / 1000} SEGUNDOS`);
            await new Promise(resolve => setTimeout(resolve, number));
        }
        ret['res'] = number / 1000;
        ret['msg'] = `RANDON: OK`;
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
    window['random'] = random;
} else { // NODEJS
    global['random'] = random;
}
