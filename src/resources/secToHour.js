// let infSecToHour, retSecToHour
// infSecToHour = 65
// retSecToHour = secToHour(infSecToHour)
// console.log(retSecToHour)

let e = import.meta.url;
function secToHour(inf) { // NÃO POR COMO 'async'!!!
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        const errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; let retRegexE = await regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
    try {
        let hou = Math.floor(inf / 3600).toString().padStart(2, "0");
        let min = Math.floor((inf % 3600) / 60).toString().padStart(2, "0");
        let sec = (inf % 60).toString().padStart(2, "0");
        ret['res'] = String(`${hou}:${min}:${sec}`)
        ret['msg'] = `SEC TO HOUR: OK` // manter o 'String' para forcar o '0' (zero) na frente → '001'
        ret['ret'] = true;
    } catch (e) {
        (async () => {
            let retRegexE = await regexE({ 'inf': inf, 'e': e, 'catchGlobal': false });
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
    window['secToHour'] = secToHour;
} else { // NODEJS
    global['secToHour'] = secToHour;
}
