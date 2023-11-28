// let infConfigStorage, retConfigStorage; // 'logFun': true, 'functionLocal': false,
// infConfigStorage = { 'action': 'set', 'key': 'NomeDaChave', 'value': 'Valor da chave' } // 'functionLocal' SOMENTE NO NODEJS
// infConfigStorage = { 'action': 'get', 'key': 'NomeDaChave' } // 'functionLocal' SOMENTE NO NODEJS
// infConfigStorage = { 'action': 'del', 'key': 'NomeDaChave' } // 'functionLocal' SOMENTE NO NODEJS
// retConfigStorage = await configStorage(infConfigStorage);
// console.log(retConfigStorage)

// let cs
// cs = await csf(['']); cs = cs.res // ***** CS ***** GET VALOR DO 'reg.json'
// console.log(cs)
// cs = await csf([{ 'a': 'b' }]); cs = cs.res // ***** CS ***** SET VALOR NO 'reg.json'
// console.log(cs)

async function configStorage(inf) {
    let ret = { 'ret': false };
    try {
        if (inf instanceof Array && inf.length == 1) { // ### CS
            inf['path'] = `${letter}:/${conf[2]}/log/reg.json`; let dt, rf = {}; if (inf[0] == '' || inf[0] == '*') {
                rf = await file({ 'action': 'read', 'path': inf.path }); if (!rf.ret) { dt = {} } else { dt = JSON.parse(rf.res).dt }
            } else { dt = typeof inf[0] === 'object' ? inf[0] : { 'key': inf[0] } };
            if (!rf.ret) { rf = await file({ 'action': 'write', 'path': inf.path, 'rewrite': false, 'text': JSON.stringify({ 'dt': dt }, null, 2) }) }
            ret['res'] = dt; ret['ret'] = true; ret['msg'] = 'CS: OK'
        } else {
            let run = false;
            if (!inf.action || !['set', 'get', 'del'].includes(inf.action)) {
                ret['msg'] = `\n\n #### ERRO #### CONFIG STORAGE \n INFORMAR O 'action' \n\n`
            } else {
                if ((!inf.key || inf.key == '')) {
                    ret['msg'] = `\n\n #### ERRO #### CONFIG STORAGE \n INFORMAR A 'key' \n\n`;
                } else {
                    if (inf.action == 'set' && !inf.value) {
                        ret['msg'] = `\n\n #### ERRO #### CONFIG STORAGE \n INFORMAR O 'value' \n\n`
                    } else {
                        run = true
                    }
                }
            };
            if (run) {
                if (eng) { // CHROME
                    if (inf.action == 'set') { // #### STORAGE: SET
                        await storageSet(inf);
                        async function storageSet(inf) {
                            return new Promise((resolve) => {
                                let data = {};
                                data[inf.key] = inf.value;
                                chrome.storage.local.set(data, async () => {
                                    if (chrome.runtime.lastError) {
                                        ret['msg'] = `\n\n #### ERRO #### STORAGE SET \n ${chrome.runtime.lastError} \n\n`
                                    } else {
                                        ret['msg'] = 'STORAGE SET: OK'
                                        ret['ret'] = true;
                                    };
                                    resolve(ret);
                                });
                            });
                        }
                    } else if (inf.action == 'get') { // #### STORAGE: GET
                        await storageGet(inf);
                        async function storageGet(inf) {
                            return new Promise((resolve) => {
                                chrome.storage.local.get(inf.key, async (result) => {
                                    if (chrome.runtime.lastError) {
                                        ret['msg'] = `\n\n #### ERRO #### STORAGE GET \n ${chrome.runtime.lastError} \n\n`
                                    } else if (Object.keys(result).length == 0) {
                                        async function checkConfig() {
                                            let infFile = { 'action': 'read', 'path': inf.path ? path : conf[0], 'functionLocal': true }
                                            let retFile = await file(infFile);
                                            let config = JSON.parse(retFile.res);
                                            if (config[inf.key]) {
                                                let data = {};
                                                data[inf.key] = config[inf.key];
                                                return new Promise((resolve) => {
                                                    chrome.storage.local.set(data, async () => {
                                                        if (chrome.runtime.lastError) {
                                                            ret['msg'] = `\n\n #### ERRO #### STORAGE SET* \n ${chrome.runtime.lastError} \n\n`
                                                        } else {
                                                            ret['res'] = config[inf.key]
                                                            ret['msg'] = 'STORAGE GET: OK';
                                                            ret['ret'] = true;
                                                        };
                                                        resolve(ret)
                                                    });
                                                })
                                            } else {
                                                ret['msg'] = `\n\n #### ERRO #### STORAGE GET \n CHAVE '${inf.key}' NAO ENCONTRADA \n\n`;
                                            }
                                        };
                                        await checkConfig()
                                    } else {
                                        ret['res'] = result[inf.key]
                                        ret['msg'] = 'STORAGE GET: OK';
                                        ret['ret'] = true;
                                    };
                                    resolve(ret);
                                });
                            });
                        }
                    } else if (inf.action == 'del') { // #### STORAGE: DEL
                        await storageDel(inf);
                        async function storageDel(inf) {
                            return new Promise((resolve) => {
                                chrome.storage.local.get(inf.key, async (result) => {
                                    if (chrome.runtime.lastError) {
                                        ret['msg'] = `\n\n #### ERRO #### STORAGE DEL \n ${chrome.runtime.lastError} \n\n`
                                    }
                                    else if (Object.keys(result).length == 0) {
                                        ret['msg'] = `\n\n #### ERRO #### STORAGE DEL \n CHAVE '${inf.key}' NAO ENCONTRADA \n\n`
                                    } else {
                                        chrome.storage.local.remove(inf.key, async () => { });
                                        ret['msg'] = 'STORAGE DEL: OK'
                                        ret['ret'] = true;
                                    };
                                    resolve(ret)
                                });
                                return
                            });
                        }
                    }
                } else { // ################## NODE
                    let infFile, retFile, config, path, ret_Fs = false;
                    if (inf.path && inf.path.includes(':')) {
                        path = inf.path
                    } else {
                        infFile = { 'action': 'relative', 'path': conf[0], 'functionLocal': typeof inf.functionLocal == 'boolean' && !inf.functionLocal ? false : true }
                        retFile = await file(infFile);
                        path = retFile.res[0]
                    };
                    try {
                        await _fs.promises.access(path);
                        ret_Fs = true
                    } catch (e) { }
                    if (ret_Fs) {
                        let configFile = await _fs.promises.readFile(path, 'utf8');
                        config = JSON.parse(configFile)
                    } else {
                        config = {}
                    }
                    if (!inf.key || inf.key == '') {
                        ret['msg'] = `\n\n #### ERRO #### CONFIG \n INFORMAR A 'key' \n\n`;
                    }
                    else if (inf.action == 'set') { // #### CONFIG: SET
                        if (!inf.value && !inf.value == false) {
                            ret['msg'] = `\n\n #### ERRO #### CONFIG \n INFORMAR O 'value' \n\n`
                        } else {
                            if (inf.key == '*' && typeof inf.value !== 'object') {
                                ret['msg'] = `\n\n #### ERRO #### CONFIG \n VALOR NAO É OBJETO \n\n`
                            } else if (inf.key == '*') {
                                config = inf.value
                            } else {
                                config[inf.key] = inf.value
                            };
                            if (!ret.msg) {
                                infFile = { 'action': 'write', 'path': path, 'rewrite': false, 'text': JSON.stringify(config, null, 2) }
                                retFile = await file(infFile);
                                ret['msg'] = `CONFIG SET: OK`
                                ret['ret'] = true;
                            }
                        }
                    } else if (inf.action == 'get') { // #### CONFIG NODE: GET
                        if (!ret_Fs) {
                            ret['msg'] = `\n\n #### ERRO #### CONFIG GET \n ARQUIVO '${path}' NAO ENCONTRADO \n\n`
                        } else if (inf.key == '*' || (inf.key !== '*' && config[inf.key])) {
                            ret['res'] = inf.key == '*' ? config : config[inf.key]
                            ret['msg'] = `CONFIG GET: OK`;
                            ret['ret'] = true;
                        } else {
                            ret['msg'] = `\n\n #### ERRO #### CONFIG GET \n CHAVE '${inf.key}' NAO ENCONTRADA \n\n`
                        }
                    } else if (inf.action == 'del') { // #### CONFIG NODE: DEL
                        if (!ret_Fs) {
                            ret['msg'] = `\n\n #### ERRO #### CONFIG DEL\n ARQUIVO '${path}' NAO ENCONTRADO \n\n`
                        } else if (config[inf.key]) {
                            delete config[inf.key];
                            infFile = { 'action': 'write', 'path': path, 'rewrite': false, 'text': JSON.stringify(config, null, 2) }
                            retFile = await file(infFile);
                            ret['msg'] = `CONFIG DEL: OK`
                            ret['ret'] = true;
                        } else {
                            ret['msg'] = `\n\n #### ERRO #### CONFIG DEL \n CHAVE '${inf.key}' NAO ENCONTRADA \n\n`;
                        }
                    }
                }
            }
        }

        // ### LOG FUN ###
        if (inf.logFun) {
            let infFile = { 'action': 'write', 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }, retFile
            infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; retFile = await file(infFile);
        }
    } catch (e) {
        // let m = await regexE({ 'e': e });
        // ret['msg'] = m.res
        console.log(e)
    };
    return {
        ...({ ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}

if (eng) { // CHROME
    window['configStorage'] = configStorage;
    window['csf'] = configStorage;
} else { // NODEJS
    global['configStorage'] = configStorage;
    global['csf'] = configStorage;
}

// NÃO COMENTAR! NECESSÁRIO PARA DEFINIR AS VARIÁVEIS GLOBAIS
let retConfigStorage = await configStorage({ 'action': 'get', 'key': 'webSocket', });
let secReconnect = retConfigStorage.res.secReconnect
let secPing = retConfigStorage.res.secPing
let par1 = retConfigStorage.res.par1
let par2 = retConfigStorage.res.par2
let par3 = retConfigStorage.res.par3
let par4 = retConfigStorage.res.par4
let par5 = retConfigStorage.res.par5
let par6 = retConfigStorage.res.par6
let par7 = retConfigStorage.res.par7
let securityPass = retConfigStorage.res.securityPass
let serverWeb = retConfigStorage.res.server['1']
let serverLocal = retConfigStorage.res.server['2']
let url = serverWeb.url;
let hostWeb = serverWeb.host;
let portWeb = serverWeb.port
let hostLocal = serverLocal.host;
let portLocal = serverLocal.port
let devices = retConfigStorage.res.devices
let devChromeWeb = `${url}://${hostWeb}:${portWeb}/${devices[0].name}`
let devChromeLocal = `${url}://${hostLocal}:${portLocal}/${devices[0].name}`
let devNodeJSWeb = `${url}://${hostWeb}:${portWeb}/${devices[1].name}`
let devNodeJSLocal = `${url}://${hostLocal}:${portLocal}/${devices[1].name}`
let devBlueStacksWeb = `${url}://${hostWeb}:${portWeb}/${devices[2].name}`
let devBlueStacksLocal = `${url}://${hostLocal}:${portLocal}/${devices[2].name}`
let devEC2Web = `${url}://${hostWeb}:${portWeb}/${devices[3].name}`
let devEC2Local = `${url}://${hostLocal}:${portLocal}/${devices[3].name}`

if (eng) { // CHROME
    window['secReconnect'] = secReconnect
    window['secPing'] = secPing
    window['par1'] = par1
    window['par2'] = par2
    window['par3'] = par3
    window['par4'] = par4
    window['par5'] = par5
    window['par6'] = par6
    window['par7'] = par7
    window['securityPass'] = securityPass
    window['port'] = portWeb
    window['devChromeWeb'] = devChromeWeb
    window['devChromeLocal'] = devChromeLocal
    window['devNodeJSWeb'] = devNodeJSWeb
    window['devNodeJSLocal'] = devNodeJSLocal
    window['devBlueStacksWeb'] = devBlueStacksWeb
    window['devBlueStacksLocal'] = devBlueStacksLocal
    window['devEC2Web'] = devEC2Web
    window['devEC2Local'] = devEC2Local
} else { // NODEJS
    global['secReconnect'] = secReconnect
    global['secPing'] = secPing
    global['par1'] = par1
    global['par2'] = par2
    global['par3'] = par3
    global['par4'] = par4
    global['par5'] = par5
    global['par6'] = par6
    global['par7'] = par7
    global['securityPass'] = securityPass
    global['port'] = portWeb
    global['devChromeWeb'] = devChromeWeb
    global['devChromeLocal'] = devChromeLocal
    global['devNodeJSWeb'] = devNodeJSWeb
    global['devNodeJSLocal'] = devNodeJSLocal
    global['devBlueStacksWeb'] = devBlueStacksWeb
    global['devBlueStacksLocal'] = devBlueStacksLocal
    global['devEC2Web'] = devEC2Web
    global['devEC2Local'] = devEC2Local
}


