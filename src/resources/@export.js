globalThis['eng'] = (typeof globalThis.alert !== 'undefined'); // [true] CHROME | [false] NODE

function all2() { } globalThis['all2'] = all2; // ******************************************************** NÃO USAR !!!

if (!globalThis.all1) {
    // DEFINIR O 'devChildren' → [CHROME] EMAIL DO USUÁRIO | [NODE] PRIMEIRO ARQUIVO A SER EXECUTADO (NA MAIORIA DOS CASOS 'server')
    let devC = new Error().stack.split('\n'); devC = devC[devC.length - 1]; let devChildren = devC.includes('.js:') ? devC.match(/\/([^/]+)\.[^/]+$/)[1] : false;
    if (eng) { devChildren = await new Promise((resolve) => { chrome.identity.getProfileUserInfo(function (u) { resolve(u.email); }); }); }

    // @functions
    await import('./@functions.js');

    // DEFINIR → LETTER | ROOT | FUNCTION | PROJECT | FILE | LINE
    await getPath({ 'e': new Error(), devChildren, });

    // console.log(`${eng} | ${engType} | ${engName} | ${letter}\n${fileProjetos} | ${fileWindows}`); console.log('\n'); console.log('securityPass:', gW.securityPass);
    // console.log('portWeb:', gW.portWeb, '|', 'serverWeb:', gW.serverWeb); console.log('portLoc:', gW.portLoc, '|', 'serverLoc:', gW.serverLoc);
    // console.log(`devMaster: ${gW.devMaster}\ndevSlave: ${gW.devSlave}\ndevChildren: ${gW.devChildren}`); console.log(`devSend:\n${gW.devSend}`);
    // console.log(`devGet:\n${gW.devGet[0]}\n${gW.devGet[1]}`); console.log('conf:', gW.conf); console.log('root:', gW.root); console.log('functions:', gW.functions);
    // console.log('project:', gW.project);
}

/* FUNÇÕES */ let project = gW.project;
globalThis['regexE'] = (inf) => { return importFun({ 'engOk': (eng || !eng), 'path': './src/resources/regexE.js', inf, project, }); }; // MANTER COMO 1º IMPORT
globalThis['file'] = (inf) => { return importFun({ 'engOk': (eng || !eng), 'path': './src/resources/file.js', inf, project, }); }; // MANTER COMO  2º IMPORT
globalThis['api'] = (inf) => { return importFun({ 'engOk': (eng || !eng), 'path': './src/resources/api.js', inf, project, }); };
globalThis['chat'] = (inf) => { return importFun({ 'engOk': (eng || !eng), 'path': './src/resources/chat.js', inf, project, }); };
globalThis['chromeActions'] = (inf) => { return importFun({ 'engOk': (eng), 'path': './src/resources/chromeActions.js', inf, project, }); };
globalThis['client'] = (inf) => { return importFun({ 'engOk': (eng || !eng), 'path': './src/resources/client.js', inf, project, }); };
globalThis['clientInputChrome'] = (inf) => { return importFun({ 'engOk': (eng), 'path': './src/resources/clientInputChrome.js', inf, project, }); };
globalThis['clipboard'] = (inf) => { return importFun({ 'engOk': (eng || !eng), 'path': './src/resources/clipboard.js', inf, project, }); };
globalThis['commandLine'] = (inf) => { return importFun({ 'engOk': (!eng), 'path': './src/resources/commandLine.js', inf, project, }); };
globalThis['configStorage'] = (inf) => { return importFun({ 'engOk': (eng || !eng), 'path': './src/resources/configStorage.js', inf, project, }); };
globalThis['devFun'] = (inf) => { return importFun({ 'engOk': (eng || !eng), 'path': './src/resources/devFun.js', inf, project, }); };
globalThis['googleSheets'] = (inf) => { return importFun({ 'engOk': (!eng), 'path': './src/resources/googleSheets.js', inf, project, }); };
globalThis['googleTranslate'] = (inf) => { return importFun({ 'engOk': (eng || !eng), 'path': './src/resources/googleTranslate.js', inf, project, }); };
globalThis['tableHtmlToJson'] = (inf) => { return importFun({ 'engOk': (true), 'path': './src/resources/tableHtmlToJson.js', inf, project, }); };
globalThis['log'] = (inf) => { return importFun({ 'engOk': (!eng), 'path': './src/resources/log.js', inf, project, }); };
globalThis['logConsole'] = (inf) => { return importFun({ 'engOk': (eng || !eng), 'path': './src/resources/logConsole.js', inf, project, }); };
globalThis['notification'] = (inf) => { return importFun({ 'engOk': (eng || !eng), 'path': './src/resources/notification.js', inf, project, }); };
globalThis['objFilter'] = (inf) => { return importFun({ 'engOk': (eng || !eng), 'path': './src/resources/objFilter.js', inf, project, }); };
globalThis['messageReceived'] = (inf) => { return importFun({ 'engOk': (eng || !eng), 'path': './src/resources/messageReceived.js', inf, project, }); };
globalThis['messageSend'] = (inf) => { return importFun({ 'engOk': (eng || !eng), 'path': './src/resources/messageSend.js', inf, project, }); };
globalThis['tabActions'] = (inf) => { return importFun({ 'engOk': (eng), 'path': './src/resources/tabActions.js', inf, project, }); };

// SCRIPTS
globalThis['command1'] = (inf) => { return importFun({ 'engOk': (eng), 'path': './src/scripts/command1.js', inf, project, }); };
globalThis['command2'] = (inf) => { return importFun({ 'engOk': (eng), 'path': './src/scripts/command2.js', inf, project, }); };
globalThis['tryRatingComplete'] = (inf) => { return importFun({ 'engOk': (eng), 'path': './src/scripts/tryRatingComplete.js', inf, project, }); };
globalThis['tryRatingSet'] = (inf) => { return importFun({ 'engOk': (eng), 'path': './src/scripts/tryRatingSet.js', inf, project, }); };
globalThis['z_backup'] = (inf) => { return importFun({ 'engOk': (!eng), 'path': './src/scripts/z_backup.js', inf, project, }); };
globalThis['z_testeElementAction'] = (inf) => { return importFun({ 'engOk': (eng || !eng), 'path': './src/scripts/z_testeElementAction.js', inf, project, }); };

// *********** (LEGACY IMPORT) NÃO FUNCIONA COM 'importFun' ***********
// → FUNÇÕES
await import('./dateHour.js'); await import('./regex.js'); await import('./chromeActions.js'); await import('./chromeActionsNew.js');

// → SCRIPTS
await import('../scripts/elementAction.js'); // → 'Chrome_Extension' / 'WebScraper'
//  **************


