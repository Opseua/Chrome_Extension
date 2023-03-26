let Comando1;
import('../scripts/Comando1.js').then(module => {
  Comando1 = module.default;
});

// *******************************************************

async function AtalhoPressionado(inf) {

  // ######################### ATALHO1
  if (inf.comando == 'atalho_1') {

    console.log('ATALHO 1: EXECUTANDO');
    Comando1(inf);
    return

  }













  console.log('ACAO DO ATALHO NAO DEFINIDA');

}

export default AtalhoPressionado