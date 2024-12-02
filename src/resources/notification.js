// let infNotification, retNotification
// infNotification = { 'duration': 3, 'icon': `icon_4.png`, 'buttons': [{ 'title': 'BOTAO 1' }, { 'title': `BOTAO 2` }], };
// infNotification = { e, 'retInf': false, 'title': `TITULO`, 'text': `TEXTO`, 'keepOld': true, 'ntfy': true, 'chromeNot': false, 'legacy': false, }; // 'legacy' SOMENTE PELA FUNÇÃO. PELO HTTP POST NÃO!!!
// retNotification = await notification(infNotification); console.log(retNotification);

// → 'duration': 5 | ERROS ( 'regexE' [crash NodeJS] )
// → 'duration': 4 | AVISOS/ALERTAS ( 'ERRO AO PESQUISAR NO CHATGPT' / 'BLIND' [tem a resposta]/[não tem a resposta] )
// → 'duration': 3 | COMUNICADOS ( 'NOVA TASK' / 'NÃO É BLIND / REPORT DE TAREFAS )
// → 'duration': 2 | COMUNICADOS ( 'SNIFFER [ativado/desativado' )

let e = import.meta.url, ee = e;
async function notification(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        let { retInf = false, title = 'TITULO VAZIO', text = 'TEXTO VAZIO', keepOld = false, ntfy = false, chromeNot = false, duration = 5, icon = 'notification_3.png', buttons = [], legacy = false, encNot = false, } = inf;

        async function apiLegacy(inf = {}) {
            let ret = { 'ret': false, }; let cng = typeof UrlFetchApp !== 'undefined'; try {
                let { url, method, headers = {}, body, bodyObject = null, } = inf; let req, resCode, resHeaders, resBody; let reqOpt = {
                    method, headers, ...(cng && { 'muteHttpExceptions': true, 'validateHttpsCertificates': true }), // GOOGLE | CHROME/NODEJS
                    ...(body && ['POST', 'PUT'].includes(method) && { [cng ? 'payload' : 'body']: typeof body === 'object' ? JSON.stringify(body) : body }),
                }; if (cng) { req = UrlFetchApp.fetch(url, reqOpt); resCode = req.getResponseCode(); resBody = req.getContentText(); } else {
                    req = await fetch(url, reqOpt); resCode = req.status; resHeaders = {}; req.headers.forEach((v, n) => { resHeaders[n.toLowerCase()] = v.toLowerCase() });
                    resBody = await req.text(); // NÃO MUDAR A INDENTAÇÃO (PARA PERMITIR COMENTAR)
                }; if (resHeaders['content-type'] == 'application/json' && bodyObject) { try { let temp = JSON.parse(resBody); resBody = temp; bodyObject = true; } catch (c) { esLintIgnore = c; }; };
                ret['ret'] = true; ret['msg'] = 'LEGACY API: OK'; ret['res'] = { 'code': resCode, 'bodyObject': bodyObject, 'headers': resHeaders, 'body': resBody, };
            } catch (catchErr) { if (!cng) { esLintIgnore = catchErr; }; ret['ret'] = false; delete ret['res']; ret['msg'] = `LEGACY API: ERRO | AO FAZER REQUISIÇÃO`; };
            return { ...({ 'ret': ret.ret }), ...(ret.msg && { 'msg': ret.msg }), ...(ret.res && { 'res': ret.res }), };
        }

        // [1] → NOTIFICAÇÃO NÃO SOLICITADA | [2] → NOTIFICAÇÃO CHAMADA ret {true} | [msg] NOTIFICAÇÃO CHAMADA ret {false}
        let retApiLegacy; let errNtfy = false; let errLegacy = false; let errDevFun = false; let errChrome = false; let { devMy, securityPass, devSend, } = gW; let retDevAndFun = {};

        // [NOVO] NTFY
        if (ntfy && !legacy) {
            retApiLegacy = await apiLegacy({ 'method': 'POST', 'url': `https://ntfy.sh/${devMy}?title=${encodeURIComponent(title)}`, 'body': text, 'bodyObject': true, });
            errNtfy = retApiLegacy.ret ? false : `{NTFY}: AO ENVIAR NOTIFICAÇÃO`;
        }

        // [NOVO] LEGACY
        if (legacy && (ntfy || !chromeNot)) {
            let body = { 'fun': [{ securityPass, retInf: 'true,', 'name': 'notification', 'par': { title, text, keepOld, chromeNot, ntfy, duration, icon, buttons, 'aws': true, } }] };
            retApiLegacy = await apiLegacy({ 'method': 'POST', 'url': `http://${devSend}`, 'headers': { 'raw': true, }, 'body': JSON.stringify(body), 'bodyObject': true, });
            retApiLegacy = retApiLegacy.ret ? retApiLegacy.res.body : retApiLegacy; errLegacy = retApiLegacy.ret ? false : `{LEGACY}: ${retApiLegacy.msg}`;
        }

        if (!eng && !legacy && !chromeNot) {
            // →→→ NO NODEJS
            delete inf['ntfy']; // DELETAR PARA EVITAR NOTIFICAÇÕES DUPLICADAS DO NTFY
            retDevAndFun = await devFun({ e, 'enc': true, 'data': { retInf, 'name': 'notification', 'par': inf, } }); errDevFun = retDevAndFun.ret ? false : `{DEV FUN}: ${retDevAndFun.msg}`;
        } else if (!legacy && !chromeNot) {
            // →→→ NO CHROME
            try {
                let notifications = chrome.notifications;

                // MANTER NOTIFICAÇÕES ANTIGAS
                if (!keepOld) { let nts = await new Promise((resolve) => { notifications.getAll((n) => resolve(n)); }); for (let id in nts) { await new Promise((resolve) => { notifications.clear(id, resolve); }); }; }

                // ÍCONE | MÁXIMO [CONSIDERANDO TUDO 'A']
                icon = icon.replace('./src/scripts/media/', '')
                icon = await fetch(`./src/scripts/media/${icon}`).then(v => v.arrayBuffer()); icon = btoa(String.fromCharCode(...new Uint8Array(icon)))
                let not = { 'type': 'basic', 'iconUrl': `data:image/png;base64,${icon}`, 'title': title.substring(0, 32), 'message': text.substring(0, 128), buttons, };

                // ENVIAR NOTIFICAÇÃO
                notifications.create(not, (notificationId) => {
                    notifications.onButtonClicked.addListener((notifId, btnIdx) => {
                        // BOTÃO PRESSIONADO
                        if (notifId === notificationId && btnIdx === 0) { alert('Botao 1 pressionado') }; if (notifId === notificationId && btnIdx === 1) { alert('Botao 2 pressionado') }
                    }); setTimeout(() => { notifications.clear(notificationId) }, duration * 1000)
                });
            } catch (catchErr) {
                esLintIgnore = catchErr; errChrome = `{CHROME}: AO ENVIAR NOTIFICAÇÃO`;
            };
        }

        let arrMsg1 = [`${ntfy ? 'NTFY' : ''}`, `${!chromeNot ? 'CHROME' : ''}`,].filter(v => v !== '').join('+') || 'VAZIO';
        let arrMsg2 = [`${errNtfy || ''}`, `${errLegacy || ''}`, `${errDevFun || ''}`, `${errChrome || ''}`,].filter(v => v !== '').join(' | ') || 'NENHUM DISPOSITIVO';
        if (errNtfy || errLegacy || errDevFun || errChrome || arrMsg1 == 'VAZIO') {
            ret['msg'] = `NOTIFICATION [${arrMsg1}]: ERRO | ${arrMsg2}`
        } else {
            ret['msg'] = `${retDevAndFun?.msg?.includes('[ENC]') && !encNot ? '[ENC] ' : ''}NOTIFICATION [${arrMsg1}]: OK`
            ret['ret'] = true;
        }

    } catch (catchErr) {
        if (inf.ignoreErr) {
            ret['msg'] = `${(!eng && !legacy) ? '[ENC] ' : ''}NOTIFICATION: ERRO | CHAMADA PELA 'regexE'`
        } else {
            let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
        }
    };

    return { ...({ 'ret': ret.ret }), ...(ret.msg && { 'msg': ret.msg }), ...(ret.res && { 'res': ret.res }), };
};

// CHROME | NODEJS
(eng ? window : global)['notification'] = notification;