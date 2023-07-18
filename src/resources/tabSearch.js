// const { tabSearch } = await import('./tabSearch.js');
// const infTabSearch = {'search': `TODAS`}
// const retTabSearch = await tabSearch(infTabSearch)
// console.log(retTabSearch)
const { regex } = await import('./functions.js');

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
                ret['msg'] = `SEARCH TAB: ERRO | ABA '${inf.search}' NAO ENCONTRADA`
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

    if (!ret.ret) { console.log(ret.msg) }
    return ret
}

export { tabSearch }
