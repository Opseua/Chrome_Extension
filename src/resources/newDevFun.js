async function newDevFun(inf) {
    await import('./@functions.js');
    let ret = { 'ret': false };
    try {

        console.log('newDevFun', inf)

    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; return ret
}

if (typeof window !== 'undefined') { // CHROME
    window['newDevFun'] = newDevFun;
} else { // NODEJS
    global['newDevFun'] = newDevFun;
}