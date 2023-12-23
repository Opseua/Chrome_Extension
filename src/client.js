await import('./resources/@export.js');
let e = import.meta.url;
async function client(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        let errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; let retRegexE = await regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
    try {
        let time = dateHour().res; console.log(`${time.day}/${time.mon} ${time.hou}:${time.min}:${time.sec}`, 'client [Chrome_Extension]');

        // DEV - SEND
        let dev1 = devSend
        // DEV - GET [WEB|LOC]
        let dev2 = devGet[0]
        let dev3 = devGet[1]

        // CONNECT
        await wsConnect({ 'e': e, 'url': [dev1, dev2, dev3,] })

        // LISTENER SOMENTE SE NÃO FOR 'Sniffer_Python'
        let retGetPath
        retGetPath = await getPath({ 'e': new Error() })
        if (retGetPath?.res[6] !== 'Sniffer_Python') {
            // LIST - [WEB]
            wsList(dev2, async (nomeList, param1) => {
                runLis(nomeList, param1)
            });

            // LISTENER SOMENTE SE NÃO FOR [EC2]
            if (retGetPath?.res[1] !== 'C') {
                // LIST - [LOC]
                wsList(dev3, async (nomeList, param1) => {
                    runLis(nomeList, param1)
                });
            }

            // RUN LIS
            async function runLis(nomeList, param1) {
                let data = {};
                try {
                    data = JSON.parse(param1)
                } catch (e) { };
                if (data.fun) { // FUN
                    let infDevFun = { 'data': data, 'wsOrigin': nomeList }
                    let retDevFun = await devFun(infDevFun)
                } else if (data.other) { // OTHER
                    // console.log('OTHER', data.other)
                    if (data.other == 'keepCookieLive') {
                        await keepCookieLive();
                        wsSend({ 'e': e, 'url': nomeList, 'message': { 'other': 'OK: keepCookieLive' } })
                    } else if (data.other == 'TryRating_QueryImageDeservingClassification') {
                        await action_TryRating_QueryImageDeservingClassification()
                    }
                } else {
                    console.log(`\nMENSAGEM DO WEBSCKET\n\n${param1}\n`)
                }
            }
        }

        ret['ret'] = true
    } catch (e) {
        let retRegexE = await regexE({ 'inf': inf, 'e': e, 'catchGlobal': false });
        ret['msg'] = retRegexE.res
    };
    if (!ret.ret) {
        if (eng) { // CHROME
            let retConfigStorage = await configStorage({ 'e': e, 'action': 'del', 'key': 'webSocket' })
        } else { // NODEJS
            await log({ 'e': e, 'folder': 'JavaScript', 'path': `log.txt`, 'text': `SERVER NODEJS: ${ret.msg}` })
        }
    }
}
await client()





































// *************************
if (eng) { // CHROME
    let keys = ['webSocket', 'chatGptOra.aiAAAAA', 'chatGptOpenAi', 'sniffer'];
    for (let key of keys) { let infConfigStorage = { 'e': e, 'action': 'del', 'key': key }; let retConfigStorage = await configStorage(infConfigStorage) }
    await chromeActions({ 'action': 'badge', 'text': '' });
    chrome.downloads.onChanged.addListener(async function (...inf) { // EXCLUIR DOWNLOAD SE TIVER '[KEEP]' NO TITULO DO ARQUIVO
        if (inf[0].state && inf[0].state.current === 'complete') {
            chrome.downloads.search({ id: inf.id }, async function (inf) {
                if (inf.length > 0) {
                    let d = inf[0]; if (d.byExtensionName === 'BOT' && !d.filename.includes('[KEEP]')) {
                        setTimeout(function () { chrome.downloads.erase({ id: d.id }); console.log('DOWNLOAD REMOVIDO DA LISTA'); URL.revokeObjectURL(d.url) }, 5000);
                    }
                }
            });
        }
    });
    chrome.commands.onCommand.addListener(async function (...inf) { // ######################### ATALHO PRESSIONADO
        let ret = { 'ret': false };
        try {
            let infShortcutPressed = { 'shortcut': inf[0] } //console.log('ON START: ATALHO PRESSIONADO')
            if (infShortcutPressed.shortcut == 'atalho_1') {
                command1();
            } else if (infShortcutPressed.shortcut == 'atalho_2') {
                command2();
            } else { ret['msg'] = `\n #### ERRO #### ON START | ACAO DO ATALHO NAO DEFINIDA \n\n` }
        } catch (e) {
            let retRegexE = await regexE({ 'inf': inf, 'e': e, 'catchGlobal': false });
            ret['msg'] = retRegexE.res
        };
        return {
            ...({ ret: ret.ret }),
            ...(ret.msg && { msg: ret.msg }),
            ...(ret.res && { res: ret.res }),
        };
    });
}
// *************************

