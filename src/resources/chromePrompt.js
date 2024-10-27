// let infChromePrompt, retChromePrompt
// infChromePrompt = { 'e': e, 'title': `NOME DO COMANDO` }
// retChromePrompt = await chromePrompt(infChromePrompt); console.log(retChromePrompt)

let e = import.meta.url, ee = e;
async function chromePrompt(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    try {
        let title = (inf.title) ? `${inf.title} | Digite o comando:` : `Digite o comando:`;
        let retPrompt = prompt(`${title}`);
        if (!retPrompt) {
            ret['msg'] = `CHROME PROMPT : ERRO | PROMPT EM BRANCO`;
        } else {
            ret['res'] = retPrompt;
            ret['msg'] = '`CHROME PROMPT: OK'
            ret['ret'] = true;
        }

    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; esLintIgnore = catchErr;
    }; return { ...({ 'ret': ret.ret }), ...(ret.msg && { 'msg': ret.msg }), ...(ret.res && { 'res': ret.res }), };
};

// CHROME | NODEJS
(eng ? window : global)['chromePrompt'] = chromePrompt;