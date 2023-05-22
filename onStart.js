let Api;
import('./src/recursos/Api.js').then(module => {
    Api = module.default;
});

if (typeof process !== 'undefined' && process.release && process.release.name === 'node') {
    // RODANDO NO NODE
    onStart()
}

// ############################################################################

async function onStart(inf) {

    console.log("onStart")

}

export default onStart






