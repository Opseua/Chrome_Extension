let Api;
import('../recursos/Api.js').then(module => {
  Api = module.default;
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

  console.log('COMANDO 1: EXECUTANDO');
  const texto_prompt = await Prompt(`GALAXY`);

  if (texto_prompt) {
    const atalho =
    {
      atalho: inf.atalho,
      comando: inf.comando,
      texto_prompt: texto_prompt,
      ori: 'chr',
      des: 'gal'
    };

    const req = {
      url: `https://ntfy.sh/OPSEUA`,
      method: 'POST',
      headers: { 'Content-Type': 'text/plain', 'title': `[chr>gal]` },
      body:
      `
      ${atalho.texto_prompt}
      `
    }

    await Api(req);
  }


}

export default Comando1 