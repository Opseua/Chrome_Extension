let comando1;
import('../scripts/comando1.js').then(module => {
  comando1 = module.default;
});

let comando2;
import('../scripts/comando2.js').then(module => {
  comando2 = module.default;
});

let notificacao;
import('../recursos/notificacao.js').then(module => {
  notificacao = module.default;
});

let variavelGlobal;
import('../recursos/variavelGlobal.js').then(module => {
  variavelGlobal = module.default;
});

// *******************************************************

async function atalhoPressionado(inf) {

  // ######################### ATALHO1
  if (inf.comando == 'atalho_1') {
    //console.log('ATALHO 1: EXECUTANDO');
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

export default atalhoPressionado