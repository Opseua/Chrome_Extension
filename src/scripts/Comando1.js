const { api } = await import('../recursos/api.js');
const { definirTagComando } = await import('../recursos/definirTagComando.js');
const { promptChrome } = await import('../recursos/promptChrome.js');

// *******************************************************

async function comando1(inf) {
  //console.log('COMANDO 1: EXECUTANDO');

  const texto_prompt = await promptChrome(`GALAXY`);

  if (texto_prompt) {

    const comando = {
      title: '[chr>gal]',
      message: texto_prompt,
    }

    const comando_tag_comando = await definirTagComando(comando);

    const texto = ''
    const req = {
      url: `https://ntfy.sh/OPSEUA`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'title': `${comando_tag_comando.titulo}` },
      body: comando_tag_comando.tex
    }

    await api(req);

  }

}
export { comando1 }
