let Api;
import('./src/recursos/Api.js').then(module => {
  Api = module.default;
});

let AreaDeTransferencia;
import('./src/recursos/AreaDeTransferencia.js').then(module => {
  AreaDeTransferencia = module.default;
});


async function teste() {
  var a0 = 'https://ntfy.s/OPSEUA';
  var b0 = 'POST';
  var c0 = { 'Content-Type': 'text/plain', 'title': 'OK TITULO' };
  var d0 = 'OK ESSA É O BODY';

  var inf = {
    url: a0,
    method: b0,
    headers: c0,
    body: d0
  }

  await Api(inf)

}

export default teste