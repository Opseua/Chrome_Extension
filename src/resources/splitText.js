async function splitText(inf) {
    let ret = { 'ret': false }

    try {
        const text = inf.replace(/\n/g, '\\n');
        const maxLength = 30;
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

