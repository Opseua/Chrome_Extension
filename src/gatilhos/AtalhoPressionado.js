let Comando1;
import('../scripts/Comando1.js').then(module => {
  Comando1 = module.default;
});

let Comando2;
import('../scripts/Comando2.js').then(module => {
  Comando2 = module.default;
});

let Notificacao;
import('../recursos/Notificacao.js').then(module => {
  Notificacao = module.default;
});

let SalvarArquivo;
import('../recursos/SalvarArquivo.js').then(module => {
  SalvarArquivo = module.default;
});

let Network;
import('../recursos/Network.js').then(module => {
  Network = module.default;
});

let Api;
import('../recursos/Api.js').then(module => {
  Api = module.default;
});

let BuscarAba;
import('../recursos/BuscarAba.js').then(module => {
  BuscarAba = module.default;
});

// *******************************************************

async function AtalhoPressionado(inf) {

console.log("OK");
return


  // ######################### ATALHO1
  if (inf.comando == 'atalho_1') {
    //console.log('ATALHO 1: EXECUTANDO');
    Comando1(inf);
    return
  };

  // ######################### ATALHO2
  if (inf.comando == 'atalho_2') {
    console.log('VARIAVEL GLOBAL LIMPA!');
    localStorage.removeItem('variavel_global');
    VariavelGlobal();
    return
  };










  console.log('ACAO DO ATALHO NAO DEFINIDA');

}

export default AtalhoPressionado