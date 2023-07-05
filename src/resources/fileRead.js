// const teste = await fileRead('D:/ARQUIVOS/BIBLIOTECAS/1_PROJETOS/Chrome_Extension/src/teste.txt')
// console.log(teste)

async function fileRead(file) {
    try {
        const response = await fetch(`file:///${file}`);
        return await response.text();
    } catch (error) {
        return 'ERRO AO LER ARQUIVO \nExemplo de como usar ↓ \n"D:/ARQUIVOS/arquivo.txt"';
    }
}

export { fileRead }
