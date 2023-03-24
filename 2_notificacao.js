let clipboard;
import('./2_clipboard.js').then(module => {
  clipboard = module.default;
});

/////////////////////////////////////////////

function fun_notificacao(inf1) {

  if (!inf1) { var inf1 = {}; };

  var json =
  {
    tempo: ((inf1.tempo === undefined) || !(inf1.tempo > 0)) ? `5` : `${inf1.tempo}`,
    clipboard: (inf1.clipboard === undefined) ? null : `${inf1.clipboard}`,
    type: "basic",
    iconUrl: ((inf1.iconUrl === undefined) || !(inf1.iconUrl.match(/.png/))) ? `z_icon.png` : `${inf1.iconUrl}`,
    title: ((inf1.title === undefined) || (inf1.title == "")) ? `TITULO VAZIO` : `${inf1.title}`,
    message: ((inf1.message === undefined) || (inf1.message == "")) ? `MESSAGE VAZIO` : `${inf1.message}`,
    buttons: inf1.buttons || [],
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

export default fun_notificacao