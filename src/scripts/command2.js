import { clipboard } from '../resources/clipboard.js';
import { notification } from '../resources/notification.js';

// *******************************************************

async function command2(inf) {

  if (inf.tag.includes('cli')) {
    const sendCli = inf.tex.match(/\[#cli\]([\S\s]*)\[#\/cli\]/s);
    clipboard(sendCli[1]);
  }

  if (inf.tag.includes('tit') || inf.tag.includes('tex')) {
    let sendTit,sendTex,sendIco

    if (inf.tag.includes('tit')) {
       sendTit = inf.tex.match(/\[#tit\]([\S\s]*)\[#\/tit\]/s);
       sendTit = sendTit[1];
    };
    if (inf.tag.includes('tex')) {
       sendTex = inf.tex.match(/\[#tex\]([\S\s]*)\[#\/tex\]/s);
       sendTex = sendTex[1];
    };
    if (inf.tag.includes('ico')) {
       sendIco = inf.tex.match(/\[#ico\]([\S\s]*)\[#\/ico\]/s);
      if (sendIco[1].match(/base64/)) {
         sendIco2 = sendIco[1].replace('base64_', '').replace('.png', '').replace('.jpg', '')
         sendIco = inf.goo.icon.base64[sendIco2];
      } else {
         sendIco = sendIco[1]
      }
    };

    const notificar =
    {
      duration: 5,
      type: 'basic',
      title: sendTit === undefined ? undefined : sendTit,
      message: sendTex === undefined ? undefined : sendTex,
      iconUrl: sendIco === undefined ? undefined : sendIco,
      buttons: [],
    };
    //console.log('COMANDO 2: TITULO + TEXTO');
    notification(notificar)
    console.log('notification: TITULO + TEXTO');

  }










  //console.log('NENHUM COMANDO ENCONTRADO')
};
export { command2 }

