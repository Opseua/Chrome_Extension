// import { searchTab } from './searchTab.js';
// const infSearchTab = {
//     'search': `TODAS`
// }
// const retSearchTab = await searchTab(infSearchTab)
// console.log(retSearchTab)

async function searchTab(inf) {
    const ret = { ret: false };

    try {
        let result;
        switch (true) {
            // ################################### ABA: ATIVA
            case inf.search === 'ATIVA':
                result = await new Promise(resolve => {
                    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                        if (tabs.length > 0) {
                            const tab = tabs[0];
                            const abaInf = {
                                id: tab.id,
                                tit: tab.title,
                                url: tab.url
                            };
                            resolve(abaInf);
                        } else {
                            resolve('NENHUM ABA ATIVA');
                        }
                    });
                }); break;

            // ################################### ABA: TODAS
            case inf.search === 'TODAS':
                result = await new Promise(resolve => {
                    chrome.tabs.query({}, function (tabs) {
                        if (tabs.length > 0) {
                            const tabsArray = tabs.map(function (tab) {
                                return {
                                    id: tab.id,
                                    title: tab.title,
                                    url: tab.url
                                };
                            });
                            resolve(tabsArray);
                        } else {
                            resolve('NENHUMA ABA ATIVA [todas]');
                        }
                    });
                }); break;

            // ################################### ABA: ID
            case typeof inf.search === 'number':
                result = await new Promise(resolve => {
                    chrome.tabs.get(inf.search, function (tab) {
                        if (!(typeof tab === 'undefined')) {
                            const abaInf = {
                                id: tab.id,
                                tit: tab.title,
                                url: tab.url
                            };
                            resolve(abaInf);
                        } else {
                            resolve('ABA ID "' + inf.search + '" NAO ENCONTRADA');
                        }
                    });
                }); break;

            // ################################### ABA: TITULO
            case typeof inf.search === 'string' && !inf.search.includes('http'):
                result = await new Promise(resolve => {
                    chrome.tabs.query({ title: inf.search }, function (tabs) {
                        if (tabs.length > 0) {
                            const tab = tabs[0];
                            const abaInf = {
                                id: tab.id,
                                tit: tab.title,
                                url: tab.url
                            };
                            resolve(abaInf);
                        } else {
                            resolve('ABA NOME "' + inf.search + '" NAO ENCONTRADA');
                        }
                    });
                }); break;

            // ################################### ABA: URL
            case typeof inf.search === 'string' && inf.search.includes('http'):
                result = await new Promise(resolve => {
                    chrome.tabs.query({ url: inf.search }, function (tabs) {
                        if (!(typeof tabs === 'undefined')) {
                            const tab = tabs[0];
                            const abaInf = {
                                id: tab.id,
                                tit: tab.title,
                                url: tab.url
                            };
                            resolve(abaInf);
                        } else {
                            resolve('ABA URL "' + inf.search + '" NAO ENCONTRADA');
                        }
                    });
                }); break;

            default:
                result = 'PARAMETRO DA ABA ERRADO "ATIVA", "TODAS", ID, TITULO, URL';
                break;
        }
        ret['ret'] = true;
        ret['msg'] = 'SEARCH TAB: OK';
        ret['res'] = result;
    } catch (e) {
        ret['msg'] = `SEARCH TAB: ERRO | ${e}`;
    }

    if (!ret.ret) { console.log(ret.msg) }
    return ret
}

export { searchTab }
