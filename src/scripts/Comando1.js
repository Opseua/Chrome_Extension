let Api;
import('../recursos/Api.js').then(module => {
  Api = module.default;
});

let DefinirTagComando;
import('../recursos/DefinirTagComando.js').then(module => {
  DefinirTagComando = module.default;
});

let AreaDeTransferencia;
import('../recursos/AreaDeTransferencia.js').then(module => {
  AreaDeTransferencia = module.default;
});

let Notificacao;
import('../recursos/Notificacao.js').then(module => {
  Notificacao = module.default;
});

let Prompt;
import('../recursos/Prompt.js').then(module => {
  Prompt = module.default;
});

// *******************************************************

async function Comando1(inf) {
  //console.log('COMANDO 1: EXECUTANDO');

  const texto_prompt = await Prompt(`GALAXY`);

  if (texto_prompt) {

    const comando = {
      title: '[chr>gal]',
      message: texto_prompt,
    }

    const comando_tag_comando = await DefinirTagComando(comando);

    const req = {
      url: `https://ntfy.sh/OPSEUA`,
      method: 'POST',
      headers: { 'Content-Type': 'text/plain', 'title': `${comando_tag_comando.titulo}` },
      body: comando_tag_comando.tex
    }


    await Api(req);

  }


}

export default Comando1 