// await import('./clipboard.js');
// const infClipboard = { 'value': 'Esse é o valor' };
// const retClipboard = await clipboard(infClipboard)
// console.log(retClipboard)

await import('./functions.js');

async function clipboard(inf) {
  let ret = { 'ret': false };
  try {
    let text = inf.value
    // OBJETO INDENTADO EM TEXTO BRUTO
    if (typeof text === 'object' && text !== null) {
      text = JSON.stringify(text, null, 2);
    }
    const element = document.createElement('textarea');
    element.value = text;
    document.body.appendChild(element);
    element.select();
    document.execCommand('copy');
    document.body.removeChild(element);
    ret['ret'] = true;
    ret['msg'] = 'CLIPBOARD: OK';
  } catch (e) {
    ret['msg'] = regexE({ 'e': e }).res;
  }

  if (!ret.ret) { console.log(ret.msg) }
  return ret
}

export { clipboard }

window['clipboard'] = clipboard;

