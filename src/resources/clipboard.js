// let infClipboard, retClipboard // 'logFun': true,
// infClipboard = { 'value': `Esse é o texto` }
// retClipboard = await clipboard(infClipboard);
// console.log(retClipboard)

let e = import.meta.url;
async function clipboard(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        const errs = async (err, ret) => { if (!ret.stop) { ret['stop'] = true; let retRegexE = await regexE({ 'e': err, 'inf': inf, 'catchGlobal': true }) } }
        if (typeof window !== 'undefined') { window.addEventListener('error', (err) => errs(err, ret)); window.addEventListener('unhandledrejection', (err) => errs(err, ret)) }
        else { process.on('uncaughtException', (err) => errs(err, ret)); process.on('unhandledRejection', (err) => errs(err, ret)) }
    }
    try {
        if (inf.value == null || inf.value == '') {
            ret['msg'] = `\n\n #### ERRO #### CLIPBOARD \n INFORMAR O 'value' \n\n`
        } else {
            let text = inf.value;
            if (typeof text === 'object') { // OBJETO INDENTADO EM TEXTO BRUTO
                text = JSON.stringify(text, null, 2)
            }
            if (eng) { // CHROME
                let element = document.createElement('textarea');
                element.value = text; document.body.appendChild(element);
                element.select(); document.execCommand('copy');
                document.body.removeChild(element)
            } else {
                _clipboard.writeSync(text)
            }; // NODEJS
            ret['msg'] = 'CLIPBOARD: OK'
            ret['ret'] = true;

            // ### LOG FUN ###
            if (inf && inf.logFun) {
                let infFile = { 'e': e, 'action': 'write', 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }, retFile
                infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; retFile = await file(infFile);
            }
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
    window['clipboard'] = clipboard;
} else { // NODEJS
    global['clipboard'] = clipboard;
}
