async function Prompt(inf) {

    const texto = (inf) ? `${inf} | Digite o comando:` : `Digite o comando:`;
    const ret = prompt(`${texto}`);
    if (ret) {
        //console.log('PROMPT: NOVO VALOR RECEBIDO');
        return ret;
    }

}

export default Prompt