// const { fileRead } = await import('./fileRead.js');
// const retFileRead = await fileRead('D:/ARQUIVOS/PROJETOS/Chrome_Extension/src/teste.txt')
// console.log(retFileRead)

async function fileRead(inf) {
    let ret = { 'ret': false };
    try {
        const retFetch = await fetch(`file:///${inf}`);

        ret['ret'] = true;
        ret['msg'] = `FILE READ: OK`;
        ret['res'] = await retFetch.text();
    } catch (e) {
        ret['msg'] = regexE({ 'e': e }).res;
    }

    if (!ret.ret) { console.log(ret.msg) }
    return ret;
}

// export { fileRead }
