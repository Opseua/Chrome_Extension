// const { tabSearch } = await import('./tabSearch.js');
// const infTabSearch = { 'search': '*google*', 'openIfNotExist': true, 'active':true, 'pinned': false, 'url': 'https://www.google.com/'  } // 'ATIVA', 'TODAS', '*google*' ou 12345678 (ID)
// const retTabSearch = await tabSearch(infTabSearch)
// console.log(retTabSearch)
const { regex } = await import('./functions.js');

async function openTab(inf) {
    try {
        const active = inf.active ? true : false;
        const pinned = inf.pinned ? true : false;
        const url = inf.url ? inf.url : 'https://www.google.com';
        return await new Promise((resolve, reject) => {
            chrome.tabs.create({ 'url': url, 'active': active, 'pinned': pinned }, function (novaAba) {
                chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
                    if (tabId === novaAba.id && changeInfo.status === 'complete') {
                        chrome.tabs.get(novaAba.id, function (tab) {
                            chrome.tabs.onUpdated.removeListener(listener);
                            resolve({
                                'id': tab.id,
                                'tit': tab.title,
                                'url': tab.url,
                                'active': tab.active,
                                'index': tab.index,
                                'pinned': tab.pinned
                            });
                        });
                    }
                });
            });
        });
    } catch (e) {
        return `SEARCH TAB: ERRO | ${e}`;
    }
}

async function tabSearch(inf) {
    let ret = { 'ret': false };
    try {
        let result = {};
        if (inf.search == 'ATIVA') {
            result = await new Promise(resolve => {
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    if (!(typeof tabs === 'undefined') && (tabs.length > 0)) {
                        const tab = tabs[0];
                        const abaInf = {
                            'id': tab.id,
                            'tit': tab.title,
                            'url': tab.url,
                            'active': tab.active,
                            'index': tab.index,
                            'pinned': tab.pinned
                        };
                        resolve({ 'res': abaInf });
                    } else {
                        resolve(result)
                    }
                });
            })
        } else {
            result = await new Promise(resolve => {
                chrome.tabs.query({}, function (tabs) {
                    if (!(typeof tabs === 'undefined') && (tabs.length > 0)) {
                        const abaInf = tabs.map(function (tab) {
                            return {
                                'id': tab.id,
                                'tit': tab.title,
                                'url': tab.url,
                                'active': tab.active,
                                'index': tab.index,
                                'pinned': tab.pinned
                            };
                        });
                        resolve({ 'res': abaInf });
                    } else {
                        resolve(result)
                    }
                });
            })
        }

        if (result.hasOwnProperty('res')) {
            if (inf.search == 'ATIVA') {
                ret['res'] = {
                    'id': result.res.id,
                    'tit': result.res.title,
                    'url': result.res.url,
                    'active': result.res.active,
                    'index': result.res.index,
                    'pinned': result.res.pinned
                };
            } else if (inf.search == 'TODAS') {
                ret['res'] = result.res;

            } else if (typeof inf.search === 'number') {
                for (const obj of result.res) {
                    if (regex(obj.id.toString(), inf.search.toString())) {
                        ret['res'] = {
                            'id': obj.id,
                            'tit': obj.tit,
                            'url': obj.url,
                            'active': obj.active,
                            'index': obj.index,
                            'pinned': obj.pinned
                        };
                        break;
                    }
                }
            } else {
                for (const obj of result.res) {
                    if (regex(obj.url, inf.search)) {
                        ret['res'] = {
                            'id': obj.id,
                            'tit': obj.tit,
                            'url': obj.url,
                            'active': obj.active,
                            'index': obj.index,
                            'pinned': obj.pinned
                        };
                        break;
                    }
                }
            }
            if (ret.hasOwnProperty('res')) {
                ret['ret'] = true;
                ret['msg'] = `SEARCH TAB: OK`;
            } else {
                if (typeof inf.search === 'number') {
                    ret['msg'] = `SEARCH TAB: ERRO | ABA ID '${inf.search}' NAO ENCONTRADA`
                }
                else {
                    ret['msg'] = `SEARCH TAB: ERRO | ABA '${inf.search}' NAO ENCONTRADA`
                }
            }
        } else {
            if (inf.search == 'ATIVA' || inf.search == 'TODAS') {
                ret['msg'] = `SEARCH TAB: ERRO | NENHUM ABA ATIVA`
            } else {
                ret['msg'] = `SEARCH TAB: ERRO | ABA '${inf.search}' NAO ENCONTRADA`
            }
        }

    } catch (e) {
        ret['msg'] = `SEARCH TAB: ERRO | ${e}`;
    }

    if (!ret.ret) {
        if (inf.openIfNotExist) {
            const retOpenTab = await openTab(inf)
            if (retOpenTab.hasOwnProperty('id')) {
                ret['ret'] = true;
                ret['res'] = retOpenTab;
            } else {
                ret['msg'] = retOpenTab;
            }
        }
    }

    if (!ret.ret) { console.log(ret.msg) }
    return ret
}

export { tabSearch }
