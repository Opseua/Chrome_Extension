// // 'write' → 'true' ESCREVE NO 'PROJECT/log/JavaScript/log.txt' A MENSAGEM (ASYNC NÃO!!!)
// logConsole({ 'e': e, 'write': false, 'msg': `Mensagem do console` });

let e = import.meta.url;
function logConsole(inf) { // NÃO POR COMO 'async'!!!
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    try {
        if (catchGlobal) {
            let errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; let retRegexE = await logConsoleE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
            if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
            else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
        }

        let time = dateHour().res;
        console.log(`${time.hou}:${time.min}:${time.sec} | ${inf.msg}`)
        if (!eng && inf.write) {
            (async () => {
                await log({ 'e': inf.e, 'folder': 'JavaScript', 'path': `log.txt`, 'text': inf.msg })
            })()
        }
        ret['msg'] = `LOG CONSOLE: OK`;
        ret['ret'] = true;

        // ### LOG FUN ###
        if (inf && inf.logFun) {
            (async () => {
                let infFile = { 'e': e, 'action': 'write', 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }, retFile
                infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; retFile = await file(infFile);
            })()
        }
    } catch (e) {
        (async () => {
            let retRegexE = await logConsoleE({ 'inf': inf, 'e': e, 'catchGlobal': false });
            ret['msg'] = retRegexE.res
        })()
    };
    return {
        ...({ ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}

if (eng) { // CHROME
    window['logConsole'] = logConsole;
} else { // NODEJS
    global['logConsole'] = logConsole;
}


