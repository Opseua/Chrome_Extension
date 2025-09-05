

// 'functionLocal': true/CHAVE_AUSENTE → SALVA EM 'PROJETOS/Chrome_Extension/src/config.json'
// 'functionLocal': false              → SALVA EM 'PROJETOS/__ProjetoAtual__/src/config.json'
// 'path': `!fileProjetos!/TESTE/arquivoConfig.json`
// 'path': `./logs/arquivoConfig.json`
// 'path': `!letter!:/PASTA/arquivoConfig.json`

// let infConfigStorage, retConfigStorage; // 'returnValueKey' → true | 'returnValueAll' → true  | 'key' → '*'
// infConfigStorage = { e, 'action': 'set', 'key': 'NomeDaChave', 'value': 'Valor da chave', };
// infConfigStorage = { e, 'action': 'get', 'key': 'NomeDaChave', };
// infConfigStorage = { e, 'action': 'del', 'key': 'NomeDaChave', };
// retConfigStorage = await configStorage(infConfigStorage); console.log(retConfigStorage);

// let cs;
// cs = await csf(['',]); cs = cs.res; // ***** CS ***** GET VALOR DO 'reg.json'
// console.log(cs);
// cs = await csf([{ 'a': 'b', },]); cs = cs.res; // ***** CS ***** SET VALOR NO 'reg.json'
// console.log(cs);

let e = currentFile(new Error()), ee = e;
async function configStorage(inf = {}) {
    let ret = { 'ret': false, }; e = inf.e || e;
    try {
        let { action = false, functionLocal = true, key = false, value = '#_VAZIA_#', path = gW.conf, returnValueKey = false, returnValueAll = false, } = inf;

        let type = eng ? 'STORAGE' : 'CONFIG'; functionLocal = eng ? true : functionLocal;

        async function processJson(inf = {}) {
            let { action, key, value, config, } = inf; let ret = false, msg, res; if (eng) { // CHROME
                let dados = await new Promise((resolve) => { chrome.storage.local.get(null, async (result) => { resolve(result); }); }); config = { ...dados, ...config, };
            } if (action === 'set') { // ### SET
                if (key !== '*') { config[key] = value; ret = true; } else if (typeof value === 'object') { config = value; ret = true; } else { msg = `${type} [SET]: ERRO | value NÃO É OBJETO`; }
            } else if (action === 'get') { // ### GET
                if (key !== '*' && !config[key]) { msg = `${type} [GET]: ERRO | key '${key}' NÃO ENCONTRADA`; } else { ret = true; }
            } else if (action === 'del') { // ### DEL
                if (key !== '*' && !config[key]) { msg = `${type} [DEL]: ERRO | key '${key}' NÃO ENCONTRADA`; } else { if (key === '*') { config = {}; } else { delete config[key]; } ret = true; }
            } if (ret) { msg = `${type} [${action.toUpperCase()}]: OK`; res = config; } return { ret, msg, res, };
        }

        if (path && (path.includes('!') || path.includes('%'))) {
            path = replaceVars({ 'content': path, });
        } else if (path && !path.includes(':')) { path = await file({ e, 'action': 'relative', path, functionLocal, }); path = path.res[0]; }

        if (!eng && Array.isArray(inf) && inf.length === 1) { // ### CS
            inf['path'] = `${fileProjetos}/${gW.functions}/logs/reg.json`; let dt, rf = {};
            if (inf[0] === '' || inf[0] === '*') { rf = await file({ e, 'action': 'read', path, functionLocal, }); if (!rf.ret) { dt = {}; } else { dt = JSON.parse(rf.res).dt; } }
            else { dt = typeof inf[0] === 'object' ? inf[0] : { 'key': inf[0], }; } if (!rf.ret) { rf = await file({ e, 'action': 'write', path, 'content': JSON.stringify({ dt, }, null, 2), functionLocal, }); }
            ret['res'] = dt; ret['ret'] = true; ret['msg'] = 'CS: OK';
        } else if (!action || !['set', 'get', 'del',].includes(action)) {
            ret['msg'] = `${type}: ERRO | INFORMAR O 'action'`;
        } else if ((!key || key === '')) {
            ret['msg'] = `${type} [${action.toUpperCase()}]: ERRO | INFORMAR A 'key'`;
        } else if (action === 'set' && value === '#_VAZIA_#') {
            ret['msg'] = `${type} [SET]: ERRO | INFORMAR O 'value'`;
        } else {

            let config, ok, retFile = await file({ e, action: 'read', path, functionLocal, }); if ((['get', 'del',].includes(action) || (eng)) && !retFile.ret) { return retFile; }
            config = retFile.ret ? JSON.parse(retFile.res) : {}; ok = await processJson({ action, key, value, config, });
            if (['get', 'del',].includes(action)) { returnValueKey = false; if (action === 'get') { returnValueAll = false; } }
            if (ok.ret) {
                config = ok.res;
                if (['set', 'del',].includes(action)) {
                    // SALVAR AS ALTERAÇÕES
                    if (eng) {
                        // CHROME
                        await new Promise((resolve) => { chrome.storage.local.clear(async () => { resolve(true); }); }); // STORAGE: LIMPAR (É NECESSÁRIO LIMPAR!!!)
                        await new Promise((resolve) => { chrome.storage.local.set(config, async () => { resolve(true); }); }); // STORAGE: DEFINIR
                    } else {
                        // NODE
                        retFile = await file({ e, 'action': 'write', path, 'content': JSON.stringify(ok.res, null, 2), functionLocal, }); if (!retFile.ret) { return ret; }
                    }
                }
                ret['ret'] = true;
                if ((['set', 'del',].includes(action) && (returnValueKey || returnValueAll)) || action === 'get') {
                    key = returnValueAll ? '*' : returnValueKey ? key : key; ret['res'] = key === '*' ? config : config[key];
                }
            } ret['msg'] = `${ok.msg}`;
        }

    } catch (catchErr) {
        let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    }

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.hasOwnProperty('res') && { 'res': ret.res, }), };
}

// CHROME | NODE
globalThis['configStorage'] = configStorage;


