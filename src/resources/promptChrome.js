async function promptChrome(inf) {

    const text = (inf) ? `${inf} | Digite o comando:` : `Digite o comando:`;
    const ret = prompt(`${text}`);
    if (ret) {
        //console.log('PROMPT: NOVO VALOR RECEBIDO');
        return ret;
    }

}

export { promptChrome }