async function AreaDeTransferencia(inf) {

  const el = document.createElement('textarea');
  el.value = inf.replace(/\\n/g, '<br>');
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  console.log('AREA DE TRANSFERENCIA: NOVO VALOR DEFINIDO')

}

export default AreaDeTransferencia

