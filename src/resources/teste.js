await import('./@functions.js');

const infCommandLine = { 'background': true, 'command': 'notepad' } // 'background' 'false' → CODIGO FICA PRESO ATE TERMINAR O PROCESSO 
const retCommandLine = await commandLine(infCommandLine)
console.log(retCommandLine)