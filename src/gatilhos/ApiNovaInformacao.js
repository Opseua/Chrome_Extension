const definirTagComando = async (i) => (await import('../recursos/definirTagComando.js')).definirTagComando(i);
const comando2 = async (i) => (await import('../scripts/comando2.js')).comando2(i);

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






