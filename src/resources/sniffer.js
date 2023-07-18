const { api } = await import('./api.js');

async function sniffer(inf) {
    let ret = { 'ret': false, 'res': {} };
    const filters = { urls: ["<all_urls>"] };
    let newReqSend = true
    let newResBlock = false
    try {
        chrome.webRequest.onBeforeRequest.addListener(lisOnBeforeRequest, filters, ['requestBody']);
        chrome.webRequest.onBeforeSendHeaders.addListener(lisOnBeforeSendHeaders, filters, ['requestHeaders']);
        chrome.webRequest.onCompleted.addListener(lisOnCompleted, filters, ['responseHeaders']);
        async function lisOnBeforeRequest(inf) { eventListener(inf, 'onBeforeRequest') }
        async function lisOnBeforeSendHeaders(inf) { eventListener(inf, 'onBeforeSendHeaders') }
        async function lisOnCompleted(inf) { eventListener(inf, 'onCompleted') }
        function regex(a, b) {
            const c = b.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
            return new RegExp(`^${c}$`).test(a);
        }
        const sendPri = {
            'arrUrl': [
                'http://18.119.140.20*', 'https://ntfy.sh/', 'https://jsonformatter.org/json-parser',
                'https://notepad.pw/save', 'https://www.instagram.com/api/v1/users/web_profile_info/*'

            ]
        };

        async function eventListener(infOk, eventType) {
            if (!!sendPri.arrUrl.find(m => regex(infOk.url, m))) {

                if (eventType == 'onBeforeRequest') {
                    if (infOk.requestBody && infOk.requestBody.raw && infOk.requestBody.raw[0].hasOwnProperty('bytes')) {
                        ret.res['requestBodyType'] = 'binary';
                        ret.res['requestBody'] = new TextDecoder("utf-8").decode(new Uint8Array(infOk.requestBody.raw[0].bytes));
                    } else if (infOk.requestBody && infOk.requestBody.formData && infOk.requestBody.hasOwnProperty('formData')) {
                        ret.res['requestBodyType'] = 'formData';
                        ret.res['requestBody'] = infOk.requestBody.formData;
                    }
                }

                if (eventType == 'onBeforeSendHeaders') {
                    if (JSON.stringify(infOk.requestHeaders).includes('naoInterceptar')) {
                        newResBlock = true
                        console.log('BLOCK')
                    } else {
                        newResBlock = false
                        ret.res['method'] = infOk.method;
                        ret.res['url'] = infOk.url;
                        ret.res['tabId'] = infOk.tabId;
                        ret.res['requestHeaders'] = infOk.requestHeaders;
                    }
                }

                if (eventType == 'onCompleted' && !newResBlock) {
                    if ((infOk.statusCode !== 200)) { console.log('DEU ERRO'); }
                    ret.res['statusCode'] = infOk.statusCode;
                    ret['ret'] = true;
                    console.log(ret)

                    if (newReqSend) {
                        const hea = {};
                        for (let header of ret.res.requestHeaders) { hea[header.name] = header.value; }
                        hea['naoInterceptar'] = 'naoInterceptar';
                        const infApi = { 'url': ret.res.url, 'method': ret.res.method, 'headers': hea };
                        if (typeof ret.res.requestBody !== 'undefined') { infApi['body'] = ret.res.requestBody }
                        const retApi = await api(infApi);
                        console.log(retApi.res.body)
                    }

                    ret = { 'ret': false, 'res': {} }
                }

            }
        }

    } catch (e) {
        ret['msg'] = `SNIFFER: ERRO | ${e}`;
        chrome.webRequest.onBeforeRequest.removeListener(eventListener, filters, ['requestBody']);
        chrome.webRequest.onBeforeSendHeaders.removeListener(eventListener, filters, ['requestHeaders']);
        chrome.webRequest.onCompleted.removeListener(eventListener, filters, ['responseHeaders']);
        console.log(3, ret.msg);
    }

    return ret;
}

export { sniffer }