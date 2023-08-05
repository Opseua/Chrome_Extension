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
      ret['msg'] = `\n #### ERRO ####  SHORTCUT PRESSED | ACAO DO ATALHO NAO DEFINIDA \n\n`;
    }

  } catch (e) {
    ret['msg'] = regexE({ 'e': e }).res
  }

  if (!ret.ret) { console.log(ret.msg) }
  return ret
}

window['shortcutPressed'] = shortcutPressed;