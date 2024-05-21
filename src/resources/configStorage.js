// let infConfigStorage, retConfigStorage
// infConfigStorage = { 'e': e, 'action': 'set', 'functionLocal': true, 'key': 'NomeDaChave', 'value': 'Valor da chave' }
// infConfigStorage = { 'e': e, 'action': 'get', 'functionLocal': true, 'key': 'NomeDaChave' }
// infConfigStorage = { 'e': e, 'action': 'del', 'functionLocal': true, 'key': 'NomeDaChave' }
// retConfigStorage = await configStorage(infConfigStorage); console.log(retConfigStorage)

// let cs
// cs = await csf(['']); cs = cs.res // ***** CS ***** GET VALOR DO 'reg.json'
// console.log(cs)
// cs = await csf([{ 'a': 'b' }]); cs = cs.res // ***** CS ***** SET VALOR NO 'reg.json'
// console.log(cs)

let e = import.meta.url, ee = e;
async function configStorage(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    try {
        if (!eng && inf instanceof Array && inf.length == 1) { // ### CS
            inf['path'] = `${letter}:/${globalWindow.root}/${globalWindow.functions}/log/reg.json`; let dt, rf = {}; if (inf[0] == '' || inf[0] == '*') {
                rf = await file({ 'e': e, 'action': 'read', 'path': inf.path }); if (!rf.ret) { dt = {} } else { dt = JSON.parse(rf.res).dt }
            } else { dt = typeof inf[0] === 'object' ? inf[0] : { 'key': inf[0] } };
            if (!rf.ret) { rf = await file({ 'e': e, 'action': 'write', 'path': inf.path, 'rewrite': false, 'text': JSON.stringify({ 'dt': dt }, null, 2) }) }
            ret['res'] = dt; ret['ret'] = true; ret['msg'] = 'CS: OK'
        } else {
            let run = false;
            if (!inf.action || !['set', 'get', 'del'].includes(inf.action)) {
                ret['msg'] = `CONFIG STORAGE: ERRO | INFORMAR O 'action'`;
            } else {
                if ((!inf.key || inf.key == '')) {
                    ret['msg'] = `CONFIG STORAGE: ERRO | INFORMAR A 'key'`;
                } else {
                    if (inf.action == 'set' && !inf.value) {
                        ret['msg'] = `CONFIG STORAGE: ERRO | INFORMAR O 'value'`;
                    } else { run = true }
                }
            };
            if (run) {
                if (eng) { // CHROME
                    if (inf.action == 'set') { // #### STORAGE: SET
                        await storageSet(inf); async function storageSet(inf) {
                            return new Promise((resolve) => {
                                let data = {}; data[inf.key] = inf.value; chrome.storage.local.set(data, async () => {
                                    if (chrome.runtime.lastError) {
                                        ret['msg'] = `STORAGE [SET]: ERRO | ${chrome.runtime.lastError}`;
                                    } else {
                                        ret['msg'] = 'STORAGE SET: OK'
                                        ret['ret'] = true;
                                    }; resolve(ret);
                                });
                            });
                        }
                    } else if (inf.action == 'get') { // #### STORAGE: GET
                        await storageGet(inf); async function storageGet(inf) {
                            return new Promise((resolve) => {
                                chrome.storage.local.get(inf.key, async (result) => {
                                    if (chrome.runtime.lastError) {
                                        ret['msg'] = `STORAGE [GET]: ERRO | ${chrome.runtime.lastError}`;
                                    } else if (Object.keys(result).length == 0) {
                                        async function checkConfig() {
                                            let infFile = { 'e': e, 'action': 'read', 'path': inf.path ? inf.path : globalWindow.conf, 'functionLocal': true }; let retFile = await file(infFile); let config = JSON.parse(retFile.res);
                                            if (config[inf.key]) {
                                                let data = {}; data[inf.key] = config[inf.key]; return new Promise((resolve) => {
                                                    chrome.storage.local.set(data, async () => {
                                                        if (chrome.runtime.lastError) {
                                                            ret['msg'] = `STORAGE [SET*]: ERRO | ${chrome.runtime.lastError}`;
                                                        } else {
                                                            ret['res'] = config[inf.key]
                                                            ret['msg'] = 'STORAGE GET: OK';
                                                            ret['ret'] = true;
                                                        }; resolve(ret)
                                                    });
                                                })
                                            } else {
                                                ret['msg'] = `STORAGE [GET]: ERRO |  CHAVE '${inf.key}' NAO ENCONTRADA`;
                                            }
                                        }; await checkConfig()
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
                        await storageDel(inf); async function storageDel(inf) {
                            return new Promise((resolve) => {
                                chrome.storage.local.get(inf.key, async (result) => {
                                    if (chrome.runtime.lastError) {
                                        ret['msg'] = `STORAGE [DEL]: ERRO | ${chrome.runtime.lastError}`;
                                    } else if (Object.keys(result).length == 0) {
                                        ret['msg'] = `STORAGE [DEL]: ERRO | CHAVE '${inf.key}' NAO ENCONTRADA`;
                                    } else {
                                        chrome.storage.local.remove(inf.key, async () => { });
                                        ret['msg'] = 'STORAGE DEL: OK'
                                        ret['ret'] = true;
                                    }; resolve(ret)
                                });
                                return
                            });
                        }
                    }
                } else { // ################## NODE
                    let infFile, retFile, config, path, ret_Fs = false; if (inf.path && inf.path.includes(':')) { path = inf.path }
                    else {
                        infFile = { 'e': e, 'action': 'relative', 'path': inf.path ? inf.path : globalWindow.conf, 'functionLocal': typeof inf.functionLocal == 'boolean' && !inf.functionLocal ? false : true }
                        retFile = await file(infFile); path = retFile.res[0]
                    }; try { await _fs.promises.access(path); ret_Fs = true } catch (catchErr) { }
                    if (ret_Fs) { let configFile = await _fs.promises.readFile(path, 'utf8'); config = JSON.parse(configFile) } else { config = {} }
                    if (!inf.key || inf.key == '') {
                        ret['msg'] = `CONFIG: ERRO | INFORMAR A 'key'`;
                    } else if (inf.action == 'set') { // #### CONFIG: SET
                        if (!inf.value && !inf.value == false) {
                            ret['msg'] = `CONFIG: ERRO | INFORMAR O 'value'`;
                        } else {
                            if (inf.key == '*' && typeof inf.value !== 'object') {
                                ret['msg'] = `CONFIG: ERRO | VALOR NAO É OBJETO`;
                            } else if (inf.key == '*') { config = inf.value } else { config[inf.key] = inf.value };
                            if (!ret.msg) {
                                infFile = { 'e': e, 'action': 'write', 'path': path, 'rewrite': false, 'text': JSON.stringify(config, null, 2) }; retFile = await file(infFile);
                                ret['msg'] = `CONFIG SET: OK`
                                ret['ret'] = true;
                            }
                        }
                    } else if (inf.action == 'get') { // #### CONFIG NODE: GET
                        if (!ret_Fs) {
                            ret['msg'] = `CONFIG [GET]: ERRO | ARQUIVO '${path}' NAO ENCONTRADO`;
                        } else if (inf.key == '*' || (inf.key !== '*' && config[inf.key])) {
                            ret['res'] = inf.key == '*' ? config : config[inf.key]
                            ret['msg'] = `CONFIG GET: OK`;
                            ret['ret'] = true;
                        } else {
                            ret['msg'] = `CONFIG [GET]: ERRO | CHAVE '${inf.key}' NAO ENCONTRADA`;
                        }
                    } else if (inf.action == 'del') { // #### CONFIG NODE: DEL
                        if (!ret_Fs) {
                            ret['msg'] = `CONFIG [DEL]: ERRO | ARQUIVO '${path}' NAO ENCONTRADO`;
                        } else if (config[inf.key]) {
                            delete config[inf.key]; infFile = { 'e': e, 'action': 'write', 'path': path, 'rewrite': false, 'text': JSON.stringify(config, null, 2) }; retFile = await file(infFile);
                            ret['msg'] = `CONFIG DEL: OK`
                            ret['ret'] = true;
                        } else {
                            ret['msg'] = `CONFIG [DEL]: ERRO | CHAVE '${inf.key}' NAO ENCONTRADA`;
                        }
                    }
                }
            }
        }

    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, });
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