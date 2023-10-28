// const retClipboard = await clipboard({ 'value': `Esse é o texto` });
// console.log(retClipboard)

async function clipboard(inf) {
    await import('./@functions.js');
    let ret = { 'ret': false }; try {
        if (inf.value == null || inf.value == '') {
            ret['msg'] = `\n\n #### ERRO #### CLIPBOARD \n INFORMAR O 'value' \n\n`
        } else {
            let text = inf.value;
            if (typeof text === 'object') { // OBJETO INDENTADO EM TEXTO BRUTO
                text = JSON.stringify(text, null, 2)
            }
            if (typeof window !== 'undefined') { // CHROME
                const element = document.createElement('textarea'); element.value = text; document.body.appendChild(element);
                element.select(); document.execCommand('copy'); document.body.removeChild(element)
            } else { _clipboard.writeSync(text) }; // NODEJS
            ret['ret'] = true; ret['msg'] = 'CLIPBOARD: OK' 
        }
    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; return ret
}

if (typeof window !== 'undefined') { // CHROME
    window['clipboard'] = clipboard;
} else { // NODEJS
    global['clipboard'] = clipboard;
}