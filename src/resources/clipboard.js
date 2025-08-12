// let infClipboard, retClipboard;
// infClipboard = { e, 'value': `Esse é o texto`, };
// retClipboard = await clipboard(infClipboard); console.log(retClipboard);

let e = currentFile(), ee = e; let libs = { 'clipboardy': {}, };
async function clipboard(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        /* IMPORTAR BIBLIOTECA [NODE] */ if (!eng && libs['clipboardy']) { libs['clipboardy']['clipboard'] = 1; libs = await importLibs(libs, 'clipboard'); }

        let { value, } = inf;

        if (value === null || value === '') {
            ret['msg'] = `CLIPBOARD: ERRO | INFORMAR O 'value'`;
        } else {
            let text = value;
            if (typeof text === 'object') { // OBJETO INDENTADO EM TEXTO BRUTO
                text = JSON.stringify(text, null, 2);
            }
            if (eng) {
                // CHROME
                let element = document.createElement('textarea');
                element.value = text; document.body.appendChild(element);
                element.select(); document.execCommand('copy');
                document.body.removeChild(element);
            } else {
                // NODE
                _clipboard.writeSync(text);
            }
            ret['msg'] = 'CLIPBOARD: OK';
            ret['ret'] = true;

        }
    } catch (catchErr) {
        let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    }

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.hasOwnProperty('res') && { 'res': ret.res, }), };
}

// CHROME | NODE
globalThis['clipboard'] = clipboard;


