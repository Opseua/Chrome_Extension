let variavelGlobal;
import('../recursos/variavelGlobal.js').then(module => {
    variavelGlobal = module.default;
});

// *******************************************************

async function definirTagComando(inf) {

    const variavel_global = JSON.parse(localStorage.getItem('variavel_global'));

    if (inf.title === undefined) {
        var inf1 = 'ntf';
        var inf2 = 'gal';
        var inf3 = '';
    } else {
        if (inf.title.match(/\[/) && inf.title.match(/\]/)) {
            var split = inf.title.replace('[', '').split(']')
            var inf3 = (split[1] == '') ? '' : `${split[1]}`;
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

    let com = 'VAZIO';
    if (inf.message === undefined) {
        com = `[#comando]\n\n[#com]${com}[#/com]\n\n[#/comando]`;
    } else if ((inf.message.match(/\[#comando\]/)) && (inf.message.match(/\[#\/comando\]/))) {
        const matches = inf.message.match(/\[#comando\]([\s\S]*?)\[#\/comando\]/s);
        var m = matches[1].match(/\[#\/(.*?)\]/g);
        com = `[#comando]${matches[1]}[#/comando]`;
    }
    else {
        var pad = variavel_global.comandos.includes(inf.message.toLowerCase()) ? true : false;
        com = pad ? `[#com]${inf.message}[#/com]` : `[#cli]${inf.message}[#/cli]`;
        var m = com.match(/\[#\/(.*?)\]/g);
        com = `[#comando]\n\n${com}\n\n[#/comando]`;
    };
    const r = m ? m.map((a) => a.slice(3, -1)) : [];

    const definir_tag_comandos = {
        ori: inf1,
        des: inf2,
        tit: inf3,
        titulo: `[${inf1}>${inf2}]${inf3}`,
        tex: com,
        tag: r,
        pad: pad,
        goo: r.includes('ico') ? variavel_global : undefined,
    }

    return definir_tag_comandos
}

export default definirTagComando

