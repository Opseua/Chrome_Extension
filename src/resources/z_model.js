async function model(inf) {
    await import('./@functions.js');
    let ret = { 'ret': false };
    try {
        if (typeof window !== 'undefined') { // [ENCAMINHAR PARA DEVICE → NODEJS]
            const infDevAndFun = { 'name': 'commandLine', 'retInf': inf.retInf, 'par': { 'url': inf.url, 'command': inf.command } }
            const retDevAndFun = await devAndFun(infDevAndFun); return retDevAndFun
        };
        ret['ret'] = true;
        ret['msg'] = `MODEL: OK`;
        ret['res'] = `resposta aqui`;
    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; return ret
}

if (typeof window !== 'undefined') { // CHROME
    window['model'] = model;
} else { // NODEJS
    global['model'] = model;
}