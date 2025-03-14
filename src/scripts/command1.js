let e = import.meta.url, ee = e;
async function command1(inf = {}) {
  let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
  try {
    let { origin, infTryRatingComplete = '', } = inf;

    if (origin === 'chrome') {
      let retChromeActions = await chromeActions({ e, 'action': 'prompt', 'title': `NOME DO COMANDO`, });
      if (!retChromeActions.ret) { return retChromeActions; } else { infTryRatingComplete = retChromeActions.res; }
    } else if (origin === 'web') {
      infTryRatingComplete = infTryRatingComplete;
    }

    if (infTryRatingComplete.includes('maps.app.goo.gl') || ['zz', 'xx', 'cc',].includes(infTryRatingComplete.toLowerCase())) {
      // → GERAR O COMENTÁRIO DO 'tryRatingComplete'

      // DEFINIR DESTINO (USUÁRIO 3 DO CHROME)
      let devSendOther, devices = gW.devices[1]; let retChromeActions = await chromeActions({ e, 'action': 'user', });
      for (let c in devices[1]) { if (c.includes(retChromeActions.res)) { let valor = devices[1][c]; devSendOther = 3; devSendOther = gW.devGet[1].replace(devices[2][valor], devices[2][devSendOther]); } }

      // ENVIAR MENSAGEM COM O COMANDO
      let message = {
        'fun': [{
          'securityPass': gW.securityPass, 'retInf': true, 'name': 'tryRatingComplete', 'par': { infTryRatingComplete, },
        },],
      };

      let retListenerAcionar = await tryRatingComplete({ e, 'infTryRatingComplete': message.fun[0].par.infTryRatingComplete, });

      if (retListenerAcionar.ret) {
        await clipboard({ e, 'value': retListenerAcionar.res.comments[retListenerAcionar.res.current], });
      }

      notification({ e, 'duration': 2, 'icon': `icon_${retListenerAcionar.ret ? 3 : 2}.png`, 'retInf': false, 'title': `Complete Judge`, 'text': retListenerAcionar.msg, 'ntfy': false, });
    } else if (/^(?:\D*\d){0,4}\D*$/.test(infTryRatingComplete)) {
      let p = infTryRatingComplete.replace(/[, \t]/g, '').split('').reduce((t, n) => { if (n === '1') { return t + 1; } else if (n === '2') { return t + 0; } else if (n === '3') { return t - 1; } return t; }, 1);
      notification({ 'title': `SRT: AVALIAÇÃO`, 'text': (p === 4 ? '[4/5]' : p < 1 ? 1 : p).toString(), 'duration': 3, 'icon': `icon_3.png`, 'ntfy': false, });
    }

    ret['msg'] = `COMMAND 1: OK`;
    ret['ret'] = true;

  } catch (catchErr) {
    let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
  }

  return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.res && { 'res': ret.res, }), };
}

// CHROME | NODEJS
globalThis['command1'] = command1;


