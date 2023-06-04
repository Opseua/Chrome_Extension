const comando1 = async (i) => (await import('../scripts/comando1.js')).comando1(i);
const variavelGlobal = async (i) => (await import('../recursos/variavelGlobal.js')).variavelGlobal(i);

// *******************************************************

async function atalhoPressionado(inf) {

  // ######################### ATALHO1
  if (inf.comando == 'atalho_1') {
    console.log('ATALHO 1: EXECUTANDO');
    comando1(inf);
    return
  };

  // ######################### ATALHO2
  if (inf.comando == 'atalho_2') {
    console.log('VARIAVEL GLOBAL LIMPA!');
    localStorage.removeItem('variavel_global');
    variavelGlobal();
    return
  };










  console.log('ACAO DO ATALHO NAO DEFINIDA');

}

export { atalhoPressionado }