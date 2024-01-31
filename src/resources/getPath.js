// let retGetPath, e = new Error() // 'logFun': true,
// retGetPath = await getPath({ 'e': e })
// console.log(retGetPath)

let e = import.meta.url, ee = e
let _stackTrace; if (!eng) { _stackTrace = await import('stack-trace'); }
async function getPath(inf) {
    let ret = { 'ret': false };// e = inf && inf.e ? inf.e : e;
    try {
        // NÃO É UM ERRO
        let eOk = false
        if (inf.e.stack.split('\n').length == 2) {
            eOk = inf.e.stack.replace('\n', `\n${new Error().stack.split('\n')[1]}\n`)
            inf.e.stack = eOk
        }

        // NECESSÁRIO PARA PEGAR O PATH DA FUNCTION [NÃO APAGAR!!!]
        let splitE = inf.e.stack.split('\n');
        if (splitE.length == 3) {
            splitE = inf.e.stack.replace(splitE[2], new Error().stack.split('\n')[1])
            inf['e'] = { 'stack': splitE }
        }

        // JS PURO [Chrome/NodeJS]
        let stackCallerFile = 'NÃO IDENTIFICADO', stackCallerLine = 'NÃO IDENTIFICADA'
        let stackErrorFile = stackCallerFile, stackErrorLine = stackCallerLine
        let stack = inf.e.stack.split('\n');
        stackErrorFile = (stack[1]?.match(/:(.*?).js/) || [])[1]?.replace('///', '') + '.js' || stackCallerFile;
        stackErrorLine = Number((stack[1]?.match(/.js:(.*?):/) || [])[1]) || stackCallerLine;
        for (let index = stack.length - 1; index >= 0; index--) {
            let value = stack[index];
            if (value.includes('.js')) {
                stackCallerFile = (value.match(/:(.*?).js/) || [])[1]?.replace('///', '') + '.js' || stackCallerFile;
                stackCallerLine = Number((value.match(/.js:(.*?):/) || [])[1]) || stackCallerLine;
                break;
            }
        }

        // BIBLIOTECA [NodeJS]
        let traceCallerFile = 'NÃO IDENTIFICADO', traceCallerLine = 'NÃO IDENTIFICADA'
        let traceErrorFile = traceCallerFile, traceErrorLine = traceCallerLine
        if (!eng) {
            let trace = _stackTrace.parse(inf.e);
            if (trace.length > 0) {
                traceErrorFile = trace[0]?.getFileName()?.replace('file:///', '') || traceCallerFile;
                traceErrorLine = Number(trace[0]?.getLineNumber()) || traceCallerLine;
                if (trace.length > 1) {
                    traceCallerFile = trace[trace.length - 1]?.getFileName()?.replace('file:///', '') || traceCallerFile;
                    traceCallerLine = Number(trace[trace.length - 1]?.getLineNumber()) || traceCallerLine;
                }
            }
        }

        let matchesNew = [], resultado = [], resultadoOk = [], conf
        if (eng) { // CHROME
            matchesNew = [
                // JS PURO
                [stackErrorFile, stackErrorLine],
                [stackCallerFile, stackCallerLine],
            ]
        } else { // NODEJS
            matchesNew = [
                // BIBLIOTECA
                [traceErrorFile, traceErrorLine],
                [traceCallerFile, traceCallerLine],
                // // JS PURO
                // [stackErrorFile, stackErrorLine],
                // [stackCallerFile, stackCallerLine],
            ]
        }

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
            resultado[0][1], // ARQUIVOS/PROJETOS | chrome-extension://
            resultado[0][2], // Chrome_Extension | afelhdjampgfmchfcnbginicjcmjhhma
            resultado[1][2], // Sniffer_Python | Downloads/Google Chrome%
            eOk ? resultado[1][3] : resultado[0][3], // src/server.js
            eOk ? matchesNew[1][1] : matchesNew[0][1] // 88 [linha]
        ]
        if (cng == 1) {
            resultadoOk[0] = `D`
            resultadoOk[1] = `chrome-extension:/`
            resultadoOk[3] = `Downloads/Google Chrome%`
        }
        conf = [
            'src/config.json',
            resultadoOk[0], // D
            `${resultadoOk[1]}/${resultadoOk[3]}`, // ARQUIVOS/PROJETOS/Chrome_Extension | chrome-extension://afelhdjampgfmchfcnbginicjcmjhhma
            `${resultadoOk[1]}/${resultadoOk[2]}`, // ARQUIVOS/PROJETOS/Sniffer_Python | Downloads/Google Chrome%
            resultadoOk[4], resultadoOk[5],
            resultado[0][2]
        ]
        if (cng == 1) {
            conf[3] = resultadoOk[3]
            conf[2] = conf[2].replace(resultadoOk[3], resultadoOk[2])
            conf[6] = 'Chrome_Extension'
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
            let infFile = { 'e': e, 'action': 'write', 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }
            infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; file(infFile);
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






















// ##################################  BACKUP

// async function getPath(inf) {
//     let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
//     try {
//         let newError, newErrorOk, matchesNew = [], resultado = [], resultadoOk = [], conf
//         newError = new Error()
//         if (inf && inf.e) {
//             newErrorOk = newError.stack.replace(/\/\/\//g, '//').split('\n')
//             newErrorOk.splice(2, 0, inf.e.stack.replace(/\/\/\//g, '//').split('\n')[1]);
//         } else {
//             newErrorOk = newError.stack.replace(/\/\/\//g, '//').split('\n')
//         }

//         for (let [index, value] of newErrorOk.entries()) {
//             if (value.includes('//') && value.includes('.js')) {
//                 matchesNew.push(value.replace('chrome-extension://', '://D:/chrome-extension/'))
//             }
//         }
//         if (inf && inf.e) {
//             matchesNew = [matchesNew[0].split('://')[1], matchesNew[1].split('://')[1]]
//         } else {
//             matchesNew = [matchesNew[0].split('://')[1], matchesNew[matchesNew.length - 1].split('://')[1]]
//         }
//         matchesNew = [[matchesNew[0].split('.js:')[0], matchesNew[0].split('.js:')[1].split(':')[0]], [matchesNew[1].split('.js:')[0], matchesNew[1].split('.js:')[1].split(':')[0]]]
//         // console.log(`\nmatchesNew [${matchesNew.length}]`, matchesNew)

//         function parsePaths(paths) {
//             const result = [];
//             for (const path of paths) {
//                 const parts = path.split('/');
//                 const drive = parts[0].charAt(0);
//                 const srcIndex = parts.indexOf('src');
//                 if (srcIndex === -1) {
//                     continue;
//                 }
//                 const unitLetter = drive.toUpperCase();
//                 const rootFolder = parts.slice(1, srcIndex).join('/');
//                 const projectFolder = parts[srcIndex - 1];
//                 const remainingPath = parts.slice(srcIndex).join('/');
//                 result.push([unitLetter, rootFolder.replace(`/${projectFolder}`, ''), projectFolder, `${remainingPath}.js`]);
//             }
//             return result;
//         }
//         for (let [index, value] of matchesNew.entries()) {
//             resultado.push(parsePaths([value[0]])[0])
//         }
//         resultadoOk = [resultado[0][0], resultado[0][1], resultado[0][2], resultado[1][2], resultado[1][3], matchesNew[1][1]]
//         if (cng == 1) {
//             resultadoOk[1] = `${resultadoOk[1]}:/`
//             resultadoOk[3] = `Downloads/Google Chrome%`
//         }
//         conf = [
//             'src/config.json',
//             resultadoOk[0], // D
//             `${resultadoOk[1]}/${resultadoOk[2]}`, // ARQUIVOS/PROJETOS/Chrome_Extension
//             `${resultadoOk[1]}/${resultadoOk[3]}`, // ARQUIVOS/PROJETOS/WebScraper
//             resultadoOk[4], // src/server.js
//             resultadoOk[5], // 99
//             resultado[1][1] == 'chrome-extension' ? 'Chrome_Extension' : resultado[1][2] // Chrome_Extension | WebScraper
//         ]
//         if (cng == 1) {
//             conf[3] = resultadoOk[3]
//         }

//         ret['res'] = conf
//         ret['msg'] = `GET PATH: OK`;
//         ret['ret'] = true;

//         if (eng) { // CHROME
//             window['letter'] = conf[1];
//             window['conf'] = conf;
//         } else { // NODEJS
//             global['letter'] = conf[1];
//             global['conf'] = conf;
//         }

//         // ### LOG FUN ###
//         if (inf && inf.logFun) {
//             let infFile = { 'e': e, 'action': 'write', 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }, retFile
//             infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; retFile = await file(infFile);
//         }
//     } catch (e) {
//         // console.log(`\n\n### ERRO GET PATH ###\n\n${e.stack}\n\n`)
//         // console.log(inf.e)
//     };
//     return {
//         ...({ ret: ret.ret }),
//         ...(ret.msg && { msg: ret.msg }),
//         ...(ret.res && { res: ret.res }),
//     };
// }