import { api } from '../resources/api.js';
import { setTag } from '../resources/setTag.js';
import { promptChrome } from '../resources/promptChrome.js';

// *******************************************************

async function command1(inf) {
  //console.log('COMANDO 1: EXECUTANDO');

  const texto_prompt = await promptChrome(`GALAXY`);

  if (texto_prompt) {

    const comando = {
      title: '[chr>gal]',
      message: texto_prompt,
    }

    const comando_tag_comando = await setTag(comando);

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
export { command1 }
