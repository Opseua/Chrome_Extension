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

  const comando_tag_comando = await DefinirTagComando(inf);

  if (comando_tag_comando.des == 'chr') {
    //console.log('NOVA INFORMACAO: EXECUTANDO');
    Comando2(comando_tag_comando);
  }

}

export default ApiNovaInformacao