// let infConfigStorage, retConfigStorage; // 'logFun': true, 'functionLocal': false, SOMENTE NO NODEJS
// infConfigStorage = { 'e': e, 'action': 'set', 'functionLocal': false, 'key': 'NomeDaChave', 'value': 'Valor da chave' }
// infConfigStorage = { 'e': e, 'action': 'get', 'functionLocal': false, 'key': 'NomeDaChave' }
// infConfigStorage = { 'e': e, 'action': 'del', 'functionLocal': false, 'key': 'NomeDaChave' }
// retConfigStorage = await configStorage(infConfigStorage);
// console.log(retConfigStorage)

// let cs
// cs = await csf(['']); cs = cs.res // ***** CS ***** GET VALOR DO 'reg.json'
// console.log(cs)
// cs = await csf([{ 'a': 'b' }]); cs = cs.res // ***** CS ***** SET VALOR NO 'reg.json'
// console.log(cs)

let e = import.meta.url;
async function configStorage(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        let errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; let retRegexE = await regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
    try {
        let confKeep = conf
        if (!eng && inf && inf.e) {
            let regex = e.match(/(file:\/\/\/.*?PROJETOS\/[^\/]+)/)
            if (regex) { confKeep[3] = regex[1].replace('file:///', '').split(':/')[1] }
        }

        if (inf instanceof Array && inf.length == 1) { // ### CS
            inf['path'] = `${letter}:/${confKeep[2]}/log/reg.json`; let dt, rf = {}; if (inf[0] == '' || inf[0] == '*') {
                rf = await file({ 'e': e, 'action': 'read', 'path': inf.path }); if (!rf.ret) { dt = {} } else { dt = JSON.parse(rf.res).dt }
            } else { dt = typeof inf[0] === 'object' ? inf[0] : { 'key': inf[0] } };
            if (!rf.ret) { rf = await file({ 'e': e, 'action': 'write', 'path': inf.path, 'rewrite': false, 'text': JSON.stringify({ 'dt': dt }, null, 2) }) }
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
                                            let infFile = { 'e': e, 'action': 'read', 'path': inf.path ? inf.path : confKeep[0], 'functionLocal': true }
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
                        infFile = { 'e': e, 'action': 'relative', 'path': inf.path ? inf.path : confKeep[0], 'functionLocal': typeof inf.functionLocal == 'boolean' && !inf.functionLocal ? false : true }
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
                                infFile = { 'e': e, 'action': 'write', 'path': path, 'rewrite': false, 'text': JSON.stringify(config, null, 2) }
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
                            infFile = { 'e': e, 'action': 'write', 'path': path, 'rewrite': false, 'text': JSON.stringify(config, null, 2) }
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
        if (inf && inf.logFun) {
            let infFile = { 'e': e, 'action': 'write', 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }, retFile
            infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; retFile = await file(infFile);
        }
    } catch (e) {
        let retRegexE = await regexE({ 'inf': inf, 'e': e, 'catchGlobal': false });
        ret['msg'] = retRegexE.res
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

// // NÃO COMENTAR! NECESSÁRIO PARA DEFINIR AS VARIÁVEIS GLOBAIS
let retConfigStorage = await configStorage({ 'action': 'get', 'key': 'webSocket', });
let securityPass = `${retConfigStorage.res.securityPass}`
let secReconnect = retConfigStorage.res.secReconnect
let secPing = retConfigStorage.res.secPing
let secScreenShot = retConfigStorage.res.secScreenShot
let secMaxWebFile = retConfigStorage.res.secMaxWebFile
let par1 = `${securityPass}=${retConfigStorage.res.par1}`
let par2 = `${retConfigStorage.res.par2}`
let par3 = `${securityPass}=${retConfigStorage.res.par3}`
let par4 = `${securityPass}=${retConfigStorage.res.par4}`
let par5 = `${securityPass}=${retConfigStorage.res.par5}`
let par6 = `${retConfigStorage.res.par6}`
let par7 = `${retConfigStorage.res.par7}`
let par8 = `${securityPass}=${retConfigStorage.res.par8}`
let par9 = `${securityPass}=${retConfigStorage.res.par9}`
let par10 = `${securityPass}=${retConfigStorage.res.par10}`
let par11 = `${securityPass}=${retConfigStorage.res.par11}`
let serverWeb = retConfigStorage.res.server['1']
let serverLocal = retConfigStorage.res.server['2']
let url = `${serverWeb.url}`
let hostWeb = `${serverWeb.host}`
let portWeb = `${Number(serverWeb.port)}`
let hostLocal = `${serverLocal.host}`
let portLocal = `${Number(serverLocal.port)}`
let devices = retConfigStorage.res.devices
let urlHostPortWeb = `${url}://${hostWeb}:${portWeb}`
let urlHostPortLocal = `${url}://${hostLocal}:${portLocal}`
let devMaster = `${devices[0].master}`
let sheetServer = retConfigStorage.res.sheetServer

let devSend, devGet
if (eng) { // CHROME | Send → NodeJS | Get → Chrome 
    devSend = `${letter == 'D' ? urlHostPortLocal : urlHostPortWeb}/${devMaster}_${devices[2].name}`
    devGet = [`${urlHostPortWeb}/${devices[1].name}`, `${urlHostPortLocal}/${devices[1].name}`]
} else { // NODEJS | Send → Chrome | Get → NodeJS
    devSend = `${letter == 'D' ? urlHostPortLocal : urlHostPortWeb}/${devices[1].name}`
    devGet = [`${urlHostPortWeb}/${devMaster}_${devices[2].name}`, `${urlHostPortLocal}/${devMaster}_${devices[2].name}`,]
}

if (eng) { // CHROME
    window['serverWeb'] = serverWeb.host
    window['secReconnect'] = secReconnect
    window['secPing'] = secPing
    window['secScreenShot'] = secScreenShot
    window['secMaxWebFile'] = secMaxWebFile
    window['par1'] = par1
    window['par2'] = par2
    window['par3'] = par3
    window['par4'] = par4
    window['par5'] = par5
    window['par6'] = par6
    window['par7'] = par7
    window['par8'] = par8
    window['par9'] = par9
    window['par10'] = par10
    window['par11'] = par11
    window['securityPass'] = securityPass
    window['portWeb'] = portWeb
    window['portLocal'] = portLocal
    window['devMaster'] = devMaster
    window['devSend'] = devSend
    window['devGet'] = devGet
    window['sheetServer'] = sheetServer
} else { // NODEJS
    global['serverWeb'] = serverWeb.host
    global['secReconnect'] = secReconnect
    global['secPing'] = secPing
    global['secScreenShot'] = secScreenShot
    global['secMaxWebFile'] = secMaxWebFile
    global['par1'] = par1
    global['par2'] = par2
    global['par3'] = par3
    global['par4'] = par4
    global['par5'] = par5
    global['par6'] = par6
    global['par7'] = par7
    global['par8'] = par8
    global['par9'] = par9
    global['par10'] = par10
    global['par11'] = par11
    global['securityPass'] = securityPass
    global['portWeb'] = portWeb
    global['portLocal'] = portLocal
    global['devMaster'] = devMaster
    global['devSend'] = devSend
    global['devGet'] = devGet
    global['sheetServer'] = sheetServer
}


