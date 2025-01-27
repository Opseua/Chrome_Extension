let e = import.meta.url, ee = e;
async function command2(inf = {}) {
  let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
  try {
    let infNotification = {
      'duration': 2, 'icon': 'icon_3.png',
      'title': `AGUARDE...`,
      'text': `Alternando sniffer`,
    };
    await notification(infNotification);

    let infCommandLine = { e, 'command': `${fileProjetos}/Sniffer_Python/src/z_OUTROS_server/TOGGLE_HIDE.vbs`, };
    await commandLine(infCommandLine);

    ret['ret'] = true;
    ret['msg'] = `SHORTCUT PRESSED: OK`;
  } catch (catchErr) {
    let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
  };

  return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.res && { 'res': ret.res, }), };
};

// CHROME | NODEJS
(eng ? window : global)['command2'] = command2;


