// import { fileInf } from './fileInf.js';
// const retFunction = await fileInf(new URL(import.meta.url).pathname);
// console.log(retFunction);

import path from 'path';
import fs from 'fs';

async function fileInf(inf) {
    const ret = { 'ret': false };

    try {
        const parsedPath = path.parse(inf);
        const fileWithExtension = parsedPath.base;
        const fileWithoutExtension = parsedPath.name;
        let filesToSearch = ['package.json', 'package-lock.json', '.gitignore'];
        let currentDir = parsedPath.dir.replace(/\//g, '\\').slice(1); let iterations = 0;

        while (!filesToSearch.find(file => fs.existsSync(path.join(currentDir, file)))) {
            iterations++; const parentDir = path.dirname(currentDir);
            if (iterations >= 15 || parentDir === currentDir) {
                currentDir = 'NAO ENCONTRADO | MAX DE 15 BUSCAS'; break;
            } currentDir = parentDir;
        }
        const retFileInf = {
            'pathProject1': currentDir,
            'pathProject2': currentDir.replace(/\\/g, '\/'),
            'pathCurrent1': parsedPath.dir.replace(/\//g, '\\').slice(1).charAt(0).toUpperCase() + parsedPath.dir.replace(/\//g, '\\').slice(1).slice(1),
            'pathCurrent2': parsedPath.dir.slice(1).charAt(0).toUpperCase() + parsedPath.dir.slice(1).slice(1),
            'fileFull': fileWithExtension,
            'fileName': fileWithoutExtension,
            'fileExtension': parsedPath.ext,
            'parameterReceived': inf
        };

        ret['ret'] = true;
        ret['msg'] = 'FILE INF: OK';
        ret['res'] = retFileInf
    } catch (e) {
        ret['msg'] = `FILE INF: ERRO | ${e}`;
    }

    if (!ret.ret) { console.log(ret.msg) }
    return ret;
}

export { fileInf };
