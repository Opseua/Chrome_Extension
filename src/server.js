let startup = new Date(); globalThis['sP'] = import.meta.url; await import('./resources/@export.js'); let e = sP, ee = e;

async function serverRun(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        logConsole({ e, ee, 'txt': `**************** SERVER **************** [${startupTime(startup, new Date())}]`, });

        // IMPEDIR 'serverRun' DE INICIAR
        async function notRun() { await new Promise(r => setTimeout(r, 15 * 1000)); await notRun(); } if (gW.devMaster === 'NOTE_HP') { await notRun(); }

        // RESETAR BADGE
        chromeActions({ e, 'action': 'badge', 'text': '', });

        // ATALHO PRESSIONADO
        chrome.commands.onCommand.addListener(async function (...inf) {
            try {
                // logConsole({ e, ee, 'txt': `ON START: ATALHO PRESSIONADO` })
                if (inf[0] === 'atalho_1') {
                    command1({ 'origin': 'chrome', });

                    // chrome.tabs.executeScript({
                    //     code: `(function () {
                    //             function pw(j, pw, ph, u) {let w = (pw / 100) * j.top.screen.width, h = (ph / 100) * j.top.screen.height; 
                    //             let y = j.top.outerHeight / 2 + j.top.screenY - (h / 2), x = j.top.outerWidth / 2 + j.top.screenX - (w / 2);
                    //             return j.open(u, '', 'width=' + w + ',height=' + h + ',top=' + y + ',left=' + x); }; pw(globalThis, 30, 35, 'http://127.0.0.1:1234/?act=page&roo=&mes=0'); })();`
                    // });

                } else if (inf[0] === 'atalho_2') { command2(); } else { logConsole({ e, ee, 'txt': `ACAO DO ATALHO NAO DEFINIDA`, }); }
            } catch (catchErr) { await regexE({ inf, 'e': catchErr, }); }
        });

        // *************************

        // CLIENT (NÃO POR COMO 'await'!!!) [MANTER NO FINAL]
        await new Promise(r => { setTimeout(r, 50); }); client({ e, }); await new Promise(r => { setTimeout(r, 500); });

        // CHAMAR PARA DEFINIR A FUNÇÃO
        await chromeActionsNew();

        ret['ret'] = true;
        ret['msg'] = `SERVER: OK`;

    } catch (catchErr) {
        let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    }

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.res && { 'res': ret.res, }), };
}
// TODAS AS FUNÇÕES PRIMÁRIAS DO 'server.js' / 'serverC6.js' / 'serverJsf.js' DEVEM SE CHAMAR 'serverRun'!!!
serverRun();


