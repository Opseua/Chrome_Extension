async function command1(inf) {
  let ret = { 'ret': false }
  try {
    const retPromptChrome = promptChrome(`NOME DO COMANDO`);
    ret['ret'] = true;
    ret['msg'] = `COMMAND 1: OK`;
  } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; if (!ret.ret) { console.log(ret.msg) }; return ret
}

if (typeof window !== 'undefined') { // CHROME
  window['command1'] = command1;
} else { // NODEJS
  // global['command1'] = command1;
}