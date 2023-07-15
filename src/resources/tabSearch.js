// import { tabSearch } from './tabSearch.js';
// const inftabSearch = {'search': `TODAS`}
// const rettabSearch = await tabSearch(inftabSearch)
// console.log(rettabSearch)

async function tabSearch(inf) {
    let ret = { 'ret': false };
    try {

        let result;
        switch (true) {
            // ################################### ABA: ATIVA
            case inf.search === 'ATIVA':
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
                            resolve({ 'ret': true, 'msg': 'SEARCH TAB: OK', 'res': abaInf });
                        } else {
                            resolve({ 'ret': false, 'msg': 'SEARCH TAB: ERRO | NENHUM ABA ATIVA' });
                        }
                    });
                }); break;

            // ################################### ABA: TODAS
            case inf.search === 'TODAS':
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
                            resolve({ 'ret': true, 'msg': 'SEARCH TAB: OK', 'res': abaInf });
                        } else {
                            resolve([]); // Retorna um array vazio se não houver nenhuma aba ativa
                        }
                    });
                }); break;

            // ################################### ABA: ID
            case typeof inf.search === 'number':
                result = await new Promise(resolve => {
                    chrome.tabs.get(inf.search, function (tabs) {
                        if (!(typeof tabs === 'undefined')) {
                            const tab = tabs;
                            const abaInf = {
                                'id': tab.id,
                                'tit': tab.title,
                                'url': tab.url,
                                'active': tab.active,
                                'index': tab.index,
                                'pinned': tab.pinned
                            };
                            resolve({ 'ret': true, 'msg': 'SEARCH TAB: OK', 'res': abaInf });
                        } else {
                            resolve({ 'ret': false, 'msg': `SEARCH TAB: ERRO | "${inf.search}" NAO ENCONTRADA` });
                        }
                    });
                }); break;

            // ################################### ABA: TITULO
            case typeof inf.search === 'string' && !inf.search.includes('http'):
                result = await new Promise(resolve => {
                    chrome.tabs.query({ title: inf.search }, function (tabs) {
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
                            resolve({ 'ret': true, 'msg': 'SEARCH TAB: OK', 'res': abaInf });
                        } else {
                            resolve({ 'ret': false, 'msg': `SEARCH TAB: ERRO | "${inf.search}" NAO ENCONTRADA` });
                        }
                    });
                }); break;

            // ################################### ABA: URL
            case typeof inf.search === 'string' && inf.search.includes('http'):
                result = await new Promise(resolve => {
                    chrome.tabs.query({ url: inf.search }, function (tabs) {
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
                            resolve({ 'ret': true, 'msg': 'SEARCH TAB: OK', 'res': abaInf });
                        } else {
                            resolve({ 'ret': false, 'msg': `SEARCH TAB: ERRO | "${inf.search}" NAO ENCONTRADA` });
                        }
                    });
                }); break;

            default:
                result = 'PARAMETRO DA ABA ERRADO "ATIVA", "TODAS", ID, TITULO, URL';
                break;
        }
        if (result.ret) {
            ret['ret'] = result.ret; ret['msg'] = result.msg; ret['res'] = result.res;
        } else { ret['ret'] = result.ret; ret['msg'] = result.msg; }
        
    } catch (e) {
        ret['msg'] = `SEARCH TAB: ERRO | ${e}`;
    }

    if (!ret.ret) { console.log(ret.msg) }
    return ret
}

export { tabSearch }
