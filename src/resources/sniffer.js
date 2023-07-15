async function sniffer(inf) {
    let ret = { 'ret': false };
    try {

        const filters = { urls: ["<all_urls>"] }
        chrome.webRequest.onBeforeRequest.addListener(ev, filters, ['requestBody']);
        chrome.webRequest.onSendHeaders.addListener(ev, filters, ['requestHeaders']);
        chrome.webRequest.onCompleted.addListener(ev, filters, ['responseHeaders']);
        let ret = { 'ret': false };
        function rgxMat(a, b) {
            const c = b.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
            return new RegExp(`^${c}$`).test(a);
        }

        const sendPri = { 'arrUrl': ['http://18.119.140.20*', 'https://ntfy.sh/',] };

        function ev(infOk) {
            if (!!sendPri.arrUrl.find(m => rgxMat(infOk.url, m))) {
                // chrome.webRequest.onBeforeRequest.removeListener(eventOnBeforeRequest);
                ret['method'] = infOk.method; ret['url'] = infOk.url; ret['tabId'] = infOk.tabId;
                if (infOk.hasOwnProperty('requestBody')) { ret['requestBody'] = infOk.requestBody; } // 1 'onBeforeRequest' 
                if (infOk.hasOwnProperty('requestHeaders')) { ret['requestHeaders'] = infOk.requestHeaders; } // 2 'onSendHeaders' 
                if (infOk.hasOwnProperty('responseHeaders')) { ret['responseHeaders'] = infOk.responseHeaders; } // 3 'onCompleted' 
                if (infOk.hasOwnProperty('statusCode')) { ret['statusCode'] = infOk.statusCode; ret['ret'] = true; } // 3 'onCompleted'

                if (ret.ret) {
                    console.log(ret);
                    ret = { 'ret': false };
                }
            }
        }

    } catch (e) {
        ret['msg'] = `SNIFFER: ERRO | ${e}`
        chrome.webRequest.onBeforeRequest.removeListener(eventOnBeforeRequest);
        chrome.webRequest.onSendHeaders.removeListener(eventOnBeforeRequest);
        chrome.webRequest.onCompleted.removeListener(eventOnBeforeRequest);
        console.log(ret.msg);
        return ret
    }

}

export { sniffer }