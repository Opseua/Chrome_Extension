const { addListener, globalObject } = await import('./globalObject.js');
async function monitorGlobalObject(value) {
    console.log('Valor de globalObject alterado: 1', value.inf);
}
addListener(monitorGlobalObject);
await new Promise(resolve => setTimeout(resolve, (2000)));
globalObject.inf = true;
