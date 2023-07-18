const { notification } = await import('./notification.js');
const { getCookies } = await import('./getCookies.js');
const { tabSearch } = await import('./tabSearch.js');
const { regex } = await import('./functions.js');

async function leads(inf) {
    let ret = { 'ret': false };
    try {

        const infTabSearch = { 'search': `*ora*` }
        const retTabSearch = await tabSearch(infTabSearch)
        console.log(2, retTabSearch)

        const infGetCookies = { 'search': retTabSearch.res.id }
        const retGetCookies = await getCookies(infGetCookies)
        console.log(retGetCookies);

        // const rettabSearch = [{
        //     "id": 182501626,
        //     "tit": "(18) ntfy",
        //     "url": "https://ntfy.sh/OPSEUA",
        //     "active ": false,
        //     "index ": 2,
        //     "pinned ": false
        // }]

        // let retRegex = 'PADRAO REGEX NAO ENCONTRADO';
        // for (const obj of rettabSearch.res) {
        //     if (regex(obj.url, '*google*')) {
        //         retRegex = { tabId: obj.id, title: obj.tit, url: obj.url };
        //         break;
        //     }
        // }

        // console.log(retRegex);


        // const res = await Promise.all(rettabSearch.res.map(async (v, index) => {

        //     console.log(v)


        //     return {
        //       '1_RESULTADO': resultado,
        //       '2_NOME': nome,
        //       '3_ENDERECO': endereco,
        //       '4_FECHADO': fechado,
        //       '5_Relevance': relevance,
        //       '6_Name_Accurracy': nameAccurracy,
        //       '7_Address_Accurracy': addressAccurracy,
        //       '8_Pin_Accurracy': pinAccurracy,
        //       //'9_COMENTARIO': comentario,
        //       'z': ['x'],
        //       '10_COMENTARIO_pt': comentario1,
        //       'x': ['x'],
        //       '11_COMENTARIO_alterado': comentario2,
        //     };
        //   }));

        // let infNotification =
        // {
        //     'duration': 5,
        //     'type': 'basic',
        //     'title': 'ERRO: Na área de transferência',
        //     'message': `texto`,
        //     'iconUrl': undefined,
        //     'buttons': [{ 'title': 'BOTÃO 1' }, { 'title': 'BOTÃO 2' }],
        // };
        // notification(infNotification)
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

export { leads }
