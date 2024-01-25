// async function esperar(par) {
//     await new Promise(resolve => { setTimeout(resolve, (3 * 1000)) })
//     return `${par}`;
// }

// async function run() {
//     // FUNÇÃO → 'esperar' | TEMPO MÁXIMO → '1' segundo | PARAMETRO → 'casa'
//     console.log('INICIO')
//     let retAwaitFun = await awaitFun(esperar, 1, 'casa');
//     console.log(retAwaitFun)
//     console.log('FIM')
// }
// run();

let e = import.meta.url;
async function awaitFun(fun, max, inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        let errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; let retRegexE = await regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
    try {
        let timeoutHandle;
        let timeoutPromise = new Promise(resolve => {
            timeoutHandle = setTimeout(
                () => {
                    // FUNÇÃO RESPONDEU A TEMPO [NÃO]
                    resolve(`NAO_RESPONDEU_A_TEMPO`);
                },
                max * 1000
            );
        });

        // FUNÇÃO RESPONDEU A TEMPO [SIM]
        await Promise.race([fun(inf), timeoutPromise]).then(result => {
            clearTimeout(timeoutHandle);
            if (result == 'NAO_RESPONDEU_A_TEMPO') {
                ret['msg'] = `AWAIT FUN: NÃO RESPONDEU A TEMPO`;
            } else {
                ret['ret'] = true;
                ret['msg'] = `AWAIT FUN: OK`;
                ret['res'] = result
            }
            return
        });
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
    window['awaitFun'] = awaitFun;
} else { // NODEJS
    global['awaitFun'] = awaitFun;
}