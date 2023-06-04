async function notificacao(inf) {

    if (!inf) { var inf = {}; };

    //console.log(inf.title)

    if (inf.iconUrl === undefined || inf.iconUrl.length > 1) {
        const imgSrc = inf.iconUrl === undefined ? 'icon_1.png' : inf.iconUrl;
        const imgBinary = await fetch(imgSrc).then(response => response.arrayBuffer());
        var imgBase64 = btoa(String.fromCharCode(...new Uint8Array(imgBinary)));
    } else {
        var imgBase64 = inf.iconUrl;
    }

    var json =
    {
        tempo: ((inf.tempo === undefined) || !(inf.tempo > 0)) ? `5` : `${inf.tempo}`,
        type: 'basic',
        iconUrl: `data:image/png;base64,${imgBase64}`,
        title: ((inf.title === undefined) || (inf.title == '')) ? `TITULO VAZIO` : `${inf.title}`,
        message: ((inf.message === undefined) || (inf.message == '')) ? `MESSAGE VAZIO` : `${inf.message}`,
        buttons: inf.buttons || [],
    };

    var not =
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
        }, json.tempo * 1000);

    });

}

export { notificacao }