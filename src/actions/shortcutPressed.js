await import('../resources/functions.js');
await import('../resources/promptChrome.js');
await import('../resources/notification.js');
await import('../scripts/command2.js');

await import('../scripts/peroptyx.js');
await import('../scripts/oneFormaMTPE.js');

async function shortcutPressed(inf) {
  let ret = { 'ret': false };
  try {
    let infConfigStorage, retConfigStorage, infNotification, retNotification
    if (inf.shortcut == 'atalho_1') { // ######################### ATALHO1
      //console.log('ATALHO 1: EXECUTANDO');
      const retPromptChrome = await promptChrome(`NOME DO COMANDO`);
      if (!retPromptChrome.res) { return ret }
      ret['ret'] = true;
      ret['msg'] = `SHORTCUT PRESSED: OK`;
      return ret
    } else if (inf.shortcut == 'atalho_2') { // ######################### ATALHO2
      console.log('ATALHO 2: EXECUTANDO');

      if (!gO.inf.sniffer) {
        infNotification =
        {
          'duration': 2,
          'type': 'basic',
          'title': `RODANDO`,
          'message': `OneForma | Peroptyx | Welocalize`,
          'iconUrl': "./src/media/icon_3.png",
          'buttons': [],
        };
        retNotification = await notification(infNotification)
        command2();
      } else {
        gO.inf = { 'sniffer': 2 }
      }

      // if (!gO.inf.sniffer) {
      //   infNotification =
      //   {
      //     'duration': 2,
      //     'type': 'basic',
      //     'title': `RODANDO`,
      //     'message': `Peroptyx`,
      //     'iconUrl': "./src/media/icon_3.png",
      //     'buttons': [],
      //   };
      //   retNotification = await notification(infNotification)
      //   peroptyx();
      // } else {
      //   gO.inf = { 'sniffer': 2 }
      // }
      ret['ret'] = true;
      ret['msg'] = `SHORTCUT PRESSED: OK`;
    } else if (inf.shortcut == 'atalho_3') { // ######################### ATALHO3
      console.log('ATALHO 3: EXECUTANDO');
      // if (!gO.inf.sniffer) {
      //   infNotification =
      //   {
      //     'duration': 2,
      //     'type': 'basic',
      //     'title': `RODANDO`,
      //     'message': `OneForma MTPE`,
      //     'iconUrl': "./src/media/icon_3.png",
      //     'buttons': [],
      //   };
      //   retNotification = await notification(infNotification)
      //   oneFormaMTPE();
      // } else {
      //   gO.inf = { 'sniffer': 2 }
      // }
      ret['ret'] = true;
      ret['msg'] = `SHORTCUT PRESSED: OK`;
    } else {
      ret['msg'] = `\n #### ERRO ####  SHORTCUT PRESSED | ACAO DO ATALHO NAO DEFINIDA \n\n`;
    }

  } catch (e) {
    ret['msg'] = regexE({ 'e': e }).res
  }

  if (!ret.ret) { console.log(ret.msg) }
  return ret
}

window['shortcutPressed'] = shortcutPressed;