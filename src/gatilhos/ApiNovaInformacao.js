const { definirTagComando } = await import('../recursos/definirTagComando.js');
const { comando2 } = await import('../scripts/comando2.js');

// *******************************************************

async function apiNovaInformacao(inf) {

  //console.log('NOVA INFORMACAO: 1');
  const comando_tag_comando = await definirTagComando(inf);
  //console.log('NOVA INFORMACAO: 2');

  if (comando_tag_comando.des == 'chr') {
    //console.log('NOVA INFORMACAO: EXECUTANDO');
    comando2(comando_tag_comando);
  }

}

export { apiNovaInformacao }






