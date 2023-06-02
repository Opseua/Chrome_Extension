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

// let prompt;
// import('../recursos/prompt.js').then(module => {
//   prompt = module.default;
// });

import { promptChrome } from '../recursos/promptChrome.js';

// *******************************************************

async function Comando1(inf) {
  //console.log('COMANDO 1: EXECUTANDO');

  const texto_prompt = await promptChrome(`GALAXY`);

  if (texto_prompt) {

    const comando = {
      title: '[chr>gal]',
      message: texto_prompt,
    }

    const comando_tag_comando = await DefinirTagComando(comando);

    const texto = ''
    const req = {
      url: `https://ntfy.sh/OPSEUA`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'title': `${comando_tag_comando.titulo}` },
      body: comando_tag_comando.tex
    }

    await Api(req);

  }


}

export default Comando1 