// let infRandom, retRandom
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
    } catch (e) {
        let m = await regexE({ 'e': e });
        ret['msg'] = m.res
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
