// await import('./splitText.js');
// const infSplitText = { 'maxLength': 30, 'text': "Lorem Ipsum is simply dummy text of the printing and typesetting industry" }
// const retSplitText = await splitText(infSplitText)
// console.log(retSplitText)

async function splitText(inf) {
    let ret = { 'ret': false }
    try {
        const text = inf.text.replace(/\n/g, '\\n');
        const maxLength = inf.maxLength;
        const chunks = [];
        let currentChunk = '';

        for (let word of text.split(/\s+/)) {
            if (currentChunk.length + word.length > maxLength) {
                chunks.push(currentChunk.trim());
                currentChunk = '';
            }
            currentChunk += (currentChunk ? ' ' : '') + word;
            if (/\n/.test(word)) {
                chunks.push(currentChunk.trim());
                currentChunk = '';
            }
        }
        if (currentChunk) {
            chunks.push(currentChunk.trim());
        }

        ret['ret'] = true;
        ret['msg'] = 'SPLIT TEXT: OK';
        ret['res'] = chunks;

    } catch (e) {
        ret['msg'] = `SPLIT TEXT: ERRO | ${e}`;
    }

    if (!ret.ret) { console.log(ret.msg) }
    return ret
}

export { splitText }

if (typeof window !== 'undefined') { // CHOME
    window['splitText'] = splitText;
} else if (typeof global !== 'undefined') { // NODE
    global['splitText'] = splitText;
}