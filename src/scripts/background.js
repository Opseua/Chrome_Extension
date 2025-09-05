async function backgroundRun() {
    // chrome.runtime.reload(); // REINICIAR A EXTENSÃO
    // await new Promise((resolve) => { chrome.storage.sync.clear(async () => { /* console.log('DEL 1'); */ resolve(true); }); }); // APAGAR STORAGE [SYNC]: LIMPAR
    await new Promise((resolve) => { chrome.storage.local.clear(async () => { /* console.log('DEL 2'); */ resolve(true); }); }); // APAGAR STORAGE [LOCAL]: LIMPAR

    // **********************************
    await import('../server.js');
    // **********************************

    let activeStream = {}; chrome.browserAction.onClicked.addListener(async function (...inf) {
        console.log(`EVENTO: click no ícone\n`, inf); // chrome.browserAction.setPopup({popup: './popup.html'});

        let infOk = { 'search': `*c6bank.my.site.com*`, 'active': true, 'pinned': true, 'index': 0, }; async function forceRunningTab(tab) { // FORÇAR ABA A FICAR ATIVA (MESMO EM SEGUNDO PLANO)
            if (activeStream[tab.url]) { activeStream[tab.url].getTracks().forEach(t => t.stop()); delete activeStream[tab.url]; return; }
            let streamId = await new Promise((res, rej) => chrome.tabCapture.getMediaStreamId({ targetTabId: tab.id, }, id => chrome.runtime.lastError ? rej(chrome.runtime.lastError) : res(id)));
            activeStream[tab.url] = await new Promise((res, rej) => navigator.webkitGetUserMedia({ audio: { mandatory: { chromeMediaSource: 'tab', chromeMediaSourceId: streamId, }, }, }, res, rej));
        } let url = 'https://c6bank.my.site.com/partners/s/lead/Lead/Default', retTabAction = await tabAction({ ...infOk, });
        if (!retTabAction?.res?.[0]?.id) { retTabAction = await tabAction({ ...infOk, 'openOrReload': url, }); } if (retTabAction?.res?.[0]) { forceRunningTab({ 'id': retTabAction?.res?.[0].id, url, }); }

        // PEGAR CONTEUDO DA ABA (SÓ FUNCIONA COM AÇÃO DO USUÁRIO COM A ABA ABERTA)
        // let e = currentFile(new Error()), ee = e; async function tabGetContent(inf = {}) {
        //     let ret = { 'ret': false, }; e = inf.e || e; try {
        //         let { id: tabId, filename, } = inf; let blob = await new Promise((resolve) => { chrome.pageCapture.saveAsMHTML({ tabId, }, (blob) => { resolve(blob); }); });
        //         let content = await blob.text(); ret['res'] = {}; if (filename) {
        //             let f = `${filename}.mhtml`; chrome.downloads.download({ 'url': `${'data:application/x-mimearchive;base64,' + btoa(content)}`, 'filename': f, }); ret['res']['filename'] = f;
        //         } ret['msg'] = `TAB GET CONTENT: OK`; ret['ret'] = true; ret['res']['content'] = `${content}`;
        //     } catch (catchErr) { let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res']; }
        //     return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.hasOwnProperty('res') && { 'res': ret.res, }), };
        // } let retTabGetContent = await tabGetContent({ 'id': tabId, 'filename': 'aaa', }); console.log(retTabGetContent);

    });

    chrome.downloads.onChanged.addListener(async function (...inf) {
        let { id, } = inf; if (inf[0].state && inf[0].state.current === 'complete') {
            chrome.downloads.search({ id, }, async function (txt) {
                if (txt.length > 0) {
                    let d = inf[0]; if (d.byExtensionName && d.byExtensionName.includes('BOT')) {
                    /* console.log(`EVENTO: download do BOT concluído\n`, downloadItem) */ if (!d.filename.includes('[KEEP]')) {
                            setTimeout(function () { chrome.downloads.erase({ id: d.id, }); /* logConsole({ e, ee, 'txt': `DOWNLOAD REMOVIDO DA LISTA` }); URL.revokeObjectURL(d.url) */ }, 5000);
                        }
                    }
                }
            });
        }
    });

    // chrome.tabs.onUpdated.addListener(function (...inf) { // FECHAR ABA DESNECESSÁRIA
    //     let { id, url, } = inf[2]; if (url.includes('.msftconnecttest.com') || url.includes('.netcombowifi.com')) {
    //         setTimeout(() => { chrome.tabs.remove(id, () => { if (chrome.runtime.lastError) { } }); }, (30 * 1000));
    //     }
    // });

    // chrome.commands.onCommand.addListener(async function (...inf) {
    //     console.log(`EVENTO: atalho pressionado\n`, inf);
    // });

    // chrome.tabs.onActivated.addListener(async function (...inf) {
    //     console.log(`EVENTO: guia ativa alterada\n`, inf);
    // });

    // chrome.notifications.onClicked.addListener(async function (...inf) {
    //     console.log(`EVENTO: click na notificação\n`, inf);
    // });

    // chrome.notifications.onButtonClicked.addListener(async function (...inf) {
    //     console.log(`EVENTO: click no botão da notificação\n`, inf);
    // });

    // chrome.notifications.onClosed.addListener(async function (...inf) {
    //     console.log(`EVENTO: notificação fechada\n`, inf);
    // });

    // chrome.runtime.onMessage.addListener(async function (...inf) {
    //     console.log(`EVENTO: mensagem recebida\n`, inf);
    // });

    // chrome.tabs.onUpdated.addListener(function (...inf) {
    //     let { active, id, index, pinned, selected, status, title, url, } = inf[2];
    //     if (url.includes('www.google.com') && status === 'complete') {
    //         console.log(`EVENTO: URL aberto e 100% carregado na aba\n`, id);
    //     }
    // });

    // chrome.webRequest.onBeforeRequest.addListener(
    //     async function (...inf) {
    //         let { requestId, tabId, url, method, } = inf[0];
    //         if (url.includes('.com/api/survey')) { // .com/api/announcement | .com/api/survey
    //             console.log(`EVENTO: requisição iniciada\n`, requestId, tabId, method, url);
    //         }
    //     }, { urls: ['<all_urls>',], }
    // );

    // chrome.webRequest.onCompleted.addListener(
    //     async function (...inf) {
    //         let { requestId, tabId, url, method, } = inf[0];
    //         if (url.includes('.com/api/survey') || url.includes('.com/api/announcement')) { // .com/api/announcement | .com/api/survey
    //             console.log(`EVENTO: requisição concluída\n`, requestId, tabId, method, url);

    //             // commandLine({ 'notBackground': true, 'command': `!fileWindows!/PORTABLE_Clavier/Clavier.exe /sendkeys "${com}"`, });
    //             let retChromeActions = await chromeActions({ 'action': 'getBody', 'target': `*.com/app/announcemen*`, }); console.log(retChromeActions);
    //             // let retFile = await file({ 'action': 'write', 'path': 'arquivoNovo.html', 'content': retChromeActions.res, }); console.log(retFile);
    //             let msgLis = { 'fun': [{ 'securityPass': gW.securityPass, 'retInf': true, 'name': 'file', 'par': { 'action': 'write', 'path': 'arquivoNovo.html', 'content': 'CASA', }, },], };
    //             let retMessageSend = await messageSend({ 'destination': `127.0.0.1:1234/?roo=SALA`, 'message': msgLis, }); console.log(retMessageSend);
    //         }
    //     }, { urls: ['<all_urls>',], }
    // );

}
backgroundRun();


