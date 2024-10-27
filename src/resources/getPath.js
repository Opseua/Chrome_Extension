// let infGetPath, retGetPath; // 'isFunction': true
// infGetPath = { 'e': new Error() }
// retGetPath = await getPath(infGetPath); console.log(retGetPath)

async function getPath(inf) {
    let ret = { 'ret': false };// e = inf && inf.e ? inf.e : e;
    let nd = 'NAO_DEFINIDO', funLetter = `D`, root = eng ? 'chrome-extension' : 'ARQUIVOS/PROJETOS', conf = 'src/config.json', confOk, master = 'src/master.json', functions = eng ? chrome.runtime.id : nd
    let project = eng ? 'Downloads/Google Chrome%' : nd, fileOk = nd, line; let devChildren = inf && inf.devChildren ? inf.devChildren : nd
    let paths = [], stack = inf.e.stack, res
    try {
        for (let [index, value] of stack.split('\n').entries()) { if (value.includes(root) && !value.includes('node_modules')) { paths.push(value) } };

        // ARQUIVO DA PILHA → [PRIMEIRO]
        paths = paths[0]
        // ARQUIVO DA PILHA → [ÚLTIMO]
        // paths = paths[paths.length - 1]

        if (eng) {
            // CHROME
            paths = paths.split(`${functions}/`)[1]; paths = paths.split(':'); line = paths[1]; fileOk = paths[0]
            if (inf.isFunction) {
                res = { 'conf': conf, 'letter': funLetter, 'functions': `${functions}`, 'project': project, };

                // CONFIG.json
                confOk = await fetch(chrome.runtime.getURL(conf)); confOk = await confOk.text(); confOk = JSON.parse(confOk);

                // MASTER.json
                master = await fetch(chrome.runtime.getURL(master)); master = await master.text(); master = JSON.parse(master);
                confOk['master'] = master.master

                res['letter'] = funLetter;
                res['root'] = root;
                res['confOk'] = confOk;

            } else {
                res = { 'conf': globalWindow.conf, 'letter': globalWindow.letter, 'root': globalWindow.root, 'functions': globalWindow.functions, 'project': project, }
            }
        } else {
            // NODEJS
            paths = paths.split('file:///')[1].split(':/'); funLetter = paths[0].toUpperCase(); paths = paths[1].split(':'); line = paths[1]; fileOk = paths[0]
            let funProject = fileOk.match(new RegExp('(' + root + '/[^/]+)'))[0]; fileOk = fileOk.split(`${funProject}/`)[1]; funProject = funProject.split(`${root}/`)[1]
            if (inf.isFunction) {
                res = { 'conf': conf, 'letter': funLetter, 'functions': funProject, 'project': project, }; _fs = await import('fs');

                // CONFIG.json
                confOk = await _fs.promises.readFile(`${funLetter}:/${root}/${funProject}/${conf}`, 'utf8'); confOk = JSON.parse(confOk);

                // MASTER.json
                master = await _fs.promises.readFile(`${funLetter}:/${root}/${funProject}/${master}`, 'utf8'); master = JSON.parse(master);
                confOk['master'] = master.master

                res['letter'] = funLetter;
                res['root'] = root;
                res['confOk'] = confOk;
            } else {
                res = { 'conf': globalWindow.conf, 'letter': globalWindow.letter, 'root': globalWindow.root, 'functions': globalWindow.functions, 'project': funProject, }
            }
        }
        res['file'] = fileOk; res['line'] = Number(line);
    } catch (catchErr) {
        console.log(`\n\n### ERRO GET PATH ###\n\n${catchErr.stack}\n\n`); res = { 'conf': nd, 'letter': nd, 'root': nd, 'functions': nd, 'project': nd, 'file': nd, 'line': 0 }
    }
    globalWindow['conf'] = res.conf;
    letter = res.letter;
    globalWindow['letter'] = res.letter;
    globalWindow['root'] = res.root;
    globalWindow['functions'] = res.functions;
    globalWindow['project'] = res.project;
    globalWindow['file'] = res.file;
    globalWindow['line'] = res.line;

    if (!inf.isFunction) {
        let devChildrenIndex = globalWindow.devices[1][1][`${res.project}_${devChildren}`]; devChildren = devChildrenIndex > -1 ? globalWindow.devices[1][2][devChildrenIndex] : nd
        let devMasterDevSlaveDevChildren = `${globalWindow.devMaster}-${globalWindow.devSlave}-${devChildren}`; globalWindow['devChildren'] = devChildren;
        globalWindow['devGet'] = [`${globalWindow.hostPortWeb}/?roo=${devMasterDevSlaveDevChildren}`, `${globalWindow.hostPortLoc}/?roo=${devMasterDevSlaveDevChildren}`];
    }

    ret['ret'] = true;
    ret['msg'] = `GET PATH: OK`;
    ret['res'] = res;
    return { ...({ 'ret': ret.ret }), ...(ret.msg && { 'msg': ret.msg }), ...(ret.res && { 'res': ret.res }), };
};

// CHROME | NODEJS
(eng ? window : global)['getPath'] = getPath;