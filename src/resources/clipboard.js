// let infClipboard, retClipboard
// infClipboard = { 'e': e, 'value': `Esse é o texto` }
// retClipboard = await clipboard(infClipboard); console.log(retClipboard)

let e = import.meta.url, ee = e;
async function clipboard(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    try {
        // IMPORTAR BIBLIOTECA [NODEJS]
        if (typeof _clipboard === 'undefined') { await funLibrary({ 'lib': '_clipboard' }); };

        if (inf.value == null || inf.value == '') {
            ret['msg'] = `CLIPBOARD: ERRO | INFORMAR O 'value'`;
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

        }
    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res;
    }; return { ...({ ret: ret.ret }), ...(ret.msg && { msg: ret.msg }), ...(ret.res && { res: ret.res }), };
};

// CHROME | NODEJS
(eng ? window : global)['clipboard'] = clipboard;