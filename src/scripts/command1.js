
async function command1(inf) {
  let ret = { 'ret': false };
  try {
    let retPromptChrome = promptChrome(`NOME DO COMANDO`);
    ret['msg'] = `COMMAND 1: OK`;
    ret['ret'] = true;
  } catch (e) {
    let retRegexE = await regexE({ 'inf': inf, 'e': e });
    ret['msg'] = retRegexE.res
  };
  return {
    ...({ ret: ret.ret }),
    ...(ret.msg && { msg: ret.msg }),
    ...(ret.res && { res: ret.res }),
  };
}

if (eng) { // CHROME
  window['command1'] = command1;
} else { // NODEJS
  global['command1'] = command1;
}
