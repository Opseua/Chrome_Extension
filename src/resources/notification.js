// await import('./notification.js');
// let infNotification =
// {
//   'duration': 2,
//   'type': 'basic',
//   'title': `titulo`,
//   'message': `texto`,
//   'iconUrl': undefined,
//   'buttons': [{ 'title': 'BOTÃO 1' }, { 'title': 'BOTÃO 2' }],
// };
// const retNotification = await notification(infNotification)
// console.log(retNotification)

await import('./functions.js');

async function notification(infOk) {
    let ret = { 'ret': false }
    try {
        let inf
        if (!infOk) { inf = {} } else { inf = infOk };
        let imgBase64
        if (inf.iconUrl === undefined || inf.iconUrl.length > 1) {
            const imgSrc = inf.iconUrl === undefined ? './src/media/icon_1.png' : inf.iconUrl;
            const imgBinary = await fetch(imgSrc).then(response => response.arrayBuffer());
            imgBase64 = btoa(String.fromCharCode(...new Uint8Array(imgBinary)));
        } else {
            imgBase64 = inf.iconUrl;
        }

        const json =
        {
            duration: ((inf.duration === undefined) || !(inf.duration > 0)) ? 5 : inf.duration,
            type: 'basic',
            iconUrl: `data:image/png;base64,${imgBase64}`,
            title: ((inf.title === undefined) || (inf.title == '')) ? `TITULO VAZIO` : `${inf.title}`,
            message: ((inf.message === undefined) || (inf.message == '')) ? `MESSAGE VAZIO` : `${inf.message}`,
            buttons: inf.buttons || [],
        };

        const not =
        {
            type: json.type,
            iconUrl: json.iconUrl,
            title: json.title,
            message: json.message.substring(0, 128),
            buttons: json.buttons,
        };

        chrome.notifications.create(not, (notificationId) => {
            // ALGUM BOTAO PRESSIONADO
            chrome.notifications.onButtonClicked.addListener((notifId, btnIdx) => {
                if (notifId === notificationId && btnIdx === 0) {
                    alert('1');
                }

                if (notifId === notificationId && btnIdx === 1) {
                    alert('2');
                }
            });

            setTimeout(() => {
                chrome.notifications.clear(notificationId);
            }, json.duration * 1000);
        });

        ret['ret'] = true;
        ret['msg'] = 'NOTIFICATION: OK';
    } catch (e) {
        ret['msg'] = regexE({ 'e': e }).res;
    }

    if (!ret.ret) { console.log(ret.msg) }
    return ret
}

// export { notification }

window['notification'] = notification;
