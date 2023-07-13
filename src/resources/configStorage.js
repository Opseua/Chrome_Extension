import { nodeOrBrowser } from './nodeOrBrowser.js';


async function configStorage(inf) {
    const ret = { ret: false };

    const retNodeOrBrowser = await nodeOrBrowser();
    console.log(retNodeOrBrowser);
    if (retNodeOrBrowser.res == 'chrome') {

        console.log('rodou')
        ret['ola'] = true;

    }
    else if (retNodeOrBrowser.res == 'node') {

    }

    console.log(ret)
}

export { configStorage };