// let retGetPath, e = new Error() // 'logFun': true,
// retGetPath = await getPath({ 'e': e })
// console.log(retGetPath)

let e = import.meta.url;
async function getPath(inf) {
    let ret = { 'ret': false };
    e = inf && inf.e ? inf.e : e
    try {
        let newError, newErrorOk, matchesNew = [], resultado = [], resultadoOk = [], conf
        newError = new Error()
        if (inf && inf.e) {
            newErrorOk = newError.stack.replace(/\/\/\//g, '//').split('\n')
            newErrorOk.splice(2, 0, inf.e.stack.replace(/\/\/\//g, '//').split('\n')[1]);
        } else {
            newErrorOk = newError.stack.replace(/\/\/\//g, '//').split('\n')
        }

        for (let [index, value] of newErrorOk.entries()) {
            if (value.includes('//') && value.includes('.js')) {
                matchesNew.push(value.replace('chrome-extension://', '://D:/chrome-extension/'))
            }
        }
        if (inf && inf.e) {
            matchesNew = [matchesNew[0].split('://')[1], matchesNew[1].split('://')[1]]
        } else {
            matchesNew = [matchesNew[0].split('://')[1], matchesNew[matchesNew.length - 1].split('://')[1]]
        }
        matchesNew = [[matchesNew[0].split('.js:')[0], matchesNew[0].split('.js:')[1].split(':')[0]], [matchesNew[1].split('.js:')[0], matchesNew[1].split('.js:')[1].split(':')[0]]]
        // console.log(`\nmatchesNew [${matchesNew.length}]`, matchesNew)

        function parsePaths(paths) {
            const result = [];
            for (const path of paths) {
                const parts = path.split('/');
                const drive = parts[0].charAt(0);
                const srcIndex = parts.indexOf('src');
                if (srcIndex === -1) {
                    continue;
                }
                const unitLetter = drive.toUpperCase();
                const rootFolder = parts.slice(1, srcIndex).join('/');
                const projectFolder = parts[srcIndex - 1];
                const remainingPath = parts.slice(srcIndex).join('/');
                result.push([unitLetter, rootFolder.replace(`/${projectFolder}`, ''), projectFolder, `${remainingPath}.js`]);
            }
            return result;
        }
        for (let [index, value] of matchesNew.entries()) {
            resultado.push(parsePaths([value[0]])[0])
        }
        resultadoOk = [resultado[0][0], resultado[0][1], resultado[0][2], resultado[1][2], resultado[1][3], matchesNew[1][1]]
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


