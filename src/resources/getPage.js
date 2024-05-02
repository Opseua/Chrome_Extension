// let infGetPage, retGetPage // 'logFun': true,
// infGetPage = { 'e': e, 'id': 182593371 };
// retGetPage = await getPage(infGetPage);
// console.log(retGetPage)

let e = import.meta.url, ee = e;
async function getPage(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    try {
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

    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, });
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
