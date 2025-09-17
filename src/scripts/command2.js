let e = currentFile(new Error()), ee = e;
async function command2(inf = {}) {
  let ret = { 'ret': false, }; e = inf.e || e;
  try {
    await notification({ 'duration': 2, 'icon': 'iconBOT', 'title': `AGUARDE...`, 'text': `Alternando sniffer`, 'ntfy': false, });

    await commandLine({ e, 'command': `${fileProjetos}/Sniffer_Python/src/z_OUTROS_server/TOGGLE_HIDE.vbs`, });

    ret['ret'] = true;
    ret['msg'] = `SHORTCUT PRESSED: OK`;
  } catch (catchErr) {
    let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
  }

  return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.hasOwnProperty('res') && { 'res': ret.res, }), };
}

// CHROME | NODE
globalThis['command2'] = command2;


