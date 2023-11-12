await import('./resources/@functions.js');
let time = dateHour().res; console.log('onStart', `${time.day}/${time.mon} ${time.hou}:${time.min}:${time.sec}`);

async function run(inf) {
    let ret = { 'ret': false };
    try {
        await wsConnect([devNodeJS, devChrome,]);

        wsList(devNodeJS, async (nomeList, par1) => {
            let data = {}; try { data = JSON.parse(par1) } catch (e) { };
            if (data.fun) { // FUN
                let infDevFun = { 'data': data, 'wsOrigin': nomeList }
                let retDevFun = await devFun(infDevFun)
            } else if (data.other) { // OTHER
                console.log('OTHER', data.other)
            } else {
                console.log(`\nMENSAGEM DO WEBSCKET\n\n${par1}\n`)
            }
        });
        async function keepCookieLiveRun() {
            await new Promise(resolve => { setTimeout(resolve, 15000) }); wsSend(devChrome, { 'other': 'keepCookieLive' })
        };
        keepCookieLiveRun();
        ret['ret'] = true
    } catch (e) {
        let m = await regexE({ 'e': e });
        ret['msg'] = m.res
    };
    if (!ret.ret) {
        if (eng) { // CHROME
            let retConfigStorage = await configStorage({ 'action': 'del', 'key': 'webSocket' })
        } else { // NODEJS
            await log({ 'folder': 'JavaScript', 'path': `log.txt`, 'text': `ONSTART NODEJS: ${ret.msg}` })
        }
    }
}
await run()
