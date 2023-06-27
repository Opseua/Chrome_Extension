// import { fileInf } from './fileInf.js';
// const retFunction = await fileInf(new URL(import.meta.url).pathname);
// console.log(retFunction);

import path from 'path';
import fs from 'fs';

async function fileInf(inf) {
    let ret = { 'ret': false };

    try {
        const parsedPath = path.parse(inf);
        const fileWithExtension = parsedPath.base;
        const fileWithoutExtension = parsedPath.name;
        let filesToSearch = ['package.json', 'package-lock.json', '.gitignore'];
        let currentDir = process.cwd(); let iterations = 0;
        while (!filesToSearch.find(file => fs.existsSync(path.join(currentDir, file)))) {
            iterations++; const parentDir = path.dirname(currentDir);
            if (iterations >= 15 || parentDir === currentDir) {
                currentDir = 'NAO ENCONTRADO | MAX DE 15 BUSCAS'; break;
            } currentDir = parentDir;
        }

        ret['res'] =
        {
            'pathProject1': currentDir,
            'pathProject2': currentDir.replace(/\\/g, '\/'),
            'pathCurrent1': parsedPath.dir.replace(/\//g, '\\').slice(1).charAt(0).toUpperCase() + parsedPath.dir.replace(/\//g, '\\').slice(1).slice(1),
            'pathCurrent2': parsedPath.dir.slice(1).charAt(0).toUpperCase() + parsedPath.dir.slice(1).slice(1),
            'fileFull': fileWithExtension,
            'fileName': fileWithoutExtension,
            'fileExtension': parsedPath.ext
        };
        ret['ret'] = true;
    } catch (error) {
        ret['msg'] = error.message;
    }

    return ret;
}

export { fileInf };
