// // 'write' → 'true' ESCREVE NO 'PROJECT/log/JavaScript/log.txt' A MENSAGEM (ASYNC NÃO!!!)
// logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `[api] Mensagem do console` });

let e = import.meta.url
async function logConsole(inf) { // NÃO POR COMO 'async'!!!
    let ret = { 'ret': false }, ee = inf && inf.ee ? inf.ee : e; e = inf && inf.e ? inf.e : e;
    try {
        if (catchGlobal) {
            let errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; let retRegexE = await logConsoleE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
            if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
            else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
        }

        let time = dateHour().res;
        let fileCall = ee.split('/').pop().replace('.js', '')
        console.log(`→ ${time.day}/${time.mon} ${time.hou}:${time.min}:${time.sec}.${time.mil} [${fileCall}]\n${inf.msg}\n`)
        if (!eng && inf.write) {
            await log({ 'e': e, 'folder': 'JavaScript', 'path': `log.txt`, 'text': inf.msg })
        }
        ret['msg'] = `LOG CONSOLE: OK`;
        ret['ret'] = true;

        // ### LOG FUN ###
        if (inf && inf.logFun) {
            let infFile = { 'e': e, 'action': 'write', 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }
            infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; file(infFile);
        }
    } catch (e) {
        regexE({ 'inf': inf, 'e': e, 'catchGlobal': false });
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


