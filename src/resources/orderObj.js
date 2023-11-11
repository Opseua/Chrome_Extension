// const infOrderObj = { 'd': 'VALOR 4', 'c': 'VALOR 3', 'b': 'VALOR 2', 'a': 'VALOR 1' }
// const retOrderObj = await orderObj(infOrderObj)
// console.log(retOrderObj)

async function orderObj(inf) {
    (async () => { await import('./@functions.js') })()
    let ret = { 'ret': false }; try {
        ret['res'] = Object.fromEntries(Object.entries(inf).sort((a, b) => a[0].localeCompare(b[0])))
        ret['ret'] = true;
        ret['msg'] = `ORDEROBJ: OK`;
    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; return ret
}

if (dev) { // CHROME
    window['orderObj'] = orderObj;
} else { // NODEJS
    global['orderObj'] = orderObj;
}