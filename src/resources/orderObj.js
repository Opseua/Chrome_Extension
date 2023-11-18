// let infOrderObj, retOrderObj
// infOrderObj = { 'd': 'VALOR 4', 'c': 'VALOR 3', 'b': 'VALOR 2', 'a': 'VALOR 1' }
// retOrderObj = await orderObj(infOrderObj)
// console.log(retOrderObj)

async function orderObj(inf) {
    await import('./@functions.js')
    let ret = { 'ret': false };
    try {
        ret['res'] = Object.fromEntries(Object.entries(inf).sort((a, b) => a[0].localeCompare(b[0])))
        ret['msg'] = `ORDEROBJ: OK`;
        ret['ret'] = true;
    } catch (e) {
        let m = await regexE({ 'e': e });
        ret['msg'] = m.res
    };
    return ret
}

if (typeof eng === 'boolean') {
    if (eng) { // CHROME
        window['orderObj'] = orderObj;
    } else { // NODEJS
        global['orderObj'] = orderObj;
    }
}