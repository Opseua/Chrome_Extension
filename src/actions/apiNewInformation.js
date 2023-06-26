// const { setTag } = await import('../resources/setTag.js');
// const { command2 } = await import('../scripts/command2.js');
import { setTag } from '../resources/setTag.js';
import { command2 } from '../scripts/command2.js';

// *******************************************************

async function apiNewInformation(inf) {

  //console.log('NOVA INFORMACAO: 1');
  const comando_tag_comando = await setTag(inf);
  //console.log('NOVA INFORMACAO: 2');

  if (comando_tag_comando.des == 'chr') {
    //console.log('NOVA INFORMACAO: EXECUTANDO');
    command2(comando_tag_comando);
  }

}

export { apiNewInformation }






