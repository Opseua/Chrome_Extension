// await import('./resources/@functions.js'); // TESTES [REMOVER COMENTÁRIO]

async function serverNode(inf) {
    await import('./resources/@functions.js'); // TESTES [INSERIR COMENTÁRIO]
    let ret = { 'ret': false };
    try {
        let time = dateHour().res; console.log(`${time.day}/${time.mon} ${time.hou}:${time.min}:${time.sec}`, eng ? 'server' : 'serverNode');

        // DEV - [LOC] LOCAL
        let dev1 = devChromeLocal
        let dev2 = conf[1] == 'D' ? devNodeJSLocal : devEC2Local
        // DEV - [WEB] WEB
        let dev3 = devChromeWeb
        let dev4 = conf[1] == 'D' ? devNodeJSWeb : devEC2Web

        // CONNECT [LOC-WEB]
        await wsConnect([dev1, dev2, dev3, dev4,])

        // LIST - [LOC] LOCAL
        wsList(dev2, async (nomeList, par1) => {
            runLis(nomeList, par1)
        });
        // LIST - [WEB] WEB
        wsList(dev4, async (nomeList, par1) => {
            runLis(nomeList, par1)
        });

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
                console.log('OTHER', data.other)
            } else {
                console.log(`\nMENSAGEM DO WEBSCKET\n\n${par1}\n`)
            }
        }

        async function keepCookieLiveRun() {
            await new Promise(resolve => { setTimeout(resolve, 15000) });
            wsSend(devChrome, { 'other': 'keepCookieLive' })
        };
        // keepCookieLiveRun();
        ret['ret'] = true
        ret['msg'] = `SERVER NODE: OK`
    } catch (e) {
        let m = await regexE({ 'e': e });
        ret['msg'] = m.res
    };
    if (!ret.ret) {
        if (eng) { // CHROME
            let retConfigStorage = await configStorage({ 'action': 'del', 'key': 'webSocket' })
        } else { // NODEJS
            await log({ 'folder': 'JavaScript', 'path': `log.txt`, 'text': `SERVER NODEJS: ${ret.msg}` })
        }
    }
}
// await serverNode()

if (typeof eng === 'boolean') {
    if (eng) { // CHROME
        window['serverNode'] = serverNode;
    } else { // NODEJS
        global['serverNode'] = serverNode;
    }
}