// let objeto = { 'chave1': { 'chave2': { 'chave3': 'VALOR' } } }; // 'logFun': true,
// let infHasKey, retHaskey
// infHasKey = { 'simple': true, 'key': 'chave3', 'obj': objeto };
// retHaskey = hasKey(infHasKey);
// console.log(retHaskey)

let e = import.meta.url;
function hasKey(inf) { // NÃO POR COMO 'async'!!!
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    // if (catchGlobal) {
    //     const errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; let retRegexE = await regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
    //     if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
    //     else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    // }
    try {
        function hk(key, obj) {
            // if (obj.hasOwnProperty(key)) {
            if (key in obj) {
                return true
            };
            for (let prop in obj) {
                if (typeof obj[prop] === 'object' && obj[prop] !== null) {
                    if (hk(key, obj[prop])) {
                        return true
                    }
                }
            };
            return false
        };
        if (inf.simple) {
            let res = hk(inf.key, typeof inf.obj === 'object' ? inf.obj : JSON.parse(inf.obj))
            return res ? true : false
        } else {
            let res = hk(inf.key, typeof inf.obj === 'object' ? inf.obj : JSON.parse(inf.obj))
            ret['res'] = res ? true : false
            ret['msg'] = `HAS KEY: OK`;
            ret['ret'] = true
        }

        // ### LOG FUN ###
        if (inf && inf.logFun) {
            (async () => {
                let infFile = { 'e': e, 'action': 'write', 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }, retFile
                infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; retFile = await file(infFile);
            })()
        }
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
    window['hasKey'] = hasKey;
} else { // NODEJS
    global['hasKey'] = hasKey;
}

