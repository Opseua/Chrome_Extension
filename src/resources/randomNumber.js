// let infRandom, retRandom
// infRandom = { 'e': e, 'min': 3, 'max': 10, 'await': true };
// retRandom = await randomNumber(infRandom); console.log(retRandom)

let e = import.meta.url, ee = e;
async function randomNumber(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    try {
        let min = inf.min;
        let max = inf.max;
        let message = inf.await ? true : false
        let number = Math.floor(Math.random() * (max - min + 1) + min) * 1000;
        if (message) {
            logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `AGUARDANDO: ${number / 1000} SEGUNDOS` });
            await new Promise(resolve => setTimeout(resolve, number));
        }
        ret['res'] = number / 1000;
        ret['msg'] = `RANDON: OK`;
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
    window['randomNumber'] = randomNumber;
} else { // NODEJS
    global['randomNumber'] = randomNumber;
}
