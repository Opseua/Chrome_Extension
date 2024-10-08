// let infGoogleTranslate, retGoogleTranslate
// infGoogleTranslate = { 'e': e, 'source': 'auto', 'target': 'pt', 'text': `Hi, what your name?` };
// retGoogleTranslate = await googleTranslate(infGoogleTranslate); console.log(retGoogleTranslate)

let e = import.meta.url, ee = e;
async function googleTranslate(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    try {
        // IMPORTAR BIBLIOTECA [NODEJS]
        if (typeof _cheerio === 'undefined') { await functionImportLibrary({ 'lib': '_cheerio' }); };

        let infApi = {
            'e': e,
            method: 'GET',
            url: `https://translate.google.com/m?sl=${inf.source}&tl=${inf.target}&q=${encodeURIComponent(inf.text)}&hl=pt-BR`,
            headers: {}
        };
        let retApi = await api(infApi); if (!retApi.ret) { return retApi } else { retApi = retApi.res }
        let res = retApi.body;
        let retRegex = regex({ 'e': e, 'pattern': 'class="result-container">(.*?)</div>', 'text': res });
        if (!retRegex.ret) {
            return ret
        };
        let dom, $
        if (eng) { // CHROME
            dom = new DOMParser().parseFromString(retRegex.res['3'], "text/html").documentElement.textContent
        } else { // NODEJS
            $ = _cheerio.load(retRegex.res['3']);
            dom = _cheerio.load($('body').html())('body').text()
        }
        ret['res'] = dom;
        ret['msg'] = `GOOGLE TRANSLATE: OK`
        ret['ret'] = true;

    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res;
    }; return { ...({ ret: ret.ret }), ...(ret.msg && { msg: ret.msg }), ...(ret.res && { res: ret.res }), };
};

// CHROME | NODEJS
(eng ? window : global)['googleTranslate'] = googleTranslate;