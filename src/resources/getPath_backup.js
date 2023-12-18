// let retGetPath, e = new Error() // 'logFun': true,
// retGetPath = await getPath({ 'e': e })
// console.log(retGetPath)

let _stackTrace
if (eng) { // CHROME
} else { // NODEJS
    global['_stackTrace'] = await import('stack-trace');
}

let e = import.meta.url;
async function getPath(inf) {
    let ret = { 'ret': false };// e = inf && inf.e ? inf.e : e;
    try {
        // NÃO É UM ERRO
        let eOk = false
        if (inf.e.stack.split('\n').length == 2) {
            eOk = inf.e.stack.replace('\n', `\n${new Error().stack.split('\n')[1]}\n`)
            inf.e.stack = eOk
        }

        // JS PURO [stack]
        let stack = inf.e.stack.split('\n');
        let stackCallerFile = 'NÃO IDENTIFICADO';
        let stackCallerLine = 'NÃO IDENTIFICADA';
        let stackErrorFile = (stack[1]?.match(/:(.*?).js/) || [])[1]?.replace('///', '') + '.js' || stackCallerFile;
        let stackErrorLine = Number((stack[1]?.match(/.js:(.*?):/) || [])[1]) || stackCallerLine;
        for (let index = stack.length - 1; index >= 0; index--) {
            let value = stack[index];
            if (value.includes('.js')) {
                stackCallerFile = (value.match(/:(.*?).js/) || [])[1]?.replace('///', '') + '.js' || stackCallerFile;
                stackCallerLine = Number((value.match(/.js:(.*?):/) || [])[1]) || stackCallerLine;
                break;
            }
        }

        // BIBLIOTECA [trace]
        let trace = _stackTrace.parse(inf.e);
        let traceCallerFile = 'NÃO IDENTIFICADO';
        let traceCallerLine = 'NÃO IDENTIFICADA';
        let traceErrorFile = traceCallerFile;
        let traceErrorLine = traceCallerLine;
        if (trace.length > 0) {
            traceErrorFile = trace[0]?.getFileName()?.replace('file:///', '') || traceCallerFile;
            traceErrorLine = Number(trace[0]?.getLineNumber()) || traceCallerLine;
            if (trace.length > 1) {
                traceCallerFile = trace[trace.length - 1]?.getFileName()?.replace('file:///', '') || traceCallerFile;
                traceCallerLine = Number(trace[trace.length - 1]?.getLineNumber()) || traceCallerLine;
            }
        }

        let matchesNew = [], resultado = [], resultadoOk = [], conf
        matchesNew = [
            // JS PURO
            [stackErrorFile, stackErrorLine],
            [stackCallerFile, stackCallerLine],
            // BIBLIOTECA
            [traceErrorFile, traceErrorLine],
            [traceCallerFile, traceCallerLine],
        ]

        function parsePaths(paths) {
            let result = [];
            for (let path of paths) {
                let parts = path.split('/');
                let drive = parts[0].charAt(0);
                let srcIndex = parts.indexOf('src');
                if (srcIndex === -1) {
                    continue;
                }
                let unitLetter = drive.toUpperCase();
                let rootFolder = parts.slice(1, srcIndex).join('/');
                let projectFolder = parts[srcIndex - 1];
                let remainingPath = parts.slice(srcIndex).join('/');
                result.push([unitLetter, rootFolder.replace(`/${projectFolder}`, ''), projectFolder, `${remainingPath.replace('.js', '') + '.js'}`]);
            }
            return result;
        }
        for (let [index, value] of matchesNew.entries()) {
            resultado.push(parsePaths([value[0]])[0])
        }
        resultadoOk = [
            resultado[0][0], // D
            resultado[0][1], // ARQUIVOS/PROJETOS
            resultado[0][2], // Chrome_Extension
            resultado[1][2], // WebScraper
            eOk ? resultado[1][3] : resultado[0][3], // src/resources/wsConnect.js
            eOk ? matchesNew[1][1] : matchesNew[0][1] // 88 [linha]
        ]

        if (cng == 1) {
            resultadoOk[1] = `${resultadoOk[1]}:/`
            resultadoOk[3] = `Downloads/Google Chrome%`
        }
        conf = [
            'src/config.json',
            resultadoOk[0], `${resultadoOk[1]}/${resultadoOk[2]}`, `${resultadoOk[1]}/${resultadoOk[3]}`, resultadoOk[4], resultadoOk[5],
            resultado[1][1] == 'chrome-extension' ? 'Chrome_Extension' : resultado[1][2]
        ]
        if (cng == 1) {
            conf[3] = resultadoOk[3]
        }

        ret['res'] = conf
        ret['msg'] = `GET PATH: OK`;
        ret['ret'] = true;

        if (eng) { // CHROME
            window['letter'] = conf[1];
            window['conf'] = conf;
        } else { // NODEJS
            global['letter'] = conf[1];
            global['conf'] = conf;
        }

        // ### LOG FUN ###
        if (inf && inf.logFun) {
            let infFile = { 'e': e, 'action': 'write', 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }, retFile
            infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; retFile = await file(infFile);
        }
    } catch (e) {
        console.log(`\n\n### ERRO GET PATH ###\n\n${e.stack}\n\n`)

        let conf = [
            'src/config.json',
            cng == 1 ? 'D' : import.meta.url.charAt(8).toUpperCase(),
            'ARQUIVOS/PROJETOS/Chrome_Extension',
            'ARQUIVOS/PROJETOS/Chrome_Extension',
            'NÃO IDENTIFICADO',
            'NÃO IDENTIFICADA',
            'NÃO IDENTIFICADO'
        ]
        ret['res'] = conf
        ret['msg'] = `GET PATH: OK`;
        ret['ret'] = true;

        if (eng) { // CHROME
            window['letter'] = conf[1];
            window['conf'] = conf;
        } else { // NODEJS
            global['letter'] = conf[1];
            global['conf'] = conf;
        }
    };
    return {
        ...({ ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}

if (eng) { // CHROME
    window['getPath'] = getPath;
} else { // NODEJS
    global['getPath'] = getPath;
}


