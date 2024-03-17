// let infRegex, retRegex // 'logFun': true,
// infRegex = { 'e': e, 'pattern': `UM(.*?)TRES`, 'text': `UMDOISTRES` }
// infRegex = { 'e': e, 'simple': true, 'pattern': `*DOIS*`, 'text': `UMDOISTRES` }
// retRegex = regex(infRegex);
// console.log(retRegex)

let e = import.meta.url, ee = e
function regex(inf) { // NÃO POR COMO 'async'!!!
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    try {
        if (catchGlobal) {
            let errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
            if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
            else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
        }
        if (inf.pattern.includes('(.*?)')) {
            let res = {}; let ok = false;
            let patternSplit = inf.pattern.split('(.*?)');
            let split1 = patternSplit[0].replace(/[.+?^${}()|[\]\\]/g, '\\$&')
            let split2 = patternSplit[1].replace(/[.+?^${}()|[\]\\]/g, '\\$&');
            let result1 = inf.text.match(`${split1}(.*?)${split2}`);
            let result2 = inf.text.match(`(?<=${split1})(.+)(?=${split2})`);
            let result3 = inf.text.match(`${split1}([\\s\\S]*?)${split2}`);
            let result4 = inf.text.match(`(?<=${split1})([\\s\\S]+)(?=${split2})`);
            let matches = inf.text.match(new RegExp(split1 + '(.*?)' + split2, 'g'));
            let result5 = matches ? matches.map(function (match) { return match.replace(new RegExp(split1 + '|' + split2, 'g'), ''); }) : [];
            res['0'] = `res.['1'] → [-|<] | res.['2'] → [-|>] | res.['3'] → [^|<] | res.['4'] → [^|>] | res.['5'] → [-|< ALL]`
            if (result1 && result1.length > 0) {
                res['1'] = result1[1]; ok = true
            } else {
                res['1'] = `[-|<] PADRAO '${inf.pattern}' NAO ENCONTRADO`
            }
            if (result2 && result2.length > 0) {
                res['2'] = result2[1]; ok = true
            } else {
                res['2'] = `[-|>] PADRAO '${inf.pattern}' NAO ENCONTRADO`
            }
            if (result3 && result3.length > 0) {
                res['3'] = result3[1]; ok = true
            } else {
                res['3'] = `[^|<] PADRAO '${inf.pattern}' NAO ENCONTRADO`
            }
            if (result4 && result4.length > 0) {
                res['4'] = result4[1]; ok = true
            } else {
                res['4'] = `[^|>] PADRAO '${inf.pattern}' NAO ENCONTRADO`
            }
            if (result5 && result5.length > 0) {
                res['5'] = result5; ok = true
            } else {
                res['5'] = `[-|< ALL] PADRAO '${inf.pattern}' NAO ENCONTRADO`
            }
            if (ok) {
                ret['msg'] = `REGEX: OK`;
                ret['res'] = res;
                ret['ret'] = true
            }
        } else {
            let pattern = inf.pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
            let result = new RegExp(`^${pattern}$`).test(inf.text);
            if (inf.simple) {
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
                    ret['msg'] = `\n\n #### ERRO #### REGEX \n PADRAO '${inf.pattern}' NAO ENCONTRADO \n\n`;
                }
            }
        }

        // ### LOG FUN ###
        if (inf && inf.logFun) {
            let infFile = { 'e': e, 'action': 'write', 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }
            infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; file(infFile);
        }
    } catch (err) {
        (async () => {
            let retRegexE = await regexE({ 'inf': inf, 'e': err, 'catchGlobal': false });
            ret['msg'] = retRegexE.res
        })()
    };
    return {
        ...({ ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}

if (eng) { // CHROME
    window['regex'] = regex;
} else { // NODEJS
    global['regex'] = regex;
}

