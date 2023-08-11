await import('./functions.js');

let infFile = {
    'action': 'write',
    'file': `D:/ARQUIVOS/PROJETOS/Chrome_Extension/aaaarquivo.txt`,
    'rewrite': true, // 'true' adiciona no MESMO arquivo, 'false' cria outro em branco
    'text': `🟢`
};
let retFileInf = await file(infFile);
console.log(retFileInf)

// infFile = {
//     'action': 'read',
//     'file': `D:/ARQUIVOS/PROJETOS/Chrome_Extension/aaaarquivo.txt`,
// };
// retFileInf = await file(infFile);
// console.log(retFileInf)