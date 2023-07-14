//import { setTag } from '../resources/setTag.js';
const { setTag } = await import('../resources/setTag.js');
//import { command2 } from '../scripts/command2.js';
const { command2 } = await import('../scripts/command2.js');

// *******************************************************

async function apiNewInformation(inf) {

  //console.log('NOVA INFORMACAO: 1');
  const retSetTag = await setTag(inf);
  //console.log('NOVA INFORMACAO: 2');

  if (retSetTag.des == 'chr') {
    //console.log('NOVA INFORMACAO: EXECUTANDO');
    command2(retSetTag);
  }

}

export { apiNewInformation }






