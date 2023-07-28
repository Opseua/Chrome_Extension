// await import('./model.js');

async function model(inf) {
    let ret = { 'ret': false };
    try {
        // CODIGO AQUI
        ret['ret'] = true;
        ret['msg'] = `MODEL: OK`;
        ret['res'] = `resposta aqui`;

    } catch (e) {
        ret['msg'] = regexE({ 'e': e }).res
    }

    if (!ret.ret) { console.log(ret.msg) }
    return ret
}

export { model }

if (typeof window !== 'undefined') { // CHOME
    window['model'] = model;
} else if (typeof global !== 'undefined') { // NODE
    global['model'] = model;
}