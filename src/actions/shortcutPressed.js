//import { command1 } from '../scripts/command1.js';
const { command1 } = await import('../scripts/command1.js');

// *******************************************************

async function shortcutPressed(inf) {

  // ######################### ATALHO1
  if (inf.command == 'atalho_1') {
    console.log('ATALHO 1: EXECUTANDO');
    command1(inf);
    return
  };

  // ######################### ATALHO2
  if (inf.command == 'atalho_2') {
    console.log('VARIAVEL GLOBAL LIMPA!');
    localStorage.removeItem('varGlobal');
    return
  };










  console.log('ACAO DO ATALHO NAO DEFINIDA');

}

export { shortcutPressed }