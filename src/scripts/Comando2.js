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

async function Comando2(inf) {
  //console.log('COMANDO 2: EXECUTANDO');

  if (inf.tag.includes('cli')) {
    const send_cli = inf.tex.match(/\[#cli\](.*?)\n?\[#\/cli\]/s);
    AreaDeTransferencia(send_cli[1]);
  }

  if (inf.tag.includes('tit') || inf.tag.includes('tex')) {

    if (inf.tag.includes('tit')) {
      var send_tit = inf.tex.match(/\[#tit\](.*?)\n?\[#\/tit\]/s);
      var send_tit = send_tit[1];
    };
    if (inf.tag.includes('tex')) {
      var send_tex = inf.tex.match(/\[#tex\](.*?)\n?\[#\/tex\]/s);
      var send_tex = send_tex[1];
    };
    if (inf.tag.includes('ico')) {
      var send_ico = inf.tex.match(/\[#ico\](.*?)\n?\[#\/ico\]/s);
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
    Notificacao(notificar)
    console.log('NOTIFICACAO: TITULO + TEXTO');

  }

};


//console.log('NENHUM COMANDO ENCONTRADO')

export default Comando2













































/* async function Comando2(inf) {
  //console.log('COMANDO 2: EXECUTANDO');
  

  if (inf.tag.includes('com') && inf.tag.length == 1) {
    const tag = inf.tex.match(/\[#com\]([^,]*[\n]?.*?)\[#\/com\]/);
    const com = tag[1].toLowerCase();

    if (com == 'c') {
      console.log('COMANDO: PEGAR ÁREA DE TRANSFERENCIA');
      return
    };
    if (com == 'claro') {
      console.log('COMANDO: CLARO');
      return
    }
    if (com == 'x' || com == 'telegram' || com == 'fechar') {
      console.log('COMANDO: TELEGRAM');
      return
    }



  }
  else if (inf.tag.includes('cli') && inf.tag.length == 1) {

    console.log('COMANDO: MANDAR PARA ÁREA DE TRANSFERENCIA');
    return

  } else {

    const send_tit = inf.tex.match(/\[#tit\](.*?)\n?\[#\/tit\]/s);
    const send_tex = inf.tex.match(/\[#tex\](.*?)\n?\[#\/tex\]/s);
    const send_cli = inf.tex.match(/\[#cli\](.*?)\n?\[#\/cli\]/s);
    const send_ico = inf.tex.match(/\[#ico\](.*?)\n?\[#\/ico\]/s);

    if (inf.tag.includes('cli')) {
      AreaDeTransferencia(send_cli[1]);
    }
    if (inf.tag.includes('tit') || inf.tag.includes('tex')) {

      var notificar =
      {
        tempo: 5,
        type: 'basic',
        title: (send_tit === null) ? undefined : `${send_tit[1]}`,
        message: (send_tex === null) ? undefined : `${send_tex[1]}`,
        iconUrl: (send_ico === null) ? undefined : `${send_ico[1]}`,
        buttons: [],
      };
      Notificacao(notificar)
      console.log('NOTIFICACAO: TITULO + TEXTO');

    }

  };


  //console.log('NENHUM COMANDO ENCONTRADO')
}

export default Comando2 */