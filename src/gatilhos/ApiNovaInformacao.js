let DefinirTagComando;
import('../recursos/DefinirTagComando.js').then(module => {
  DefinirTagComando = module.default;
});

let Comando2;
import('../scripts/Comando2.js').then(module => {
  Comando2 = module.default;
});

// *******************************************************

async function ApiNovaInformacao(inf) {

  //console.log('NOVA INFORMACAO: 1');
  const comando_tag_comando = await DefinirTagComando(inf);
  //console.log('NOVA INFORMACAO: 2');

  if (comando_tag_comando.des == 'chr') {
    //console.log('NOVA INFORMACAO: EXECUTANDO');
    Comando2(comando_tag_comando);
  }

}

export default ApiNovaInformacao