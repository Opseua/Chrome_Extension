// const { translate } = await import('./translate.js');
// const infTranslate = { 'source': 'auto', 'target': 'pt', 'text': 'Hi' };
// const retTranslate = await translate(infTranslate)
// console.log(retTranslate)

const { api } = await import('./api.js');

async function translate(inf) {
    let ret = { 'ret': false };
    try {

        const text = 'Olá';
        const infApi = {
            url: `https://translate.google.com/m?sl=${inf.source}&tl=${inf.target}&q=${encodeURIComponent(inf.text)}&hl=pt-BR`,
            method: 'GET',
            headers: {}
        };

        const retApi = await api(infApi);
        const html = retApi.res.body;
        const regex = /<div class="result-container">(.*?)<\/div>/;
        const match = html.match(regex);
        if (match && match[1]) {
            ret['ret'] = true;
            ret['msg'] = `TRANSLATE: OK`;
            ret['res'] = match[1];
        } else {
            ret['msg'] = `TRANSLATE: ERRO | TAG NAO ENCONTRADA`;
        }

    } catch (e) {
        ret['msg'] = `TRANSLATE: ERRO | ${e}`;
    }

    if (!ret.ret) { console.log(ret.msg) }
    return ret
}

export { translate }

if (typeof window !== 'undefined') { // CHOME
    window['translate'] = translate;
} else if (typeof global !== 'undefined') { // NODE
    global['translate'] = translate;
}