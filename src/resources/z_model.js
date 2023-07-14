const { api } = await import('./api.js');

async function model(inf) {
    const ret = { 'ret': false };

    try {

        // CODIGO AQUI
        ret['ret'] = true;
        ret['msg'] = `MODEL: OK`;
        ret['res'] = `resposta aqui`;

    } catch (e) {
        ret['msg'] = `MODEL: ERRO | ${e}`
    }

    if (!ret.ret) { console.log(ret.msg) }
    return ret
}

export { model }