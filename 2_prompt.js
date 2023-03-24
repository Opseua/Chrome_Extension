function fun_prompt(inf1) {

  const texto = (inf1) ? `${inf1} | Digite o comando:` : `Digite o comando:`;
  const ret = prompt(`${texto}`);
  return ret;
  
}

export default fun_prompt