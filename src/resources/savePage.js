//const { api } = await import('./api.js');
await import('./functions.js');

async function savePage(inf) {
    let ret = { 'ret': false };
    try {
console.log('aaaaa')
        return
        chrome.pageCapture.saveAsMHTML({ 'tabId': inf.id }, async function (data) {
            if (data) {
                console.log('OK')
                try {
                    const blob = new Blob([data], { type: 'application/x-mimearchive' });
                    const reader = new FileReader();
                    reader.onloadend = async function () {
                        const textContent = reader.result;
                        const infFileWrite = {
                            'file': `${inf.title}.html`,
                            'rewrite': false, // 'true' adiciona no MESMO arquivo, 'false' cria outro em branco
                            'text': textContent
                        };
                        const retFileWrite = await fileWrite(infFileWrite);
                        console.log(retFileWrite);
                        ret['msg'] = `MODEL: OK`;
                        ret['ret'] = true;
                    };
                    reader.readAsText(blob);
                } catch (e) {
                    console.log('ERRO 1')
                }
            } else {
                console.log('ERRO 2')
            }
        });

    } catch (e) {
        ret['msg'] = `MODEL: ERRO | ${e}`
    }

    if (!ret.ret) { console.log(ret.msg) }
    return ret
}

export { savePage }

if (typeof window !== 'undefined') { // CHOME
    window['savePage'] = savePage;
} else if (typeof global !== 'undefined') { // NODE
    global['savePage'] = savePage;
}