async function teste() {
  console.log('rodando')

await import('./functions.js');
await new Promise(resolve => setTimeout(resolve, (2500)));
globalObject.inf = { 'alert': true, 'function': 'Nome', 'res': 'AAAAA' };

}
teste()

