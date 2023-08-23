// const infChromeActions = { 'action': 'badge', 'inf': { 'text': 'OLA' } }
// const retChromeActions = await chromeActions(infChromeActions)
// console.log(retChromeActions)

async function chromeActions(inf) {
    let ret = { 'ret': false };
    try {
        if (inf.action == 'badge') {
            const action = chrome.browserAction
            if (inf.inf.color) {
                action.setBadgeBackgroundColor({ 'color': inf.inf.color }); // [25, 255, 71, 255]
            }
            if (inf.inf.hasOwnProperty('text')) {
                action.setBadgeText({ 'text': inf.inf.text });
            }
        }
        ret['ret'] = true;
        ret['msg'] = `CHROME ACTIONS: OK`;
    } catch (e) {
        ret['msg'] = regexE({ 'e': e }).res
    }
    if (!ret.ret) { console.log(ret.msg) }
    return ret
}

if (typeof window !== 'undefined') { // CHROME
    window['chromeActions'] = chromeActions;
} else { // NODEJS
    global['chromeActions'] = chromeActions;
}