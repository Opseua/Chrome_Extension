let e = import.meta.url, ee = e;
async function command1(inf) {
  let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
  try {
    let infTryRatingComplete = ''

    if (inf.origin == 'chrome') {
      let retChromePrompt = await chromePrompt({ 'e': e, 'title': `NOME DO COMANDO` });
      if (!retChromePrompt.ret) { return retChromePrompt } else { infTryRatingComplete = retChromePrompt.res }
    } else if (inf.origin == 'web') {
      infTryRatingComplete = inf.infTryRatingComplete
    }

    if (infTryRatingComplete.includes('maps.app.goo.gl') || ['zz', 'xx', 'cc',].includes(infTryRatingComplete.toLowerCase())) {
      // → GERAR O COMENTÁRIO DO 'tryRatingComplete'

      // DEFINIR DESTINO (USUÁRIO 3 DO CHROME)
      let devSendOther, devices = globalWindow.devices[1]; let retChromeActions = await chromeActions({ 'e': e, 'action': 'user' });
      for (let c in devices[1]) { if (c.includes(retChromeActions.res)) { let valor = devices[1][c]; devSendOther = 3; devSendOther = globalWindow.devGet[1].replace(devices[2][valor], devices[2][devSendOther]) } }

      // ENVIAR MENSAGEM COM O COMANDO
      let message = {
        'fun': [{
          'securityPass': globalWindow.securityPass, 'retInf': true, 'name': 'tryRatingComplete',
          'par': { 'infTryRatingComplete': infTryRatingComplete, }
        }]
      };

      let retListenerAcionar = await tryRatingComplete({ 'e': e, 'infTryRatingComplete': message.fun[0].par.infTryRatingComplete, });

      if (retListenerAcionar.ret) {
        await clipboard({ 'e': e, 'value': retListenerAcionar.res.comments[retListenerAcionar.res.current] });
      }

      let infNotification = {
        'e': e, 'duration': 2, 'icon': `./src/scripts/media/icon_${retListenerAcionar.ret ? 3 : 2}.png`, 'retInf': false,
        'title': `Complete Judge`, 'text': retListenerAcionar.msg,
      };
      await notification(infNotification);
    }

    ret['msg'] = `COMMAND 1: OK`;
    ret['ret'] = true;

  } catch (catchErr) {
    let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res;
  }; return { ...({ ret: ret.ret }), ...(ret.msg && { msg: ret.msg }), ...(ret.res && { res: ret.res }), };
};

// CHROME | NODEJS
(eng ? window : global)['command1'] = command1;
