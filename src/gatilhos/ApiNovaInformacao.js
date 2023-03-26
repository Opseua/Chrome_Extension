let Comando2;
import('../scripts/Comando2.js').then(module => {
  Comando2 = module.default;
});

// *******************************************************

async function ApiNovaInformacao(inf) {

  if (inf.title === undefined) {
    var inf1 = 'ntf';
    var inf2 = 'gal';
    var inf3 = null;
  } else {
    if (inf.title.match(/\]/)) {
      var split = inf.title.replace('[', '').split(']')
      var inf3 = (split[1] == '') ? null : `${split[1]}`;
      var split = split[0].split('>')
      var inf1 = split[0];
      var inf2 = split[1];
    }
    if (!inf.title.match(/\]/)) {
      var inf1 = 'ntf';
      var inf2 = 'gal';
      var inf3 = `${inf.title}`;
    }
  }

  const nova_men = {
    ori: inf1,
    des: inf2,
    tit: inf3,
    tex: (inf.message === undefined) ? null : `${inf.message}`
  }

  console.log(`NOVA INFORMACAO: [${nova_men.ori}>${nova_men.des}]\n${nova_men.tit}\n${nova_men.tex}`);

  if (nova_men.des == 'chr') {
    Comando2(nova_men)
  }


}

export default ApiNovaInformacao