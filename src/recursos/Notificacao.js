async function Notificacao(inf) {

    if (!inf) { var inf = {}; };

    var json =
    {
        tempo: ((inf.tempo === undefined) || !(inf.tempo > 0)) ? `5` : `${inf.tempo}`,
        clipboard: (inf.clipboard === undefined) ? null : `${inf.clipboard}`,
        type: 'basic',
        iconUrl: ((inf.iconUrl === undefined) || !(inf.iconUrl.match(/.png/))) ? `z_icon.png` : `${inf.iconUrl}`,
        title: ((inf.title === undefined) || (inf.title == '')) ? `TITULO VAZIO` : `${inf.title}`,
        message: ((inf.message === undefined) || (inf.message == '')) ? `MESSAGE VAZIO` : `${inf.message}`,
        buttons: inf.buttons || [],
    };

    var not =
    {
        type: json.type,
        iconUrl: json.iconUrl,
        title: json.title,
        message: json.message,
        buttons: json.buttons,
    };

    chrome.notifications.create(not, (notificationId) => {

        // DEFINIR AREA DE TRANSFERENCIA
        if (json.clipboard) {
            clipboard(json.clipboard)
        }

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

export default Notificacao