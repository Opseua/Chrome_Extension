
async function command2(inf) {
  let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
  try {
    let infNotification = {
      'duration': 3, 'icon': './src/scripts/media/icon_3.png',
      'title': `AGUARDE...`,
      'text': `Alternando sniffer`
    }
    let retNotification = await notification(infNotification);
    let infCommandLine = { 'e': e, 'command': `"${letter}:/ARQUIVOS/PROJETOS/Sniffer_Python/src/z_Outros/Sniffer_Python_keep[N]-view[N].lnk"`, 'retInf': false }
    let retCommandLine = await commandLine(infCommandLine)
    ret['ret'] = true;
    ret['msg'] = `SHORTCUT PRESSED: OK`;
  } catch (e) {
    let retRegexE = await regexE({ 'inf': inf, 'e': e, 'catchGlobal': false });
    ret['msg'] = retRegexE.res
  };
  return {
    ...({ ret: ret.ret }),
    ...(ret.msg && { msg: ret.msg }),
    ...(ret.res && { res: ret.res }),
  };
}

if (eng) { // CHROME
  window['command2'] = command2;
} else { // NODEJS
  global['command2'] = command2;
}
