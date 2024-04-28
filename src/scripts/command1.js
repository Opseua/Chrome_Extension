let e = import.meta.url, ee = e;
async function command1(inf) {
  let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
  try {
    let retPromptChrome = promptChrome({ 'e': e, 'title': `NOME DO COMANDO` });
    ret['msg'] = `COMMAND 1: OK`;
    ret['ret'] = true;
  } catch (catchErr) {
    let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, 'catchGlobal': false });
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
