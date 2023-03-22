let clipboard;
import('./2_clipboard.js').then(module => {
  clipboard = module.default;
});

 
 function notificacao(inf1) {


  var inf1 = {
    title: 'Título da notificação',
    message: 'Mensagem da notificação',
    iconUrl: 'z_icon.png',
    buttons: [{ title: 'Botão 1' }, { title: 'Botão 2' }]
  }


    if (!inf1) { var inf1 = {}; }
    console.log(inf1.iconUrl)
  
    var json =
    {
      type: "basic",
      iconUrl: ((inf1.iconUrl === undefined) || !(inf1.iconUrl.match(/.png/))) ? `z_icon.png` : `${inf1.iconUrl}`,
      title: ((inf1.title === undefined) || (inf1.title == "")) ? `TITULO VAZIO` : `${inf1.title}`,
      message: ((inf1.message === undefined) || (inf1.message == "")) ? `MESSAGE VAZIO` : `${inf1.message}`,
      buttons: inf1.buttons || [],
    };
  
    chrome.notifications.create(json, (notificationId) => {
      chrome.notifications.onButtonClicked.addListener((notifId, btnIdx) => {
        if (notifId === notificationId && btnIdx === 0) {
          clipboard('1');
        }
        if (notifId === notificationId && btnIdx === 1) {
          clipboard('2');
        }
      });
  
      setTimeout(() => {
        chrome.notifications.clear(notificationId);
      }, 5000);
    });
  
    function copiarTexto(texto) {
      const el = document.createElement('textarea');
      el.value = texto;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
  
  }

  export default notificacao