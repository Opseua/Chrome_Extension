// // await import('./sniffer.js');
// const infSniffer = { 'arrUrl': ['https://excel.officeapps.live.com/x/_vti_bin/DynamicGridContent.json/GetRangeContentJson?context=*'] }
// const retSniffer = await sniffer(infSniffer)
// console.log(retSniffer)

await import('./functions.js');

async function sniffer(inf) {

    return new Promise(resolve => {
        let ret = { 'ret': false, 'res': {} };
        let lisOnBeforeRequest, lisOnBeforeSendHeaders, lisOnCompleted
        function snifferOff() {
            chrome.webRequest.onBeforeRequest.removeListener(lisOnBeforeRequest);
            chrome.webRequest.onBeforeSendHeaders.removeListener(lisOnBeforeSendHeaders);
            chrome.webRequest.onCompleted.removeListener(lisOnCompleted);
            console.log('sniffer removido'); resolve(ret);
        }
        try {
            const filters = { urls: ["<all_urls>"] };
            lisOnBeforeRequest = function (infLis) { intercept(infLis, 'onBeforeRequest'); }
            lisOnBeforeSendHeaders = function (infLis) { intercept(infLis, 'onBeforeSendHeaders'); }
            lisOnCompleted = function (infLis) { intercept(infLis, 'onCompleted'); }
            chrome.webRequest.onBeforeRequest.addListener(lisOnBeforeRequest, filters, ['requestBody']);
            chrome.webRequest.onBeforeSendHeaders.addListener(lisOnBeforeSendHeaders, filters, ['requestHeaders']);
            chrome.webRequest.onCompleted.addListener(lisOnCompleted, filters, ['responseHeaders']);
            console.log('sniffer iniciado');
            let newReqSend = false; let newResBlock = false
            let sendPri = {
                'arrUrl': [
                    'http://18.119.140.20*', 'https://ntfy.sh/', 'https://jsonformatter.org/json-parser',
                    'https://notepad.pw/save'
                ]
            }
            if (inf && inf.arrUrl) { sendPri = { 'arrUrl': inf.arrUrl } }
            async function intercept(infOk, eventType) {
                if (!!sendPri.arrUrl.find(infRegex => regex({ 'simple': true, 'pattern': infRegex, 'text': infOk.url }))) {

                    if (eventType == 'onBeforeRequest') {
                        if (infOk.requestBody && infOk.requestBody.raw && infOk.requestBody.raw[0].hasOwnProperty('bytes')) {
                            ret.res['requestBodyType'] = 'binary';
                            ret.res['requestBody'] = new TextDecoder("utf-8").decode(new Uint8Array(infOk.requestBody.raw[0].bytes));
                        } else if (infOk.requestBody && infOk.requestBody.formData && infOk.requestBody.hasOwnProperty('formData')) {
                            ret.res['requestBodyType'] = 'formData';
                            ret.res['requestBody'] = infOk.requestBody.formData;
                        }
                        ret.res['type'] = infOk.type; // 'main_frame' (requisicao inicial 'doc')
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

                    if (eventType == 'onCompleted' && ret.res.url && !newResBlock) {
                        // if ((infOk.statusCode !== 200)) {
                        //     console.log('DEU ERRO', 'CODE:', infOk.statusCode, infOk.url)
                        // }
                        ret.res['statusCode'] = infOk.statusCode;
                        ret['ret'] = true;

                        if (newReqSend) {
                            console.log('REENVIAR REQUISICAO')
                            // const hea = {};
                            // for (let header of ret.res.requestHeaders) { hea[header.name] = header.value; }
                            // hea['naoInterceptar'] = 'naoInterceptar';
                            // const infApi = { 'url': ret.res.url, 'method': ret.res.method, 'headers': hea };
                            // if (typeof ret.res.requestBody !== 'undefined') { infApi['body'] = ret.res.requestBody }
                            // const retApi = await api(infApi);
                            // console.log(retApi.res.body)
                        }

                        snifferOff();
                        ret = { 'ret': false, 'res': {} }
                    }

                }
            }

        } catch (e) {
            ret['msg'] = regexE({ 'e': e }).res
            ret['msg'] = `\n #### ERRO ####  CONFIG SET \n INFORMAR A 'key' \n\n`;
            console.log(ret.msg)
            snifferOff()
        }
    });

}

window['sniffer'] = sniffer;
