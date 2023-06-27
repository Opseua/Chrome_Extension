import { clipboard } from '../resources/clipboard.js';
import { notification } from '../resources/notification.js';

// *******************************************************

async function command2(inf) {

  if (inf.tag.includes('cli')) {
    const send_cli = inf.tex.match(/\[#cli\]([\S\s]*)\[#\/cli\]/s);
    clipboard(send_cli[1]);
  }

  if (inf.tag.includes('tit') || inf.tag.includes('tex')) {

    if (inf.tag.includes('tit')) {
      var send_tit = inf.tex.match(/\[#tit\]([\S\s]*)\[#\/tit\]/s);
      var send_tit = send_tit[1];
    };
    if (inf.tag.includes('tex')) {
      var send_tex = inf.tex.match(/\[#tex\]([\S\s]*)\[#\/tex\]/s);
      var send_tex = send_tex[1];
    };
    if (inf.tag.includes('ico')) {
      var send_ico = inf.tex.match(/\[#ico\]([\S\s]*)\[#\/ico\]/s);
      if (send_ico[1].match(/base64/)) {
        var send_ico_2 = send_ico[1].replace('base64_', '').replace('.png', '').replace('.jpg', '')
        var send_ico = inf.goo.icon.base64[send_ico_2];
      } else {
        var send_ico = send_ico[1]
      }
    };

    var notificar =
    {
      tempo: 5,
      type: 'basic',
      title: send_tit === undefined ? undefined : send_tit,
      message: send_tex === undefined ? undefined : send_tex,
      iconUrl: send_ico === undefined ? undefined : send_ico,
      buttons: [],
    };
    //console.log('COMANDO 2: TITULO + TEXTO');
    notification(notificar)
    console.log('notification: TITULO + TEXTO');

  }










  //console.log('NENHUM COMANDO ENCONTRADO')
};
export { command2 }

