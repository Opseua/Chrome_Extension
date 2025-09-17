// let infTabAction, retTabAction; // [search] → 'ATIVA', 'TODAS', '*www.google.com*' ou 12345678 (ID)
// infTabAction = {
//     'search': '*google.com*',
//     'active': true, 'pinned': true, 'index': 0, 'close': false, 'sharedMedia': true, 'title': 'Novo título da aba',
//     'openIfNotExist': 'https://www.google.com', 'awaitComplete': true, 'reloadOrNavigate': true, // [SE EXISTIR]: (true → reload) | ('https://www.bing.com' → navegate)
//     'thisActive': true, 'thisPinned': true, 'thisFrist': true, 'thisIndex': 0, 'thisWindowId': true, 'thisIncognito': false, 'thisSharedMedia': true,
// };
// retTabAction = await tabAction(infTabAction); console.log(retTabAction);

let e = currentFile(new Error()), ee = e; let shaMed = {};
async function tabAction(inf = {}) {
    let ret = { 'ret': false, }; e = inf.e || e;
    try {
        let { search = '_NAO_INFORMADO_', openIfNotExist, reloadOrNavigate, awaitComplete, active, pinned, index, title, close, sharedMedia,
            thisActive, thisPinned, thisFrist, thisIndex, thisIncognito, thisWindowId, thisSharedMedia, } = inf;

        // PEGAR INFORMAÇÕES DA(s) ABA(s) |  COMPARTILHAR ÁUDIO DA ABA
        let c = chrome.tabs; async function getTabsInfo(id) {
            return new Promise(resolve => {
                c.query({}, tabs => {
                    let res = []; for (let t of tabs) {
                        if (!id || t.id === id) {
                            let d = dateHour(t.lastAccessed).res; d = `${d.yea}_${d.mon}_${d.day}-${d.hou}.${d.min}.${d.sec}`; let r = { 'id': t.id, 'index': t.index, 'pinned': t.pinned, 'active': t.active, }; res.push({
                                ...r, 'status': t.status, 'incognito': t.incognito, 'sharedMedia': !!shaMed[t.id], 'windowId': t.windowId, 'lastAccessed': d, 'title': t.title, 'url': t.url,
                            });
                        }
                    } resolve(res);
                });
            });
        } async function sharedMediaRun({ sharedMedia, id, } = {}) {
            function sCheck() { clearInterval(shaMed[id].monitor); delete shaMed[id]; } if (!sharedMedia && shaMed[id]) { shaMed[id].getTracks().forEach(t => t.stop()); sCheck(); } else if (sharedMedia && !shaMed[id]) {
                let stream = await new Promise(resolve => { chrome.tabCapture.capture({ 'audio': true, 'video': false, }, s => { if (chrome.runtime.lastError || !s) { resolve(false); } else { resolve(s); } }); });
                if (!stream) { logConsole({ e, ee, 'txt': `SEM PERMISSÃO!`, }); } else {
                    chromeActions({ action: 'badge', text: 'ON', color: '#040404ff', }); shaMed[id] = stream; // CHECAR SE O STREAM ESTÁ ATIVO
                    if (!shaMed[id].monitor) { shaMed[id].monitor = setInterval(() => { if (!(shaMed[id] && shaMed[id].getAudioTracks().some(t => t.readyState === 'live'))) { sCheck(); } }, 5000); }
                }
            }
        }

        // ABA(s): BUSCAR
        let newTab, res = [], tabsFound = [], tabs = await getTabsInfo(); if (search === 'ATIVA') { tabsFound.push(...tabs.filter(t => t.active)); } else if (search === 'TODAS') { tabsFound = tabs; }
        else { tabsFound.push(...tabs.filter(t => t.id === search || regex({ e, 'pattern': search, 'text': t.url, }).ret || regex({ e, 'pattern': search, 'text': t.title, }).ret)); }

        // (SE NECESSÁRIO) ABA: FILTRAR
        let t = tabsFound; if (typeof thisIndex === 'number') { t = t.filter(x => x.index === thisIndex); } if (thisFrist === true && t.length > 0) { t = [t[0],]; }
        if (typeof thisActive === 'boolean') { t = t.filter(x => x.active === thisActive); } if (typeof thisPinned === 'boolean') { t = t.filter(x => x.pinned === thisPinned); }
        if (typeof thisSharedMedia === 'boolean') { t = t.filter(x => x.sharedMedia === thisSharedMedia); } if (typeof thisIncognito === 'boolean') { t = t.filter(x => x.incognito === thisIncognito); }
        if (typeof thisWindowId === 'number') { t = t.filter(x => x.windowId === thisWindowId); } tabsFound = t;

        // (SE NECESSÁRIO) ABA: ABRIR
        let u = openIfNotExist; if (typeof u === 'string' && !u.includes('chrome') && !u.includes('://')) { u = `https://${u}`; } if (tabsFound.length === 0 && u && typeof u === 'string') {
            let t = await new Promise(resolve => c.create({ url: u, active: !!active, pinned: !!pinned, ...(typeof index === 'number' ? { index, } : {}), }, resolve)); newTab = t.id; tabsFound.push({ ...t, });
        }

        let cActive = typeof active === 'boolean' ? active : 0, cPinned = typeof pinned === 'boolean' ? pinned : 0, cTitle = title && typeof title === 'string' ? title : 0;
        let cAwaitComplete = typeof awaitComplete === 'boolean' ? awaitComplete : 0, cClose = typeof close === 'boolean' ? close : 0, cSharedMedia = typeof sharedMedia === 'boolean' ? sharedMedia : 0;
        let change = (tabsFound.length > 0 && reloadOrNavigate) || cActive !== 0 || cPinned !== 0 || typeof index === 'number' || cTitle !== 0 || cAwaitComplete !== 0 || cClose !== 0 || cSharedMedia !== 0;
        for (let [idx, value,] of tabsFound.entries()) {
            // (SE NECESSÁRIO) ABA: ALTERAR
            let { id, url, status, windowId, } = value; if (change) {
                // → [navegar/regarregar]
                if (!newTab && reloadOrNavigate) { status = 'carregando'; if (typeof reloadOrNavigate === 'string') { c.update(id, { 'url': reloadOrNavigate, }); } else { c.reload(id, { 'bypassCache': false, }); } }
                // → [ativa E/OU fixada]
                if (cActive !== 0 || cPinned !== 0) {
                    await new Promise(resolve => c.update(id, { ...(cActive !== 0 ? { 'active': cActive, } : {}), ...(cPinned !== 0 ? { 'pinned': cPinned, } : {}), }, resolve));
                    if (cActive !== 0) { await new Promise(resolve => chrome.windows.update(windowId, { 'focused': true, }, resolve)); }
                }
                // → [índice]
                if (typeof index === 'number') { await new Promise(resolve => c.move(id, { index, }, resolve)); }
                // *** AGUARDAR TERMINAR DE CARREGAR *** (APENAS QUANDO: close / title / cAwaitComplete)
                cTitle = cTitle !== 0 && !url.includes('chrome://version') ? cTitle : false; if ((status !== 'complete' && (cClose || cTitle || cAwaitComplete))) {
                    await new Promise(resolve => {
                        let resolved = false, listener = (idUpdated, changeInfo) => {
                            if (idUpdated === id && changeInfo.status === 'complete') { if (!resolved) { resolved = true; c.onUpdated.removeListener(listener); resolve(); } }
                        }; c.onUpdated.addListener(listener); setTimeout(() => { if (!resolved) { resolved = true; c.onUpdated.removeListener(listener); resolve(); } }, 15000);
                    });
                }
                // → [título]
                if (cTitle) { await new Promise(resolve => { c.executeScript(id, { 'code': `document.title = ${JSON.stringify(cTitle)};`, }, () => resolve()); }); }
                // → [compartilhar mídia]
                if (cSharedMedia !== 0) { sharedMediaRun({ sharedMedia, id, }); }
            }
            // PEGAR INFORMAÇÃO DA ABA (ANTES DE FECHAR!!!)
            res.push(...(await getTabsInfo(id)));
            // → (SE NECESSÁRIO) [fechar]
            if (cClose && change) { await new Promise(resolve => c.remove(id, resolve)); }
        }

        if (tabsFound.length === 0) {
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


