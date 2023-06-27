// import { nodeOrBrowser } from './nodeOrBrowser.js';
// const retFunction = await nodeOrBrowser();
// console.log(retFunction);

async function nodeOrBrowser() {
    let ret = { ret: false }

    try {

        if (typeof process.versions.node !== 'undefined') { // Node
            ret['res'] = 'node'
        } else if (typeof window !== 'undefined') { // Chrome
            ret['res'] = 'chrome'
        } else if (typeof UrlFetchApp !== 'undefined') { // Google App Script
            ret['res'] = 'googleAppScript'
        } else { // NAO IDENTIFICADO
            ret['res'] = 'NAO IDENTIFICADO'
        }
        ret['ret'] = true;

    } catch (error) {
        ret['msg'] = error.message;
    }

    return ret
}

export { nodeOrBrowser }
