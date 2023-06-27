// import { nodeOrBrowser } from './nodeOrBrowser.js';
// const retFunction = await nodeOrBrowser();
// console.log(retFunction);

async function nodeOrBrowser() {
    let ret = { ret: false }

    try {

        if (typeof process.versions.node !== 'undefined') { // NodeJS
            ret['res'] = 'NodeJS'
        } else if (typeof window !== 'undefined') { // Chrome
            ret['res'] = 'Chrome'
        } else if (typeof UrlFetchApp !== 'undefined') { // Google App Script
            ret['res'] = 'Google App Script'
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
