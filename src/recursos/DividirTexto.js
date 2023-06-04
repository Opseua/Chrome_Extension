function dividirTexto(text) {

    const text_novo = text.replace(/\n/g, '\\n');
    const maxLength = 30;
    const chunks = [];
    let currentChunk = '';

    for (let word of text_novo.split(/\s+/)) {
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

    return chunks;
}

export default dividirTexto

