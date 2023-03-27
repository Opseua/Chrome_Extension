let Api;
import('../recursos/Api.js').then(module => {
    Api = module.default;
});

// *******************************************************

async function DefinirTagComando(inf) {

    //console.log('DEFINIR TAG E COMANDO: EXECUTANDO');

    if (localStorage.getItem('variavel_global') == null) {
        console.log('VARIAVEL GLOBAL: NAO DEFINIDA')
        const inf = {
            url: `https://banco-de-dados-9bc75-default-rtdb.firebaseio.com/tasker.json`,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            body: { 'tags': ['1', '2', '3'] }
        }
        const real_time = await Api(inf);
        window.localStorage.setItem('variavel_global', JSON.stringify(real_time.comandos_tasker));
    } else {
        //console.log('VARIAVEL GLOBAL: DEFINIDA')
    }

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
        const matches = inf.message.match(/\[#comando\]([^,]*[\n]?.*?)\[#\/comando\]/);
        var m = matches[1].match(/\[#\/(.*?)\]/g);
        com = `[#comando]${matches[1]}[#/comando]`;
    }
    else {
        var pad = localStorage.getItem('variavel_global').includes(inf.message.toLowerCase()) ? true : false;
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
    }

    return definir_tag_comandos
}

export default DefinirTagComando 