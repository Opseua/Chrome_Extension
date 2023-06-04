async function buscarAba(inf) {

    let result;
    switch (true) {
        // ################################### ABA: ATIVA
        case inf === "ATIVA":
            result = await new Promise(resolve => {
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    if (tabs.length > 0) {
                        const tab = tabs[0];
                        const aba_inf = {
                            id: tab.id,
                            tit: tab.title,
                            url: tab.url
                        };
                        resolve(aba_inf);
                    } else {
                        resolve('NENHUM ABA ATIVA');
                    }
                });
            });
            break;

        // ################################### ABA: TODAS
        case inf === "TODAS":
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
            });
            break;

        // ################################### ABA: ID
        case typeof inf === "number":
            result = await new Promise(resolve => {
                chrome.tabs.get(inf, function (tab) {
                    if (!(typeof tab === 'undefined')) {
                        const inf = {
                            id: tab.id,
                            tit: tab.title,
                            url: tab.url
                        };
                        resolve(inf);
                    } else {
                        resolve('ABA ID "' + inf + '" NAO ENCONTRADA');
                    }
                });
            });
            break;

        // ################################### ABA: TITULO
        case typeof inf === "string" && !inf.includes('http'):
            result = await new Promise(resolve => {
                chrome.tabs.query({ title: inf }, function (tabs) {
                    if (tabs.length > 0) {
                        const tab = tabs[0];
                        const aba_inf = {
                            id: tab.id,
                            tit: tab.title,
                            url: tab.url
                        };
                        resolve(aba_inf);
                    } else {
                        resolve('ABA NOME "' + inf + '" NAO ENCONTRADA');
                    }
                });
            });
            break;

        // ################################### ABA: URL
        case typeof inf === "string" && inf.includes('http'):
            result = await new Promise(resolve => {
                chrome.tabs.query({ url: inf }, function (tabs) {
                    if (!(typeof tabs === 'undefined')) {
                        const tab = tabs[0];
                        const inf = {
                            id: tab.id,
                            tit: tab.title,
                            url: tab.url
                        };
                        resolve(inf);
                    } else {
                        resolve('ABA URL "' + inf + '" NAO ENCONTRADA');
                    }
                });
            });
            break;

        default:
            result = 'PARAMETRO DA ABA ERRADO "ATIVA", "TODAS", ID, TITULO, URL';
            break;
    }
    //console.log(result);
    return result;

}

export default buscarAba
