// const infTabSearch = { 'search': '*google*', 'openIfNotExist': true, 'active':true, 'pinned': false, 'url': 'https://www.google.com/'  } // 'ATIVA', 'TODAS', '*google*' ou 12345678 (ID)
// const retTabSearch = await tabSearch(infTabSearch)
// console.log(retTabSearch)

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
                                'title': tab.title,
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
    } catch (e) { (async () => { const m = await regexE({ 'e': e }); return `\n #### ERRO #### SEARCH TAB \n ${m.res}` })() }
}

async function tabSearch(inf) {
    let ret = { 'ret': false }
    try {
        let result = {};
        if (inf.search == 'ATIVA') { // ATIVA search
            result = await new Promise(resolve => {
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    if (!(typeof tabs === 'undefined') && (tabs.length > 0)) {
                        const tab = tabs[0];
                        const abaInf = {
                            'id': tab.id,
                            'title': tab.title,
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
                                'title': tab.title,
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

        if (result.hasOwnProperty('res')) { // ATIVA ret
            if (inf.search == 'ATIVA') {
                ret['res'] = {
                    'id': result.res.id,
                    'title': result.res.title,
                    'url': result.res.url,
                    'active': result.res.active,
                    'index': result.res.index,
                    'pinned': result.res.pinned
                };
            } else if (inf.search == 'TODAS') { // TODAS ret
                ret['res'] = result.res;

            } else if (typeof inf.search === 'number') { // ID ret
                for (const obj of result.res) {
                    const infRegex = { 'pattern': inf.search.toString(), 'text': obj.id.toString() }
                    const retRegex = regex(infRegex)
                    if (retRegex.ret) {
                        ret['res'] = {
                            'id': obj.id,
                            'title': obj.title,
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
                    let infRegex, retRegex
                    infRegex = { 'pattern': inf.search, 'text': obj.url } // URL ret
                    retRegex = regex(infRegex)
                    if (retRegex.ret) {
                        ret['res'] = {
                            'id': obj.id,
                            'title': obj.title,
                            'url': obj.url,
                            'active': obj.active,
                            'index': obj.index,
                            'pinned': obj.pinned
                        };
                        break;
                    }
                    infRegex = { 'pattern': inf.search, 'text': obj.title } // TITULO ret
                    retRegex = regex(infRegex)
                    if (retRegex.ret) {
                        ret['res'] = {
                            'id': obj.id,
                            'title': obj.title,
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
                    ret['msg'] = `\n #### ERRO #### SEARCH TAB \n ABA ID '${inf.search}' NAO ENCONTRADA \n\n`;
                }
                else {
                    ret['msg'] = `\n #### ERRO #### SEARCH TAB \n ABA '${inf.search}' NAO ENCONTRADA \n\n`;
                }
            }
        } else {
            if (inf.search == 'ATIVA' || inf.search == 'TODAS') {
                ret['msg'] = `\n #### ERRO #### SEARCH TAB \n NENHUM ABA ATIVA \n\n`;
            } else {
                ret['msg'] = `\n #### ERRO #### SEARCH TAB \n ABA '${inf.search}' NAO ENCONTRADA \n\n`;
            }
        }
    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }
    if (!ret.ret) {
        if (inf.openIfNotExist) {
            const retOpenTab = await openTab(inf)
            if (retOpenTab.hasOwnProperty('id')) {
                ret['ret'] = true;
                ret['msg'] = `SEARCH TAB: OK`;
                ret['res'] = retOpenTab;
            } else {
                ret['msg'] = retOpenTab;
            }
        }
    }
    if (!ret.ret && ret.msg) { console.log(ret.msg) }
    return ret
}

if (typeof window !== 'undefined') { // CHROME
    window['tabSearch'] = tabSearch;
} else { // NODEJS
    // global['tabSearch'] = tabSearch;
}