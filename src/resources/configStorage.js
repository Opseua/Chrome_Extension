// let infConfigStorage, retConfigStorage
// infConfigStorage = { e, 'action': 'set', 'functionLocal': true, 'key': 'NomeDaChave', 'value': 'Valor da chave', 'returnValueAll': true, 'returnValueKey': true, };
// infConfigStorage = { e, 'action': 'get', 'functionLocal': true, 'key': 'NomeDaChave', };
// infConfigStorage = { e, 'action': 'del', 'functionLocal': true, 'key': 'NomeDaChave', 'returnValueAll': true, };
// retConfigStorage = await configStorage(infConfigStorage); console.log(retConfigStorage);

// let cs
// cs = await csf(['']); cs = cs.res // ***** CS ***** GET VALOR DO 'reg.json'
// console.log(cs)
// cs = await csf([{ 'a': 'b' }]); cs = cs.res // ***** CS ***** SET VALOR NO 'reg.json'
// console.log(cs)

let e = import.meta.url, ee = e;
async function configStorage(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        let { action, functionLocal, key, value, path, returnValueKey, returnValueAll, } = inf;

        if (!eng && Array.isArray(inf) && inf.length == 1) { // ### CS
            inf['path'] = `${letter}:/${gW.root}/${gW.functions}/log/reg.json`; let dt, rf = {}; if (inf[0] == '' || inf[0] == '*') {
                rf = await file({ e, 'action': 'read', 'path': path }); if (!rf.ret) { dt = {} } else { dt = JSON.parse(rf.res).dt }
            } else { dt = typeof inf[0] === 'object' ? inf[0] : { 'key': inf[0] } };
            if (!rf.ret) { rf = await file({ e, 'action': 'write', 'path': path, 'rewrite': false, 'text': JSON.stringify({ 'dt': dt }, null, 2) }) }
            ret['res'] = dt; ret['ret'] = true; ret['msg'] = 'CS: OK'
        } else {
            let run = false;
            if (!action || !['set', 'get', 'del'].includes(action)) { ret['msg'] = `CONFIG STORAGE: ERRO | INFORMAR O 'action'`; }
            else {
                if ((!key || key == '')) { ret['msg'] = `CONFIG STORAGE: ERRO | INFORMAR A 'key'`; }
                else { if (action == 'set' && !value) { ret['msg'] = `CONFIG STORAGE: ERRO | INFORMAR O 'value'`; } else { run = true } }
            }; if (run) {
                if (eng) { // CHROME
                    if (action == 'set') {
                        // #### STORAGE: SET
                        async function storageSet(inf = {}) {
                            let { key, value, } = inf; return new Promise((resolve) => {
                                let data = {}; data[key] = value; chrome.storage.local.set(data, async () => {
                                    if (chrome.runtime.lastError) { ret['msg'] = `STORAGE [SET]: ERRO | ${chrome.runtime.lastError}`; } else {
                                        ret['ret'] = true; ret['msg'] = 'STORAGE SET: OK'; if (returnValueAll || returnValueKey) {
                                            let retConfigStorage = await configStorage({ e, 'action': 'get', 'functionLocal': true, 'key': returnValueAll ? '*' : key, }); ret['res'] = retConfigStorage.res;
                                        }; resolve(ret);
                                    };
                                });
                            });
                        }; await storageSet(inf);
                    } else if (action == 'get') {
                        // #### STORAGE: GET
                        async function storageGet(inf = {}) {
                            let { key, path, } = inf; return new Promise((resolve) => {
                                chrome.storage.local.get(key == '*' ? null : key, async (result) => {
                                    if (chrome.runtime.lastError) { ret['msg'] = `STORAGE [GET]: ERRO | ${chrome.runtime.lastError}`; }
                                    else if (Object.keys(result).length == 0) {
                                        async function checkConfig() {
                                            let infFile = { e, 'action': 'read', 'path': path ? path : gW.conf, 'functionLocal': true }; let retFile = await file(infFile); let config = JSON.parse(retFile.res);
                                            if (config[key]) {
                                                let data = {}; data[key] = config[key]; return new Promise((resolve) => {
                                                    chrome.storage.local.set(data, async () => {
                                                        if (chrome.runtime.lastError) { ret['msg'] = `STORAGE [SET*]: ERRO | ${chrome.runtime.lastError}`; }
                                                        else { ret['res'] = config[key]; ret['msg'] = 'STORAGE GET: OK'; ret['ret'] = true; }; resolve(ret)
                                                    });
                                                })
                                            } else { ret['msg'] = `STORAGE [GET]: ERRO |  CHAVE '${key}' NAO ENCONTRADA`; }
                                        }; await checkConfig()
                                    } else { ret['res'] = key == '*' ? result : result[key]; ret['msg'] = 'STORAGE GET: OK'; ret['ret'] = true; }; resolve(ret);
                                });
                            });
                        }; await storageGet(inf);
                    } else if (action == 'del') {
                        // #### STORAGE: DEL
                        async function storageDel(inf = {}) {
                            let { key, } = inf; return new Promise((resolve) => {
                                chrome.storage.local.get(key, async (result) => {
                                    if (chrome.runtime.lastError) { ret['msg'] = `STORAGE [DEL]: ERRO | ${chrome.runtime.lastError}`; }
                                    else if (Object.keys(result).length == 0) { ret['msg'] = `STORAGE [DEL]: ERRO | CHAVE '${key}' NAO ENCONTRADA`; }
                                    else { chrome.storage.local.remove(key, async () => { }); ret['msg'] = 'STORAGE DEL: OK'; ret['ret'] = true; }; resolve(ret)
                                }); return
                            });
                        }; await storageDel(inf);
                    }
                } else { // ################## NODE
                    let infFile, retFile, config, ret_Fs = false; if (path && path.includes(':')) { path = path } else {
                        infFile = { e, 'action': 'relative', 'path': path ? path : gW.conf, 'functionLocal': typeof functionLocal == 'boolean' && !functionLocal ? false : true }
                        retFile = await file(infFile); path = retFile.res[0]
                    }; try { await _fs.promises.access(path); ret_Fs = true } catch (catchErr) { esLintIgnore = catchErr; }; if (ret_Fs) { let configFile = await _fs.promises.readFile(path, 'utf8'); config = JSON.parse(configFile) }
                    else { config = {} }; if (!key || key == '') { ret['msg'] = `CONFIG: ERRO | INFORMAR A 'key'`; } else if (action == 'set') { // #### CONFIG: SET
                        if (!value && !value == false) { ret['msg'] = `CONFIG: ERRO | INFORMAR O 'value'`; } else {
                            if (key == '*' && typeof value !== 'object') { ret['msg'] = `CONFIG: ERRO | VALOR NAO É OBJETO`; } else if (key == '*') { config = value } else { config[key] = value }; if (!ret.msg) {
                                infFile = { e, 'action': 'write', 'path': path, 'rewrite': false, 'text': JSON.stringify(config, null, 2) }; retFile = await file(infFile);
                                ret['ret'] = true; ret['msg'] = `CONFIG SET: OK`; if (returnValueAll) { ret['res'] = config; } else if (returnValueKey) { ret['res'] = config[key]; };
                            }
                        }
                    } else if (action == 'get') { // #### CONFIG NODE: GET
                        if (!ret_Fs) { ret['msg'] = `CONFIG [GET]: ERRO | ARQUIVO '${path}' NAO ENCONTRADO`; } else if (key == '*' || (key !== '*' && config[key])) {
                            ret['res'] = key == '*' ? config : config[key]; ret['msg'] = `CONFIG GET: OK`; ret['ret'] = true;
                        } else { ret['msg'] = `CONFIG [GET]: ERRO | CHAVE '${key}' NAO ENCONTRADA`; }
                    } else if (action == 'del') { // #### CONFIG NODE: DEL
                        if (!ret_Fs) { ret['msg'] = `CONFIG [DEL]: ERRO | ARQUIVO '${path}' NAO ENCONTRADO`; } else if (config[key]) {
                            delete config[key]; infFile = { e, 'action': 'write', 'path': path, 'rewrite': false, 'text': JSON.stringify(config, null, 2) }; retFile = await file(infFile);
                            ret['msg'] = `CONFIG DEL: OK`; ret['ret'] = true;
                        } else { ret['msg'] = `CONFIG [DEL]: ERRO | CHAVE '${key}' NAO ENCONTRADA`; }; if (returnValueAll) { ret['res'] = config; };
                    }
                }
            }
        }

    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    };

    return { ...({ 'ret': ret.ret }), ...(ret.msg && { 'msg': ret.msg }), ...(ret.res && { 'res': ret.res }), };
};

// CHROME | NODEJS
(eng ? window : global)['configStorage'] = configStorage;