await import('./resources/@export.js');
let e = import.meta.url;
async function client(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        const errs = async (err, ret) => { if (!ret.stop) { ret['stop'] = true; let retRegexE = await regexE({ 'e': err, 'inf': inf, 'catchGlobal': true }) } }
        if (typeof window !== 'undefined') { window.addEventListener('error', (err) => errs(err, ret)); window.addEventListener('unhandledrejection', (err) => errs(err, ret)) }
        else { process.on('uncaughtException', (err) => errs(err, ret)); process.on('unhandledRejection', (err) => errs(err, ret)) }
    }
    try {
        let time = dateHour().res; console.log(`${time.day}/${time.mon} ${time.hou}:${time.min}:${time.sec}`, 'client [Chrome_Extension]');

        // DEV - [WEB] WEB {IMPAR}
        let dev1 = devChromeWeb
        let dev3 = letter == 'D' ? devNodeJSWeb : devEC2Web
        // DEV - [LOC] LOCAL {PAR}
        let dev2 = devChromeLocal
        let dev4 = letter == 'D' ? devNodeJSLocal : devEC2Local

        // [WEB-LOC]
        if (letter == 'D') {
            // CONNECT - NOTEBOOK
            await wsConnect({ 'e': e, 'url': [dev1, dev2, dev3, dev4,] })

            // LIST - [WEB] WEB
            wsList(dev1, async (nomeList, par1) => {
                runLis(nomeList, par1)
            });
            // LIST - [LOC] LOCAL
            wsList(dev2, async (nomeList, par1) => {
                runLis(nomeList, par1)
            });
        } else {
            // ### CONNECT - EC2
            await wsConnect({ 'e': e, 'url': [dev1, dev3,] })

            // LIST - [WEB] WEB
            wsList(dev3, async (nomeList, par1) => {
                runLis(nomeList, par1)
            });
        }

        // RUN LIS
        async function runLis(nomeList, par1) {
            let data = {};
            try {
                data = JSON.parse(par1)
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
                console.log(`\nMENSAGEM DO WEBSCKET\n\n${par1}\n`)
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