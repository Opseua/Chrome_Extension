/* eslint-disable camelcase */

// let infGetPath, retGetPath; // 'isFunction': true
// infGetPath = { 'e': new Error(), };
// retGetPath = await getPath(infGetPath); console.log(retGetPath);

async function getPath(inf = {}) {
    let ret = { 'ret': false, };
    let { devChildren, isFunction, } = inf;

    let nd = 'NAO_DEFINIDO', funLetter = `D`, root = eng ? 'chrome-extension' : 'ARQUIVOS/PROJETOS', conf = 'src/config.json', confOk, master = 'src/master.json', functions = eng ? chrome.runtime.id : nd;
    let project = eng ? 'Downloads/Google Chrome%' : nd, fileOk = nd, line; devChildren = devChildren || nd; let paths, pathsNew = false, pathsKeep = [], stack = inf.e.stack, res;
    try {
        for (let [index, value,] of stack.split('\n').entries()) { if (value.includes(root) && !value.includes('node_modules')) { pathsKeep.push(value); } };

        // ARQUIVO DA PILHA → [PRIMEIRO] {functions}
        paths = pathsKeep[0];

        // ARQUIVO DA PILHA → [ÚLTIMO] {project}
        if (!eng) { try { pathsNew = pathsKeep[pathsKeep.length - 1].replace(/\\/g, '/').split(`${root}/`)[1].split('/')[0]; } catch (catchErr) { esLintIgnore = catchErr; pathsNew = false; }; }

        if (eng) {
            // CHROME
            paths = paths.split(`${functions}/`)[1]; paths = paths.split(':'); line = paths[1]; fileOk = paths[0];
            if (isFunction) {
                res = { 'conf': conf, 'letter': funLetter, 'functions': `${functions}`, 'project': project, };

                // CONFIG.json
                confOk = await fetch(chrome.runtime.getURL(conf)); confOk = await confOk.text(); confOk = JSON.parse(confOk);

                // MASTER.json
                master = await fetch(chrome.runtime.getURL(master)); master = await master.text(); master = JSON.parse(master);
                confOk['master'] = master.master;

                res['letter'] = funLetter;
                res['root'] = root;
                res['confOk'] = confOk;

            } else {
                res = { 'conf': gW.conf, 'letter': gW.letter, 'root': gW.root, 'functions': gW.functions, 'project': project, };
            }
        } else {
            // NODEJS
            paths = paths.split('file:///')[1].split(':/'); funLetter = paths[0].toUpperCase(); paths = paths[1].split(':'); line = paths[1]; fileOk = paths[0];
            let funProject = fileOk.match(new RegExp('(' + root + '/[^/]+)'))[0]; fileOk = fileOk.split(`${funProject}/`)[1]; funProject = funProject.split(`${root}/`)[1];
            if (isFunction) {
                res = { 'conf': conf, 'letter': funLetter, 'functions': funProject, 'project': project, }; _fs = await import('fs');

                // CONFIG.json
                confOk = await _fs.promises.readFile(`${funLetter}:/${root}/${funProject}/${conf}`, 'utf8'); confOk = JSON.parse(confOk);

                // MASTER.json
                master = await _fs.promises.readFile(`${funLetter}:/${root}/${funProject}/${master}`, 'utf8'); master = JSON.parse(master);
                confOk['master'] = master.master;

                res['letter'] = funLetter;
                res['root'] = root;
                res['confOk'] = confOk;
            } else {
                res = { 'conf': gW.conf, 'letter': gW.letter, 'root': gW.root, 'functions': gW.functions, 'project': pathsNew || funProject, };
            }
        }
        res['file'] = fileOk; res['line'] = Number(line);
    } catch (catchErr) {
        console.log(`\n\n### ERRO GET PATH ###\n\n${catchErr.stack}\n\n`); res = { 'conf': nd, 'letter': nd, 'root': nd, 'functions': nd, 'project': nd, 'file': nd, 'line': 0, };
    }

    letter = res.letter; gW['conf'] = res.conf; gW['letter'] = res.letter; gW['root'] = res.root; gW['functions'] = res.functions;
    gW['project'] = res.project; gW['file'] = res.file; gW['line'] = res.line;

    if (!isFunction) {
        let devChildrenIndex = gW.devices[1][1][`${res.project}_${devChildren}`]; devChildren = devChildrenIndex > -1 ? gW.devices[1][2][devChildrenIndex] : nd;
        let devMasterDevSlaveDevChildren = `${gW.devMaster}-${gW.devSlave}-${devChildren}`; gW['devChildren'] = devChildren;
        gW['devGet'] = [`${gW.hostPortWeb}/?roo=${devMasterDevSlaveDevChildren}`, `${gW.hostPortLoc}/?roo=${devMasterDevSlaveDevChildren}`,];
    } else {
        let fPW = `${letter}:/ARQUIVOS`; fileProjetos = `${fPW}/PROJETOS`; fileChrome_Extension = `${fPW}/PROJETOS/Chrome_Extension`; fileWindows = `${fPW}/WINDOWS`;
        gW['conf'] = res.conf; gW['root'] = res.root; gW['functions'] = res.functions; gW['project'] = res.project; gW['file'] = res.file; gW['line'] = res.line;
    }

    ret['ret'] = true;
    ret['msg'] = `GET PATH: OK`;
    ret['res'] = res;
    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.res && { 'res': ret.res, }), };
};

// CHROME | NODEJS
(eng ? window : global)['getPath'] = getPath;


