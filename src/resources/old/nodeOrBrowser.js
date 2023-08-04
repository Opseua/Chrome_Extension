// const { nodeOrBrowser } = await nodeOrBrowser();
// console.log(retNodeOrBrowser);

async function nodeOrBrowser() {
    let ret = { 'ret': false }

    try {
        if (typeof process !== 'undefined') { // NODE
            ret['res'] = 'node'
        } else if (typeof window !== 'undefined') { // CHROME
            ret['res'] = 'chrome'
        } else if (typeof UrlFetchApp !== 'undefined') { // GOOGLE APP SCRIPT
            ret['res'] = 'googleAppScript'
        } else { // NAO IDENTIFICADO
            ret['res'] = 'NAO IDENTIFICADO'
        }

        ret['ret'] = true;
        ret['msg'] = 'NODE OR BROWSER: OK';
    } catch (e) {
        //ret['msg'] = `NODE OR BROWSER: ERRO | ${e.message}`;
        ret['msg'] = regexE({ 'e': e.message }).res
    }

    if (!ret.ret) { console.log(ret.msg) }
    return ret
}
