// const infGetPage = { 'id': retTabSearch.res.id }
// const retGetPage = await getPage(infGetPage)
// console.log(retGetPage)

async function getPage(inf) {
    let ret = { 'ret': false }
    try {
        function getContent(inf) {
            return new Promise((resolve) => {
                chrome.pageCapture.saveAsMHTML({ 'tabId': inf.id }, function (data) {
                    if (data) {
                        const blob = new Blob([data], { type: 'application/x-mimearchive' });
                        const reader = new FileReader();
                        reader.onloadend = async function () {
                            ret['ret'] = true;
                            ret['msg'] = `GET PAGE: OK`;
                            ret['res'] = reader.result;
                            resolve(true);
                        };
                        reader.readAsText(blob);
                    } else {
                        ret['msg'] = `GET PAGE: 'data' é 'false'`;
                        resolve(false);
                    }
                });
            });
        }
        await getContent(inf)
    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; if (!ret.ret) { console.log(ret.msg) }; return ret
}

if (typeof window !== 'undefined') { // CHROME
    window['getPage'] = getPage;
} else { // NODEJS
    // global['getPage'] = getPage;
}