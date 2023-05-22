let definirTagComando;
import('../recursos/definirTagComando.js').then(module => {
  definirTagComando = module.default;
});

let comando2;
import('../scripts/comando2.js').then(module => {
  comando2 = module.default;
});

// *******************************************************

async function apiNovaInformacao(inf) {

  //console.log('NOVA INFORMACAO: 1');
  const comando_tag_comando = await DefinirTagComando(inf);
  //console.log('NOVA INFORMACAO: 2');

  if (comando_tag_comando.des == 'chr') {
    //console.log('NOVA INFORMACAO: EXECUTANDO');
    comando2(comando_tag_comando);
  }

}

export default apiNovaInformacao






