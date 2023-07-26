await import('../scripts/command1.js');

async function shortcutPressed(inf) {
  let ret = { 'ret': false };
  try {
    if (inf.shortcut == 'atalho_1') { // ######################### ATALHO1
      //console.log('ATALHO 1: EXECUTANDO');
      ret['ret'] = true;
      ret['msg'] = `SHORTCUT PRESSED: OK`;
      await command1()
    } else if (inf.shortcut == 'atalho_2') { // ######################### ATALHO2
      console.log('ATALHO 2: EXECUTANDO');
      ret['ret'] = true;
      ret['msg'] = `SHORTCUT PRESSED: OK`;
      console.log('VARIAVEL GLOBAL LIMPA!');
      localStorage.removeItem('varGlobal');
    } else {
      ret['msg'] = `SHORTCUT PRESSED: ERRO | ACAO DO ATALHO NAO DEFINIDA`;
    }

  } catch (e) {
    ret['msg'] = `SHORTCUT PRESSED: ERRO | ${e}`
  }

  if (!ret.ret) { console.log(ret.msg) }
  return ret
}

export { shortcutPressed }

window['shortcutPressed'] = shortcutPressed;