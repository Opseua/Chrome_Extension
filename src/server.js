let startup = new Date(); await import('./resources/@export.js'); let e = import.meta.url, ee = e;

async function serverRun(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        logConsole({ e, ee, 'msg': `**************** SERVER **************** [${startupTime(startup, new Date())}]`, });

        // RESETAR BADGE
        chromeActions({ e, 'action': 'badge', 'text': '', });

        // ATALHO PRESSIONADO
        chrome.commands.onCommand.addListener(async function (...inf) {
            try {
                // logConsole({ e, ee, 'msg': `ON START: ATALHO PRESSIONADO` })
                if (inf[0] === 'atalho_1') {
                    command1({ 'origin': 'chrome', });

                    // chrome.tabs.executeScript({
                    //     code: `(function () {
                    //             function pw(j, pw, ph, u) {let w = (pw / 100) * j.top.screen.width, h = (ph / 100) * j.top.screen.height; 
                    //             let y = j.top.outerHeight / 2 + j.top.screenY - (h / 2), x = j.top.outerWidth / 2 + j.top.screenX - (w / 2);
                    //             return j.open(u, '', 'width=' + w + ',height=' + h + ',top=' + y + ',left=' + x); }; pw(globalThis, 30, 35, 'http://127.0.0.1:1234/?act=page&roo=&mes=0'); })();`
                    // });

                } else if (inf[0] === 'atalho_2') { command2(); } else { logConsole({ e, ee, 'msg': `ACAO DO ATALHO NAO DEFINIDA`, }); }
            } catch (catchErr) { await regexE({ inf, 'e': catchErr, }); }
        });

        // *************************

        // CLIENT (NÃO POR COMO 'await'!!!) [MANTER NO FINAL]
        client({ e, }); await new Promise(resolve => { setTimeout(resolve, 500); });

        // CHAMAR PARA DEFINIR A FUNÇÃO
        await chromeActionsNew();

        // function monitorarValorTempo() {
        //     if (globalThis.observadorAtivo) { return; } globalThis.observadorAtivo = true;
        //     function title(t) { let [m, s = 0,] = t.match(/\d+/g).map(Number); document.title = `TryRating ${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`; }
        //     let l = [...document.querySelectorAll('.labeled-attribute__label span'),].find(el => el.textContent.trim() === 'Estimated Rating Time'); if (!l) { return; }
        //     let t = l.closest('.labeled-attribute')?.querySelector('.label-value'); if (!t) { return; } let p = t.textContent.trim(); title(`${p} [INI]`);
        //     new MutationObserver(() => { let n = t.textContent.trim(); if (n !== p) { p = n; title(`${n} [ALT]`); } }).observe(t, { characterData: true, subtree: true, });
        // } monitorarValorTempo();


        ret['ret'] = true;
        ret['msg'] = `SERVER: OK`;

    } catch (catchErr) {
        let retRegexE = await regexE({ inf, 'e': catchErr, });

        console.log(retRegexE);


        ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    }

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.res && { 'res': ret.res, }), };
}
// TODAS AS FUNÇÕES PRIMÁRIAS DO 'server.js' / 'serverC6.js' / 'serverJsf.js' DEVEM SE CHAMAR 'serverRun'!!!
serverRun();


