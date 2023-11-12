async function command1(inf) {
  let ret = { 'ret': false };
  try {
    let retPromptChrome = promptChrome(`NOME DO COMANDO`);
    ret['msg'] = `COMMAND 1: OK`;
    ret['ret'] = true;
  } catch (e) {
    let m = await regexE({ 'e': e });
    ret['msg'] = m.res
  };
  return ret
}

if (typeof eng === 'boolean') {
  if (eng) { // CHROME
    window['command1'] = command1;
  } else { // NODEJS
    global['command1'] = command1;
  }
}