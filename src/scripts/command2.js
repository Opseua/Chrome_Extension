async function command2(inf) {
  let ret = { 'ret': false };
  try {
    let infNotification = {
      'duration': 3, 'icon': './src/media/icon_3.png',
      'title': `AGUARDE...`,
      'text': `Alternando sniffer`
    }
    let retNotification = await notification(infNotification);
    let infCommandLine = { 'command': `"${conf[1]}:\\ARQUIVOS\\PROJETOS\\Sniffer_Python\\src\\1_BACKGROUND.exe"`, 'retInf': false }
    let retCommandLine = await commandLine(infCommandLine)
    ret['ret'] = true;
    ret['msg'] = `SHORTCUT PRESSED: OK`;
  } catch (e) {
    let m = await regexE({ 'e': e });
    ret['msg'] = m.res
  };
  return ret
}

if (typeof eng === 'boolean') {
  if (eng) { // CHROME
    window['command2'] = command2;
  } else { // NODEJS
    global['command2'] = command2;
  }
}