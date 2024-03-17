// let infNotification, retNotification // 'logFun': true,
// infNotification = {
//     'e': e, 'duration': 2, 'icon': './src/scripts/media/icon_4.png', 'retInf': false,
//     'buttons': [{ 'title': 'BOTAO 1' }, { 'title': 'BOTAO 2' }],
//     'title': `TITULO`, 'text': `TEXTO`,
// };
// retNotification = await notification(infNotification);
// console.log(retNotification)

let e = import.meta.url, ee = e
async function notification(infOk) {
    let ret = { 'ret': false };
    e = infOk && infOk.e ? infOk.e : e
    try {
        let inf, imgBase64; if (!infOk) { inf = {} } else { inf = infOk };
        if (!`rodar no → CHROME`.includes(engName)) { // [ENCAMINHAR PARA DEVICE]
            let infDevAndFun = { 'e': e, 'enc': true, 'data': { 'name': 'notification', 'par': inf, 'retInf': inf.retInf, } };
            let retDevAndFun = await devFun(infDevAndFun); return retDevAndFun
        };

        if (!inf.icon || inf.icon.length > 1) {
            let imgSrc = !inf.icon ? './src/scripts/media/icon_3.png' : inf.icon;
            let imgBinary = await fetch(imgSrc).then(response => response.arrayBuffer())
            imgBase64 = btoa(String.fromCharCode(...new Uint8Array(imgBinary)))
        } else {
            imgBase64 = inf.icon
        };
        let json = {
            duration: ((!inf.duration) || !(inf.duration > 0)) ? 5 : inf.duration, type: 'basic', icon: `data:image/png;base64,${imgBase64}`,
            title: ((!inf.title) || (inf.title == '')) ? `TITULO VAZIO` : `${inf.title}`, text: ((!inf.text) || (inf.text == '')) ? `TEXT VAZIO` : `${inf.text}`,
            buttons: inf.buttons ? inf.buttons : [],
        };
        let not = {
            type: json.type, iconUrl: json.icon, title: json.title.substring(0, 32),   // máximo [considerando tudo 'A']
            message: json.text.substring(0, 128), buttons: json.buttons // máximo [considerando tudo 'A']
        };
        chrome.notifications.create(not, (notificationId) => {
            chrome.notifications.onButtonClicked.addListener((notifId, btnIdx) => { // ALGUM BOTAO PRESSIONADO
                if (notifId === notificationId && btnIdx === 0) {
                    alert('1')
                };
                if (notifId === notificationId && btnIdx === 1) {
                    alert('2')
                }
            }); setTimeout(() => {
                chrome.notifications.clear(notificationId)
            }, json.duration * 1000)
        });
        ret['msg'] = 'NOTIFICATION: OK'
        ret['ret'] = true;

        // ### LOG FUN ###
        if (inf && inf.logFun) {
            let infFile = { 'e': e, 'action': 'write', 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }
            infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; file(infFile);
        }
    } catch (err) {
        let retRegexE = await regexE({ 'inf': infOk, 'e': err, 'catchGlobal': false });
        ret['msg'] = retRegexE.res
    };
    return {
        ...({ ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}

if (eng) { // CHROME
    window['notification'] = notification;
} else { // NODEJS
    global['notification'] = notification;
}
