// let infTranslate, retTranslate // 'logFun': true,
// infTranslate = { 'e': e, 'source': 'auto', 'target': 'pt', 'text': `Hi, what your name?` };
// retTranslate = await translate(infTranslate);
// console.log(retTranslate)

let e = import.meta.url, ee = e
async function translate(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        let errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
    try {
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
        ret['msg'] = `TRANSLATE: OK`
        ret['ret'] = true;

        // ### LOG FUN ###
        if (inf && inf.logFun) {
            let infFile = { 'e': e, 'action': 'write', 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }
            infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; file(infFile);
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
