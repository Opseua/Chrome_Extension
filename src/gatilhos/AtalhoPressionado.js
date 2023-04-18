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

// *******************************************************

async function AtalhoPressionado(inf) {

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

  // ######################### ATALHO3
  if (inf.comando == 'atalho_3') {

    /*     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          var tab = tabs[0];
          chrome.tabs.executeScript(tab.id, { code: "document.documentElement.outerHTML" }, function (result) {
            var html = result[0];
    
            const inf = {
              nom: 'NOME_ARQUIVO.html',
              inf: html,
              typ: 'text/plain;charset=utf-8'
            }
            SalvarArquivo(inf)
    
          });
        }); */



    const valor = String.raw`ESSA \ É / " A ' INFORMACAO`;
    //const valor = { teste: 'OLA TUDO BEM' };
    const requisicao = {
      url: 'https://ntfy.sh/OPSEUA',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: valor

    };
    Api(requisicao)



    return
  };











  console.log('ACAO DO ATALHO NAO DEFINIDA');

}

export default AtalhoPressionado