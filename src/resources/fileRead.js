// const retFileRead = await fileRead('D:/ARQUIVOS/BIBLIOTECAS/1_PROJETOS/Chrome_Extension/src/teste.txt')
// console.log(retFileRead)

async function fileRead(inf) {
    const ret = { ret: false };

    try {
        const retFetch = await fetch(`file:///${inf}`);
        ret['ret'] = true;
        ret['msg'] = `LER ARQUIVO: OK`;
        ret['res'] = await retFetch.text();
    } catch (error) {
        ret['msg'] = `LER ARQUIVO: ERRO | ${error}`;
    }

    //console.log(ret.msg);
    return ret;
}

export { fileRead }
