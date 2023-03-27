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


    if (inf.tag.includes('cli')) {
      const send_clip = inf.tex.match(/\[#cli\](.*?)\n?\[#\/cli\]/s);
      AreaDeTransferencia(send_clip[1]);
    }
    if (inf.tag.includes('tit') && inf.tag.includes('tex')) {
      console.log('NOTIFICACAO: TITULO + TEXTO');
    } else if (inf.tag.includes('tit')) {
      console.log('NOTIFICACAO: SO TITULO');
      removeEventListener
    } else if (inf.tag.includes('tex')) {
      console.log('NOTIFICACAO: SO TEXTO');
    }

  };


  //console.log('NENHUM COMANDO ENCONTRADO')
}

export default Comando2