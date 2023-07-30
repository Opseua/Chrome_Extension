// const { configStorage } = await import('./resources/configStorage.js');
// let infConfigStorage, retConfigStorage

// infConfigStorage = { 'path': '/src/config.json', 'action': 'set', 'key': 'NomeDaChave', 'value': 'Valor da chave' }
// retConfigStorage = await configStorage(infConfigStorage)
// console.log(1, retConfigStorage)

// infConfigStorage = { 'path': '/src/config.json', 'action': 'get', 'key': 'NomeDaChave' }
// retConfigStorage = await configStorage(infConfigStorage)
// console.log(2, retConfigStorage)

// infConfigStorage = { 'path': '/src/config.json', 'action': 'del', 'key': 'NomeDaChave' }
// retConfigStorage = await configStorage(infConfigStorage)
// console.log(3, retConfigStorage)

const { nodeOrBrowser } = await import('./nodeOrBrowser.js');

async function configStorage(inf) {
    let ret = { 'ret': false };
    try {

        const retNodeOrBrowser = await nodeOrBrowser();

        if (retNodeOrBrowser.res == 'chrome') { // ################## CHROME

            if (inf.action == 'set') { // STORAGE: SET
                await storageSet(inf)
                async function storageSet(inf) {
                    return new Promise((resolve) => {
                        const data = {};
                        if (!inf.key) {
                            //ret['msg'] = 'STORAGE SET: ERRO | INFORMAR A "key"';
                            ret['msg'] = `\n #### ERRO ####  STORAGE SET \n INFORMAR A "key" \n\n`;
                        } else if (!inf.value) {
                            //ret['msg'] = 'STORAGE SET: ERRO | INFORMAR O "value"';
                            ret['msg'] = `\n #### ERRO ####  STORAGE SET \n INFORMAR O "value" \n\n`;
                        } else {
                            data[inf.key] = inf.value;
                            chrome.storage.local.set(data, async () => {
                                if (chrome.runtime.lastError) {
                                    //ret['msg'] = `STORAGE SET: ERRO | ${chrome.runtime.lastError}`;
                                    ret['msg'] = `\n #### ERRO ####  STORAGE SET \n ${chrome.runtime.lastError} \n\n`;
                                } else {
                                    ret['ret'] = true;
                                    ret['msg'] = 'STORAGE SET: OK';
                                }
                                resolve(ret);
                            });
                            return;
                        }
                        resolve(ret);
                    });
                }
            }

            if (inf.action == 'get') { // STORAGE: GET
                await storageGet(inf)
                async function storageGet(inf) {
                    return new Promise((resolve) => {
                        if (!inf.key) {
                            ret['msg'] = 'STORAGE GET: ERRO | INFORMAR A "key"';
                        } else {
                            chrome.storage.local.get(inf.key, async (result) => {
                                if (chrome.runtime.lastError) {
                                    //ret['msg'] = `STORAGE GET: ERRO | ${chrome.runtime.lastError}`;
                                    ret['msg'] = `\n #### ERRO ####  STORAGE GET \n ${chrome.runtime.lastError} \n\n`;
                                } else if (Object.keys(result).length === 0) {
                                    async function checkConfig() {
                                        const retConfigJson = await fetch(`${inf.path}`);
                                        const config = await retConfigJson.json();
                                        if (config[inf.key]) {
                                            const data = {};
                                            data[inf.key] = config[inf.key];
                                            return new Promise((resolve) => {
                                                chrome.storage.local.set(data, async () => {
                                                    if (chrome.runtime.lastError) {
                                                        //ret['msg'] = `STORAGE SET*: ERRO | ${chrome.runtime.lastError}`;
                                                        ret['msg'] = `\n #### ERRO ####  STORAGE SET* \n ${chrome.runtime.lastError} \n\n`;
                                                    } else {
                                                        ret['ret'] = true;
                                                        ret['msg'] = 'STORAGE GET: OK';
                                                        ret['res'] = config[inf.key]
                                                    }
                                                    resolve(ret);
                                                });
                                                return;
                                            })
                                        }
                                        else { 
                                            //ret['msg'] = `STORAGE GET: ERRO | CHAVE '${inf.key}' NAO ENCONTRADA`;
                                            ret['msg'] = `\n #### ERRO ####  STORAGE GET \n CHAVE '${inf.key}' NAO ENCONTRADA \n\n`;
                                         }
                                        return ret;
                                    }
                                    await checkConfig()
                                } else {
                                    ret['ret'] = true;
                                    ret['msg'] = 'STORAGE GET: OK';
                                    ret['res'] = result[inf.key]
                                }
                                resolve(ret);
                            });
                            return
                        }
                        resolve(ret);
                    });
                }
            }

            if (inf.action == 'del') { // STORAGE: DEL
                await storageDel(inf)
                async function storageDel(inf) {
                    return new Promise((resolve) => {
                        if (!inf.key) {
                            //ret['msg'] = 'STORAGE DEL: ERRO | INFORMAR A "key"';
                            ret['msg'] = `\n #### ERRO ####  STORAGE DEL \n INFORMAR A "key" \n\n`;
                        } else {
                            chrome.storage.local.get(inf.key, async (result) => {
                                if (chrome.runtime.lastError) {
                                    //ret['msg'] = `STORAGE DEL: ERRO | ${chrome.runtime.lastError}`;
                                    ret['msg'] = `\n #### ERRO ####  STORAGE DEL \n ${chrome.runtime.lastError} \n\n`;
                                } else if (Object.keys(result).length === 0) {
                                    //ret['msg'] = `STORAGE DEL: ERRO | CHAVE '${inf.key}' NAO ENCONTRADA`;
                                    ret['msg'] = `\n #### ERRO ####  STORAGE DEL \n CHAVE '${inf.key}' NAO ENCONTRADA \n\n`;
                                } else {
                                    chrome.storage.local.remove(inf.key, () => { });
                                    ret['ret'] = true;
                                    ret['msg'] = 'STORAGE DEL: OK';
                                }
                                resolve(ret);
                            });
                            return
                        }
                        resolve(ret);
                    });
                }
            }

        }

        if (retNodeOrBrowser.res == 'node') { // ################## NODE

            const fs = await import('fs');
            const { fileInf } = await import('./fileInf.js');
            const retfileInf = await fileInf(new URL(import.meta.url).pathname);
            const configPath = `${retfileInf.res.pathProject1}${inf.path}`
            const configFile = fs.readFileSync(configPath);
            const config = JSON.parse(configFile);

            if (inf.action == 'set') { // CONFIG: SET
                try {
                    if (!inf.key) {
                        //ret['msg'] = 'CONFIG SET: ERRO | INFORMAR A "key"';
                        ret['msg'] = `\n #### ERRO ####  CONFIG SET \n INFORMAR A "key" \n\n`;
                    } else if (!inf.value) {
                        //ret['msg'] = 'CONFIG SET: ERRO | INFORMAR O "value"';
                        ret['msg'] = `\n #### ERRO ####  CONFIG SET \n INFORMAR O "value" \n\n`;
                    } else {
                        ret['ret'] = true;
                        ret['msg'] = `CONFIG SET: OK`;
                        config[inf.key] = inf.value;
                        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
                    }
                } catch (e) {
                    ret['msg'] = regexE({ 'e': e }).res;
                }
            }

            if (inf.action == 'get') { // CONFIG NODE: GET
                try {
                    if (!inf.key) {
                        //ret['msg'] = 'CONFIG GET: ERRO | INFORMAR A "key"';
                        ret['msg'] = `\n #### ERRO ####  CONFIG GET \n INFORMAR A "key" \n\n`;
                    } else {
                        if (config[inf.key]) {
                            ret['ret'] = true;
                            ret['msg'] = `CONFIG GET: OK`;
                            ret['res'] = config[inf.key];
                        } else {
                            //ret['msg'] = `CONFIG GET: ERRO | CHAVE '${inf.key}' NAO ENCONTRADA`;
                            ret['msg'] = `\n #### ERRO ####  CONFIG GET \n CHAVE '${inf.key}' NAO ENCONTRADA \n\n`;
                        }
                    }
                } catch (e) {
                    ret['msg'] = regexE({ 'e': e }).res;
                }
            }

            if (inf.action == 'del') { // CONFIG NODE: DEL
                try {
                    if (!inf.key) {
                        //ret['msg'] = 'CONFIG DEL: ERRO | INFORMAR A "key"';
                        ret['msg'] = `\n #### ERRO ####  CONFIG DEL \n INFORMAR A "key" \n\n`;
                    } else {
                        if (config[inf.key]) {
                            ret['ret'] = true;
                            ret['msg'] = `CONFIG DEL: OK`;
                            delete config[inf.key];
                            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
                        } else {
                            //ret['msg'] = `CONFIG DEL: ERRO | CHAVE '${inf.key}' NAO ENCONTRADA`;
                            ret['msg'] = `\n #### ERRO ####  CONFIG DEL \n CHAVE '${inf.key}' NAO ENCONTRADA \n\n`;
                        }
                    }
                } catch (e) {
                    ret['msg'] = regexE({ 'e': e }).res;
                }
            }

        }

    }
    catch (e) {
        ret['msg'] = regexE({ 'e': e }).res;
    }

    if (!ret.ret) { console.log(ret.msg) }
    return ret
}

// export { configStorage };
