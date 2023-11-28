async function serverNode(inf) {
    let ret = { 'ret': false };
    try {
        let time = dateHour().res; console.log(`${time.day}/${time.mon} ${time.hou}:${time.min}:${time.sec}`, `serverNode [Chrome_Extension]`, '\n');

        // DEV - [WEB] WEB {IMPAR}
        let dev1 = devChromeWeb
        let dev3 = letter == 'D' ? devNodeJSWeb : devEC2Web
        // DEV - [LOC] LOCAL {PAR}
        let dev2 = devChromeLocal
        let dev4 = letter == 'D' ? devNodeJSLocal : devEC2Local

        // CONNECT [WEB-LOC]
        await wsConnect([dev1, dev2, dev3, dev4,])

        // LIST - [WEB] WEB
        wsList(dev3, async (nomeList, par1) => {
            runLis(nomeList, par1)
        });
        // LIST - [LOC] LOCAL
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

if (eng) { // CHROME
    window['serverNode'] = serverNode;
} else { // NODEJS
    global['serverNode'] = serverNode;
}
