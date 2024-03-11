// let retGetPath, e = new Error() // 'logFun': true,
// retGetPath = await getPath({ 'e': e , 'mode': 1 })
// console.log(retGetPath)

let e = import.meta.url, ee = e
let _stackTrace; if (!eng) { _stackTrace = await import('stack-trace'); }
async function getPath(inf) {
    let ret = { 'ret': false };// e = inf && inf.e ? inf.e : e;
    try {
        if (inf.mode == 1) {
            // ### NOVO MODELO (JS PURO)

            let stackTrace, filePath
            let regex2 = /(?:\:\/\/)(.+)/g

            // stackTrace = `
            // ReferenceError: globalWindow is not defined
            //     at regexE (chrome-extension://afelhdjampgfmchfcnbginicjcmjhhma/src/resources/regexE.js:103:65)
            //     at async file (chrome-extension://afelhdjampgfmchfcnbginicjcmjhhma/src/resources/file.js:448:25)
            //     at async chrome-extension://afelhdjampgfmchfcnbginicjcmjhhma/src/resources/configStorage.js:100:41`;
            // stackTrace = `
            // TypeError: Cannot read properties of null (reading '1')
            //     at getPath (file:///d:/ARQUIVOS/PROJETOS/Chrome_Extension/src/resources/getPath.js:44:46)
            //     at file:///d:/ARQUIVOS/PROJETOS/WebScraper/src/resources/apiNire.js:60:24
            //     at file:///d:/ARQUIVOS/PROJETOS/URA_Reversa/src/server.js:80:24`;

            let filePathOk = []; stackTrace = inf.e.stack;
            for (let [index, value] of stackTrace.match(regex2).entries()) {
                filePathOk.push(value)
            }
            if (filePathOk.length == 1) {
                for (let [index, value] of new Error().stack.match(regex2).entries()) {
                    filePathOk.unshift(value)
                    break
                }
            }
            filePath = []
            for (let [index, value] of filePathOk.entries()) {
                let valueOk = value
                value = value.replace(':///', '').replace('://', '').split('.js:')
                let line = Number(value[1].split(':')[0])
                value = value[0].split('/src/')
                let fileName = `src/${value[1]}.js`
                value = value[0]
                if (eng && valueOk.includes('://')) {
                    // CHROME
                    filePath.push(['D', `chrome-extension://${chrome.runtime.id}`, fileName, line, 'Chrome_Extension'])
                } else if (valueOk.includes('ARQUIVOS/PROJETOS/')) {
                    //NODEJS
                    value = value.split(':/')
                    filePath.push([value[0].toUpperCase(), value[1], fileName, line, value[1].split('PROJETOS/')[1]])
                }
            }

            // console.log(filePath)

            let conf = [
                'src/config.json', // CONFIG
                filePath[0][0], // LETRA
                filePath[0][1], // ARQUIVOS/PROJETOS/Chrome_Extension | afelhdjampgfmchfcnbginicjcmjhhma
                stackTrace.includes('chrome-extension://') ? 'Downloads/Google Chrome%' : filePath[filePath.length - 1][1], // ARQUIVOS/PROJETOS/WebScraper
                filePath[filePath.length - 1][2], // ARQUIVO
                filePath[filePath.length - 1][3], // LINHA
                filePath[filePath.length - 1][4], // PROJETO
            ]

            if (inf.keep) {
                if (eng) { // CHROME
                    window['conf'] = conf;
                    window['letter'] = conf[1];
                    window['project'] = conf[6];
                } else { // NODEJS
                    global['conf'] = conf;
                    global['letter'] = conf[1];
                    global['project'] = conf[6];
                }
            }

            ret['res'] = conf
            ret['msg'] = `GET PATH: OK`;
            ret['ret'] = true;
        } else if (inf.mode == 2) {
            // ### NOVO MODELO (JS PURO)

            // ORIGINAL 1 (NÃO APAGAR!!!)
            // let [, filename, line, column] = new Error().stack.match(/\/([\/\w-_\.]+\.js):(\d*):(\d*)/)

            // LETRA DA UNIDADE
            let match = import.meta.url.match(/file:\/\/\/([a-zA-Z]):/);
            let letterOk = match[1].toUpperCase();

            let split, filename, line, stack, lines, lastLine

            // PROJETO ONDE ESTÁ A FUNCTIONS
            stack = new Error().stack;
            stack.split('\n').length < 3 ? stack = new Error().stack : inf.e.stack
            lines = stack.split('\n'); lastLine = lines[1];

            stack = lastLine.match(/\/([\/\w-_\.]+\.js):(\d*):(\d*)/);
            split = `/src/`; filename = stack[1].split(split); line = Number(stack[2]); split = split.replace('/', '')
            conf[0] = 'src/config.json'
            conf[1] = letterOk
            conf[2] = filename[0]

            // PROJETO QUE ESTÁ SENDO EXECUTADO
            stack = inf.e.stack
            stack.split('\n').length < 3 ? stack = new Error().stack : inf.e.stack
            lines = stack.split('\n'); lastLine = lines[lines.length - 1];

            stack = lastLine.match(/\/([\/\w-_\.]+\.js):(\d*):(\d*)/);
            split = `/src/`; filename = stack[1].split(split); line = Number(stack[2]); split = split.replace('/', '')
            conf[3] = filename[0]
            conf[4] = `${split}${filename[1]}`
            conf[5] = line
            conf[6] = filename[0].split('/').pop()
        } else if (inf.mode == 3) {
            // ### NOVO MODELO (JS PURO)

            // ORIGINAL 2 (NÃO APAGAR!!!)
            // function getStackTrace() {
            //     let stack; try { throw new Error(''); } catch (error) { stack = error.stack || ''; }
            //     stack = stack.split('\n').map(function (line) { return line.trim(); });
            //     return stack.splice(stack[0] == 'Error' ? 2 : 1);
            // };

            function getStackTrace() {
                let stack; stack = inf.e.stack || ''; stack = stack.split('\n').map(function (line) { return line.trim(); });
                return stack.splice(stack[0] == 'Error' ? 1 : 1);
            };

            // LETRA DA UNIDADE
            let match = import.meta.url.match(/file:\/\/\/([a-zA-Z]):/);
            let letterOk = match[1].toUpperCase();

            let split, filename, line, stack, stackOk = getStackTrace()

            // PROJETO ONDE ESTÁ A FUNCTIONS
            stack = stackOk[0].match(/\/[a-zA-Z]:\/([\/\w-_\.]+\.js):(\d*):\d*/);
            split = `/src/`; filename = stack[1].split(split); line = Number(stack[2]); split = split.replace('/', '')
            conf[0] = 'src/config.json'
            conf[1] = letterOk
            conf[2] = filename[0]

            // PROJETO QUE ESTÁ SENDO EXECUTADO
            stack = stackOk[stackOk.length - 1].match(/\/[a-zA-Z]:\/([\/\w-_\.]+\.js):(\d*):\d*/);
            split = `/src/`; filename = stack[1].split(split); line = Number(stack[2]); split = split.replace('/', '')
            conf[3] = filename[0]
            conf[4] = `${split}${filename[1]}`
            conf[5] = line
            conf[6] = filename[0].split('/').pop()
        } else {
            // ### ANTIGO

            // NÃO É UM ERRO
            let conf = []
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

            let matchesNew = [], resultado = [], resultadoOk = [] //,conf
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
                window['project'] = conf[6];
            } else { // NODEJS
                global['letter'] = conf[1];
                global['conf'] = conf;
                global['project'] = conf[6];
            }
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
            window['project'] = conf[6];
        } else { // NODEJS
            global['letter'] = conf[1];
            global['conf'] = conf;
            global['project'] = conf[6];
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