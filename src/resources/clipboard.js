async function clipboard(inf) {

  let text = inf

  // OBJETO INDENTADO EM TEXTO BRUTO
  if (typeof text === 'object' && text !== null) {
    text = JSON.stringify(text, null, 2);
  }

  const element = document.createElement('textarea');
  element.value = text;
  document.body.appendChild(element);
  element.select();
  document.execCommand('copy');
  document.body.removeChild(element);

  console.log('AREA DE TRANSFERENCIA: NOVO VALOR DEFINIDO')

}

export { clipboard }

