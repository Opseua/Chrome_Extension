const { notification } = await import('./notification.js');

let infNotification =
{
  'duration': 5,
  'type': 'basic',
  'title': 'ERRO: Na área de transferência',
  'message': `texto`,
  'iconUrl': undefined,
  'buttons': [{ 'title': 'BOTÃO 1' }, { 'title': 'BOTÃO 2' }],
};
notification(infNotification)

async function model(inf) {
    let ret = { 'ret': false };
    try {

        // CODIGO AQUI
        ret['ret'] = true;
        ret['msg'] = `MODEL: OK`;
        ret['res'] = `resposta aqui`;

    } catch (e) {
        ret['msg'] = `MODEL: ERRO | ${e}`
    }

    if (!ret.ret) { console.log(ret.msg) }
    return ret
}

export { model }
