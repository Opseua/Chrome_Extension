async function command2(inf) {
  let ret = { 'ret': false };
  try {
    let infNotification = { 'duration': 3, 'icon': './src/media/icon_3.png', 'title': `AGUARDE...`, 'text': `Alternando sniffer` }
    let par;
    let retNotification = await notification(infNotification);
    let infFile = { 'action': 'read', 'path': `${conf[1]}:/ARQUIVOS/Projetos/Sniffer_Python/log/state.txt` };
    let retFile = await file(infFile); par = `"${conf[1]}:\\ARQUIVOS\\WINDOWS\\BAT\\RUN_PORTABLE\\1_BACKGROUND.exe"`;
    if (retFile.res == 'ON') {
      par = `${par} "taskkill /IM nodeSniffer.exe /F"`
    } else {
      par = `${par} "${conf[1]}:\\ARQUIVOS\\PROJETOS\\Sniffer_Python\\src\\1_BACKGROUND.exe"`
    };
    await commandLine({ 'command': par, 'retInf': false })
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