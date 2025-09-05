// let infTabAction, retTabAction; // [search] → 'ATIVA', 'TODAS', '*www.google.com*' ou 12345678 (ID)
// infTabAction = {
//     'search': '*www.google.com*', 'active': false, 'pinned': false, 'index': 0, 'close': false, 'title': 'Novo título da aba',
//     // 'openOrReload': 'https://www.google.com', // 'https://www.google.com': [SE EXISTIR: NÃO] → open | true: [SE EXISTIR: SIM] → reload | 'https://www.bing.com': [SE EXISTIR: SIM] → navegate
// };
// retTabAction = await tabAction(infTabAction); console.log(retTabAction);

let e = currentFile(new Error()), ee = e;
async function tabAction(inf = {}) {
    let ret = { 'ret': false, }; e = inf.e || e;
    try {
        let { search = '_NAO_INFORMADO_', openOrReload, active, pinned, index, title, close, } = inf;

        let tabsIdFound = []; async function getTabsInfo(tabId) {
            return new Promise(resolve => {
                c.query({}, tabs => {
                    let res = []; for (let t of tabs) {
                        if (tabId === null || t.id === tabId) {
                            let d = dateHour(t.lastAccessed).res; d = `${d.yea}_${d.mon}_${d.day}-${d.hou}.${d.min}.${d.sec}`;
                            res.push({ 'id': t.id, 'title': t.title, 'url': t.url, 'active': t.active, 'index': t.index, 'pinned': t.pinned, 'incognito': t.incognito, 'lastAccessed': d, 'status': t.status, });
                        }
                    } resolve(res);
                });
            });
        }

        // ABA(s): BUSCAR
        let newTab, c = chrome.tabs, res = [], tabs = await new Promise(resolve => c.query({}, resolve)); if (search === 'ATIVA') { let tab = tabs.find(t => t.active); if (tab) { tabsIdFound.push({ ...tab, }); } }
        else if (search === 'TODAS') { tabsIdFound = tabs.map(t => ({ ...t, })); } else if (typeof search === 'number') { let tab = tabs.find(t => t.id === search); if (tab) { tabsIdFound.push({ ...tab, }); } }
        else if (typeof search === 'string' && search) { for (let t of tabs) { if (regex({ e, pattern: search, text: t.url, }).ret || regex({ e, pattern: search, text: t.title, }).ret) { tabsIdFound.push({ ...t, }); } } }

        // (SE NECESSÁRIO) ABA: ABRIR
        let u = openOrReload; if (typeof u === 'string' && !u.includes('chrome') && !u.includes('://')) { openOrReload = `https://${u}`; } if (tabsIdFound.length === 0 && openOrReload && typeof openOrReload === 'string') {
            let t = await new Promise(resolve => c.create({ url: openOrReload, active: !!active, pinned: !!pinned, ...(typeof index === 'number' ? { index, } : {}), }, resolve)); newTab = t.id; tabsIdFound.push({ ...t, });
        }

        let cActive = typeof active === 'boolean' ? active : 0, cPinned = typeof pinned === 'boolean' ? pinned : 0, cTitle = title && typeof title === 'string' ? title : 0;
        let cClose = typeof close === 'boolean' ? close : 0, change = (tabsIdFound.length > 0 && openOrReload) || cActive !== 0 || cPinned !== 0 || typeof index === 'number' || cTitle !== 0 || cClose !== 0;
        for (let [idx, value,] of tabsIdFound.entries()) {
            // (SE NECESSÁRIO) ABA: ALTERAR
            let { id, url, status, } = value;
            if (change) {
                // → [navegar/regarregar]
                if (!newTab && openOrReload) {
                    if (typeof openOrReload === 'string') { c.update(id, { 'url': openOrReload, }); } else { c.reload(id, { 'bypassCache': false, }); }
                }
                // → [ativa E/OU fixada]
                if (cActive !== 0 || cPinned !== 0) {
                    await new Promise(resolve => c.update(id, { ...(cActive !== 0 ? { 'active': cActive, } : {}), ...(cPinned !== 0 ? { 'pinned': cPinned, } : {}), }, resolve));
                }
                // → [índice]
                if (typeof index === 'number') {
                    await new Promise(resolve => c.move(id, { index, }, resolve));
                }
                // *** AGUARDAR TERMINAR DE CARREGAR ***
                cTitle = cTitle !== 0 && !url.includes('chrome://version') ? cTitle : false;
                if (status !== 'complete' && (cClose || cTitle)) {
                    await new Promise(resolve => {
                        let resolved = false, listener = (tabIdUpdated, changeInfo) => {
                            if (tabIdUpdated === id && changeInfo.status === 'complete') { if (!resolved) { resolved = true; c.onUpdated.removeListener(listener); resolve(); } }
                        }; c.onUpdated.addListener(listener); setTimeout(() => { if (!resolved) { resolved = true; c.onUpdated.removeListener(listener); resolve(); } }, 15000);
                    });
                }
                // → [título]
                if (cTitle) {
                    await new Promise(resolve => { c.executeScript(id, { 'code': `document.title = ${JSON.stringify(cTitle)};`, }, () => resolve()); });
                }
            }
            // PEGAR INFORMAÇÃO DA ABA (ANTES DE FECHAR!!!)
            res.push(...(await getTabsInfo(id)));
            // → (SE NECESSÁRIO) [fechar]
            if (cClose && change) {
                await new Promise(resolve => c.remove(id, resolve));
            }
        }

        if (tabsIdFound.length === 0) {
            ret['msg'] = `TAB SEARCH: ERRO | ABA '${search}' NAO ENCONTRADA`;
        } else {
            ret['ret'] = true;
            ret['msg'] = `TAB SEARCH: OK`;
            ret['res'] = res;
        }

    } catch (catchErr) {
        let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    }

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.hasOwnProperty('res') && { 'res': ret.res, }), };
}

// CHROME | NODE
globalThis['tabAction'] = tabAction;


