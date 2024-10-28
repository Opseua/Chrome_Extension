// let infNotification, retNotification
// infNotification = { // Chrome/NodeJs [conectado ao WS]
//     'e': e, 'duration': 3, 'icon': `./src/scripts/media/icon_4.png`, 'retInf': false, 'buttons': [{ 'title': 'BOTAO 1' }, { 'title': `BOTAO 2` }],
//     'keepOld': true, 'title': `TITULO`, 'text': `TEXTO`,
// };
// infNotification = { 'e': e, 'legacy': true, 'title': `TITULO`, 'text': `TEXTO`, }; // Chrome/NodeJs
// retNotification = await notification(infNotification); console.log(retNotification)

// → 'duration': 5 | ERROS ( 'regexE' [crash NodeJS] )
// → 'duration': 4 | AVISOS/ALERTAS ( 'ERRO AO PESQUISAR NO CHATGPT' / 'BLIND' [tem a resposta]/[não tem a resposta] )
// → 'duration': 3 | COMUNICADOS ( 'NOVA TASK' / 'NÃO É BLIND / REPORT DE TAREFAS )
// → 'duration': 2 | COMUNICADOS ( 'SNIFFER [ativado/desativado' )

let e = import.meta.url, ee = e;
async function notification(infOk) {
    let ret = { 'ret': false }; e = infOk && infOk.e ? infOk.e : e
    try {
        let inf, imgBase64; if (!infOk) { inf = {} } else { inf = infOk };

        let title = (!inf.title || inf.title == '') ? `TITULO VAZIO` : inf.title
        let text = (!inf.text || inf.text == '') ? `TEXTO VAZIO` : inf.text

        // →→→ LEGACY
        if (inf.legacy) {
            async function notificationLegacy(inf) {
                let ret = { 'ret': false };
                try {
                    let { title, text } = inf; let cng = typeof UrlFetchApp !== 'undefined';
                    let url = `http://${globalWindow.devSend}`; let reqOpt = { 'method': 'POST', }; let body = JSON.stringify({
                        "fun": [{ "securityPass": globalWindow.securityPass, 'name': 'notification', 'par': { 'duration': 5, 'icon': './src/scripts/media/notification_3.png', 'title': title, 'text': text, 'ntfy': true } }]
                    }); reqOpt[cng ? 'payload' : 'body'] = body; if (cng) { UrlFetchApp.fetch(url, reqOpt); } else { await fetch(url, reqOpt) } // GOOGLE | Chrome/NodeJS
                    ret['msg'] = 'NOTIFICATION [LEGACY]: OK'
                    ret['ret'] = true;
                } catch (catchErr) {
                    ret['msg'] = catchErr;
                };

                return { ...({ 'ret': ret.ret }), ...(ret.msg && { 'msg': ret.msg }), ...(ret.res && { 'res': ret.res }), };
            };
            let retNotificationLegacy = await notificationLegacy({ 'title': title, 'text': text });
            return retNotificationLegacy

        }

        if (!eng) {
            let retDevAndFun = await devFun({ 'e': e, 'enc': true, 'data': { 'name': 'notification', 'par': infOk, 'retInf': infOk.retInf, } }); return retDevAndFun
        } else {
            // →→→ NORMAL
            // MANTER NOTIFICAÇÕES ANTIGAS
            if (!inf.keepOld) {
                let notifications = await new Promise((resolve) => { chrome.notifications.getAll((notifs) => resolve(notifs)); });
                for (let notifId in notifications) { await new Promise((resolve) => { chrome.notifications.clear(notifId, resolve); }); }
            }

            if (!inf.icon || inf.icon.length > 1) {
                let imgSrc = !inf.icon ? './src/scripts/media/icon_3.png' : inf.icon; let imgBinary = await fetch(imgSrc).then(response => response.arrayBuffer());
                imgBase64 = btoa(String.fromCharCode(...new Uint8Array(imgBinary)))
            } else { imgBase64 = inf.icon };

            let json = {
                'duration': ((!inf.duration) || !(inf.duration > 0)) ? 5 : inf.duration, 'type': 'basic', 'icon': `data:image/png;base64,${imgBase64}`,
                'title': title,
                'text': text,
                'buttons': inf.buttons ? inf.buttons : [],
            };
            let not = {
                // MÁXIMO [CONSIDERANDO TUDO 'A']
                'type': json.type, 'iconUrl': json.icon, 'title': json.title.substring(0, 32),
                // MÁXIMO [CONSIDERANDO TUDO 'A']
                'message': json.text.substring(0, 128), 'buttons': json.buttons
            };

            // ENVIAR NOTIFICAÇÃO
            chrome.notifications.create(not, (notificationId) => {
                chrome.notifications.onButtonClicked.addListener((notifId, btnIdx) => { // ALGUM BOTAO PRESSIONADO
                    if (notifId === notificationId && btnIdx === 0) { alert('Botao 1 pressionado') }; if (notifId === notificationId && btnIdx === 1) { alert('Botao 2 pressionado') }
                }); setTimeout(() => { chrome.notifications.clear(notificationId) }, json.duration * 1000)
            });

            ret['msg'] = 'NOTIFICATION: OK'
            ret['ret'] = true;

        }

    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': infOk, 'e': catchErr, }); ret['msg'] = retRegexE.res;
    };

    return { ...({ 'ret': ret.ret }), ...(ret.msg && { 'msg': ret.msg }), ...(ret.res && { 'res': ret.res }), };
};

// CHROME | NODEJS
(eng ? window : global)['notification'] = notification;