// let infTranslate, retTranslate // 'logFun': true,
// infTranslate = { 'source': 'auto', 'target': 'pt', 'text': `Hi, what your name?` };
// retTranslate = await translate(infTranslate);
// console.log(retTranslate)

let e = import.meta.url;
async function translate(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        const errs = async (err, ret) => { if (!ret.stop) { ret['stop'] = true; let retRegexE = await regexE({ 'e': err, 'inf': inf, 'catchGlobal': true }) } }
        if (typeof window !== 'undefined') { window.addEventListener('error', (err) => errs(err, ret)); window.addEventListener('unhandledrejection', (err) => errs(err, ret)) }
        else { process.on('uncaughtException', (err) => errs(err, ret)); process.on('unhandledRejection', (err) => errs(err, ret)) }
    }
    try {
        let infApi = {
            method: 'GET',
            url: `https://translate.google.com/m?sl=${inf.source}&tl=${inf.target}&q=${encodeURIComponent(inf.text)}&hl=pt-BR`,
            headers: {}
        };
        let retApi = await api(infApi); if (!retApi.ret) { return retApi } else { retApi = retApi.res }
        let res = retApi.body;
        let retRegex = regex({ 'pattern': 'class="result-container">(.*?)</div>', 'text': res });
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
        ret['msg'] = `TRANSLATE: OK`
        ret['ret'] = true;

        // ### LOG FUN ###
        if (inf && inf.logFun) {
            let infFile = { 'e': e, 'action': 'write', 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }, retFile
            infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; retFile = await file(infFile);
        }
    } catch (e) {
        let retRegexE = await regexE({ 'inf': inf, 'e': e, 'catchGlobal': false });
        ret['msg'] = retRegexE.res
    };
    return {
        ...({ ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}

if (eng) { // CHROME
    window['translate'] = translate;
} else { // NODEJS
    global['translate'] = translate;
}
