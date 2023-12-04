// let infGetPage, retGetPage // 'logFun': true,
// infGetPage = { 'id': 182593371 };
// retGetPage = await getPage(infGetPage);
// console.log(retGetPage)

let e = import.meta.url;
async function getPage(inf) {
    let ret = { 'ret': false };
    e = inf && inf.e ? inf.e : e
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

        // ### LOG FUN ###
        if (inf && inf.logFun) {
            let infFile = { 'e': e, 'action': 'write', 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }, retFile
            infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; retFile = await file(infFile);
        }
    } catch (e) {
        let retRegexE = await regexE({ 'inf': inf, 'e': e });
        ret['msg'] = retRegexE.res
    };
    return {
        ...({ ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}

if (eng) { // CHROME
    window['getPage'] = getPage;
} else { // NODEJS
    global['getPage'] = getPage;
}
