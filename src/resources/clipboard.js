// let infClipboard, retClipboard
// infClipboard = { 'value': `Esse é o texto` }
// retClipboard = await clipboard(infClipboard);
// console.log(retClipboard)

async function clipboard(inf) {
    await import('./@functions.js');
    let ret = { 'ret': false };
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
        }
    } catch (e) {
        let m = await regexE({ 'e': e });
        ret['msg'] = m.res
    };
    return {
        ...(ret.ret && { ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}

if (typeof eng === 'boolean') {
    if (eng) { // CHROME
        window['clipboard'] = clipboard;
    } else { // NODEJS
        global['clipboard'] = clipboard;
    }
}