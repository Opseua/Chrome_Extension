async function sniffer(inf) {
    let ret = { 'ret': false, 'res': {} };
    try {

        const filters = { urls: ["<all_urls>"] }
        chrome.webRequest.onBeforeRequest.addListener(event, filters, ['requestBody']);
        chrome.webRequest.onSendHeaders.addListener(event, filters, ['requestHeaders']);
        chrome.webRequest.onCompleted.addListener(event, filters, ['responseHeaders']);
        function rgxMat(a, b) {
            const c = b.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
            return new RegExp(`^${c}$`).test(a);
        }
        const sendPri = {
            'arrUrl': [
                'http://18.119.140.20*', 'https://ntfy.sh/', 'https://jsonformatter.org/json-parser',
                'https://notepad.pw/save',
            ]
        };

        function event(infOk) {
            if (!!sendPri.arrUrl.find(m => rgxMat(infOk.url, m))) {
                ret['method'] = infOk.method; ret['url'] = infOk.url; ret['tabId'] = infOk.tabId;
                if (infOk.hasOwnProperty('requestBody')) { // 1 'onBeforeRequest' 
                    if (infOk.requestBody.raw && infOk.requestBody.raw[0].hasOwnProperty('bytes')) {
                        ret.res['requestBodyType'] = 'binary';
                        ret.res['requestBody'] = new TextDecoder("utf-8").decode(new Uint8Array(infOk.requestBody.raw[0].bytes));
                    }
                    else if (infOk.requestBody.formData && infOk.requestBody.hasOwnProperty('formData')) {
                        ret.res['requestBodyType'] = 'formData';
                        ret.res['requestBody'] = infOk.requestBody.formData;
                    }
                    else {
                        ret.res['requestBodyType'] = 'others';
                        ret.res['requestBody'] = infOk.requestBody;
                    }
                }
                if (infOk.hasOwnProperty('requestHeaders')) { // 2 'onSendHeaders' 
                    ret.res['requestHeaders'] = infOk.requestHeaders;
                }
                if (infOk.hasOwnProperty('responseHeaders')) { // 3 'onCompleted' 
                    ret.res['responseHeaders'] = infOk.responseHeaders;
                }
                if (infOk.hasOwnProperty('statusCode')) { // 3 'onCompleted'
                    ret.res['statusCode'] = infOk.statusCode;
                    ret['ret'] = true;
                }

                if (ret.ret) {
                    console.log(ret);
                    ret = { 'ret': false, 'res': {} };
                    return ret
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