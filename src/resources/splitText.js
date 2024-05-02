// let infSplitText, retSplitText
// infSplitText = { 'e': e, 'maxLength': 30, 'text': `Lorem Ipsum is simply dummy text of the printing and typesetting industry` }
// retSplitText = await splitText(infSplitText);
// console.log(retSplitText)

let e = import.meta.url, ee = e;
async function splitText(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        let errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
    try {
        let text = inf.text.replace(/\n/g, '\\n');
        let maxLength = inf.maxLength;
        let chunks = [];
        let currentChunk = '';
        for (let word of text.split(/\s+/)) {
            if (currentChunk.length + word.length > maxLength) {
                chunks.push(currentChunk.trim());
                currentChunk = ''
            }
            currentChunk += (currentChunk ? ' ' : '') + word;
            if (/\n/.test(word)) {
                chunks.push(currentChunk.trim());
                currentChunk = ''
            }
        };
        if (currentChunk) {
            chunks.push(currentChunk.trim())
        };
        ret['res'] = chunks;
        ret['msg'] = 'SPLIT TEXT: OK';
        ret['ret'] = true;

    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, 'catchGlobal': false });
        ret['msg'] = retRegexE.res
    };
    return {
        ...({ ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}

if (eng) { // CHROME
    window['splitText'] = splitText;
} else { // NODEJS
    global['splitText'] = splitText;
}
