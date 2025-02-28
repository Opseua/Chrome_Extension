// let infModel, retModel
// infModel = { e, 'chaveUm': 'valorUm', 'chaveDois': 'valorDois' }
// retModel = await model(infModel); console.log(retModel)

let e = import.meta.url, ee = e;
async function model(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        let { text = 'aaa', folder = 'bbb', } = inf;

        let retRegex = regex({ e, 'pattern': `UM(.*?)TRES`, text, 'nada': folder, }); console.log(retRegex);

        ret['res'] = `resposta aqui`;
        ret['msg'] = `MODEL: OK`;
        ret['ret'] = true;

    } catch (catchErr) {
        let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    }

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.res && { 'res': ret.res, }), };
}

// CHROME | NODEJS
(eng ? window : global)['model'] = model;


