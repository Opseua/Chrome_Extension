// } catch (err) {
//     let retRegexE = await regexE({ 'e': err });
//     ret['msg'] = retRegexE.res;
// };

async function regexE(inf) {
    let ret = { 'ret': false };
    try {
        let confKeep = conf
        let retGetPath = await getPath({ 'e': inf.e, 'mode': 1 })

        // IDENTIFICAR ENGINE
        let cng = typeof window !== 'undefined' ? 1 : typeof UrlFetchApp !== 'undefined' ? 3 : 2

        // NOME E LINHA DO ARQUIVO
        confKeep[2] = retGetPath.res[2]
        confKeep[4] = retGetPath.res[4]
        confKeep[5] = retGetPath.res[5]
        confKeep[6] = retGetPath.res[6]
        let file = confKeep[4]
        let line = confKeep[5]
        let projectFile = `[${confKeep[6]}]\n→ ${confKeep[4]}`

        // IDENTIFICAR O 'devMaster'
        let retFetch, devMaster
        if (cng == 1) { // CHROME
            try {
                retFetch = await fetch(chrome.runtime.getURL('src/config.json'));
                retFetch = await retFetch.text()
                retFetch = JSON.parse(retFetch)
                devMaster = retFetch.webSocket.devices[0].master
            } catch (err) {
                devMaster = `???`
            }
        } else if (cng == 2) { // NODEJS
            try {
                retFetch = await _fs.promises.readFile(`${confKeep[1]}://${confKeep[2]}/${confKeep[0]}`, 'utf8');
                retFetch = JSON.parse(retFetch)
                devMaster = retFetch.webSocket.devices[0].master
            } catch (err) {
                devMaster = `???`
            }
        };

        let errorOk = {
            'cng': cng, 'cngName': cng == 1 ? 'CHROME' : cng == 2 ? 'NODEJS' : 'GOOGLE', 'devMaster': devMaster,
            'file': file, 'projectFile': projectFile, 'line': line, 'inf': inf.inf, 'catchGlobal': inf.catchGlobal, 'e': inf.e.stack,
        };

        console.log(`\n\n### ERRO ### [catchGlobal ${inf.catchGlobal}]\n→ ${projectFile} [${errorOk.line}]\n\n${errorOk.e}\n\n\n`)

        // LOG DE ERROS [NODEJS]
        if (errorOk.cng == 2 && conf && confKeep[3]) {
            let dt1 = new Date();
            dt1.setSeconds(new Date().getSeconds()).setSeconds;
            let dt2 = Date.now();
            let dtRes = {
                'day': String(dt1.getDate()).padStart(2, '0'),
                'mon': String(dt1.getMonth() + 1).padStart(2, '0'),
                'yea': String(dt1.getFullYear()),
                'hou': String(dt1.getHours()).padStart(2, '0'),
                'min': String(dt1.getMinutes()).padStart(2, '0'),
                'sec': String(dt1.getSeconds()).padStart(2, '0'),
                'mil': String(dt2.toString().slice(-3)),
                'tim': String(dt2.toString().slice(0, -3)),
                'timMil': String(dt2.toString()),
                'monNam': ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'][dt1.getMonth()]
            };
            let time = dtRes, mon = `MES_${time.mon}_${time.monNam}`, day = `DIA_${time.day}`
            let hou = `${time.hou}.${time.min}.${time.sec}.${time.mil}`, text = errorOk
            text = text = typeof text === 'object' ? `${hou}\n${JSON.stringify(text)}\n\n` : `${hou}\n${text}\n\n`

            let path = errorOk.file
            if (path.includes('/')) {
                path = path.substring(path.lastIndexOf('/') + 1);
            }
            path = `${letter}:/${confKeep[3]}/log/JavaScript/${mon}/${day}/${hou}_ERR_${path.replace(/[<>:"\\|?*]/g, '').replace('.js', '')}.txt`

            if (typeof errorOk === 'object') {
                let raw = '';
                let obj = errorOk
                let concat = inf.concat ? inf.concat : `\n\n#######\n\n`
                for (let chave in obj) {
                    if (typeof obj[chave] === 'object') {
                        for (let subChave in obj[chave]) {
                            raw += obj[chave][subChave] + concat;
                        }
                    } else {
                        raw += obj[chave] + concat;
                    }
                }
                text = `${text}\n\n${raw}`
            }

            await _fs.promises.mkdir(_path.dirname(path), { recursive: true });
            await _fs.promises.writeFile(path, text, { flag: 'a' })
        }

        // ENVIAR NOTIFICAÇÃO COM O ERRO
        let reqOpt = { 'method': 'POST', };
        let body = JSON.stringify({
            'fun': [{
                'securityPass': errorOk.cng == 3 ? 'AAAAAAAA' : globalWindow.securityPass,
                'retInf': false,
                'name': 'notification',
                'par': {
                    'duration': 5, 'icon': './src/scripts/media/notification_3.png',
                    'title': `### ERRO ${errorOk.cngName} [${errorOk.devMaster}] ###`,
                    'text': `→ ${errorOk.projectFile} [${errorOk.line}]\n${errorOk.e.substring(0, 128)}`
                }
            }]
        })
        try {
            let url = errorOk.cng == 3 ? 'http://AAAAAAAA.20:1234/AAAAAAAA' : `http://${globalWindow.devSend.split('://')[1]}`
            // GOGOLE
            if (errorOk.cng == 3) {
                reqOpt['payload'] = body
                UrlFetchApp.fetch(url, reqOpt)
                Browser.msgBox(`### ERRO ### → ${errorOk.projectFile}[${errorOk.line}]`, `${errorOk.e.substring(0, 128)}`, Browser.Buttons.OK);
            } else {
                // CHROME | GOOGLE
                reqOpt['body'] = body
                await fetch(url, reqOpt)
            }
        } catch (err) {
            console.log(`\n\n### ERRO REGEXe [FETCH] ###\n\n${err}\n\n`)
        }
        ret['res'] = { 'file': errorOk.file, 'line': errorOk.line, 'projectFile': errorOk.projectFile, 'e': errorOk.e, }
        ret['msg'] = `\n\n### ERRO ### [catchGlobal ${inf.catchGlobal}]\n\n→ ${errorOk.projectFile} [${errorOk.line}]\n${errorOk.e}`;
    } catch (err) {
        console.log(`\n\n### ERRO REGEXe ###\n\n${err.stack}\n\n`)
    };
    return {
        ...({ ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}

if (eng) { // CHROME
    window['regexE'] = regexE;
} else { // NODEJS
    global['regexE'] = regexE;
}




































// ##################################  BACKUP

// async function regexE(inf) {
//     let ret = { 'ret': false };
//     try {
//         let confKeep = conf
//         let retGetPath = await getPath({ 'e': inf.e })

//         // IDENTIFICAR ENGINE
//         let cng = typeof window !== 'undefined' ? 1 : typeof UrlFetchApp !== 'undefined' ? 3 : 2

//         // NOME E LINHA DO ARQUIVO
//         let file = `NÃO IDENTIFICADO`, line = `NÃO IDENTIFICADA`, projectFile = `[?]`
//         if (retGetPath.ret) {
//             confKeep[2] = retGetPath.res[2]
//             confKeep[4] = retGetPath.res[4]
//             confKeep[5] = retGetPath.res[5]
//             confKeep[6] = retGetPath.res[6]
//             file = confKeep[4]
//             line = confKeep[5]
//             projectFile = `[${confKeep[6]}]\n→ ${confKeep[4]}`
//         }

//         // IDENTIFICAR O 'devMaster'
//         let retFetch, devMaster
//         if (cng == 1) { // CHROME
//             try {
//                 retFetch = await fetch(chrome.runtime.getURL('src/config.json'));
//                 retFetch = await retFetch.text()
//                 retFetch = JSON.parse(retFetch)
//                 devMaster = retFetch.webSocket.devices[0].master
//             } catch (err) {
//                 devMaster = `???`
//             }
//         } else if (cng == 2) { // NODEJS
//             try {
//                 retFetch = await _fs.promises.readFile(`${confKeep[1]}://${confKeep[2]}/${confKeep[0]}`, 'utf8');
//                 retFetch = JSON.parse(retFetch)
//                 devMaster = retFetch.webSocket.devices[0].master
//             } catch (err) {
//                 devMaster = `???`
//             }
//         };

//         let errorOk = {
//             'cng': cng, 'cngName': cng == 1 ? 'CHROME' : cng == 2 ? 'NODEJS' : 'GOOGLE', 'devMaster': devMaster,
//             'file': file, 'projectFile': projectFile, 'line': line, 'inf': inf.inf, 'catchGlobal': inf.catchGlobal, 'e': inf.e.stack,
//         };

//         console.log(`\n\n### ERRO ### [catchGlobal ${inf.catchGlobal}]\n→ ${projectFile} [${errorOk.line}]\n\n${errorOk.e}\n\n\n`)

//         // LOG DE ERROS [NODEJS]
//         if (errorOk.cng == 2 && conf && confKeep[3]) {
//             let dt1 = new Date();
//             dt1.setSeconds(new Date().getSeconds()).setSeconds;
//             let dt2 = Date.now();
//             let dtRes = {
//                 'day': String(dt1.getDate()).padStart(2, '0'),
//                 'mon': String(dt1.getMonth() + 1).padStart(2, '0'),
//                 'yea': String(dt1.getFullYear()),
//                 'hou': String(dt1.getHours()).padStart(2, '0'),
//                 'min': String(dt1.getMinutes()).padStart(2, '0'),
//                 'sec': String(dt1.getSeconds()).padStart(2, '0'),
//                 'mil': String(dt2.toString().slice(-3)),
//                 'tim': String(dt2.toString().slice(0, -3)),
//                 'timMil': String(dt2.toString()),
//                 'monNam': ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'][dt1.getMonth()]
//             };
//             let time = dtRes, mon = `MES_${time.mon}_${time.monNam}`, day = `DIA_${time.day}`
//             let hou = `${time.hou}.${time.min}.${time.sec}.${time.mil}`, text = errorOk
//             text = text = typeof text === 'object' ? `${hou}\n${JSON.stringify(text)}\n\n` : `${hou}\n${text}\n\n`
//             // NO MESMO ARQUIVO
//             // let path = `${letter}:/${confKeep[3]}/log/JavaScript/${mon}/${day}_err.txt`
//             // ARQUIVO DIFERENTE DENTRO DE OUTRA PASTA

//             let path = errorOk.file
//             if (path.includes('/')) {
//                 path = path.substring(path.lastIndexOf('/') + 1);
//             }
//             path = `${letter}:/${confKeep[3]}/log/JavaScript/${mon}/${day}/${hou}_ERR_${path.replace(/[<>:"\\|?*]/g, '').replace('.js', '')}.txt`

//             if (typeof errorOk === 'object') {
//                 let raw = '';
//                 let obj = errorOk
//                 let concat = inf.concat ? inf.concat : `\n\n#######\n\n`
//                 for (let chave in obj) {
//                     if (typeof obj[chave] === 'object') {
//                         for (let subChave in obj[chave]) {
//                             raw += obj[chave][subChave] + concat;
//                         }
//                     } else {
//                         raw += obj[chave] + concat;
//                     }
//                 }
//                 text = `${text}\n\n${raw}`
//             }

//             await _fs.promises.mkdir(_path.dirname(path), { recursive: true });
//             await _fs.promises.writeFile(path, text, { flag: 'a' })
//         }

//         // ENVIAR NOTIFICAÇÃO COM O ERRO
//         let reqOpt = { 'method': 'POST', };
//         let body = JSON.stringify({
//             'fun': [{
//                 'securityPass': errorOk.cng == 3 ? 'AAAAAAAA' : globalWindow.securityPass,
//                 'retInf': false,
//                 'name': 'notification',
//                 'par': {
//                     'duration': 5, 'icon': './src/scripts/media/notification_3.png',
//                     'title': `### ERRO ${errorOk.cngName} [${errorOk.devMaster}] ###`,
//                     'text': `→ ${errorOk.projectFile} [${errorOk.line}]\n${errorOk.e.substring(0, 128)}`
//                 }
//             }]
//         })
//         try {
//             let url = errorOk.cng == 3 ? 'http://AAAAAAAA.20:1234/AAAAAAAA' : `http://${globalWindow.devSend.split('://')[1]}`
//             // GOOGLE
//             if (errorOk.cng == 3) {
//                 reqOpt['payload'] = body
//                 UrlFetchApp.fetch(url, reqOpt)
//                 Browser.msgBox(`### ERRO ### → ${errorOk.projectFile}[${errorOk.line}]`, `${errorOk.e.substring(0, 128)}`, Browser.Buttons.OK);
//             } else {
//                 // CHROME | NODEJS
//                 reqOpt['body'] = body
//                 await fetch(url, reqOpt)
//             }
//         } catch (err) {
//             console.log(`\n\n### ERRO REGEXe [FETCH] ###\n\n${err}\n\n`)
//         }
//         ret['res'] = { 'file': errorOk.file, 'line': errorOk.line, 'projectFile': errorOk.projectFile, 'e': errorOk.e, }
//         ret['msg'] = `\n\n### ERRO ### [catchGlobal ${inf.catchGlobal}]\n\n→ ${errorOk.projectFile} [${errorOk.line}]\n${errorOk.e}`;
//     } catch (err) {
//         console.log(`\n\n### ERRO REGEXe ###\n\n${err.stack}\n\n`)
//     };
//     return {
//         ...({ ret: ret.ret }),
//         ...(ret.msg && { msg: ret.msg }),
//         ...(ret.res && { res: ret.res }),
//     };
// }