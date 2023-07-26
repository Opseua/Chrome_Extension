async function teste() {
  console.log('rodando')

await import('./functions.js');
// addListener(monitorGlobalObject);
// async function monitorGlobalObject(value) {
//   console.log('Valor de globalObject alterado: 1', value.inf);
// }


await new Promise(resolve => setTimeout(resolve, (2500)));
globalObject.inf = { 'alert': true, 'function': 'Nome', 'res': 'AAAAA' };

}
teste()

