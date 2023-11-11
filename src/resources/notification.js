// const infNotification = {
//     'duration': 2, 'icon': './src/media/icon_4.png', 'retInf': false, 'retUrl': false,
//     'buttons': [{ 'title': 'BOTAO 1' }, { 'title': 'BOTAO 2' }],
//     'title': `TITULO`, 'text': 'TEXTO',
// };
// const retNotification = await notification(infNotification);
// console.log(retNotification)

async function notification(infOk) {
    await import('./@functions.js');
    let ret = { 'ret': false };
    try {
        let inf, imgBase64; if (!infOk) { inf = {} } else { inf = infOk };

        if (!dev) { // [ENCAMINHAR PARA DEVICE → CHROME]
            const retInf = typeof inf.retInf === 'boolean' ? inf.retInf ? JSON.stringify(Date.now()) : false : inf.retInf ? inf.retInf : JSON.stringify(Date.now())
            const infDevAndFun = { 'name': 'notification', 'retInf': retInf, 'par': inf };
            const retDevAndFun = await newDevFun(infDevAndFun) // await devAndFun(infDevAndFun);
            return retDevAndFun
        };

        if (!inf.icon || inf.icon.length > 1) {
            const imgSrc = !inf.icon ? './src/media/icon_3.png' : inf.icon; const imgBinary = await fetch(imgSrc).then(response => response.arrayBuffer())
            imgBase64 = btoa(String.fromCharCode(...new Uint8Array(imgBinary)))
        } else { imgBase64 = inf.icon }; const json = {
            duration: ((!inf.duration) || !(inf.duration > 0)) ? 5 : inf.duration, type: 'basic', icon: `data:image/png;base64,${imgBase64}`,
            title: ((!inf.title) || (inf.title == '')) ? `TITULO VAZIO` : `${inf.title}`, text: ((!inf.text) || (inf.text == '')) ? `TEXT VAZIO` : `${inf.text}`,
            buttons: inf.buttons ? inf.buttons : [],
        }; const not = {
            type: json.type, iconUrl: json.icon, title: json.title.substring(0, 32),   // máximo [considerando tudo 'A']
            message: json.text.substring(0, 128), buttons: json.buttons // máximo [considerando tudo 'A']
        }; chrome.notifications.create(not, (notificationId) => {
            chrome.notifications.onButtonClicked.addListener((notifId, btnIdx) => { // ALGUM BOTAO PRESSIONADO
                if (notifId === notificationId && btnIdx === 0) { alert('1') }; if (notifId === notificationId && btnIdx === 1) { alert('2') }
            }); setTimeout(() => { chrome.notifications.clear(notificationId) }, json.duration * 1000)
        }); ret['ret'] = true; ret['msg'] = 'NOTIFICATION: OK'
    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; return ret
}

if (dev) { // CHROME
    window['notification'] = notification;
} else { // NODEJS
    global['notification'] = notification;
}