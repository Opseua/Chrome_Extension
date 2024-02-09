let e = import.meta.url, ee = e
async function client(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        let errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
    try {
        // DEV - SEND
        let dev1 = windowGlobal.devSend
        // DEV - GET [WEB|LOC]
        let dev2 = windowGlobal.devGet[0]
        let dev3 = windowGlobal.devGet[1]

        // CONNECT SOMENTE SE FOR [NOTEBOOK]
        // await wsConnect({ 'e': e, 'url': [dev1, dev2, dev3,] })
        await wsConnect({ 'e': e, 'url': [, dev2, ,] })

        // // LISTENER SOMENTE SE NÃO FOR 'Sniffer_Python'
        // let retGetPath
        // retGetPath = await getPath({ 'e': new Error() })
        // if (retGetPath?.res[6] !== 'Sniffer_Python') {
        //     // LIST - [WEB]
        //     listenerMonitorar(dev2, async (nomeList, param1) => {
        //         runLis(nomeList, param1)
        //     });

        //     // LISTENER SOMENTE SE FOR [NOTEBOOK]
        //     if (retGetPath?.res[1] == 'D') {
        //         // LIST - [LOC]
        //         listenerMonitorar(dev3, async (nomeList, param1) => {
        //             runLis(nomeList, param1)
        //         });
        //     }

        //     // RUN LIS
        //     async function runLis(nomeList, param1) {
        //         let data = {};
        //         try { data = JSON.parse(param1) } catch (e) { };
        //         if (data.fun) { // FUN
        //             let infDevFun = { 'e': e, 'data': data, 'wsOrigin': nomeList }
        //             devFun(infDevFun)
        //         } else if (data.other) { // OTHER
        //             logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `OTHER\n${data.other}` });
        //         } else {
        //             logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `MENSAGEM DO WEBSCKET\n\n${param1}` });
        //         }
        //     }
        // }

        ret['ret'] = true
    } catch (e) {
        let retRegexE = await regexE({ 'inf': inf, 'e': e, 'catchGlobal': false });
        ret['msg'] = retRegexE.res
    };
    if (!ret.ret) {
        if (eng) { // CHROME
            configStorage({ 'e': e, 'action': 'del', 'key': 'webSocket' })
        } else { // NODEJS
            log({ 'e': e, 'folder': 'JavaScript', 'path': `log.txt`, 'text': `SERVER NODEJS: ${ret.msg}` })
        }
    }
}

if (eng) { // CHROME
    window['client'] = client;
} else { // NODEJS
    global['client'] = client;
}



