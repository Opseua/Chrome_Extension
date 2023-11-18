// let infGetPage, retGetPage
// infGetPage = { 'id': 182593371 };
// retGetPage = await getPage(infGetPage);
// console.log(retGetPage)

async function getPage(inf) {
    await import('./@functions.js');
    let ret = { 'ret': false };
    try {
        if (!`rodar no → CHROME`.includes(engName)) { // [ENCAMINHAR PARA DEVICE]
            let infDevAndFun = { 'enc': true, 'data': { 'name': 'getPage', 'par': inf, 'retInf': inf.retInf } };
            let retDevAndFun = await devFun(infDevAndFun); return retDevAndFun
        };
        function getContent(inf) {
            return new Promise((resolve) => {
                chrome.pageCapture.saveAsMHTML({ 'tabId': inf.id }, function (data) {
                    if (data) {
                        let blob = new Blob([data], { type: 'application/x-mimearchive' });
                        let reader = new FileReader();
                        reader.onloadend = async function () {
                            ret['res'] = reader.result;
                            ret['msg'] = `GET PAGE: OK`;
                            ret['ret'] = true;
                            resolve(true)
                        };
                        reader.readAsText(blob)
                    } else {
                        ret['msg'] = `GET PAGE: 'data' é 'false'`;
                        resolve(false)
                    }
                });
            });
        };
        await getContent(inf)
    } catch (e) {
        let m = await regexE({ 'e': e });
        ret['msg'] = m.res
    };
    return ret
}

if (typeof eng === 'boolean') {
    if (eng) { // CHROME
        window['getPage'] = getPage;
    } else { // NODEJS
        global['getPage'] = getPage;
    }
}