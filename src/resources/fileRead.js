// const retFileRead = await fileRead('D:/ARQUIVOS/BIBLIOTECAS/1_PROJETOS/Chrome_Extension/src/teste.txt')
// console.log(retFileRead)

async function fileRead(inf) {
    try {
        const ret = await fetch(`file:///${inf}`);
        return await ret.text();
    } catch (error) {
        return 'ERRO AO LER ARQUIVO \nExemplo de como usar ↓ \n"D:/ARQUIVOS/arquivo.txt"';
    }
}

export { fileRead }
