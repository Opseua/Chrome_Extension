// let infRegex, retRegex
// infRegex = { e, 'pattern': `UM(.*?)TRES`, 'text': `UMDOISTRES`, };
// infRegex = { e, 'pattern': `UM(*)TRES`, 'text': `UMDOISTRES`, }; // [NOVO MODO]
// infRegex = { e, 'pattern': `*DOIS*`, 'text': `UMDOISTRES`, 'simple': true, };
// retRegex = regex(infRegex); console.log(retRegex);

let e = import.meta.url, ee = e;
function regex(inf = {}) { // NÃO POR COMO 'async'!!!
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        let { pattern, text, simple, } = inf;

        if (!pattern) {
            ret['msg'] = `REGEX: ERRO | INFORMAR O 'pattern'`;
        } else if (!text) {
            ret['msg'] = `REGEX: ERRO | INFORMAR O 'text'`;
        } else {
            pattern = pattern.replace('(*)', '(.*?)')
            if (pattern.includes('(.*?)')) {
                let res = {}; let ok = false; let patternSplit = pattern.split('(.*?)');
                let split1 = patternSplit[0].replace(/[*.+?^${}()|[\]\\]/g, '\\$&')
                let split2 = patternSplit[1].replace(/[*.+?^${}()|[\]\\]/g, '\\$&'); let result1 = text.match(`${split1}(.*?)${split2}`);
                let result2 = text.match(`(?<=${split1})(.+)(?=${split2})`); let result3 = text.match(`${split1}([\\s\\S]*?)${split2}`);
                let result4 = text.match(`(?<=${split1})([\\s\\S]+)(?=${split2})`); let matches = text.match(new RegExp(split1 + '(.*?)' + split2, 'g'));
                let result5 = matches ? matches.map(function (match) { return match.replace(new RegExp(split1 + '|' + split2, 'g'), ''); }) : [];
                res['0'] = `res.['1'] → [-|<] | res.['2'] → [-|>] | res.['3'] → [^|<] | res.['4'] → [^|>] | res.['5'] → [-|< ALL]`
                if (result1 && result1.length > 0) {
                    res['1'] = result1[1]; ok = true
                } else {
                    res['1'] = `[-|<] PADRAO '${pattern}' NAO ENCONTRADO`
                }
                if (result2 && result2.length > 0) {
                    res['2'] = result2[1]; ok = true
                } else {
                    res['2'] = `[-|>] PADRAO '${pattern}' NAO ENCONTRADO`
                }
                if (result3 && result3.length > 0) {
                    res['3'] = result3[1]; ok = true
                } else {
                    res['3'] = `[^|<] PADRAO '${pattern}' NAO ENCONTRADO`
                }
                if (result4 && result4.length > 0) {
                    res['4'] = result4[1]; ok = true
                } else {
                    res['4'] = `[^|>] PADRAO '${pattern}' NAO ENCONTRADO`
                }
                if (result5 && result5.length > 0) {
                    res['5'] = result5; ok = true
                } else {
                    res['5'] = `[-|< ALL] PADRAO '${pattern}' NAO ENCONTRADO`
                }
                if (ok) {
                    ret['msg'] = `REGEX: OK`;
                    ret['res'] = res;
                    ret['ret'] = true
                }
            } else {
                pattern = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
                let result = new RegExp(`^${pattern}$`).test(text);
                if (simple) {
                    if (result) {
                        return true
                    } else {
                        return false
                    }
                } else {
                    if (result) {
                        ret['msg'] = `REGEX: OK`;
                        ret['res'] = 'TEXTO POSSUI O PADRAO';
                        ret['ret'] = true;
                    }
                    else {
                        ret['msg'] = `REGEX: ERRO | PADRAO '${pattern}' NAO ENCONTRADO`;
                    }
                }
            }
        }

    } catch (catchErr) {
        (async () => { let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res']; })()
    };

    return { ...({ 'ret': ret.ret }), ...(ret.msg && { 'msg': ret.msg }), ...(ret.res && { 'res': ret.res }), };
};

// CHROME | NODEJS
(eng ? window : global)['regex'] = regex;