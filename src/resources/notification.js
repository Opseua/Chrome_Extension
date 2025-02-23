// let infNotification, retNotification;
// infNotification = { 'duration': 3, 'icon': `icon_4.png`, 'buttons': [{ 'title': 'BOTAO 1', }, { 'title': `BOTAO 2`, },], };
// infNotification = { e, 'retInf': false, 'title': `TITULO`, 'text': `TEXTO`, 'keepOld': true, 'ntfy': true, 'chromeNot': false, 'legacy': false, }; // 'legacy' PELO HTTP POST NÃO!!!
// retNotification = await notification(infNotification); console.log(retNotification);

// // → 'duration': 5 | ERROS ( 'regexE' [crash NodeJS] )
// // → 'duration': 4 | AVISOS/ALERTAS ( 'ERRO AO PESQUISAR NO CHATGPT' / 'BLIND' [tem a resposta]/[não tem a resposta] )
// // → 'duration': 3 | COMUNICADOS ( 'NOVA TASK' / 'NÃO É BLIND / REPORT DE TAREFAS )
// // → 'duration': 2 | COMUNICADOS ( 'SNIFFER [ativado/desativado' )

let e = import.meta.url, ee = e;
async function notification(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        let { retInf = false, title = 'TITULO VAZIO', text = 'TEXTO VAZIO', keepOld = false, ntfy = true, chromeNot = false, duration = 5, icon = 'notification_3.png', buttons = [], legacy = false, } = inf;

        // [1] → NOTIFICAÇÃO NÃO SOLICITADA | [2] → NOTIFICAÇÃO CHAMADA ret {true} | [msg] NOTIFICAÇÃO CHAMADA ret {false}
        let { devMy, securityPass, devSever, } = gW; let retDAF = {}; let rets = []; let promises = [];

        // NTFY
        if (ntfy) {
            promises.push(
                (async () => {
                    let retA1 = await api({ e, 'method': 'POST', 'url': `https://ntfy.sh/${devMy}?title=${encodeURIComponent(title)}`, 'body': text, 'max': 10, 'bodyObject': true, 'ignoreErr': true, });
                    rets.push({ 'ret': retA1.ret, 'msg': `[NTFY: ${retA1.ret ? 'OK' : `ERRO | ${retA1.msg.replace(': ERRO | ', '#SPLIT#').split('#SPLIT#')[1]}`}] `, });
                })()
            );
        }

        // LEGACY
        if (legacy && !chromeNot) {
            promises.push(
                (async () => {
                    let body = { 'fun': [{ securityPass, retInf, 'name': 'notification', 'par': { title, text, keepOld, chromeNot, duration, icon, buttons, }, },], };
                    let retA2 = await api({ e, 'method': 'POST', 'url': `http://${devSever}`, 'headers': { 'raw': true, }, body, 'bodyObject': true, 'ignoreErr': true, }); retA2 = retA2.ret ? retA2.res.body : retA2;
                    rets.push({ 'ret': retA2.ret, 'msg': `[CHROME {LEGACY}: ${retA2.ret ? 'OK' : `ERRO | ${retA2.msg.replace(': ERRO | ', '#SPLIT#').split('#SPLIT#')[1]}`}]`, });
                })()
            );
        }

        if (!eng && !legacy && !chromeNot) {
            // →→→ NO NODEJS
            promises.push(
                (async () => { // DELETAR PARA EVITAR NOTIFICAÇÕES DUPLICADAS DO NTFY
                    let infTemp = inf; infTemp['ntfy'] = false; retDAF = await devFun({ e, 'enc': true, 'data': { retInf, 'name': 'notification', 'par': infTemp, }, });
                    rets.push({ 'ret': retDAF.ret, 'msg': `[CHROME {DEV FUN}: ${retDAF.ret ? 'OK' : `ERRO | ${retDAF.msg.replace(': ERRO | ', '#SPLIT#').split('#SPLIT#')[1]}`}]`, });
                })()
            );
        } else if (!legacy && !chromeNot) {
            // →→→ NO CHROME
            promises.push(
                (async () => {
                    async function sendNotification() {
                        try {
                            let nots = chrome.notifications; // MANTER NOTIFICAÇÕES ANTIGAS
                            if (!keepOld) { let nts = await new Promise((resolve) => { nots.getAll((n) => resolve(n)); }); for (let id in nts) { await new Promise((resolve) => { nots.clear(id, resolve); }); } }
                            // ÍCONE | MÁXIMO [CONSIDERANDO TUDO 'A']
                            icon = icon.includes('media') ? icon.split('media/')[1] : icon; // ANTIGO → './src/scripts/media/notification_3.png'
                            icon = await fetch(`./src/media/${icon}`).then((v) => v.arrayBuffer()).then((buffer) => btoa(String.fromCharCode(...new Uint8Array(buffer)))); await new Promise((resolve, reject) => {
                                nots.create({ 'type': 'basic', 'iconUrl': `data:image/png;base64,${icon}`, 'title': title.substring(0, 32), 'message': text.substring(0, 128), buttons, }, (notId) => {
                                    if (chrome.runtime.lastError) { return reject(chrome.runtime.lastError.message); }; // ENVIAR NOTIFICAÇÃO
                                    nots.onButtonClicked.addListener((notifId, btnIdx) => { if (notifId === notId) { alert(`BOTÃO ${btnIdx} PRESSIONADO`); } }); // BOTÃO PRESSIONADO
                                    setTimeout(() => { if (notId) { nots.clear(notId); } }, duration * 1000); resolve(true); // NOTIFICAÇÃO: LIMPAR
                                });
                            }); return true;
                        } catch (catchErr) { esLintIgnore = catchErr; return false; }
                    }; let retSN = await sendNotification(); rets.push({ 'ret': retSN, 'msg': `[CHROME: ${retSN ? 'OK' : 'ERRO | AO ENVIAR NOTIFICAÇÃO'}]`, });
                })()
            );
        }

        // EXECUTAR TODAS AS AÇÕES DE UMA SÓ VEZ E AGUARDAR O RETORNO DE TODAS
        await Promise.all(promises);

        ret['ret'] = rets.length > 0 && rets.every(item => item.ret === true);
        if (!ntfy && chromeNot) {
            ret['msg'] = `NOTIFICATION: ERRO [VAZIO] = NENHUM DISPOSITIVO`;
        } else {
            ret['msg'] = `${(!eng && !legacy && !chromeNot) ? '[ENC] ' : ''}NOTIFICATION: [${rets.map(item => item.ret ? 'OK' : 'ERRO').join('|')}] = ${rets.map(item => item.msg).join('')}`;
        }

        if (typeof ret.msg === 'string') { ret['msg'] = ret.msg.trim(); }

    } catch (catchErr) {
        if (inf.ignoreErr) {
            ret['msg'] = `${(!eng && !inf.legacy && !inf.chromeNot) ? '[ENC] ' : ''}NOTIFICATION: ERRO | CHAMADA PELA 'regexE'`;
        } else {
            let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
        }
    };

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.res && { 'res': ret.res, }), };
};

// CHROME | NODEJS
(eng ? window : global)['notification'] = notification;


