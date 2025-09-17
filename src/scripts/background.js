async function backgroundRun() {
    // chrome.runtime.reload(); // REINICIAR A EXTENSÃO
    // await new Promise((resolve) => { chrome.storage.sync.clear(async () => { /* console.log('DEL 1'); */ resolve(true); }); }); // APAGAR STORAGE [SYNC]: LIMPAR
    await new Promise((resolve) => { chrome.storage.local.clear(async () => { /* console.log('DEL 2'); */ resolve(true); }); }); // APAGAR STORAGE [LOCAL]: LIMPAR

    globalThis.restartCode = () => { setTimeout(() => chrome.runtime.reload(), 2000); return { 'ret': true, 'msg': 'RESTART CODE: OK', }; }; function scheduleRun(timeStr = '00:05') { // AGENDAR GATILHO
        let [hour, min,] = timeStr.split(':').map(Number), now = new Date(), next = new Date(now); next.setHours(hour, min, 0, 0); function format(ts, type = 'date') {
            let d = new Date(ts); let pad = n => String(n).padStart(2, '0'); if (type === 'diff') {
                let h = pad(Math.floor(ts / 3600000)), m = pad(Math.floor((ts % 3600000) / 60000)), s = pad(Math.floor((ts % 60000) / 1000)); return `${h}:${m}:${s}`;
            } return `${pad(d.getDate())}/${pad(d.getMonth() + 1)} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
        } if (next.getTime() <= now.getTime()) { next.setDate(next.getDate() + 1); } console.log(`GATILHO (${format(next)}) → EM ${format(next.getTime() - now.getTime(), 'diff')}`);
        chrome.alarms.create('reloadAtTime', { 'when': next.getTime(), 'periodInMinutes': 24 * 60, }); chrome.alarms.onAlarm.addListener(alarm => { if (alarm.name === 'reloadAtTime') { restartCode(); } });
    } globalThis['scheduleRun'] = scheduleRun;

    // **********************************
    await import('../server.js');
    // **********************************

    // OBJETO E FUNÇÃO PARA A INDICAÇÃO AUTOMÁTICA
    gO.inf['WebScraper_Chrome_Extension'] = { 'search': '*c6bank.my.site.com*', 'thisPinned': true, 'thisIndex': 0, 'thisFrist': true, }; async function checkIndication(inf = {}) {
        let { duration = 6, } = inf; let retTabAction = await tabAction({ ...gO.inf.WebScraper_Chrome_Extension, 'thisSharedMedia': true, }); if (!retTabAction?.res?.[0]) {
            notification({ 'title': `INDICAÇÃO AUTOMÁTICA`, 'text': `Pressione o ícone da extensão até aparecer o quadrado!`, duration, 'icon': `iconRed`, 'ntfy': false, });
            chromeActions({ 'action': 'badge', 'text': '', }); return false;
        } else { return true; }
    } globalThis['checkIndication'] = checkIndication;

    chrome.browserAction.onClicked.addListener(async function (...inf) {
        console.log(`EVENTO: click no ícone\n`, inf); // chrome.browserAction.setPopup({popup: './popup.html'});

        // ABRIR ABA DO SISTEMA E ATIVAR O COMPARTILHAMENTO DE MÍDIA
        await tabAction({ ...gO.inf.WebScraper_Chrome_Extension, 'active': true, 'pinned': true, 'index': 0, 'sharedMedia': true, 'openIfNotExist': 'https://c6bank.my.site.com/partners/s/lead/Lead/Default', });
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

    async function forceUpdate() {
        // MENUS DE CONTEXTO DO ÍCONE DA EXTENSÃO: REMOVER TODOS (NECESSÁRIO ANTES DE CRIAR POR CAUSA DO ID QUE JÁ EXISTE!!!)
        chrome.contextMenus.removeAll(() => { });

        // MENUS DE CONTEXTO DO ÍCONE DA EXTENSÃO: CRIAR
        chrome.contextMenus.create({ 'id': 'item1', 'title': '🟢 Prompt', 'contexts': ['browser_action',], });
    } forceUpdate(); // FORÇAR ATUALIZAÇÕES NO CÓDIGO E NA EXTENSÃO AO APERTAR F5 NO CONSOLE

    // -------------------- MENU DE CONTEXTO DO ÍCONE DA EXTENSÃO (OPÇÕES) ---------------------------------------------------------------------
    // (Item normal)
    // chrome.contextMenus.create({ 'id': 'item1', 'title': 'Item normal', 'contexts': ['browser_action',], });
    // ------------------------------------------------------------------------------------------------------------------------------------------
    // [Checkbox]
    // chrome.contextMenus.create({ 'id': 'item2', 'type': 'checkbox', 'checked': true, 'title': 'Ativar modo X', 'contexts': ['browser_action',], });
    // ------------------------------------------------------------------------------------------------------------------------------------------
    // [Radio] Opção 1 | Opção 2
    // chrome.contextMenus.create({ 'id': 'item3', 'type': 'radio', 'title': 'Opção 1', 'contexts': ['browser_action',], });
    // chrome.contextMenus.create({ 'id': 'item4', 'type': 'radio', 'title': 'Opção 2', 'contexts': ['browser_action',], });
    // --------------------------------------------------------------------------------------------
    // {Separador}
    // chrome.contextMenus.create({ 'type': 'separator', 'contexts': ['browser_action',], });
    // ------------------------------------------------------------------------------------------------------------------------------------------
    // // [Submenu] Ajuda > Sobre o Google Chrome
    // chrome.contextMenus.create({ 'id': 'submenu', 'title': 'Mais opções', 'contexts': ['browser_action',], });
    // chrome.contextMenus.create({ 'id': 'submenu_item', 'parentId': 'submenu', 'title': 'Sub-opção 1', 'contexts': ['browser_action',], });
    // -------------------- MENU DE CONTEXTO DO ÍCONE DA EXTENSÃO (AÇÕES) ---------------------------------------------------------------------
    chrome.contextMenus.onClicked.addListener(async function (...inf) {
        let [info, /* tab */,] = inf; if (info.menuItemId === 'item1') { command1({ 'origin': 'chrome', }); /* MOSTRAR prompt */ }
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

}
backgroundRun();


