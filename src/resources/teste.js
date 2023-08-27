await import('./@functions.js');

function orderObj(o) {
  return Object.fromEntries(Object.entries(o).sort((a, b) => a[0].localeCompare(b[0])));
}
const meuObjeto = {
  banana: 2,
  maca: 5,
  abacate: 3,
  laranja: 1
};
console.log(meuObjeto);
const objetoOrdenado = orderObj(meuObjeto);
console.log(objetoOrdenado);
