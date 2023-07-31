let wsRet;
async function webRet() {
    wsRet = new WebS(`${retConfigStorage.res.ws2}:${port}/${device}`);
    wsRet.addEventListener('open', async function (event) {
        wsRet.send('Chrome: mensagem de teste')
        wsRet.close();
    });
    wsRet.addEventListener('error', async function (error) {
        console.error(`BACKGROUND: ERRO WRET`);
    });
}