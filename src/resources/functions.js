// const { regex, fileRead, fileWrite } = await import('./functions.js');
// const retNodeOrBrowser = await nodeOrBrowser();
// console.log(retNodeOrBrowser);
// - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # -                   
// const infFileInf = { 'path': new URL(import.meta.url).pathname }      ## CHROME NAO!
// const retFileInf = await fileInf(infFileInf);
// console.log(retFileInf)
// - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # -       
// const infFileWrite = {
//     'file': `PASTAS 1/PASTA 2/arquivo.txt`,
//     'rewrite': true, // 'true' adiciona no MESMO arquivo, 'false' cria outro em branco
//     'text': `LINHA 1\nLINHA 2\nLINHA 3\n`
// };
// const retFileWrite = await fileWrite(infFileWrite);
// console.log(retFileWrite);
// - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # -      
// const infFileRead = { 'file': `D:/Downloads/Google Chrome/arquivo.txt` }
// const retFileRead = await fileRead(infFileRead)
// console.log(retFileRead)
// - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # -      
// const infConfigStorage = { 'path': '/src/config.json', 'action': 'set', 'key': 'NomeDaChave', 'value': 'Valor da chave' }
// const retConfigStorage = await configStorage(infConfigStorage)
// console.log(retConfigStorage)

// const infConfigStorage = { 'path': '/src/config.json', 'action': 'get', 'key': 'NomeDaChave' }
// const retConfigStorage = await configStorage(infConfigStorage)
// console.log(retConfigStorage)

// const infConfigStorage = { 'path': '/src/config.json', 'action': 'del', 'key': 'NomeDaChave' }
// const retConfigStorage = await configStorage(infConfigStorage)
// console.log(retConfigStorage)
// - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # -       
// const RetDateHour = dateHour()
// console.log(RetDateHour)
// - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # - 
// const infRandom = { 'min': 10, 'max': 50, 'msg': true }
// const retRandom = await random(infRandom)
// console.log(retRandom)
// - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # - 
// const loop = ['A', 'B', 'C', 'D', 'E'];
// let i = 0;
// async function runLoop() {
//     while (i < loop.length) {
//         i++;
//         const infRandom = { 'min': 1, 'max': 5, 'msg': true }
//         const retRandom = await random(infRandom)
//         await new Promise(resolve => setTimeout(resolve, retRandom));
//         console.log(loop[i - 1]);
//         if (loop[i - 1] == 'C') {
//             break
//         }
//     }
//     console.log("Loop concluído!");
// }
// runLoop();
// - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # - 
// const infRegex = { 'pattern': 'UM(.*?)TRES', 'text': 'UMDOISTRES' }
// const infRegex = { 'pattern': '*DOIS*', 'text': 'UMDOISTRES' }
// const retRegex = regex(infRegex)
// console.log(retRegex)

async function nodeOrBrowser() {
    let ret = { 'ret': false }
    try {
        if (typeof process !== 'undefined') { // NODE
            ret['res'] = 'node'
        } else if (typeof window !== 'undefined') { // CHROME
            ret['res'] = 'chrome'
        } else if (typeof UrlFetchApp !== 'undefined') { // GOOGLE APP SCRIPT
            ret['res'] = 'googleAppScript'
        } else { // NAO IDENTIFICADO
            ret['res'] = 'NAO IDENTIFICADO'
        }
        ret['ret'] = true;
        ret['msg'] = 'NODE OR BROWSER: OK';
    } catch (e) {
        ret['msg'] = `NODE OR BROWSER: ERRO | ${e.message}`;
    }

    if (!ret.ret) { console.log(ret.msg) }
    return ret
}

async function fileInf(inf) {
    let ret = { 'ret': false };
    try {
        const path = await import('path');
        const fs = await import('fs');

        const parsedPath = path.parse(inf.path);
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

async function fileWrite(inf) {
    let ret = { 'ret': false };
    try {
        if (inf.file == undefined || inf.file == '') {
            ret['msg'] = `INFORMAR O "file"`;
        } else if (typeof inf.rewrite !== 'boolean') {
            ret['msg'] = `INFORMAR O "rewrite" TRUE ou FALSE`;
        } else if (inf.text == undefined || inf.text == '') {
            ret['msg'] = `INFORMAR O "text"`;
        } else {

            const resNodeOrBrowser = await nodeOrBrowser()
            if (resNodeOrBrowser.res == 'node') {
                // NODEJS
                const fs = await import('fs');
                const path = await import('path');
                async function createDirectoriesRecursive(directoryPath) {
                    const normalizedPath = path.normalize(directoryPath);
                    const directories = normalizedPath.split(path.sep);
                    let currentDirectory = '';
                    for (let directory of directories) {
                        currentDirectory += directory + path.sep;
                        if (!fs.existsSync(currentDirectory)) { await fs.promises.mkdir(currentDirectory); }
                    }; return true;
                }
                const folderPath = path.dirname(inf.file);
                await createDirectoriesRecursive(folderPath);
                await fs.promises.writeFile(inf.file, inf.text, { flag: inf.rewrite ? 'a' : 'w' });
            } else {
                // CHROME
                let textOk = inf.text;
                if (inf.rewrite) {
                    const infFileRead = { 'file': `D:/Downloads/Google Chrome/${inf.file}` }
                    const retFileRead = await fileRead(infFileRead)
                    if (retFileRead.ret) { textOk = `${retFileRead.res}${textOk}` }
                }
                const blob = new Blob([textOk], { type: 'text/plain' });
                const downloadOptions = {
                    url: URL.createObjectURL(blob),
                    filename: inf.file,
                    saveAs: false, // PERGUNTAR AO USUARIO ONDE SALVAR
                    conflictAction: 'overwrite' // overwrite (SUBSTITUIR) OU uniquify (REESCREVER→ ADICIONANDO (1), (2), (3)... NO FINAL)
                };
                chrome.downloads.download(downloadOptions);
            }
            ret['ret'] = true;
            ret['msg'] = `FILE WRITE: OK`;
        }
    } catch (e) {
        ret['msg'] = `FILE WRITE: ERRO | ${e}`;
    }

    if (!ret.ret) { console.log(ret.msg) }
    return ret;
}

async function fileRead(inf) {
    let ret = { 'ret': false };
    try {
        let retFetch
        const retNodeOrBrowser = await nodeOrBrowser();

        if (retNodeOrBrowser.res == 'node') { // ################## NODE
            const fs = await import('fs');
            retFetch = fs.readFileSync(inf.file.replace(/\//g, '\\'), 'utf8');
        }

        if (retNodeOrBrowser.res == 'chrome') { // ################## CHROME
            retFetch = await fetch(`file:///${inf.file}`);
            retFetch = await retFetch.text();
        }
        ret['ret'] = true;
        ret['msg'] = `FILE READ: OK`;
        ret['res'] = retFetch;
    } catch (e) {
        ret['msg'] = `FILE READ: ERRO | ${e}`;
    }

    if (!ret.ret) { console.log(ret.msg) }
    return ret;
}

async function configStorage(inf) {
    let ret = { 'ret': false };
    try {
        const retNodeOrBrowser = await nodeOrBrowser();

        if (retNodeOrBrowser.res == 'chrome') { // ################## CHROME

            if (inf.action == 'set') { // STORAGE: SET
                await storageSet(inf)
                async function storageSet(inf) {
                    return new Promise((resolve) => {
                        const data = {};
                        if (!inf.key) {
                            ret['msg'] = 'STORAGE SET: ERRO | INFORMAR A "key"';
                        } else if (!inf.value) {
                            ret['msg'] = 'STORAGE SET: ERRO | INFORMAR O "value"';
                        } else {
                            data[inf.key] = inf.value;
                            chrome.storage.local.set(data, async () => {
                                if (chrome.runtime.lastError) {
                                    ret['msg'] = `STORAGE SET: ERRO | ${chrome.runtime.lastError}`;
                                } else {
                                    ret['ret'] = true;
                                    ret['msg'] = 'STORAGE SET: OK';
                                }
                                resolve(ret);
                            });
                            return;
                        }
                        resolve(ret);
                    });
                }
            }

            if (inf.action == 'get') { // STORAGE: GET
                await storageGet(inf)
                async function storageGet(inf) {
                    return new Promise((resolve) => {
                        if (!inf.key) {
                            ret['msg'] = 'STORAGE GET: ERRO | INFORMAR A "key"';
                        } else {
                            chrome.storage.local.get(inf.key, async (result) => {
                                if (chrome.runtime.lastError) {
                                    ret['msg'] = `STORAGE GET: ERRO | ${chrome.runtime.lastError}`;
                                } else if (Object.keys(result).length === 0) {
                                    async function checkConfig() {
                                        const retConfigJson = await fetch(`${inf.path}`);
                                        const config = await retConfigJson.json();
                                        if (config[inf.key]) {
                                            const data = {};
                                            data[inf.key] = config[inf.key];
                                            return new Promise((resolve) => {
                                                chrome.storage.local.set(data, async () => {
                                                    if (chrome.runtime.lastError) {
                                                        ret['msg'] = `STORAGE SET*: ERRO | ${chrome.runtime.lastError}`;
                                                    } else {
                                                        ret['ret'] = true;
                                                        ret['msg'] = 'STORAGE GET: OK';
                                                        ret['res'] = config[inf.key]
                                                    }
                                                    resolve(ret);
                                                });
                                                return;
                                            })
                                        }
                                        else { ret['msg'] = `STORAGE GET: ERRO | CHAVE '${inf.key}' NAO ENCONTRADA`; }
                                        return ret;
                                    }
                                    await checkConfig()
                                } else {
                                    ret['ret'] = true;
                                    ret['msg'] = 'STORAGE GET: OK';
                                    ret['res'] = result[inf.key]
                                }
                                resolve(ret);
                            });
                            return
                        }
                        resolve(ret);
                    });
                }
            }

            if (inf.action == 'del') { // STORAGE: DEL
                await storageDel(inf)
                async function storageDel(inf) {
                    return new Promise((resolve) => {
                        if (!inf.key) {
                            ret['msg'] = 'STORAGE DEL: ERRO | INFORMAR A "key"';
                        } else {
                            chrome.storage.local.get(inf.key, async (result) => {
                                if (chrome.runtime.lastError) {
                                    ret['msg'] = `STORAGE DEL: ERRO | ${chrome.runtime.lastError}`;
                                } else if (Object.keys(result).length === 0) {
                                    ret['msg'] = `STORAGE DEL: ERRO | CHAVE '${inf.key}' NAO ENCONTRADA`;
                                } else {
                                    chrome.storage.local.remove(inf.key, () => { });
                                    ret['ret'] = true;
                                    ret['msg'] = 'STORAGE DEL: OK';
                                }
                                resolve(ret);
                            });
                            return
                        }
                        resolve(ret);
                    });
                }
            }

        }

        if (retNodeOrBrowser.res == 'node') { // ################## NODE

            const fs = await import('fs');
            const infFileInf = { 'path': new URL(import.meta.url).pathname }
            const retFileInf = await fileInf(infFileInf);
            const configPath = `${retFileInf.res.pathProject1}${inf.path}`
            const configFile = fs.readFileSync(configPath);
            const config = JSON.parse(configFile);

            if (inf.action == 'set') { // CONFIG: SET
                try {
                    if (!inf.key) {
                        ret['msg'] = 'CONFIG SET: ERRO | INFORMAR A "key"';
                    } else if (!inf.value) {
                        ret['msg'] = 'CONFIG SET: ERRO | INFORMAR O "value"';
                    } else {
                        ret['ret'] = true;
                        ret['msg'] = `CONFIG SET: OK`;
                        config[inf.key] = inf.value;
                        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
                    }
                } catch (e) {
                    ret['msg'] = `CONFIG SET: ERRO | ${e}`;
                }
            }

            if (inf.action == 'get') { // CONFIG NODE: GET
                try {
                    if (!inf.key) {
                        ret['msg'] = 'CONFIG GET: ERRO | INFORMAR A "key"';
                    } else {
                        if (config[inf.key]) {
                            ret['ret'] = true;
                            ret['msg'] = `CONFIG GET: OK`;
                            ret['res'] = config[inf.key];
                        } else {
                            ret['msg'] = `CONFIG GET: ERRO | CHAVE '${inf.key}' NAO ENCONTRADA`;
                        }
                    }
                } catch (e) {
                    ret['msg'] = `CONFIG GET: ERRO | ${e}`;
                }
            }

            if (inf.action == 'del') { // CONFIG NODE: DEL
                try {
                    if (!inf.key) {
                        ret['msg'] = 'CONFIG DEL: ERRO | INFORMAR A "key"';
                    } else {
                        if (config[inf.key]) {
                            ret['ret'] = true;
                            ret['msg'] = `CONFIG DEL: OK`;
                            delete config[inf.key];
                            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
                        } else {
                            ret['msg'] = `CONFIG DEL: ERRO | CHAVE '${inf.key}' NAO ENCONTRADA`;
                        }
                    }
                } catch (e) {
                    ret['msg'] = `CONFIG DEL: ERRO | ${e}`;
                }
            }

        }
    }
    catch (e) {
        ret['msg'] = `CONFIG STORAGE: ERRO | ${e}`;
    }

    if (!ret.ret) { console.log(ret.msg) }
    return ret
}

function dateHour() { // NAO POR COMO 'async'!!!
    let ret = { 'ret': false };
    try {
        const date = new Date();
        const retDate = {
            'day': String(date.getDate()).padStart(2, '0'),
            'mon': String(date.getMonth() + 1).padStart(2, '0'),
            'yea': String(date.getFullYear()),
            'hou': String(date.getHours()).padStart(2, '0'),
            'min': String(date.getMinutes()).padStart(2, '0'),
            'sec': String(date.getSeconds()).padStart(2, '0'),
            'mil': String(date.getMilliseconds()).padStart(3, '0'),
            'tim': Date.now()
        }
        ret['ret'] = true;
        ret['msg'] = `DATE HOUR: OK`;
        ret['res'] = retDate;
    }
    catch (e) {
        ret['msg'] = `DATE HOUR: ERRO | ${e}`;
    }

    if (!ret.ret) { console.log(ret.msg) }
    return ret
}

function regex(inf) {
    let ret = { 'ret': false };
    try {
        if (inf.pattern.includes('(.*?)')) {
            const result = inf.text.match(inf.pattern);
            if (result && result[1].length > 0) {
                ret['ret'] = true;
                ret['msg'] = `REGEX: OK`;
                ret['res'] = {
                    'bolean': true,
                    'text': result[1]
                }
            } else {
                ret['ret'] = true;
                ret['msg'] = `REGEX: ERRO | PADRAO '${inf.pattern}' NAO ENCONTRADO`;
                ret['res'] = { 'bolean': false }
            }
        } else {
            const pattern = inf.pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
            const result = new RegExp(`^${pattern}$`).test(inf.text);
            if (result) {
                ret['ret'] = true;
                ret['msg'] = `REGEX: OK`;
                ret['res'] = {
                    'bolean': true,
                    'text': 'TEXTO POSSUI O PADRAO'
                }
            } else {
                ret['ret'] = true;
                ret['msg'] = `REGEX: ERRO | PADRAO '${inf.pattern}' NAO ENCONTRADO`;
                ret['res'] = { 'bolean': false }
            }
        }
    } catch (e) {
        ret['msg'] = `REGEX: ERRO | ${e}`
    }

    if (!ret.ret) { console.log(ret.msg) }
    return ret
}

async function random(inf) {
    let ret = { 'ret': false };
    try {
        const min = inf.min;
        const max = inf.max;
        const message = inf.msg ? true : false
        const number = Math.floor(Math.random() * (max - min + 1) + min) * 1000;
        if (message) {
            console.log(`AGUARDANDO: ${number / 1000} SEGUNDOS`);
        }
        ret['ret'] = true;
        ret['msg'] = `RANDON: OK`;
        ret['res'] = number;
    } catch (e) {
        ret['msg'] = `RANDON: ERRO | ${e}`
    }

    if (!ret.ret) { console.log(ret.msg) }
    return ret
}

export { nodeOrBrowser, fileInf, fileWrite, fileRead, configStorage, dateHour, regex, random };











let perfils = ["adelar_santos_", "lightbrotherz", "carolescavassini", "cafe_light_", "djtavinhotavares", "manoel_doa_teclados", "prmauriciorr", "os_meninos_da_cohab_oficial", "dj_eduh_pinheiro", "belarmino5551", "binhodavibe", "raggi_hall_casa_de_festas", "marivictorhugo", "sandrochaim", "wedmolight", "bruno_pinheirobbs", "oboydapegacaooficial", "dm_diegomartins_", "diegodesouzacarlos", "djkero15", "salaolarafesta", "luansilvabarros", "marcelinho._", "fabiodeoliveiracarvalh", "cruz_rudney", "palitobassof", "marcelobrasaosantos", "rubinhomajor", "douglaslimacantor", "swing.dapizadaoficial", "____djsaymonoficial____", "tthonnyoliver", "diegofernandesteclas", "starsomluze", "djcarlin", "leolauretto.rl", "motosicristabaik", "dj_regino", "dj.leonam_ofc", "clodoaldo4041", "elkervenancio", "gesso_eartes", "fagner3751", "manoel1941", "byronnunesguedes", "olavojosebenvegnu", "jose_vianey21", "micheletto.som", "_paulo.mtb", "luanhenrique979", "eduardofonseca06", "darlynmorais", "botecodojan", "rikdo_malha", "pr.luciano_passon", "emersom4828", "adrianomeneses", "marcelopegadaooficial", "bandailhaaxe", "andrebomfim.jeq", "edsonchuva", "djlucianonetto", "dj_rick.rp", "apl_iluminacao_", "eugenioolliveroficial", "diogo_dgproducoes", "negobrasil10", "pabloforlan_", "neventosproducoesaudiovisuais", "sonus_som_e_iluminacao", "alexandrebeckmann", "massafmtaquaritinga", "andradesom", "lenilson_xr", "djedmilson_topmusic", "adroaldosaxsolo", "dj.celio.sistema11", "portariaeeventossf", "djclebinho", "rodrigounifest", "gilsionsantana", "igoriluminacoeseeventos", "djherrera1", "edivaldocultinhode", "tomspigolon", "henryque1134", "nildo_150", "charlesportom", "llucasmorais", "rodrigomarcal", "andremixador", "powersoundp", "ipcemcf", "mirialdo_novaez", "souzzaclaudiomiro", "remulo_fernandes", "maiquel_mhs", "danielengel_starprotecao", "diego_goncalves_souza", "rodrigoan79", "joaoholzer_", "edson.pereirajunior.7", "williamtecnicodesom", "moraes_gaabriel", "kastrodj", "bob_kaceteiro.2021", "djalexgouvea", "manausiluminacao", "galalauentretenimento", "lucas_lacproducoes", "ir_studio_gravacoes", "maikelredante", "fernandogoulartmarques", "guga_sms", "djleandrolima", "ramon.almeida.ptu", "sonoratechpro", "gabrielacapuchoellite", "jcsonorizacaoal", "marigasomeeventos", "julio_doy", "otlian8263", "rodrigolima.s85", "prolediluminacaoestruturas", "flaviononatopereira", "audiopixsomeluz", "igrejasozobh", "gilenolopesviana", "irafaelvi", "miguelacioli", "replicas_de_carrinho", "pablo_olivera.98", "dj_edvanio", "eusoualexpaz", "gabrielmagrig", "richard.cerimoniais.eventos", "v8eventosarapiraca", "jorginho_uepa", "welbert_dj", "eltondez", "adrianomachadoll", "leandro_bassanii", "jooliveira.oficial", "elvispadoim", "marcelodolub", "emesson_iluminacao", "netoilumina", "dalben_lr", "djbrunodovale", "marcosh_viniciush", "luimilsoncamposferreira", "jcautocentercabofrio", "carloslima2081", "djcuryluiz2007", "emersoncell21", "djpedroperez", "maurovictorweb", "junior_light75", "pulse_entretenimento", "romulotendasdecirco", "ricardolima_81", "theushfreitas", "diognes_antonio_benthas", "atiliopadela", "tiao.goes.3", "felipejbamiranda", "celestino805", "guerreiro.nato", "emersonferreiramoura", "ricardolombardi__", "jorgeoliveiradj", "jobs.dj", "pr_jhonny_silva_", "solon__silva", "rafinha_queirozz", "vieira.iluminacao", "chopp.cia", "luterobarros", "zecalopesdk", "marcosklautau", "fabiano_sanntana", "dennysdonnely", "bailedogatto", "caiquemastereventos", "johnjohn_transportes", "julioc.a.p", "erineudecarvalho", "j_c.nunes", "lourinhodosteclados", "andre.mkk", "edilsonitu", "fernandopereirapro_", "m.v_lucasof", "marcus.pvc", "arnaldoamaralmusic", "estilizadojonh", "helciopereirapereira", "dionei.al", "octopus_som_luz_e_palco", "kleberfigueiredo_", "fabianobtavares", "fredvidigal", "denilsongmleao", "marcelojr.real", "cesar_serapiao", "fabiopadilhademoraes", "aluisio_iluminacoes", "dj_wender_martins", "arthussonorizacao", "yvan.almeida", "celsomeireles", "diegomello1985", "mariomtres", "kilefd", "djwarleygaia", "tattodeejay", "fernandoerenan", "marcospn05525", "franciscoantonioda961", "manoelsotto", "djsaimonoficial", "eudesdasilva23", "pastordainerley", "pessoahelenildo", "eduardosilva.dj", "adrianostern", "igormatheus383", "gugansouza", "evantuilto__producoes", "sutytech", "wesdrencastro", "elkhallebdjofficial", "luzearteventos", "paredaododennisdj", "maicomportes", "djkleberbarros", "diogobass_", "iluminacao_cdr_", "marcosrobsongazeta", "dj.otavio", "bandabailabeat", "josemiguelneves", "djpliniocesar", "jrsound21", "jailsoncem", "danieloliveirabs", "amorim.som.e.luz", "cristianestacaoamigos", "lakshmi_tecnomelody", "gvsom02", "maxwell_com_m", "jhoesteodoro", "alcantara3843", "jayro_jr20", "djmarcelonervosogbi", "danilo.nobre.921025", "paula_sl_eventos", "altopadraoeventos", "zecarlosmaial", "eusougranato", "andre_nts_", "emersontenellidj", "gimenes2012", "deboxadosuruacu", "marcioayres", "braulioandradeo", "mousa.music_oficial", "narelledj", "oh_proprietario", "dodo.voz", "cleidissonccr", "elianebataclanoficial", "diogodjb10", "regis61oficial", "rafagobbi", "chagassantosbass", "fausto.teen", "fabricioshow2019", "caroline_silva.helena", "davidtaraujo", "thiago_henrique_os2", "joaodebarrochurrascaria", "mauromainieri", "2leventosfor", "leofrennesy", "pedrophsilva_", "adrianoluzdoluar", "pr.marquinho", "cristianobanni.oficial", "danielmatos.oficial", "someluz_locacoes", "87douglassilva", "beatboxdivulgacoes", "rodrigo__rangel", "forronamoro.comoficial", "gauravlights", "havannyvinicius", "djmarciobrito", "johnny.love1", "84_caio_", "atila.rodrigo1603", "gsiluminacoescm", "sander_m1", "jotawilliamdepaula", "felipedelukaoficial", "piperoficial8", "djchrystian_cesar", "regisluizcordeiro", "brunnuspizzaria", "paulonunes1965", "pedromiguel9605", "muleke_10_oficial", "dk_augusto", "nando_nzsonorizacao", "icaro_guitta", "ulicesjunior", "mathmarconi", "mv_solucoesimediatas", "djdedes", "dj_rafafaria", "djsony0", "djbrunopistori", "vaqueirorodrigolima", "_theusalvs", "vamberg.italo", "lucianomaiaellite", "romulobaladaofc", "marcusantos_", "portal_cristina_", "diegogilfotos", "cairo.livestore", "andrealmeidadagostino", "dsc_daniell", "djbetojunior", "oficialforrodotom", "brunomarianodasi", "parquinho_do_pintinho", "thiago_teclas_2023", "forrorasgasaia", "emersonrodriguesda46", "luccalencar", "braulioferraz", "rodriguesgomesedmilson", "romariio_diias", "leandromarquesfonseca", "joaommmoreira", "magno.lsa", "amaurioliveira_oficial", "ledforfun", "erickjacobp", "djwalkervasquez", "mjp_industrial", "marcelo_lilla", "eduardoclaza", "mv_produ", "abrahao40", "lukanal", "gersonalvezcruz", "mauroneto97", "adrianoiluminacaoearte", "demoriebandeira", "tonfreiremadeirada", "paulo__filho__ofc", "djpaccooficial", "carlls_jr", "murillo__martins", "edu_giordano", "thiagocostaoficial", "carlos_moreno_402", "thiagosannxs", "romimdj", "chefbuiugourmet", "daniel063k", "gelsongularte", "paulosmilazzo", "djcoloreventos", "jeffimpressao", "lucianosouzanogueira", "jorge.filho.948", "flavio_coelho16ofc", "meloserginho", "a.dom.guimaraes", "jonathan_fs7", "marcos.britez.3385", "producer_gm", "visaeventos", "brunohdomingos", "vaninhomartires", "fernando_tec_512", "studio90_son_e_luz", "jardiel_santos25", "bliss_indoor", "richard_ferrr", "djmateustoniolo", "galegosistemanervoso", "artur.daniel", "wesleymoralloficial", "bachmusic_", "cascio_jr", "paedproducoes", "jeancarlosmagnan", "biancarocha731", "bandadomanoel_oficial", "djvinny.oficial", "realizarsomeiluminacao", "dj.leocruz", "pabloentretenimento_", "diegoprodutorsanjuan", "vaguinhoravagnani", "carlosassisbq", "erikwidmark2.0", "sl_eventos", "unico.p.artistica", "taty_iupiii", "tassioderfesson", "viictor_gusmao", "renato_tecnico97", "zelitoiluminacao", "jp.lins40", "thalivaloura", "diogenesbcoutinho", "mastersomeventos", "luucasacastro", "evsomeventos", "luxsonit", "nfcardoso__", "mateus.s_siilva", "avatarsunsetfestival", "renan_light", "ggpankas", "arnaldo_polli", "reinart.eventos", "aamusicbr", "grafitebateraoficial", "marcobalederua5", "buffetlafiesta", "waslleypaixao", "naldodoforrooficial", "alvaroonelight", "gewandersonsiqueira", "davidmorenocantor", "lauropachecoam", "emanoelmix", "joaocartazfacil", "carlosbocao2022", "grafite_todiboa", "fabio_fgsaudio", "nelsonante", "juniormennys2023", "marcianomme", "viitaoo", "carlos.euclides.921", "welkedeoliveira", "rplsonorizacao", "cristianoricardodj", "djjhonnyba", "nonasjr", "fabiano.israel", "isabel_e_felipe", "arthurmizura_55", "maestroheliojunior", "wagner2on", "aline__fe", "alvsdj", "zz_stage_light", "alan_m_simas", "jeferson_kureki", "carlos_brendow", "lucionegreiros", "l.felipemartins", "rog_moliveira", "leandroofcl40", "naiarabarbosa.j", "quinhodj", "conceicao_moraujo23", "julierme021", "felipesalves88", "gustavo_lins11", "evertonsintonia", "paulinhonamoro_oficial", "bruninhoollyv", "jeanbarrese", "sidnei_fama", "raphaeldmlopes", "igor.scalcon", "talles_silvas", "jvsomeluz", "tom_cabistan", "hector.mf", "junintec", "rpazine", "engefilhotmail.com6", "luiz.paulorleite", "cristyancastilho", "julianosaltorato", "jc_someventos", "soundpoweroficial", "eduardosmendess", "mc_jeff_oficial_12", "cristian_tec23", "alanriosnunes", "afonso.delima", "mayconsom", "julio_parisi", "billabongalvesdj", "inaciocarvalhooficial", "mariofreirejunior", "jujudogesso", "cardoni.ricardo", "marcosddutra", "jonnatanlima_jlproducoes", "gfad_boi_aguiadourada_oficial", "rafaeldaltrooficial", "xtremesomeluzmarilia", "cauellima", "mdinizbar", "marquinhosonorizacoes_", "sonorizacoesleo", "adelson.83", "joao7239vitor", "djnadinho_o_rei_das_pistas", "cristovao.santana_", "didier_juniorr", "brled", "rafaelrodrigues34810", "rblbm", "claudioproducoeseeventos", "lucianosancho", "vitorftoledo", "marcoscavalcante41", "jardeldias139", "vitorramos5263", "cesarhigashi", "fernandooliveirasouza", "pauloservan", "forrozaocamisamolhada", "amandooficial", "dandinhomoreirasilva", "yurigcunha", "paulo.cezaraudio", "fabianopereira898", "juniorsilivais", "marcoramos.imoveis", "rmjsomiluminacao", "deniltondejesusalves", "atacadaodopisovalparaiso", "juliomarujooficial", "alan_moretti", "street.sound_", "jardel_souza_bezerra", "aenicollas", "clebermix_som_e_luz_", "tonyviana_oficial", "djfelipevasconcelos", "matheuschianca88", "daniel_andradesp", "estruturasaluforte", "marcovhs13", "lucaskoii", "jeanpaulo.00", "raulg.09", "miguelquaresma1994", "andremarquesofc", "romulotrigueiro65", "leodreyes1408", "claudineitesta", "iorio_marcos", "joelsonng", "betinhoalvares", "gostosinhocircosuperfantastico", "bandahallsdobrasil", "martinssomluz", "wesleyandrade_s", "paulo.eventoss", "rodrigo.facil_iluminacao", "evandro_ls_", "aparecidavalentinaa", "deejaychamb", "waltercardoso2017", "hectorrade_radesom", "chacal_sonorizacao_iluminacao", "tony_saladini", "harrison_santoos", "ale.oliveira.be", "michelmendes280181", "samfabrjr", "krampewhelton", "banda_l.a", "marciogjanuario", "alex_duarte_dj", "andreypossi", "djthiago_garan", "paredaouva", "gustavo.zago.796", "thomalmeida_", "jhonatan.carlos.f", "tiagolibrelato", "dedemoral.oficial", "vitormanoel1389", "marcello_som_ofc", "filipe.maced0", "didilsenacantor", "jowcarvalhoofc", "eletroniccenter", "maximusproducoesmba", "danley_almeida", "djandertoledo", "p.colombera", "leidson_cunha50", "tim_danca80", "viniciuscouto90", "samba_e_simpatiaoficial", "guilvenceslau", "kamy.llapantoja", "marcianoizaias", "hb_lightingconsole", "ozziel_piseironovo", "fotouberaba", "fernando_eros_som", "audiosom", "redkombatengenharia", "marcelo.hoppe12", "djlsomepalco", "djdanielsmk", "rogeriofrancomg", "deividyfreitascavalcante", "dairinho_som", "dhoneseventos", "luicarlos8776", "renatotecnico", "herinholuzeled", "victorpagliaci", "proartmacae", "allysongiliard", "marcosdemetrios", "baraopersonalizadosoficial", "db.midias", "sandrooliveiraagro", "_elios", "andrepereiramusicall", "robertgrimald", "pa_gabriell", "gondinsergio", "flaviotatianedeoliveira", "julio_cesar_spinola", "dj_thiagozanella", "wellington_ti", "stuart_nascimento", "sergioapananias", "aldostudiomusic", "djsaidymusic", "jacksonetrio", "guga_f7", "vipevento.s", "ronnymusic1000", "daviargolo", "thiagogabrielrp", "zecorisco2011", "jonatasamisadai", "elledeventos", "gomesjeffersondossantos", "gelfeira", "charlesssilva01", "galeradoled", "marcelolobomusic", "adilsonebanda", "kaua_levadas", "rcostadj", "barretos_producoes_eventos", "rg.sonorizacao", "diogodesouzateixeira", "leoefabiano", "oruspainelled", "djdanielbarreto.oficial", "djguilhermepiracicaba", "gustavmacucodj", "djmarconesalles", "berwangerjairo", "djnoelvix", "ramonwbatera", "andersoneclaudinho", "primataseventos", "evecimar", "thalesananias5", "mateusjesse.loss", "simeiasrieloficial", "vasconcelos.deyvison", "djmatheuscorradi", "luis.henrique77", "eduardofernandesrj21", "slineeventos", "lucan.raphael", "leandrosom01", "brunobezerra89", "rodrigofestsom_pitangui", "savio.oliveira.tvp", "lelo_w7", "mgs_eventos", "maikerener", "maxvieiras", "leonardoalmeida387", "maykbrasiloficial", "fernandocaarvalho", "demosthynes", "jeffersonsizino", "brunno.black", "tomeneto", "spanty_", "christal.xie", "hugo_l_s", "showmarketproducoeseeventos", "ultimasnoticias_adrianoblog", "uaueventoos", "kaemy_producoes", "lj_iluminacao", "hudsonoliveiraimv", "djrafaelpacheco", "wendersondejavitte", "julianohenrique.jhds", "wmasonorizacao_vandson", "studiozluzesom", "carlosjacomeoficial", "marcoacrdj", "geison_vargas", "marceloroberto", "geovanicf", "bieda_eventos", "joseilson_borges", "carlosvictor300", "henriquesousa_of", "sandromixoficial", "timoteo_antunes", "katraca_lustosa", "djrogeriocoelho", "forrodepegadoroficial", "william_meanreal", "kimulights", "claudio_ribbeirooficial", "filipefigueiredobh", "azalimproducoes", "djcarlospacheco", "victorsgavioli", "tigrao_adm", "thiagojmribeiro41", "rafaelfavani", "netorodolfo.getulio", "guimacaio", "djcristhian.ms", "talento_som_e_luz", "8eventos.oficial", "soulsomeluz", "gordaodosmoveis", "joanderson.natanael", "djeduardomix_", "mar.celoyuri13", "dieguindumal", "gordinhoo.som", "guiled.br", "victorhugo_morais", "dangaproducoes", "ricardosante", "teko_buana", "agui_mendes", "leorodrigues_show", "ipproeventos", "equiperrsound", "diego.skema.light", "gelcaminho3", "sergioalvesdasilvaa", "rafaelamando_", "victormmarques_", "rafael_becker", "jocimarfarias", "plok_producoes", "wesleysomeiluminacao", "vladmir_maia85", "dj.ederluiz", "jjonataslima", "thiago_naestrada", "railson.uau", "euluizdosom", "derikcairo_", "emersonseverino", "rs.railtonrl", "brener_rangel", "maic_santana", "aguinaldo.lima.3139", "vitor_hugo.lisboa", "eduardo.heineck", "cristianomcout", "elias_baragada", "cleciocunhaoficial2", "vm_som_", "leandrovieiracompanhia", "andre_lu_iz", "olevyserena27", "marciohenriquesom", "vitorcandido_dias", "douglaslight_katia", "galaxsom", "rafa_da_zeus", "edson_victor12", "jorge.antunes.52831", "delcioboth", "mariomarciofda", "crisaocoelho", "luiz_menezescirco", "williamydias", "delbervilaca", "igororiginalam", "pedropaulo.silva.12935756", "classeaentretenimento_", "grupominuano", "fernandotrb", "cristianomagalhaescosta", "diogoherkenhoff", "alessandra_ssouza04", "montandocores", "dj_fuba", "assiszinhodosteclados_oficial", "ms_producoes_ptr", "patrickvaltrick", "nildoeshow", "uptimeventos", "sn____1984_", "mr_someluz", "welersonchristian", "petersonlyan", "levifigueredofonseca", "churrascariaboideourooficial", "viniciusjochem", "djleandrocesar", "thiagoveimais", "djguiga2024", "_eualexplanet", "djandre_iluminacao", "twolights_", "filippevillaca", "guilherme_vbianchi", "anselmovermeio", "maykon.pantoja", "dj_menott", "silvio.arturforromuriae7", "enr_leds_iluminacoes", "fernando.matarazzo.9", "hiagotaavares", "carlinhos.annater", "msolucoesiluminacao", "djanderson_diniz", "nunestorresmarcotulio", "marcossrz", "sauloteixeira1", "j.s.amancio", "bossmarcenaria", "djzimoficial", "djfelipeadriano", "jlb_bahia", "rasecpinho", "djsblackout", "djgalatas", "eduardomelo2014", "bikiartista", "raulbozo", "mayanamello_", "leolobo11", "bianchi.eventos", "np_iluminacao", "decorlight", "mariano_maff", "ailinpascoal", "vandersoncolnago", "viniciusforato", "yuri_dias_tecnico_de_som_", "lulapaiva_bn", "h10iluminacao", "andregaletidj", "mauronobress", "pesimperiodos", "escoladafesta", "renatorichard", "kernickieventos", "fariasjosuecarvalhode", "joni_saiff", "valderijunior_", "danilo.luciano.3726", "cawmartins", "bitencourt013", "reginaldo.pinheiro.161", "simonresk", "luizcarlosfrancodeoliveira", "joaolucasrocha2017", "gnova.gustavo", "alessandrooliver_", "aciolegama", "nortongrassijoaquim", "oficial_sonora", "cassio_scherer_", "andinho.cf", "tporteglio", "djwitgospelmusic", "rafael_somdigital", "muril_o2561", "antonionovaesmendes3", "rodrigopertuzatti", "vagalume_musical", "vanderley_caboclo", "paulinho_do_pinheiro", "rafaeldiicarvalho", "marciosalvadorestevam", "nocautdrinks", "pardal_josemar", "jandersonrobertosiqueira", "wagner_camposs", "rodrigocontinlopes", "vaniaamelia.inv", "marquinho_sylva_ms_", "tiagonebe38", "bill_htz", "evandro_machado1", "dj_junior_vieira", "cesinhanobeat", "carloshenryqueubr", "vitorprivy", "kamilokichileski", "bass.carlinhos", "josyribeirogrein", "ricardompereira78", "lucia.menezes.52", "renato_hventura", "djbruninhoviuvanegra", "josinilsonbatista", "euamanda_santos_", "seixasaugusto", "alexpaulotomio", "robertofaustinolima", "davidazeredo", "junomaster", "magulight", "tiagosillv.oficial", "olavooliveirabass", "marcosp.andrigo", "djricogarcia", "mateus.ag", "juuniordj", "wagninhojunior", "athriosband", "djandrebomfim", "djleotodynho", "fabioabelino", "assis_cult", "brunoborbabecker", "iury.bellin", "luzlightingprofissional", "paulor.prc", "djavan_diniz", "espetonight", "santosrenatobarrosdos", "juninhoalvescantor", "rogercorrea_", "fred.tammaky", "ednaldo_costaa", "leonardoamaraldj", "junior.seabra10", "thi6537", "gho_marusiak", "djmarkinhosmeiraa", "davidcdsmp3", "gustavoo_rodriguescp", "pocivieventos", "juniorsoares.c", "stylus.som", "pedrolyra1", "fabio_eventos", "barnes.sonorizacaoltda", "_guilherme_antunes__", "jacksonxz_", "josehamilton.s", "blade_nigth", "douglas.hayashi", "juniorgarciaoficial", "yuri_victor_12", "luciano_gamarra", "joaolicassali", "paulomarcili", "jonathas_tchuck", "andersoncaldasdjac", "djggswett", "zappsaula", "heliogomesneto", "g4briel.syt7", "djmarciocamargo", "deivedebatera", "sergi0sousa", "victornascimento_gp", "djraffabelarmino", "x_luzes", "luuucas00_", "felipemixerr", "douglastecla10", "lauro.nascimento", "silvio.vazquez.85", "orbitasomeluz", "alexandropereiracosta", "danerpedroso", "jfproducoes_of", "josemilson_reis", "oiantoniojr", "dj_zokrinho", "macielrufino", "astrolediluminacao", "djagrizzi", "hyagocosta92", "badranpublicidade", "martinstudiobr", "locasomeluz", "regibatista1501", "artcenic.eventos", "djleotralli", "marciofrancs_me", "brunno.mix", "nadjecksonlacerda", "franchescohermes", "dayse_alves_gb", "cleonardo_shalom", "marceloforrozeiro2022", "marceloferreiramusico", "cantarellijotha333", "paulohenriques152", "celio.oliveiraf", "brunobokaispersonal", "oficialpagonejo", "juliana.brasil", "guh_lg16", "marcolino.027", "claudemiro_rocha", "clay.magalhaes.7", "hdjlokosom", "lucas.rodrigs_", "aldenorjunior1", "djrobsonpaje", "djtonyrangell", "gilberto99k", "jonasbittn", "joelsonaraujo241", "henryke_garciia", "caiogabriel_0.3", "rs_eventos_oficial", "kelvinsellsellsell", "pedrinho.souza.710", "andrekcond", "baltarflavio", "queluzqueluzoficial", "technnos.someluz", "__carloscesar", "andrezinhosoma2l", "theo_fazzio", "gabrielvillena", "vanessacarolinade", "divled", "tiagotorreslight", "clima.dev", "felipe_linz", "eccostv_acre", "marcostorres72", "gabrieldiasdj", "denilson_marques2017", "leandroferreira3156", "eduardomello10", "tiagompw", "vini__barros__", "f.ednardosehischini", "djtikinhobs", "rodrigomartinsjb", "ottojrjr", "celso.ricardo.98837", "leosarttus", "julianogiandoso_oficial", "andersoncarlos1974", "rodrigofilme", "vini__rf", "xandebondioli", "rmilproducoes", "psantos.dj", "aline_oliveira122", "gilmar_hrysay_ges", "tonysantos322", "jotaerreoficiall", "oliverdejota", "willian.wleventos", "emsproducoesoficial", "evolutioneventosdj", "sammuel_franklin", "joaopaulomoreiralima", "gilmar_santos7", "julliofrois", "msoundestruturaseeventos", "te_killers_five", "raidon.cardoso.96", "ramongomes95", "ketison.22", "designsonorizacao", "vaanessaazevedo", "romeriosantiago", "wittrodrigo", "fabricio.a.soares", "klebermartins74", "edivar.brunetto", "claiberhenriques", "lsouza.ofc", "wallascampos_cantor", "alexdjjoinville", "tiago_coelho", "edn.sousa.bispo", "miguelviddal", "musicaesomcampinas", "wesleytenoredocarmo", "cezarromulobrito", "jotinhadoforro", "mayconpantoja", "thombeatsmusic", "tiagonocchi", "josineygcosta", "lucassantiago1205", "dj_dirceu", "minas_som_e_luz", "samuelalencaroficial", "djcassioestevamoficial", "solinarleite", "driu.lima", "alessandrocgk1", "paulovinni", "israelmiranda.silva", "oficialdjscorpion", "pemoura", "cicinho.pp", "aleandroazevedo82", "eloy_som_iluminacao", "augustokozuki", "enio_heitor", "kinhaproducoes", "brunogutierrezoficial", "lps.eventos", "wanglovezou99", "raphaelmontandon", "sydomarsantos", "forrodomomento_oficial", "claudiolimafd", "bhfestsomeluz", "diego.sonorizacao", "wellingtoncampos97", "lucianomaurosiqueira", "diego_cantor_ofc__", "moreira8701", "vitordepierii", "danoneteixeira", "djgutta_oficial", "wagner_adami", "emilio_sound", "marcoandrevsilva", "fokoseventos", "andreluizgmor", "vilela.meirelles", "rodrigoramosds", "oscar_schmidt_01", "paulo_henrique_thomazi", "vipproducoesdjipatinga", "aguinaldo.santos.39794895", "futebol_brasileiro_newss", "portalgibanoticias", "jacksongardin", "eumaxpaulo", "rodrigomoreno.tt", "josiasmagalhaesdjjj", "fredericoaraujo89", "claudio.montoza", "alexandre.hashimoto.94", "oliveiradedeuacustico", "sandiniz7", "toebezerra", "sandrolima.music", "abnelima", "luizrpadua", "casadeeventos.rs", "edwilson.cesar", "marcos.garbin.18", "beto_ramos_eletrica", "arybernardino", "lumixiluminacao", "merakifotografia.br", "jcaudioproducoes", "preliton_maisia", "moucatus", "marcossantosmabs", "diego_s_batista", "andre_e_du.dadausom", "ronymax.oficial", "tchucoacai", "henri.joao", "danielsonsilva12", "djluviana", "davidgomesav", "sandrofortes20", "dliveoficial1", "lucascardoso692019", "turibiomota", "jonatas_ferreira_nascimento_", "sr.rfelix", "aldenormacedo.sonart", "wesleyrsantos25", "jobsonsilva908", "joaosousa2442", "djalessiolima", "_gerasom", "prismasomlu", "comendador_do_asa", "wgcsbiel", "felipesouza9039", "stereosound81", "leandrolima6509", "deejay.juninho", "barcellos_comununicacao_visual", "vlcaetano_12", "alexandredias_dj", "rodrigoalmeida1997", "jhompsonlima", "duart_italo", "rogerio.rogin", "solivancamelo", "eduardosilva.eu", "casabinstalacoes", "djfabriciobatista", "joaocarlosrodriguesadv", "leo_navesom", "flaviabritofestas", "blackbeatssoundd", "djbarteventos", "rogenerdoliveira", "rogeriosalesproducoes", "daniel.bolacha", "ojulinhooliveira", "alex.freedom", "robinson_magnusson_campos", "beto_r_pereira", "chocolateaxesucessooficial", "raphaelnovicki", "adm.nadsonsantos", "fabriciosalvaia", "helton_bollmann", "paulinho_bra", "djmagraojf", "allysonclaudior", "djbergcalixto", "preetam._l", "felippearantes", "bruno_rovedo", "herdesonqueiroz", "cesarsoanata", "nandoferreiragtr", "emersoncarvalhodj", "henriquecbfrei", "douglassoares455", "deleym7", "jorgericardodigital", "djtranceoficial", "serginhoribaspinheiro", "lucasviolinoficial", "francismontovani", "ricardoribeiromg", "nelcijunior7.7", "djsayer", "adrianoo_santiago", "mukamoura", "yriluminacao", "geraldoyron", "campossmattos_producoes", "djwillersp", "djmatheus_lima", "mariofigueiredo12", "matheuspoletopumba", "dj_cylas", "ezprodutora", "elder.moreira", "marianasachetinoficial", "ray_pc_iat", "murilaoita", "tiago_feoliveira", "jrgehan", "hs_producoes_oficial", "tiaguinhoblackreisdobatidao", "rafaelhenriquel.a", "mayk_teclas", "alexandre.franz.3", "heldermont", "wesley.som.eventos", "grupohd_", "rogerioreispro", "navarini", "marciobalada_producoes", "maciel.teixeira.94", "omatheus062", "dj_fire_brazil", "ivaldo_boni", "djadrianomoreira", "gwsa94", "kakavideo", "guilherme_neto_", "oficialeuanderson", "pammelateles", "dj.rogeriomaia", "djmarciocustodio", "sanfoneiro_damiao_silva", "estevaobrag", "everton_nascimento2307", "djdaniloalmeida", "carlodoring", "djgoiabaoficial", "raphaelvazoficial", "zillion_sound", "diegofontella", "araujo.joaosousa", "marcelopiteldj", "conrados_producaes", "andrade97", "xavierdna", "wesley.araujo.santos12", "le0viita", "herculanofilho06", "ronald_argollo", "hudsonclerison", "robson.grespan", "fabianojuffu", "raelalbuquerque13", "blootalexsandro", "jefferson.patrick_", "thadeutabosa", "rogerluizts", "pedrinhobaziliolucilene", "djkleberaiello", "jeanfrejat", "djjoao_lourenco", "weekendeventosbsb", "beto_marchioreto", "eduardocolombo81", "felipe_m.assis", "raul_kido", "haroldo_pitoknovo", "felipeebenezerfraga", "djlucianorealproject", "djthonoficial", "nzsom", "djmorenooficial", "rodrigo_rodsilva", "daniloboiborges", "lucianodosreissantos", "luizinhoiluminacao", "rejanecavalcante51", "djastro10", "djfelipetinoco", "audio67oficial", "caiodinizcantor", "perimpedro", "jfstudiodebeleza", "djdanielhayashi", "caiorsena", "aironsantosoficial", "pittawelington", "cleber_6343", "djhevertoncastro", "dj_danieloficial", "williamgeneroso", "patchoco", "luisbarth99", "hermespinna", "eufabricioteixeira", "lucaskatumata", "admilson.ferreira.58", "oficialfeliperibeiro", "cristiano_weber_pa", "andrevictorleite", "felipedelbone", "fabianomaquinaria", "jeoas_rodrigues", "mota_barber_cabeleireiro_33", "valdekjakleide", "grupoflordeabobora", "castelo_casado1", "escola_de_music_shallon", "tiagomaia_assis", "dadoblowoficial", "rafaelloganx", "digitaldialeto", "advarela369", "machadodavii", "eng.rodrigo15", "davilandimf", "sandrorodrigues70", "brunoalcosta", "ferreirafilhoproducoes", "marcosguilherme131988", "djsoberanooficial", "bellacardoso14", "guilherme_lighting", "carlos.alvs", "pr.marloncastro", "mauricio_palcos", "helder_deluz_iluminando_sonhos", "serginhocorreiasom", "djlopezeventos", "djmauriciomaciel", "piardifelipegustavo", "thiibagui", "rafaelbarros.of", "fllaviob", "dj_thp_oficial", "ilbertogadelha", "wendell_mattos_16", "lucassantos_bike", "biano.bezerra", "higorbalanco", "caubyanselmo", "mbproducoessomeluz", "fa_bricio3304", "jeeymelourencomascarenhas", "alecsom_", "leoo_syllva", "leosimoesfotografo", "raul_gerraproducoes", "kalebe_silva04567", "djtom_eventos", "kamisg", "wbalazeiro", "djricka", "gustavo.gurgel", "dj.juliocesar", "_fernandogimenez_", "rodrigo.cruzpb", "mlight.iluminacao", "wilkinswps", "walmirewanderley", "alex_ctenorio", "brunaobquality", "raphaelglopes", "romulovilhenaa", "eneziocapistrano", "wg_producoes_", "arilson_productions", "raylanriosraylan", "tatyxtiago", "joaoregisnascimento", "renato.s.moura", "igonegao", "carlosleguica", "djborges_ac", "unicaentretenimento", "roniericardo", "adairbatista", "joaoandrade_xx", "maxsoundeventos", "geovanicebolinha", "rananfarley", "djtsunamioficial", "gregoryadam_", "moabcarrias_", "dedynha_teclas_ofc", "guilhermeu_29", "arilson_k", "fagne_rbarbosa", "ronnyonmidias", "djnettopyrez", "fiusaalex", "vilmarfelix17", "djcarlos.henrique", "joaoluixx__1", "djfernandolima", "libert.rs", "flavinhoalvesofc", "edivaldojuniore", "diel_nunes", "matheuslaerciofotografia", "maluquinhopersonaltrainer", "zezinhochamegado1", "djmarcioromano", "falcaodj", "dj_oneda", "equipewattsom", "jamesdaysss", "wyllyan88", "edivaldo.sousa.338211", "studio_atual__fabio", "jander_vibe", "xuxasomeiluminacao", "joaopedrosilva2030", "_reinaldolourenco", "robertosimaocuri", "gellpridedj", "wnfestas", "audioe_luz", "denis2017insta", "alfa_som_e_luz", "dj_geo_moral", "carluz_luz_cenica", "lh_grimauth", "talviseduardo", "tattofest", "bandatropicaliaoficial", "jadsondasilva.santos.9", "otavio_camargoo", "jonatas_projectsom", "kamillosomof", "felipexribeiro", "marcelodezottivieira", "djgustavodj_", "jqueirozl", "carlosmachado12", "matheus.s.saraiva", "anjonegro_producoes", "jsomafenixdomarajo", "djbrunocabral", "lucas_lins.gota", "sokorasilvana", "zedosomproducoes", "juarez.goncalves.545", "djsidmix", "marcelomusicoficial", "djroyalsom", "fernandorangel_somluz__", "emessoncampossoares", "evolusomsonorizacao", "iranildosantos_of", "palazzosomeluz", "djrccruz", "edmedeirosrn", "djgabrielsantos_", "nathannuness", "virtual_dance_", "saba_iluminacao_realizando_snh", "rocket.filmes", "efpeventos", "tarcio171", "phillmorais", "robsondj1", "edigarpavanelo", "tonyfabian", "djdendelzinhu", "familiarevelacao", "flaviodecore", "leonardomahnke", "comemorarte_bh", "casadedancarodolfogoncalves", "djroger_r5comunicacaovisual", "alessandro.hoffmann.37", "einsteinvargas", "murilodosreis1", "dj_leandroramos", "jc24_leite", "marcelogs_2023", "volmarsm", "evandroluz4040", "raul_neves1", "pavlakpai", "andrepvasconcelos", "prdiegoricardo", "barbosa.i.x", "banda_forca_jovem", "djadrianocostaoficial", "joaopaulocantorof", "yago_moshage12", "carlosalmeida156", "jameson_martins94", "alberto7474_", "e3sonorizacao", "djmauriciocury", "renatopellegrini", "marcio_apk7", "reginaldo.cardosooficial", "kexo_iluminador", "mariavitoria26__", "netonunesof", "fabianosakana", "joelsonbruno", "lima.wagner_", "markosrezende", "gerdsonbebe", "bomlavar_aseco", "djcorpinho", "alessandro_ajslokasom", "lucassousacedro", "_ballaco", "rabelohr", "perceusbarbearia", "falamansa_iluminacao", "djwilliamandrade", "inaldo_oficial", "alcidesjunior777", "batuta_mercado", "arao_lopes", "tsasomeluz", "necomeeting", "edmsomeluz", "luan_mateus_18", "waltersantosj_", "marcio.cariocasport", "paulo3216sergio", "jonasmatozo", "rennangri", "fellipearaujo28", "sergio.limma", "pro.audio_someluz", "rodrilimagomes.rlima", "renato_l_costa", "antoniofernandodesantana", "dj_andre_queiroga", "sandrobaliana", "xanddydj", "top_line_sonorizacao_", "josuemartinsoficial37", "clipsomrs", "sidneymartins21", "bombasomsilvani", "rsom_eventos", "pronfest_eventos", "primepro_eve", "claudineidionato", "guisaatmam", "meventosiluminacao", "ronaldo.ballardin.3", "metalmecanicans", "romenikoferadosteclados", "dinhomenezesoficial", "mercantesound", "mih_mk1216", "djwendeu", "eddie.smart", "planetaeventos", "arainhadoscabelo", "djcubanoluz", "dj_maycoon", "wesleylight31", "gteventos00piu", "abiliomiranda33", "djsteniosimoes", "ureia_roadie", "vj_boro", "prandre_luiz_ss", "tiagoaguiar1oficial", "tonynhodj", "lucas_fernandes04", "luivtz", "edsonmmeloo", "rudimar.martelli", "mseventosoficial", "djguilhermeoficiall", "nossopointporto", "rodrigo_horse_iluminacao", "isaiasgtr", "encontrosomeluz", "sdbproducoes", "aleixonromanowski", "cub2446", "eliane_arrudaa", "hiltinhosomluzimagens", "marcusviniciusdj", "santiaggoandre", "ssavilda", "marcosviniciusrto", "ademir_mota_mota", "alisonmiran", "djnicolasrodrigues", "nenem_dj", "villervoltolini2", "vanderson_abrantes", "guidofreitasoficial", "leomixeventos", "danimarbackes", "re.sostena", "aramecenotecnica", "alexsv.lima", "bambamluz", "cgla.dson", "lazaromeiokilo", "brancoribeiro_ou_adenilson.c.r", "djcuru", "djvinymarques", "reginaldomarcelor", "rickfrancacantor", "g.bernardino", "dj_paulinho_mix_e_som", "victorpereiraac", "waltervanessacosta", "peterson_willian_cantor", "prsamuel_santos", "bandafocus", "fabiomedinadj", "haytzman.adv", "osmar.franca96", "gilsondjofficial", "oeste.empreeendimento", "potroricardo", "twist_eventos_oficial", "dj_moises_", "djcemin", "maicondanielschmitz", "jordania.ferreira.79230", "rafaelandradeofic", "danieldellotdb", "jmsomeiluminacao", "flavinhoalencar", "johnydrops92", "diego_schroer", "noronharoger098", "luizcarlosbelli", "g_ledsoficial", "dj_dan_botelho", "portelasonorizacao", "anderson._jacques", "marcionikimasmp", "teixeirajosemarmiranda", "manassescardoso_", "fausto_motta", "g8eventos", "thiagocapeletti", "koy_sonorizacao", "fabiodfaria", "regi_conecta", "rafael_guedes99", "andersonluisss", "fabricioleiteofc", "victors4lles", "bellochio", "camilotheguitar", "elenilson.andradeoficial", "marga.mendes27", "djvitorrodrigues", "_f_coast_", "toppistas", "carlos.juunio", "icarolightsound", "ailton_mix", "daniel.araujo.al", "markaobomdesom", "djedysaocarlos", "maicondias_30", "lucioreis43", "donimaxoficial", "wagner_t_carvalho", "mauromielke", "almeida_stronda", "starcompany.cell", "musicpazsonorizacao", "gibi.campos", "_robertoharadaa", "djclebercosta", "pablogattoborges", "marcelogaldini", "d7producoes", "gil_guimaraes_", "rooger_souzza", "djgutoazevedo", "jonas_light", "dssomluzled", "scproducoesartisticas", "tec_alanfranco", "djpaulera", "adejarbueno", "denyscdsmoral_85", "ivamsomecia", "danyel_deluchi", "junior_carlet", "jearlyson3812", "djmaxmontesclaros", "marcosfinan2020", "ricardonunes_fotografo", "carlos.marcelo.50767", "leleotonetti", "rodrigo123tavares", "darlan.marcel", "lojapiee", "dapazjosivaldo", "leandrocappellaro", "afonsoangelsilva", "willdan18", "connect__informatica", "djcele", "djpedroalmeida", "mazinhosantanaoficial", "jairoitasom", "samuelsouzavp", "dj_shark_brasil", "leitejoaojr", "gabrielvgdias", "rodrigo_hornke", "djhigoor", "tc.light", "deltoq", "tcharling_", "rubensjfcjequie", "ricardo_augustimm", "errezmusic", "rogerlights", "everthon_rosas_ac", "thiago.lacorte", "julia_som_mg", "emeroliveira", "joaopedropalladini", "coimbraoficial81", "tajustadj", "jaimesilvabbu", "jananlazo", "joaosvrjr", "djivofurtado", "fagnerpissinin", "fabiodelimacantor", "izaque_padilha", "gugarebonatoo", "alyssonmix", "andreottiwagner", "leonardo.lts_melb", "benrapha10", "dj.diego_updrinks", "djkaiquevieira", "gustavomileva", "stylluseventoseempreendimentos", "rodrigomatos_oficial", "mixasom", "marcelokarlinskisomeluz", "alisom_som_e_luz_", "fernando_iluminacao_cenica", "marcosalegro", "max.iluminacao", "totty.sousa.12", "juliorochaoficiall", "laravelounge", "adrilondon", "pabloboufleur", "osreisdoriso", "djbrunoromeu", "djpaulriopreto", "sebastianshowoficial", "azalimwesley", "adrianocoelho_oficial", "gilsonalexand", "dj_p_lira_festas_e_eventos", "mf.someluz", "nseventospb", "jhonysertanejo", "jpsonorizacao_e_iluminacao", "dj.nana", "thallysrodriguesdgc", "nono.som.iluminacao", "play.djs", "joaaovds", "adailtonbezerra83", "dj.iury", "carlos__juniir", "djlazinholimeira", "tor.bruno", "caio_emipro", "icpi.bela_vista", "djrobsonfratta", "dj_ediivas", "michaeljne", "guilhermemercosul", "reginaldoferreirada88", "marlonsamuelgoncalves", "matheus.leite.m2", "arcoverdecasashow", "wesleyfnogueira", "marcio_santinosjm", "eduardo_sammy", "eduardo_lpma", "kallebe_klsonorizacao", "joaoolucas.br", "djhykaro", "riquinho_connect", "jamille8134", "kieldoacordeon", "joaocarloscrb1227", "fernandodolastro", "prbetoqfg", "hugo_angelino", "jacaresilvaeventos", "rjotaoficial", "calandrinifilmes", "djraphaantonelli", "banda_xarada_oficial", "jhoonatan_medeiros", "adriangaitero", "audiomixrs", "djdavijiinger", "mbsom_luz", "filipe_juvencio", "gaxinim_", "celsodjj", "nem_game_mania", "ws_silva15", "danielanzuategui", "adailtonjrsound", "fabioduk", "serginho_upagencia", "fernandoduplafernandoerenan", "somdfrente", "samyysales", "dj.jacare.06", "glauber_santos244", "eliteesteticaautomotiva_srpq", "geancarlos_freitas", "djfrancisjunio91", "kllauskabellus", "felipeb.borges", "adriano_albuquerque08", "rod_loureiro", "rafapires999", "matheussstuani", "rodrigopereiraempresario", "thevao.rocha", "elizabete.vitorino.54", "djtheguga", "jonas__garcia", "chicoconde", "joaocavalcantef", "trussvaladares", "benevidesacacio", "mercia4499", "thiagobrahim", "vitaminasom", "_drigo07_", "nicolasalvesnj", "nando_e_silva", "bandajaffersonoficial", "sauloreboucas", "gaffersupport", "thiago_vieiralh", "bruno_mbleventos", "felipe_alves_ofc", "l2dj_oficial", "maicondemenighi", "guilhermeferreira.mx", "360fsareboucas", "maurolevy97", "thyago_farias_", "andre_seculus_sonorizacao", "luizinhosantos.ls", "eusouotavio_", "romuloramon", "junioroliveira87", "djthiagocarvalhosc", "vibrasomrs", "vanderlei_luciara_w.z", "dalvanilson92", "marquinhosalves", "ls_souza061", "henrique_tofolo", "_vinicius.goncalves", "johnbionerdes", "selectled", "ligia.recrearte", "forroespacoverdee", "djbielzx", "djpedrobarros", "laellson_silva", "liandroholz", "eumauricioreis", "bar_do_arley_e_espetinho", "elmomatosjr", "tonni.gama", "djsadan_official", "dj.luciano.ls", "dgcoreografias", "wm__eletricagv", "arys_moreno", "xandedeejayofficial", "adilson_tron", "igor_gaberti_saks", "mariozinhoperegrino", "eduardodoviolino", "marcos_regis.2015", "_leiciano_teclas", "gbossonaroo", "alissonlouzadarodrigues", "ls_entreten061", "cristhian_d", "_erico_silv", "3aeventosbvg", "bfreire", "danillotcoelho", "djjhone", "dhiegomix", "carloshbaier", "mirvanis_nascter", "__ruan_pabl", "wandersonnunes.costa", "lisboaclaudinho", "carmona.willy", "edu_someluz", "alexandredjsom54", "felipe_hebelsom", "dj__lucca", "sttagemix", "dproducoes.pe", "drcaiohenriquescosta", "doonycorreia", "marcelohydeguitar", "templodacerveja.timbogrande", "cristiano.cantor", "playlighteventosoficial", "ls_producoes16", "hernani.cout", "bruno_bala", "toni.nho2708", "djmarceloboto", "henriquedesouza_", "gilsonsemretoque", "djdudusomluzeimagem", "viniciusantana_", "foccussomeestruturas", "kaique.menotti", "renato__cleberson", "leizmarcel", "berta_799", "fun.view360", "jamaicatattoooficial", "_dahorasom", "bernardo.dias.1654", "guina2andrade", "danielmelopi", "pauloricardosax", "gabiroba_gabriel", "iarllis_i2connect", "reginaldosantana.alves", "marcos333207", "deyrgomes", "guiimix", "edcarvalhooficial", "dj_j.neto", "markvalleyoficial", "mariojorgelima", "blackouteventos01", "jefferson_lightmv", "juninhofmx4489", "junior.lobato_", "jrwsomeluz", "djedsonsom", "netinhosom.someluz", "lig_iluminacao", "gustavomoorales", "djleodj", "ronaldolima_rl", "spaceproducoes_", "dj_saulinho_", "djlukinha_oficial", "lulumaia_", "paredao_bigbig2023", "lukassousa_oficial", "rafaelps1980", "as_estacionamento_eventos", "adami3778", "naalisonlopes", "tiododinho", "nano.pedalaventuras", "djfeliperamos", "forrorekinte_", "djkalil.vilhena", "thiagodaimpacto", "diegommtransasom", "marciocarecaluz", "leleandroyasbellami", "_joaozinhosom", "edcleialiancas", "pgsomeluz", "adamirvivan", "djdudamaciel", "pe_corporativos_e_eventos", "meriquekauan", "gilsonstussi", "brenox122710", "johnny_megasom", "guess19850515", "djgaovix", "iuresom", "gusttavooabreu", "marioproart", "ken_yamaga", "barpalhoca", "ap.netolucena", "djmaycom_oficial", "selmoferresbarbosa", "_thamyrys.costa", "hailtonht", "hans_.muller", "juninho_do_forro", "leandrorosa_luz", "marcioaraujo_oficial", "emanuel_hudson18", "superbandareal", "wrocha33", "juniorcorreanp", "o_gigante_do_som", "tayrone_lopes", "joaocarlosferreira.ferreira.10", "vinigomidedj", "itamar6638", "sic_sonorizacao", "wagner_msantos", "vandersonalves05", "mariocleiber", "van_sonorizacao", "henriquelemes.oficial", "cristian_enzdasilva", "alencacioschuenk", "altairjroficial", "richardleonardii", "reinaldo_2017_", "grupocandeiasofc", "a_fabrica_iluminacao", "ofc_kuller", "roldney.dalcin.agostinho", "dongepettomarcenaria", "trinityplayeventos", "dj_adriano_stylossom", "silviolioli", "360conecta", "yancoutinhocantor", "regisleitzke", "fabianomoura_silva", "guilhermeandradedj", "lucianochibiaque80", "bender_lighting", "joaobeva", "mariocristianoferreira", "henriquemixoficial", "equipeminasom", "renanmendonza", "denilson_lealsanfa", "ogaleguinhooficial", "igor.caria", "djdanielferreira", "gleidsonlula", "wstelaoeiluminacao", "julio_souzaofcial", "matheusalmeidashow", "nildo_monteirocda", "geymerson_tecladista", "djthiagoleite", "leandroviana86", "pitota_sonorizacao", "wavegrupo", "djjuliobrito", "mm_sonorizacao_2019", "djxandeaudioproduction", "cantorjimmydiaz", "carlos_dudue", "rjrobozaogigantevivo", "rodrigo_rs_1", "claudioleao01", "miguelmelloni", "djdanielpinheiro", "ominettiiiii", "mazolaeventos", "daniel_braga6", "djrafadouglas", "ivansom.nc", "igrejacolheitasede", "djwanderson_oliveira", "geovane_santana.jg", "diegotecllas", "jsom_64_992348660", "leojaime73", "joaorogerio7", "wallacecarneiro", "wagner_papel", "paulofurtadooficial", "djmaradonamaradona", "roneiherter", "jaridecalazans_", "andremellodj", "samyroraimundinho", "_matheusvincent", "andircorrea", "reginaldogomescelestino", "ederson2056", "glauciogomespainel", "juniorbritooficial", "eng.querles_santos_", "brunno_araujooficial_", "djk.eventos", "diogoizael", "djfredsegadilha", "luanpireslopes", "everaldodomingosevsom", "pezinho_moraloficial", "gabriel.luzofc", "henrique_ap46", "leyhouse", "djjarbasgomes1", "guilhermeferrazza", "riomastersomeluz", "alternativa_igp_producoes", "charlesandersonaraujo", "uaiboss", "juninho_alternativa", "fabiosouza953727", "amarildoprado10", "antonioermesondesousa", "djxandypancadao", "generalluizinho", "alonsosantos2023", "chute_certo2021", "facasfranqueiro", "eliseu.ssantos", "junior_balla_producoes", "pegada_dos_3", "maycon_jguimaraes", "pedroligth", "ottavio_cotrim", "yuresilvaoficial", "samuka_sonorizacao", "terezazanirato", "alexandre_sergipe_b_coqueiros", "danielzimcapitao", "saboia.tiago", "joao_amaral043", "brazil2000bandashow", "nastar___light_console", "paulobruno_psi", "alexpascoal", "cantorravelli", "juliorbribeiro", "juliocozini", "alcenirzollner", "arthur_refrigeracao", "_daniel_rafaela_", "elder_multi", "jeanmacieira", "jailsongledson", "clebercacheffo", "gilson_andradesouza", "rspaineldeled", "gilmarwestarb", "manoel_ospal", "audiolighteventos", "gustavo_sanchess", "reisfutsal_oficial", "cesinhatecnico", "gilnei_fim", "menezesaudioeventos", "rogeliohortencio", "brunosantos1010", "buffet_silveira", "megaled_luz_e_led", "brunnuscn", "manoelneto_76", "djmulsikart", "andre_andrey2011", "apostoloandredamaceno", "renatinhobolzzoni", "nksomeluz", "murilo_light", "vitinho_segundo", "junior_fuzi", "danielzinhojunior22", "lucaas_araujo96", "djdieguinhooficiall", "marcsdjmarcelo", "teodorocasemiro", "alissonmusicproducoes", "producoespatryck", "sandro_maguila", "evandroremigio.pimpolho", "labbertazzo", "ibiapinoandre", "vidadedeejay", "enzowajntraub", "bandabalancogostoso", "jp_estruturas", "alisonhiga", "filipe.murta", "robsonlightdesigner", "yssobdj", "renatosverdan", "erico.guimaraes.7", "_erique114", "jorginhobahiarodrigues", "emanuelbattera", "twoblacker", "vvitoras", "dil_santos_teclaz_oficial", "dj_arthur_vieira", "djfidelisalto", "alme1d4_", "douglaskombi", "jeffersondejesus__", "ednei_koester", "jouberthsouza", "thyagomyller20", "anderson.christian.92", "digitalsomeluz", "mateusribeiro1379", "cassiano6724", "ramonalmeidaam", "reginaldoalvesp", "djmarcosbassi", "artluzeventos", "jhonatansmarc", "prraimundobispo", "ricardo_mofardini", "tiagojuniorcosta", "jcsaudioeiluminacao", "branndj", "soundmix.someluz", "profest_som", "mauriciolight10", "djpitocooficial", "estevamnl", "souzaodontoespecializada", "luizgustavobandaedj", "baldez.jonathan", "joans_silvadj", "julio.c_pereira", "newlifeiluminacao", "djhugobsb", "helton.music", "welber_aguiar", "ssandro_cesar", "frank.rodrigues_", "brunno_e_guilherme", "hlightiluminacao", "jeferson_carvalho.hl9", "karlinhozandrade", "visionsomeluz", "johnnyspace01", "toplight.oficial", "jonathan_pazinato", "eugenioproducoessg", "quasetudo.musical", "ddiluminacoes", "banda_biografia", "arttendas", "rubenssilva__", "robson.vilasboass", "djlucasoliveira12", "marcos_deejay", "santosjosepetronio", "djsegattoo", "jonesmoraesoficial", "bc_festaseeventos", "ldlsomeluz", "isabellaeandre18", "dadoph7", "diegooiluminador", "uelitonqss", "jaimeiluminar", "megaluz_iluminacao", "rafazecolmeia", "leandrooliveira6685", "adriamasantos", "djvinnyba", "djwestn", "leolabres", "igor_souza_reis", "pedrohmontess", "bandafatorr4", "rick__andrade", "trindadelocacao", "djfellipems", "marcelozem", "restingjovens", "klebsoncamargo", "djjulinhodias", "pedeferro_entretenimento", "led5_iluminacao_som", "adierson_holdefer", "paulovictormt", "altiere_altsom", "cezar_junior", "djrobertcandido", "predgleysonpereira", "dado_som_e_luz", "victtorpinto", "iluminarslz", "joaougustocr10", "hebertealmeida", "dj.robsonbarbosa", "lindembergcunha", "fabianorochalf", "andreuzedaba", "_allan.op10", "lucassenasoares", "albuquerque.guga", "vsaldanha014", "clodoaldoapolinario", "thiagoberninide", "ukskenta", "vitor_tec.audio", "blac_kjorge", "k1_machado", "mcaudiovisuais", "buiasom", "renato_menon", "marrygomezoficial", "jmx_sonorizacao_e_iluminacao", "lafayette.0710gavao", "marcor.amaral", "marcelodjmarcelinho", "djmark.vga", "rodrigomuller31", "jcsonorizacoes", "estevezportes", "djbranco_iub", "andre_alex_machado", "mhsomeluz", "marlonwru", "magoolino", "douglas_l_lopes", "djandrensmusic", "lelemarazzo", "ofbrucelee", "djleoribeiro", "dj_pisquila_", "tiagohrosa_", "guii_souzaaa", "geydson_marone", "uvaudiosystem", "guilhermesalles_gsm", "_marcos_vieira_ce", "agnelitodf", "gansosaxbarril", "vitinhodosom", "ribas3363", "delsertanejo", "forrocangacooficial", "jviictorofc", "chaguinha_rocha", "djleandrinho_djleandrinho", "gabrielcarreraoficial", "djpontesbh", "marcio.cordeiro.1865904", "marlonfrequencia", "vibe_vmix_som_e_luz", "homeropizadinha", "dj_coruja__corujasonorizacao", "eng_warlley", "marciohelenoxavier", "lssomluzimagem", "juninhoosanfoneiro", "djventuraa", "fidelis13_", "alegonzalezdj", "junior_carvalhooooo", "betinho_bass", "djcoutinhofestas", "mathiasmmd", "robertramito", "thiagowesley", "uber_damiao", "jr_kbcinha", "newtonjunior2", "selflogisticaemeventos", "ricardosilvasilva", "maninhojoel_expresso", "dionismarmix", "ricardoiluminador", "eduardolima1.0", "markinhospalito", "incenaxperience", "navire.2k23", "gleyserazevedo", "gilsonmatos.entretenimento", "danielmatias6743", "caio_caldeira_mello", "djlaertearaujo", "dj_botchan", "tiago_peretti", "vilsonproducoes", "eduardoviieira", "tornadosamba", "galak.dj", "_willyoneda", "adilsonabilio", "gerasonssonorizacao", "jhonathan_deejay_", "dj_audino.junior", "djcarlao01", "jorgefernandesce", "elissandro72", "marquinhos.gaspar", "andreipressi", "dj_victoxoficial", "carlosaugusto.82", "ttheeuuss", "lucassenz", "guilhermecosbor", "djraniel", "wellington_mix", "nilsynhodj", "amaurylight", "joaootica", "banda_brilho_do_parana", "caiopavel", "donatellopremiumpizzaria", "salesguto", "phraudiovisual", "studiovipeventos", "wanderson_e_companhia", "dj_vitim_oficial", "djedsonalmeida", "oasisteodorosampaio", "robertovieirajr_", "spido_rey", "jonathanbenck", "joaopaulosimao_produtor", "carlosbeckerdj", "lifeshow.ac", "valdeir_pinheiro", "markinhosenvelopamento", "blacknight.lounge", "brugomes86", "djmarcel.oliveira", "marinholima05", "djfabioribeiro", "sampaiotelles", "helinhosilva", "djevandroprado", "cassianogerber", "produtorsergiolima", "tiagoengel777", "importlight_reis", "jacksonebanda", "reginaldor2sonorizacao", "ricardo.f.s43", "allmagazinegroup", "uelgersantos", "brunocassioresende", "djsaulorichard", "julianbzs", "roberto_mogli", "alexbrasilan", "djleandrinfranca", "wedsonmathias", "equaliza_audio_rec", "matheus_foglii", "djmasgoficial", "lazarottoficial", "junior_bazu", "jard_ggomes", "_quadros.nic", "djvilelamix", "thiagocampos_rs", "djricardosouza", "djdrinao", "jeanmontenegroo", "soltaoplayeventos", "gilcimar_marques", "diegoiluminarlpg", "trproducoestony", "cristiano.foqui", "jairoolbi", "onegooficial", "ricardosom.pnz", "pt.caixas", "juninhodeoliiveira", "leandroturazzi", "eduardospessoto", "higor.sampaio.igor", "music.eventos.dj", "juninhodoaraguaia", "carlosmelo", "vitalimauricio", "apolodjoficial", "_williamsampaio0", "reneecds_e_divulgacoes", "claudemir_cl", "igor_light_iluminacao", "franciscoribeiro237", "wemersonmachado", "galeguinho_ofc", "lsmaelluz", "fagner1ima", "acpmega", "japao_diesel1", "djcaiquesantos", "mantovani.jefferson", "tfeventos", "superartcomunicacaoeeventos", "dj_khaed", "djtuca", "helber_candido", "twooswingueira", "cerimonialcruzformaturas", "djmatheussantosoficial", "dj_juliano_teixeira", "thieresdeejay", "lucasdalcin1", "mamutmunck", "djgrigoletto", "baladicongress", "fqrecreacaoejogos", "jomar705", "caiorochha", "davi.coutinho.18007", "giuganzer", "djthiago51", "djestevao", "dj_wellys.oliveira", "tafsom", "thalessjn", "djbambambam", "djjay.com.br", "jn_eventosrs", "djwagnerba", "rf_ilumina", "kaiosouz_dj", "teixeira_wattspro", "igorjroficial", "elektratech.aju", "robos_e_mascotes", "alessiomborges", "djlaurofelix", "jrmartinsz", "fredmorais31", "djjeffersondias", "matheusdaibs", "gustavolcj", "trend_led", "nanotecsom", "dj_ice_boy_ofc", "cleberrbampi", "lelis_goncalvess", "juliocezarmusicofc", "sandrobahiaof", "studiomariocortes", "renatocardouzo", "dionandosdias", "frd13227", "fernandinhomix", "fabriciomixx", "fredianipaulo8", "djsamambaia", "redmoon_eventos", "paulo.giovani.54772", "djjoaoguerra", "rudipires.rp", "randal_oliveira_oficial", "guilherme.guto", "drjucalima", "diego.dfd", "fjeventosoficial", "tiagopratesofficial", "alphasomsc", "wssombz", "jeanlouis_oficial", "leandroramosdj81", "maykeh_henrique", "gurodrigo", "manoproducoes", "rubinho_vilela", "djcarlinhoszoomoficial", "nandoanobre", "neto_pelicano", "pauloturco25", "djpolobr", "gildney_macedo", "micael_campina", "djryncon", "gilbert.lopes.50", "b1bass", "rogerio_miami", "spirro_go", "claudinei_chiconi", "hugobarata", "christian_crc_som.e.luz", "almir_schmitz", "leonardol3silva", "geraldodacruz2023", "dj.julio.cerza", "felipealmeida.drum", "marquim.salles.949", "andreparkdance", "djamoficial", "jpsom.luz", "vitorhugosoa", "weltbarbosa", "jeancoutodj", "diegocorreia_dj", "hfcarvalhoo", "alexandrosantoslima.santoslima", "manooliveirafilho", "deejayguimanfra", "leimifernandescorretor", "carlos.silva.cs332", "lucas_nnathann", "denissilvamacedo", "hecklaurindooficial", "rhuanperes._", "cassio_velho.oeste.fogos", "andrefranciozi", "raphael22garcez", "jerffson_menezes", "vande_veiga", "wt_sonorizacao_iluminacao", "joaoadolfopiresjr", "celsodinicu", "djrafa.oficial", "ruipedroviegasdealmeida", "djleandrinho", "claiton_bessa_", "dj_marceloshogun", "djdanilofiuza", "rafael_menani", "tosatisantinello", "juninhofaganelo", "braian.iluminacoes", "berlingovigarista", "_carlinhosom", "alemixdiscotecagem", "ryanlopesdj", "chineslin", "dr.icaro_michel", "joaocorsine", "fernando.botelhobatista", "cariocawander2020", "charllescantor", "realceiluminacoes", "vinedj", "robsonferrazoficial", "edinhopereira51", "tecnicodeiluminacao", "j.u.n.i.o.r.l.u.z", "dj_rony_soares", "rafael_quirinoo", "erivan.lima29", "elitesonorizacoesoficial", "djboydjboy", "qualityleds2", "alexandrematozo", "promofest.oficial", "djsapo2006", "danilomaia_dj", "idarlanmendes", "viniciuscarreirafiori", "caitohp", "dj_borrao", "nikson_publicidade_e_eventos", "alexiscunhaeventos", "sannym7", "gabrieelsm", "rodrigocosta28", "wisleymoraes_oficial", "djgrillo_oficial", "itamarnunescantor", "ronaldo.svecia", "gian_pnardi", "vitor_tristao_", "nickn7oficial", "leon.souza_22", "andre_luis_cantor_compositor", "djdiegoramon", "nicolasrafaelfuhr", "duduramosilva", "alineegilliard_oficial", "gabriellago.adv", "s8_eventos", "marcelomagrica", "eliesio_barreto_oficial", "evertonmkt", "forrodeprimeiraa", "breno_djoficial", "fabiolimajaru", "edersongoes", "adrianoguilher7", "_gabrielopess_", "marcos_r_santos_fonseca", "andretoys", "djronaldo_music", "leto23goiana", "tierrecavalheiro_oficial", "pretinhoblack_", "djbinhozanetty", "ayrton_light", "amazonia_itz", "djleoteles", "antoniocarloseventos", "adanilsondiasofc", "fil_sr", "soareslouzaluizfelipe", "allebassoficial", "djgustavorodrigues", "lucianokaupe1", "djandim", "fleide_marques", "atrilhasinop", "rennandjnan_1989", "lucasmatheus10som", "forrodomachuca", "douglasfdelima", "djwill_march", "oficialmamonascover", "adautojuniors", "toroo.2022", "bonde_do_som", "luizcleverton_r1sonorizacao", "netochicolli", "hs_equipamentos", "audiomaxoficial2", "jvictor_teles", "djvenenon", "walmirneiva", "williamsantosbatista", "vmodenalight", "luancostac", "kevin_missiunas", "davi.silva202200", "rivas_sampaio", "junior_barcellar", "juniorluzbel", "reizinhodj", "sr_rff", "janielmoura3", "marciogaiteiro", "vinee_al", "barboza_ademir", "marciorechoficial", "welton_whp", "alekrambeck", "djfernandoneves", "maryecristianooficial", "desouza.bruno", "felizyasmin__", "djadrianont", "gabriell_msilva", "willerprimaveracantor", "rodrigobahia2", "dodidjsom", "luciodj.sdg", "mamasomeiluminacao", "valmmir66", "dj_anderson_limafranca", "hugo.som", "roos.marcelo", "pr.denis.santana.oficial", "megadjemerson", "seudanadoalex", "djnandofoz", "eliascappellaro", "marcelomegamix", "morroreinaldo", "porto_sp", "lelloequipamentos", "zenrecepcoes", "felipeapucarana", "djjefersoncf", "prcleyton_braga", "gordinho_perc3lsom", "ciceromonteirocantor", "claudinhofs", "cle.xaviersantos", "nascimentogueu", "renatoweberchampion", "cayque_vilela", "gordinhosom2024", "andersonluisoficial_", "wilsonbarrosdjrj", "angelomiranda104855", "guilherme.90ab", "pokemondj", "mauricioaraujooficial", "adrianomonteiro_78", "jmaisproducoes", "natalcase", "filhosom_blackout", "hudsonmramos", "banda_relux", "mateusfcsaldanha", "th_marccos", "jannbikefit", "diegovieira_dv", "brunosolaroficial", "djmariohenriquesukevicz", "_.marcus_.fonseca._", "sonarteventos", "deividswaves", "jisilvaoficial", "diegonavoz", "jrcorreia10", "jpedrodamasceno", "tonare_noebu", "reginhogravacoes", "warleynsv", "jesus.sanfoneiro", "djwagnersegati", "djrodrigopetillo", "andersonsilvaab", "impactosom_pb", "nivaldobtpmusic", "djthaynannascimento", "tthayse", "teiocampos", "rubembezerra", "edinhofreiredj", "charlesmourabossa", "alisonmnkd", "martimerio_alves_", "jefersonaraujooriginal", "iluminart_1", "djemersonmarques", "danielbatera_fj", "ilumine_aldsantos", "niltoncelere", "explosaosome", "daniel.luzesom", "djivanmartins", "japa_producoes_sp", "felipenogueira740", "danielsantoevento", "biano.s.filho", "diogozorzanello", "elvesrota", "djjoaovitoralmeida", "forrovaiqvai", "crosseventostaubate", "dj_gabrielschumacher", "kanalsomeluz", "wagner.89", "fweventosfortaleza", "dyllyng", "rogerio.2r", "djlucasfariaoficial", "somluzeventos", "autieresrochadasilva", "prolinemogieventos", "batista_mix_ofc", "glauberbremer", "bandacafecoado", "leandrosilvaproducao", "feliperodrigues332", "tec_dj", "vilaca_neto", "hipersound1", "facililuminacao.import", "bandaseducaodeblumenau", "eletropameventos", "2inn_sonorizacao", "djfernando_supersonicdjs", "carlinhos_iluminacao", "ricardosekyn", "rickebombomoficial", "marcelo.hab", "danielcastral", "djdouglas.andrade", "djcanavarro", "djadrianooliveirams", "bcdeventos", "ciceronascimentodelima", "marcosfilhomf_", "pablo.sousa22", "ofc.pedroz7", "raphaelaudioecia", "thiago.angel0", "cesarprodussom", "_lucaum", "james.deon.7", "lavynhosoares", "gil_bolinhaa", "libertypoa", "peterson_zuffo", "williamcar", "arthursds_88", "peubass12", "glmidiailuminacao2", "bentinhovicente", "kdencia.oficial", "marcoseduardoofiicial", "djnandoveiga", "taciano_limaa", "andrezinhomusic", "nogueirataciano", "lu_freitasvalverde", "clipsomoficial", "rafa_petter", "aafogaca", "eziobessajr", "carlosailton21", "paulovpeixoto", "assis_vieira10", "contato.bodegas", "lucas608silva", "eldeswan_ferreira", "maciel_iluminacao", "fernandomixlight", "ronaldoviannaseventos", "renatovieira53", "tratordopiseiro_of", "sanderxx_05", "carlinhos8701", "jardelzinho_do_piseiroofc", "pj.mix79", "marcos.ribeiro54", "ismael_mix_", "cristianwagner2", "murilosantos_lem", "jhowoshowoficial", "marcelo_jr_jm", "leo_bittencourts", "osmar_depaula", "marcio_som123", "niltincantor", "jonaslimaofc1", "julianovieira_dgtalmix", "lucaspierotty", "felipeecvale", "luizdiascantor", "luizrezendecantor", "cl.audioeservicos", "valdemir.adorador", "marcosbarraria", "rofer.mail", "eduardo_fernandes_dusom", "paulocesar5706", "fabricio.fabricio.3975", "djpaulinho_catanduva", "sergiodealbuquerque", "illuminareluzesom", "nggsonorizacao", "robertotononi", "luismalteresquirio", "alexqueirozrc", "junioroliveira.83", "gustavoojedasaraiva", "maxwellcarvalhocantor", "luandelfinotecnico", "fabiororatto", "evandro_som2", "fabiofsom", "antoniomunhoz24", "flantanaeventos", "matheusguidio", "djvitorm_", "pankadateclas", "maurosantos2019", "n0ahgabrielperez", "deivith_mbr", "franthescocantor_oficial", "studioestreladedavi", "willyyazevedo", "ludamidia", "renanzinh0_ofcl", "andreiluminacao", "ulisses1980", "imperiumfashionstory", "djmarquinhos_es", "djjapinha", "leozzinho_malaxe", "carlosandre2339", "facililuminacao", "mateusjuniorofc", "kairooandrade", "good_angel_rodrgues_", "abala_som_e_luz", "djfernandobitencourt", "bonitao_producoes", "henriquewarlison", "abner1gomes", "brunobs.som", "joaoferreiramusic", "rbsonorizacaorj", "djwagner_lins", "juliocesar91oficial", "alan_mundial_iluminacao", "rsproducaoelocacoes", "aguaalcalinaionizada_to", "djeltoncesar_", "djcasojr", "demetrio_l_campos", "eltonlelia", "denise.torquato.982", "emerson.guimaraes.18062", "dj_juninhomix", "antonioandreamancio", "luminaireluz", "arthurgondim", "som_renato", "r_alessandro", "enpinglaikesi", "playsonoraestruturas", "thiago_carriel", "maurodlucas", "agl_iluminacao", "lipenapoli", "leone.rogerio", "tiagoborges0", "djchiquinhovaldecir", "gleidisbarbosa", "vitor.ourbano", "djbocao_ba", "ivannascimento.oficial", "l.e.aparedao", "jackson_oliver_teclas", "dj_edermix", "andersonschmidtcantor", "renato.silva.94801", "f7.som.iluminacao", "edmilson.djgago", "gabrielgottschalk_", "calegarieventos", "paulocardosocle", "jr_allvess_", "wanderson.carvalho.7965", "ancelmo_teclas_oficial", "o_tiago_silva", "djmarquinho_oficiall", "vipproducoesdj", "francisneyalvesjunior", "giovanicortopassi", "djfrancisofficiall", "alex_piinto15", "ykaronamedida", "marcoaurelio6087", "wemersonmachado801", "djhenrriquefreitas", "maguila_som_e_teloes", "djmocotoo", "assistecmoc", "andre_dos_teclados_oficial", "triomoraloficial", "matheuscfischer", "renatoiluminacoes", "quadracustica", "mota_somiluminacao", "fabriciocoronel1", "popsonorizacao", "aurelio.oliosi", "djgringogadash", "djrafaelfarina", "marciopopsonorizacao", "alexandre_maiaoficial", "csmproducoes", "lhscoelho", "elmatheusmello2", "stefani_stival", "sergiojuniorjpa", "renancrlos19", "_heltonborges", "candeoliveira", "nathanbaratella", "wilker.calouro", "luizvictordj", "reisproducoeseventos", "igormachadobreder", "ejtc0110", "claudioeventual", "paulorodriigo", "lumosrj", "jajadortaoficial", "ronnie_fisio", "igor_perpetuo", "beto2reis", "starlightsomeiluminacao", "juliano_caramano", "equipedjs", "wclean_higienizacao", "mindobritto", "diditecnicoap", "berghjunov", "weslenaquino1", "djnenedalpra", "bebopsomeluz", "machado3822", "sonorizacaoroberto", "juniorkeops", "lucaslima0209", "pedro.calheiros.56", "djstefanohass", "joao_r03", "igorrodrigues.98", "antonio_peao", "marcos_oliveira.dm", "ojoaoemilio", "luispierre24", "addomeventos", "binhodevaldominerio", "mraraujoproducoes", "jpeventoos", "fabianpovolo", "beto_forrodumoral", "lamaiormusical", "viniiciussousa_", "lazaro_marquesom_", "sergiosomluzeled", "leonardoorth", "wendsonlummiluz", "alessandro_fernandes", "markinhos.dj.tec", "henriquecantor.oficial", "pontoaltolocacoes", "abramofeletti", "djcristianolima", "paulooliveira.1", "acnsomeluz", "dudumorenooficial", "mmledshow", "fabio.ferreira.948494", "pretel_dj", "_techouse", "thyago_proline", "lazaropaulino40", "_betogomes10", "djnandope", "pimposomarcilio", "dkbatidao", "jonessonorizacao", "steve.stienen", "pedro_peetch", "st.eventos_", "rubinhohaniel", "ljose0133", "ms_samples_", "paulohenriquelp2", "evertonhf", "jefersoncavinadias", "thiti_almeida", "borasomproducao", "lucaslagni", "djneybacinello", "djserginhogarcia", "sistec_cidadenobre", "renanrodriguesoficial", "gelson.junior.545", "rogerioreve", "jeanperosin", "rn.sonorizacao", "wandersonwsom", "caiojoaquim", "arthur.luz.9066", "andreluis994", "salvadoriluminacao", "s.paganotti", "gugumixlajedo", "denniodeejay", "joao.paulo_1001", "pr.rubinho", "paulinhalimacantora", "djone_gorck", "eduusaa", "steinporto", "espacobrunuseventos", "sidneysonorizacao1", "maicom_zanetti", "betterlightingcn", "bandamegusta", "tvjaguaretamaofc", "lamparina_som", "vj_silvamatheus", "mateusgoncalves349", "k2.eventos", "powerlightestudio", "alta_costura_sob", "toinho_som", "djclaudioleao", "dhiancarlo_jodelle", "diegosantos9544", "julinhoavila90", "robertogiuliani", "raafaaoliveiraa", "ramonpessoajf", "marksomshow", "wbpaineisled", "bandagitus", "shingvj", "itasomeventos", "alvespereiraalisson", "rafaeventos", "joni.schulz", "barprimeiraopcao3", "dj_mariano_oficial", "mancoscordeiroiluminacao", "marcellolemossal", "sogeradores", "felipegamaof", "marci.o", "alissonxiclin", "djrodrigoalmeida_", "laidenssmedeiros", "diegues_percussa", "ddlproducoeseeventos", "djjoenabalada", "gustavo_fontoura", "queirozpaulovictor", "maiconm2", "dj_yagooliveira", "felixmartins40", "wallyson_e_wallescka", "rj_producoes_pe", "mastersom_led", "dmxshopsp", "roxhamarcel", "j.tecladista", "x_igorkross", "max_video_producoes", "bruno_augustosr", "polymattos", "dudunoleto", "igor_mixx", "marcelofgredo", "kayky_led", "ricardoamano", "daniel_bracho_37", "mohamad_zein05", "michelsilvafoque11", "horacioht", "vinijastes", "marcelo_demori", "guilhermeguimaraes.mkt", "_eduardo_milani", "rodrigocaarlos", "fabriciolwerneck", "acheson_mattos", "dr.alessandromarques", "falo_nadaa", "alexsandrow31_ducho", "helderg.neves", "pbragatto", "betobellinii", "startled.ce", "joaoreisaudio", "sanguelatinooficial", "waldemiralvess", "gm_entretenimento.2023", "marcosdkalla", "marcosferrattini", "neojaime", "eng.clebersond", "kikoparanhos", "felipefigueiredo.arq", "crifatecnologia", "r10_pinturas_", "produtos_de_limpeza_sf", "djraffaoliveira", "deyvison_bovolim", "sanclairsansom", "sylviodib", "jonatasferreira104", "crisadiers", "du_ebc_eventos", "topsound.digital", "bebelagjc", "bakeventos", "darlanrocha_", "sigasuummit", "anderson_bertuol", "evertonk9", "ttoninho.pereira", "mobitecservicos", "fernando.covre", "vanderleihamplytude", "brunopereiragomes", "edgar.techfest", "leandroribeiro0309", "djjohnoliveroficial", "jhesary", "edumixpro", "selectprime_carrefourvalinhos", "eventos_branco_", "adelso.costa.731", "cesarcapeletti", "xande.severo", "infortaunet", "djwsomeluz", "gilvan.luzcenica", "riicfreitas", "josa.sabino6", "phpaulohenrique25", "julio.dt", "mark_davyd", "lmelo7", "douglassena92", "sandro.rhema", "viniciuslinsdj", "andy.mullerr", "lucasugeda", "forrosuperid_", "ghabrielbylla", "magnosonorizacao", "junior_topiluminacao", "rodrigobps1", "robsondiastecladista", "alexandre_dos_reis_", "djmarcinholasershow", "ricardosantana100db", "heitor_grang", "eletronicadosom", "luciomar_ferreira", "andredjcosta", "crispossette", "arthureduardo885", "gabrielbranco74", "djhevertonalmeida", "natanrosaf", "daniel_projeto", "juniorcastroo", "moisesprado23", "rodriguesrogerioteixeira", "ivo_carrilho", "guilhermepontieri", "djeliasfox", "leandrosilva509", "dj_lz_oficial", "whitedj100", "follmannvanderlei", "primer.someluz", "globalproducoeseeventos", "fhabinho_pereira", "crismutt", "rioartes_entretenimento", "hueinerlessa", "marcusmonteirosilva", "playdayeventos", "djfernandosomloretonunes", "rolandercristiam", "prmarcoscamillo", "tadeubortolini", "rd_locacoes", "souzacarmobotequim", "eletricoboca", "alifeoliveiraa", "vanderluciobezerra_", "dj_casamentos", "djgiba_rg", "maykecrispolini", "ciiluminacao", "vjbol", "scutari.som", "george_ignorant", "maju.wrr", "luiznoworld", "djoujp", "intermedcars", "brsomeiluminacao", "heitormassi", "dj_rodrigo_eventos", "glauber.santos.904", "bandaricardoesdoforro", "bagagifestas_eventos", "m.b.n_som_iluminacao", "jotasaudio", "douglasporto88", "amaraljuniorcantor", "davidbarauna", "djharrysonsomeluz", "djjuliocorrea", "jorge_doda", "rodrigodelimasilva.adv", "extruturanenesom", "ricardopessara", "djrenisonvipoastrodosritmos", "bilton.edward", "silviobarbosa.barbosa.9", "diegomesquittta", "wdlles_cassimro_", "nelsondeoliveirajaros", "versati_producoes_som_e_luz", "rbrunodj15", "prdanielantonio", "jhonathan_nevees", "douglasmaurerph", "book.som", "djleo.mourao", "marciocoelhobass", "davi.iluminacoes", "paulinhopseventos", "djbadboyudi", "ri_paulo", "albanosilvadossantos", "djconradofadine", "robertodiaspr", "playiluminacao", "rony_carneiroled", "renato_iluminacoes", "thiago_fraga_moreira", "lata_luz", "wandersondjconde", "ife.rrari", "claudemiraparecidomar", "idseventos_oficial", "djrodrigoleite", "bn_sonorizacao_", "djweberevangelista", "jc.distribuidora_de_bebidas", "djtomateoficial", "mailson_almeida91", "juniorribeirooficial", "valmirdiogenes_", "max_maciel7", "cauamellolights", "andinho_bondmais", "gabrielfeliciano0", "padomapro", "eldulefestas", "fabinhoemaciel", "simervalsantos", "dj_marcio_pascarelli_", "marcelomaurodas", "luan_teclas", "fabianedio", "pedrojunioearaujo", "eupelegrini", "marcelloalb.bjj", "paulinhosom_ilumi", "djelisonnewage", "alexx_luzz", "zedafenix.oficial", "mellanciadoacordeon", "geovanessoom9", "felypeostentacao21", "henriquesomeluz", "djxandee", "romulo.g.martins", "eduardoricardo12", "cerradolocacaoeeventos", "cl_producoes__", "_fabiano_ramos", "dj_jhonymartins", "djmarcelosom", "anderbduarteled", "lluuizamarquess", "mksom18", "djodair", "rogerinho_do_brega", "jonathan_brit0", "caramelo_operador_free", "eduardo_gd_", "allanomoralzimoficial", "leonidas.amorim", "andrebragacantor", "ci.parizotto", "douglas.fonseca15", "djmarcelinho", "vanderso.r.31", "oneplay.midiaindoor", "tanercruz", "angelo_marfuss", "zobiak", "kengaocantor.oficial", "jason_la_fiestabh", "bentao_e_banda", "andrearaujorec", "andrelins0ficial", "marcellodt", "armandoproducoes", "conde.recreacoes", "netojhones", "rodrigomaneco", "dj.vinhas", "giropop360", "portifolio_pro", "ederlanfabio", "djsmarcosmontanher", "kiko_silva_fb", "luizfernandezoficial", "pacheco.h05", "guterres.neri", "guipowersound", "artinluz_eventos", "somaquarius.umuarama", "tgentil07", "theedurocha2", "iluminareneon.rj", "jones.dias.737", "somdafesta", "djmazinho_oficial", "gelson.campos1", "marciavieirapro", "vandreamorim_", "etenoelsantos", "henrique_lh", "ebenezer.sb2", "josedansantos", "jrprodutorace", "gugasonorizacao", "wsoundeventos", "djandersonpontes", "brunoandrade_ios", "hebert_voz_do_deserto", "josejoelsonmoraisbatista", "alvesjoedison", "renan_rangel_2r", "sergiotoledo01", "dalton.masson", "wh_leds", "djhugoluiz", "evertonmarques531", "rafanocomando", "gfachadas_acm", "dj.serginho.santana", "diogo_sousa01", "diegocoscobaoficial", "djpasquat", "araujojossineipaulinode", "mauro_sro", "onelightkarl", "inglessomluzeled_", "fabiosantanape", "eugenioejuliana", "ferreiravagner16", "jota.nunnes", "marcelo.macedo.31337", "showsjd", "welitonledmix", "xgdlaser", "luis.cantor.351", "carlosgalvaao", "marquinhosomeluz", "djrafamiotto", "danielmoreira366", "muller_castro", "adilsonlucianoitatiba", "polysiluminacao", "ciprv_brumado", "studiojm74", "pedrosilva.pe", "luiz_luzzi", "jpfestaseeventosoficial", "alberto_som", "eltonolliver", "buffetcheioderecheio", "magrao.da.luz", "alex.garcyaoficial", "shoes.thata", "slim_somluzimagem", "brunonardotto", "djbetinhocapivari", "juniorlighting", "danilocostadj", "anthonyshowseeventos", "guihh_matheus", "lucaseeventos", "djdanieleobicho", "djadamsmarlon", "dj_bruninhoqualidade", "taciomix", "lucianosanchesr", "djgranada", "leandrogiffoni", "raelleony", "gabrielsilveiraok", "diegogomes.jf", "diivelar", "leandro_maldini", "netoprobox", "thiago_siilva02", "wf_producaoeeventos", "diego_souza_producoes", "lsrael_ferreira", "teresinadivulgacoes", "leandromaritaca", "michelburnymdj", "mayracavalcant", "ro.berto6142", "djmarcelostz", "alcebiades.neto.1", "rafatjcs", "daanarauujo", "kapsula_eventos", "leonardovogelde", "mj_grafica", "williampereira569", "djjefinhodias", "fabio.deyvison", "viu_fest", "tendamixcidmix", "alendeguedes", "pelicano.eventos", "tchulinnicolini", "santanaprintbsb", "tiolenexavier", "alandelox", "gabrielpublicidade", "gustavo_eventos", "c3iluminacao", "joaofinacio", "luck_producoes_limeira", "daniel_telaomix", "jonathanfabio1620", "douglas.lobato12", "lucasroucas", "felipeeliass", "neto_caselli", "viniciuzf", "joaodilson", "kelvinprado", "alexramonmusic", "cristianogrilo", "tsumani_monster", "_davilow", "djthunder_glauco", "djcurtisom", "alexmahal", "montelesjulian", "wendelgraupner", "duduacordeon", "samuel_linhares78", "bisteca.eventos", "edson_luiz_s", "ducavalcantir", "romancheluzeled", "dscalle", "rubinhofc", "ericsonferreira1", "juliocesarpiccini", "hytallohiang", "simaodosreis", "silvanycanopus2017", "dorileolucas", "rodrigobioneph", "ihissa4u", "lucianoribeiromendonca", "nf_locacoesparaeventos", "djlucasfagundes", "midia_stream", "andrecosta170", "djamaraal", "db_do_paredao", "andersoncola", "augusto_sonorizacao", "danielbragantin", "alvarocabralneto", "w.e_iluminacoes", "gualbertojunior", "jeanstradiotti", "lima_father", "egtoncosta", "tafarelsilversom", "wanderleyimpressao", "andrelmarx", "gustavo_henrrique011", "willian_tofoli", "diego_custodiode", "marceluzfortes", "liveupconsultoria", "gsaudiovisuais", "joaosomvip", "gutoman", "digitalmixdj", "felype_de_oliveira", "johnathanfp85", "sagainfo_informatica", "hgeventos_oricelio", "sourafa", "aaacoutinho93", "dj_lucioap", "sam_.mendes", "oscarmuvluz", "marceloprata81", "tim.eletrica", "odimarreis", "th1agoalmeida", "newtimeespumoso", "atomixeventos", "playsoundcba", "topgrideventos", "wgton_nunes", "rodolfolopesoficial", "rushbarechoperia", "elieser_salatiel", "rodrigojeova19", "audioluck", "luanpiintoo", "mastersomrv", "bahiaestruturas", "furtadinho_produtor", "wanderson_teixeira_", "kellyson_mix", "digital_midia.com.br", "rogerio.clemente.104", "djalisonmagalhaes", "glaudion_goncalves", "arq.fredcarrijo", "douglas.marcon", "caio_macksuel", "everton_som_iluminacao", "optimizaaudio", "jardelferre", "ricardovidaldj", "luisoliveira.12", "vinniciusdk", "djalysonmatos", "djsamukafelippe", "hallanschuertz", "rafaelbertoli87", "anderson_caceres_benites", "lucianobingool", "dj_diegobenatti", "pezaoeventositu", "rneto_", "fotocabineestiloearte", "vcorrealima", "claudio_peruzzo", "maninho_dj", "angelo_santos_silva", "fgasparoficial", "victormeirelesmoura", "douglas.carvalho.125", "jairovenancio", "evertonmattner", "ederantonio.silva", "andrealvescartao", "eu_diferenciado", "filippealexandre", "true_p5", "thiagoribeiromg", "michaelsouza.mbs", "charles.noxx", "ninjaaudiomusic.py", "luccas.eventos", "renatoeuropeu", "gtledpainel", "topdjjeann", "cardosodevargaspablo", "leosompe35", "negrodell", "jvcenica", "emilioazullight", "_superaudio", "danilo_almeidac", "ldorileo", "mauricio.gamba10", "arca.digital", "djpitico_oficial", "magnocosta.dj", "joaogabrielalbertoni", "asip_eventos", "leandro_neri", "guilherme_geretti", "ryantravenzoli_", "cristiano.cr_iluminacao", "thiago_csantos", "rapha_fernandes_", "danilo.graf", "eraldo_dj", "matheusrere", "djcaiooliveira", "msprodeventos", "casa_da_informatica_snp", "vinnytx", "janderson_pietry", "brunoithamar", "niedsonsanto_oficial", "lleo.rc", "djphillipericardo", "ederson.s.araujo", "djjuniorck", "djrafapiccini", "jairo_bezerra_dj", "jancastelobranco", "murillolima_st", "id_rodrigues26", "sonica_som", "vitorinecantor", "raulfesaro", "hussein_prolightuk", "djsailuminax_oficial", "lucasclm._", "edsonllevi", "bruninho_danttas", "djeduardovilaca", "lukaslimasax", "artesdodu", "djvictorcarvalho", "cristiano_ricarde_", "jardel_camurca", "pllighteventos", "p85junior", "as_adrianosilva", "henriqueoficial75", "divancarloss", "felipearnosti", "luciano_3l_sonorizacao", "alan_meanreal", "allanimportspgm", "jorddihoffman", "mab_martins", "fellipeaalvarenga", "matheusonorizacao", "cerimonialcruz", "djfelipebrother", "lorrainnysthephany", "alibertiricardo", "gt_audio", "sonorasomeluz", "rafa.drums", "light_ingshow", "robson3reventos", "djcaioeventos", "dj_dan_producoes", "juniorvisosul", "rotazerobanda", "fhellippalves", "philuminacao2022", "dvjmarcelinho.vj", "valdeci_carval", "cintrasonorizacao", "paulosilvavj", "artdigitalsoundeled", "nicholasprieto", "fsiluminacaoeeventos", "fernandodasilva_souza", "djfelipeaugusto", "guipanseri", "djleandrinho__", "emanuel.max", "ed_magalhaess", "rike_light", "hokaahmagic", "facil.iluminacao", "jujumix2015", "showmarcelo", "junior.jacobi", "digao1984digao", "crisnaty21", "derlynsilvestre", "aguinaldopopsom", "adrianoazevedo7", "som.master", "statys_festa", "dj.anderson.mendonca", "abnercf.07", "luizchavess_", "perfecteventosbz", "leandroluzz", "evensound", "djpaulinhorodrigues", "eyeledoficial", "sw4producoesartisticas", "marcelinhocolombo", "alexsandro4010", "thiago_pp1", "andreluiz1_", "franklin_diniz", "contraluzeventos", "brunodaonlineoficial", "boresso.sonorizacao.iluminacao", "tiagoimportlight", "bryanbreno", "jovani_pucinelli", "_daniel_souto", "som.marcosr", "gkustersonorizacao", "ninogoes12", "kelldj", "eriqueluna", "iluminador_rodrigo", "wmiluminacoes", "edielsonshow", "raidiluminacao", "elizeu5407", "djgersonosasco", "leo_villela", "vicente_c_amboni_vca_taigar", "lucasnassar23_", "diegoschaabdj", "digolight", "flippersom", "pieterdhjr", "juniorhotsom", "empreendimentosprado", "zbagaca", "djthiagomatias", "degas.omenino_dos_leds", "ubajarasilva", "joelson_fsilva", "ramaianakennedy", "thomazgouveia", "mart_edc", "roger.rgsonorizacao", "ireneistop", "legalmart_rb", "julianopaimdj", "simon_uls", "robersonlightt", "megailuminacaoo", "servarawsten", "thallesmarinho.gt", "djcharlessantos_oficial", "weltonformiga", "lucaspaivasomeluz", "gilson.jordao", "charlles_muniz", "hscasepro", "gabrielavilatec", "rossicleade", "rafa.keyboard", "leandrorapasound", "getpremiumoficial", "wiliam_soares1", "nobertinhovaz", "djmarcosmr", "denilson_luzled", "betty_eralighting", "stagelighting_era", "mateus_som_df", "leonardosales23", "wendeldj07wxl", "dj_recruta_oficial", "pro3.group", "djtuliomuniz", "jonhfelype", "audiovicbr", "aluisio2021", "marcoaureliomts", "sandroilumi", "djmaramar", "gray_rooster", "beto.bolla", "brsound", "lamounier_eventos", "sonimedeiros", "dalvinoiluminacao", "wellington__pedroso", "p.publimidia", "willianmullerrigolin", "guitalima", "vogel.leonardo", "leodiassantossantos", "festline.eventos", "sergioluizsom", "sinesioprimo", "carlossvianaa", "kellvy_mix", "klebes_alves_torres_", "djdenilson_rodrigues_ofc", "pedrobertoncelli", "jeyzonleonardo", "bandaxr9oficial", "marquinhonascimento10", "matheusdesignreal", "m2eventos_com", "klklighting", "leandrobragaeventos", "eduardo_pere1r4", "djpyano", "thie_silva77", "ailton.passeios.turismo", "elviopizzi", "zearaujo80", "rafa_cxp7", "donatoalmeidamartins", "rauldecampos.eventos", "gteclas_oficial", "dornellescledsom", "grecosom", "katany_production", "sebastiaodossantos.oliveira", "cristinaanunciadasalvino", "piabamaciel", "japaolight", "eucassiocosta", "xandiaudiocn", "rdmsonorizacaoepublicidade", "willianssaturnino", "alex.light22", "trabalhe.em.casa2023", "cyntiacapo.soares", "dylannflorentino", "felixiluminacoes", "djmaaax", "hugopassos", "dj_gil_bits", "djalissonmool", "higor.albuquerque_", "pedro_bertolin", "pierre_light_iluminacao", "eccusproducoes", "dej_eventos", "lucianothomazinho", "andrepankadao", "sergiolobisomem", "marcos.bozo", "infinitylederechim", "jack_stage_light", "vitorhugonois2", "deboracosta1906", "celebre_fireworks", "alexandreestacao", "djhericoheynan", "andreschmitt21", "dj_paulinhomattos", "canal_agrovertentes", "leonardo_alves_dj_leo", "fredelacerda", "caique_paredao", "vorlane_lighting", "claudio2888", "wvaaudio", "thiagorinker", "djmarcosgv", "ladilsonvital", "gustavocardoso013", "bonetisomeluz", "dj.adilson.midiasape", "perinzilda", "d.s_producoes_", "kassandrarodriigues", "ricardoweis", "jeffersonribeiroteles", "thaleslight", "djwashington_wsom", "alexligthing_", "alexpirulitodrummer", "caiosom.estruturas.paineldeled", "djrafaelmelo", "vasonorizacoes", "ds_sonorizacaoiluminacao", "djpedrols", "madalena.nicolodi", "vibeledbh", "cleynercandido", "mlsstorebr", "shuning_stagelight", "fantasiasdeamor1", "eucutia", "reaeventositajai", "hseventossomeluz", "ggsolucoescomerciais", "geovani_antonio_gabriel", "mgluzeled", "evertonmofaia", "jadsonsilva_dj", "danields20", "luadilsonkappes", "hitcasebrasil", "alorinogustavo", "riquecardosooficial", "dant_som_eventos", "dj_andre", "kikadinhaoficial", "lucknobre", "wesley_lighting", "positivasomsonorizacao", "fabianamonteirorm", "douglaswintrabartolo", "jairdo.do.nascimento", "hbl_console", "alex_avilaeventos", "afs_solutions", "leandroalopes", "jeronimo_alexandre_rodrigues", "wendelldj_oficial", "jbiluminacaojb", "fabricioprattes", "showdesom", "giliard.lopes.3", "guiwill_00", "ivisomproducoes", "rodrigues10.lr", "douglasrodriguesluzeaudio", "eduardoantoniodm", "thales_1310", "victorbompan", "davidprojeto5", "gabriel_pgs", "sergiovelososilva", "gonc.alves486", "ricardojorgealmeida_", "sandro_fsa123", "proseteventos", "wlaudiopro", "luzlight512", "fabricio_raphael", "thiagoqueiroz09", "betinhodelaloy", "erismardoacordeon", "fabiomaral", "imep_audiovisual", "birola_iluminador", "braulio_morais", "thiagogomes.jfmg", "rodrigotcsantos", "oadrianotosta", "alineestruturas", "marcoslucio_ck", "ajuniornave", "guilherme_luz_led", "mauricinholight", "projetozandraxx", "educasulo", "studio10poa", "eliud_moreira", "lucianogv2019", "bhetoprasnievski", "pr.wemersonlima", "reparomac", "r.perninha", "starsom_acre", "italo_douglas_santos23", "thiagosantos111037", "bene_cabeludo", "maxwell_mix_led", "mauriciodejesusromero", "vinicius.gul", "fabiopazzine", "leo_pointdaluz", "mataraia_sj_barra", "laison_ferreira", "kings_light_01", "viniciushm33", "vinnysouza89", "bruno_lacerda_iluminacao", "gustavoafmonteiro", "daniellopes.32", "artecenicailuminacao", "zequeirozpc", "miojo_guita_iluminacao", "raonyiluminacao", "montefuscoeventos", "maycon_prs", "caldas_banheiros_quimicos_", "tr_som_e_luz", "_tavinho2023_", "deyvidsoliveira", "matheus_mix_", "luizhenrique__costa", "vivianegoes12", "_lucassrj", "skarsomeventos", "profanoficial", "leo_castelo_b", "felipe.campos.barbosa", "meira_2023", "djmarinildo1", "pro.audio_", "techledspaineis", "wadsonbubinha", "marinildoiluminacoes", "djvaguinho_", "pousadasolardailhagja", "tomiluminacao", "claudiobragga", "luizjp1", "claudioembuscadabatidaperfeita", "gv785663", "soneka_light8", "cassyorauber", "delighting91", "thiago_led", "brunapelegrinii", "duplailuminacao", "cesar9547.augusta", "fredluziluminandoomundo", "giovannipasquagxp", "bucafonseca1", "pierre_panatto", "mauriciospichler", "franciscolightdesign", "viviannegiacchin2", "pauloarthuroficial", "prjulianoaragao", "edsontecnico", "jagutobr", "estacaodosommg", "morcego_roadie_", "silvanojuniorsouza33", "minoro_som", "ricardoaliberti", "krause_kleverton", "luanzinramos_", "gildevanproducoes", "raphaelpinaoficial", "expeditomanoell", "herbert_santos_", "gleydyjan_carvalho", "costaalexsandromartins", "flaviosproducoes", "eu_andrefelix", "pllasticaetal", "dj_pettrus", "cristiano1989menezes", "mdestruturas", "eviproducoes", "israelfelix01", "suzy_cantoraoficial", "djkaleb", "celitoborges", "djrodrigobatalha", "verner_dj", "datdiniz", "darama_linguicas_artesanal_", "tufy_eventos", "olavomendesn", "andre_daniel_araujo", "osmareventoscf", "lucasomcgs", "ogroled", "alti.eventos", "genival_gregori", "danielsylverdj", "mwaudiopro", "songpebasofc", "tintimbonfim", "bassmusicsom", "halleysom", "gleiceane.kl", "volts_sonorizacao", "fazollomix", "bandeirasom", "artecentercomunicacao", "lightadriano", "mariahilda.barros", "carlosfernandesprodutor", "camila_rodrigues_msm", "romielgralak_rg2producoes", "digodapola", "company_audio_video", "thiagomanussom", "witalo.iluminacao", "alderi_mix", "swan.audio.system", "guivenancio_019", "storesoundbr", "djraphaelalmeida", "ronabsonmartins", "chiquinhosoares2k", "aerolight_1995", "rplight_iluminacao", "zycleddisplay", "hssomeluz", "genilton1975", "murielcogoangonese", "jasielbernardo", "sandrocosta_vm", "adsom_oficial", "_danybrand", "rubao_shopmusic", "netovillatexana", "polianna.santoss", "mt.creis", "dusomeventos", "pittlight", "rivarenato", "schuck784", "vanderjuniorgk", "djedubh", "grupomroficial", "leonardocamposhonorio", "evandromix_oficial", "jardeldj", "dj.mazzo", "andersondjbabaloo", "as.sonorizacao.tb", "victor.vzc", "marciosompompeia", "brenoemarcianooficial", "thiagocardoso_thiago", "ed.freitasss", "marcelodantass2", "fabio_spl_audio", "leonardohenriques.br", "java.tec.som", "jk_iluminacao_", "sergioazevedopr", "paredao.jm", "df93freitas", "doctordoled", "andreh.light", "serginho.som", "thiagosantos11103_iluminacao", "mauricioburi", "sidinei_prado", "claustok", "jackson_proset", "manzidanilo", "martin_philip05", "statussom", "iluminadorchicotao681", "jobinho_iluminacao", "xico_lumisul_eventos", "wgengenhariaeacustica", "tecnicowaltinhooficial", "x_truss_estruturas", "adilson_quirino_m", "castorsom", "eduardosantos6642", "denis_teixeira", "sosomsonorizacao", "boy.roberto.boy", "d.j___payal", "universoshowprodutora", "amsolution360", "edu.correa95", "pedro_marinho2234", "roberto_almeida_light", "edigonsangon", "rioclarocorretoradeseguros", "rodolfodomanico", "kennedy_ribeiro", "wagner_wsom", "maurisv10", "zinholight", "marcio_farias_soares", "vandi0805", "leticiasantos1625", "izaiasmarciano", "edu_lightdesign", "shalomrogerio", "francisco_matosjr", "edivaldo.santos.71216", "cybernetdivisores", "leones_sonorizacao", "moisesstake", "dionesosorio", "ramoneduassuncao", "jamersonhenriquejh", "loc__light", "maxsousadj", "lehsantos767", "hibrido_design_", "putz.midias.digitais", "lucas16salla", "lucaskiary", "fabriciozanardi", "840.232.624", "daura_atelie", "xuxudmx", "ap.iluminacao", "_phproducoes", "jhony_ulissses", "feijod90", "vavayunity", "pericles_merighetti", "cleitonpgoficial", "gerson.mauricio.399", "omegasolucoesinteligentes", "kalyteroseventos", "maiconalmeida613", "promusic_sonorizacao", "camargo.producoes", "claiton_saatkamp_batata", "valdecleiantunes", "rcaeventossc", "lhsom", "lucasbbielik", "jcgsom", "djguiguioficial", "rogeriocostailuminador", "theo_cowboy", "ga_producoes_", "raphael_pin", "franciscoadrianoreiesdo", "marioshow1000", "elizangelamarques43", "radiomilenio1029", "acusticosc", "leonidas6880", "daniel.mnegreiros", "paulo_appelt", "tubisom_460", "markimmix", "marlinho_light", "walterviudesjr", "anderson.tecnico84", "roger.limalima.779", "sandrotecnico", "claudiomota111", "conradojunioroficial", "marce.light", "beto.simoes", "mellogibson", "rfpizza.burger", "marco_martinatti", "thiagocardoso5255", "pl_lighting", "djpaulosantana", "gatinha_1313", "gerondinpassos", "edivaldocosme_crf_csc_cec", "thelight.poa", "fabio_rogerio_batista", "patrickttr", "paulao_light", "gui_cintra", "master_banda_show_", "cadusomeventos", "chicotecnicopahotmailcom", "vatsik_wojciechowski", "marcinhobarioni", "adilsonrcaeventos", "jocaluz", "fan_audio_nancy", "denebatera_mix", "victorhugoavelino24", "alvaro_tejeda_ulloa", "diegobarbosasom", "emilcasseb", "piaui_luz_", "pedrotec", "setegustavo", "joaocarlosfleury", "tiagocorrei39", "linolight_71", "guikancelskis", "jhsomeluz", "romulopressao", "cassiomanussom", "oo_tal_do_diego", "juninhomarquesani", "fabaoultrailuminacao", "emiliovilson", "marnevinicius", "lucas_iluminador", "bebeto_kassula", "vmatheusantunes", "markinhops", "landim_1", "wolf_weber", "ralph_corona", "paulo_roberto_light", "ibraim_janez", "iuri.75", "julianodosom", "gustavonicolight", "felipe211880", "pretinhoiluminador", "dudubala0", "danilorodriguesdesouza", "wagner___emidio", "clayton_lacerda_kura", "fabiooperadordeaudio", "ducaluz", "kentolighting", "quicalima", "maicon_light", "iltonaudio_", "caiomachadoprodutor", "igorgenius", "carlosalvesmauzinho", "ademir.rodriguez", "andre_ortiz_querido", "mfpagotto", "rodrigousy", "bandasa.oficial", "danilokabeca", "babaprodutor", "tiagocoelho_light", "fernandoayalajimenez19", "luz_na_veia_", "ewertom_piemonte"];






// const { google } = await import('googleapis');
// const sheets = google.sheets('v4');
// const spreadsheetId = '1lSl6VUYmp0c32Gu8qwlbtJ-BGdl1gKXB9YC4thffSOk'
// const sheetTab = 'DADOS'
// let sheetLin = 0
// const authClient = new google.auth.GoogleAuth({
//     keyFile: './src/resources/api.json',
//     scopes: ['https://www.googleapis.com/auth/spreadsheets'],
// });

// async function lastLin(inf) {
//     let ret = { 'ret': false };
//     try {

//         const auth = await authClient.getClient();
//         const range = `${sheetTab}!A2`;
//         const response = await sheets.spreadsheets.values.get({ auth, spreadsheetId, range, });
//         ret['ret'] = true;
//         ret['msg'] = `LAST LIN: OK`;
//         ret['res'] = Number(response.data.values[0][0]);

//     } catch (e) {
//         ret['msg'] = `LAST LIN: ERRO | ${e}`
//     }

//     if (!ret.ret) { console.log(ret.msg) }
//     return ret
// }

// async function dataGet(inf) {
//     let ret = { 'ret': false };
//     try {

//         const auth = await authClient.getClient();
//         const range = `${sheetTab}!B${inf.lin}`;
//         const response = await sheets.spreadsheets.values.get({ auth, spreadsheetId, range, });
//         ret['ret'] = true;
//         ret['msg'] = `DATA GET: OK`;
//         ret['res'] = response.data.values;

//     } catch (e) {
//         ret['msg'] = `DATA GET: ERRO | ${e}`
//     }

//     if (!ret.ret) { console.log(ret.msg) }
//     return ret
// }

// async function dataSend(inf) {
//     let ret = { 'ret': false };
//     try {

//         const auth = await authClient.getClient();
//         console.log(auth)
//         await sheets.spreadsheets.values.update({
//             auth,
//             spreadsheetId,
//             range: `${sheetTab}!B${inf.lin}`,
//             valueInputOption: 'USER_ENTERED',
//             resource: { values: [[inf.values]] },
//         });
//         ret['ret'] = true;
//         ret['msg'] = `DATA SEND: OK`;

//     } catch (e) {
//         ret['msg'] = `DATA SEND: ERRO | ${e}`
//     }

//     if (!ret.ret) { console.log(ret.msg) }
//     return ret
// }

// async function fun() {

//     const retLastlin = await lastLin()
//     console.log(retLastlin);

//     const infDataSend = { 'lin': retLastlin.res, 'values': 'Ola' }
//     const retDataSend = await dataSend(infDataSend)
//     console.log(retDataSend);

// }
// //fun()








// const { api } = await import('./api.js');
// const { fileWrite } = await import('./fileWrite.js');

// async function teste() {
//     let ret = { 'ret': false };

//     try {
//         perfils = [perfils[0]]
//         for (let i = 0; i < perfils.length; i++) {
//             const perfilId = perfils[i];

//             const infApi = {
//                 url: `https://www.instagram.com/api/v1/users/web_profile_info/?username=${perfilId}`,
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'x-ig-app-id': '936619743392459',
//                     'sec-fetch-site': 'same-origin'
//                 }
//             };

//             const retApi = await api(infApi);
//             console.log(retApi)
//             if (!retApi.ret) { ret['ret'] = false; }
//             const res = JSON.parse(retApi.res.body);

//             const infFileWrite = {
//                 'file': `PERFILS/${res.data.user.id}=${perfilId}.txt`,
//                 'rewrite': false,
//                 'text': JSON.stringify(res)
//             };
//             await fileWrite(infFileWrite);

//             ret['ret'] = true;
//             ret['msg'] = 'FUNCTIONS: OK';
//             console.log(`${perfils.length} - ${i + 1} | ${res.data.user.id} = ${perfilId}`);

//         }
//     } catch (e) {
//         ret['msg'] = `FUNCTIONS: ERRO | ${e}`
//     }

//     if (!ret.ret) { console.log(ret.msg) }
// }

// teste()
