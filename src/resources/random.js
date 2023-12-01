// let infRandom, retRandom // 'logFun': true,
// infRandom = { 'min': 3, 'max': 10, 'await': true };
// retRandom = await random(infRandom);
// console.log(retRandom)

async function random(inf) {
    let ret = { 'ret': false };
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
        if (inf.logFun) {
            let infFile = { 'action': 'write', 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }, retFile
            infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; retFile = await file(infFile);
        }
    } catch (e) {
        let retRegexE = await regexE({ 'inf': inf, 'e': e });
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
