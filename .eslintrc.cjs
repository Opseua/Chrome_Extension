// ************** VARIÁVEIS NÃO DECLARADAS [globais] **************
let arrGlobal = [
    'window', 'global', 'globalWindow', 'fileWrite',
    'eng', 'engName', 'cng', 'letter', 'conf', 'infGlobal', 'gORem', 'gOAdd', 'csf', 'listenerAcionar', 'listenerMonitorar',

    // CHROME
    // ## BIBLIOTECAS / NATIVO
    'chrome',

    // NODEJS
    // ## BIBLIOTECAS / NATIVO
    '_WebSocketServer', '_WebSocket', '_fs', '_path', '_cheerio', '_clipboard', '_http', '_exec', '_google', '_crypto',
    '_puppeteer', '_net', '_util', '_getFolderSize', 'process', 'Buffer', '_parse', '_stackTrace',
    // ## VARIÁVEIS
    'cs', 'catchGlobal',
    // ## GLOBAL OBJECT [NOVO]
    'gO', 'gOList',
    // ## GLOBAL OBJECT [SNIFFER CHROME]
    'gOSniffer', 'gOAddSniffer', 'gORemSniffer',
    // ## FUNÇÕES
    'rateLimiter', 'getPath', 'awaitTimeout',

    // GOOGLE 
    // ## BIBLIOTECAS / NATIVO
    'UrlFetchApp', 'Browser',

    // [Chrome_Extension]
    // → funções globais
    'api', 'chat', 'chromeActions', 'client', 'clipboard', 'commandLine', 'configStorage', 'dateHour', 'devFun', 'file',
    'getCookies', 'getPage', 'getPath', 'googleSheets', 'hasKey', 'htmlToJson', 'jsonInterpret', 'keepCookieLive', 'log', 'logConsole',
    'messageSend', 'messageReceived', 'notification', 'orderObj', 'promptChrome', 'randomNumber', 'rawText', 'regex', 'regexE', 'secToHour',
    'sniffer', 'splitText', 'tabSearch', 'translate',
    // scripts
    'action_TryRating_QueryImageDeservingClassification', 'background', 'command1', 'command2', 'command2_old',
    'oneForma_MTPE', 'peroptyx_QueryImageDeservingClassification', 'peroptyx_Search20',

    // [WebSocket]
    // → funções globais
    'html', 'messageAction', 'roomParams',

    // [Sniffer_Python]
    // → funções globais
    'ewoq', 'tryRating', 'tryRating_Search20', 'performTask', 'tryRating_QueryImageDeservingClassification', 'tryRating_DrivingNavigation3DMaps',

    // [URA_Reversa]
    // → funções globais
    'leadChangeStatus', 'leadGet', 'leads', 'leadsJsf', 'login',

    // [WebScraper]
    // → funções globais
    'apiCnpj', 'apiNire', 'awaitLoad', 'buttonElement', 'checkPage', 'cookiesGetSet', 'getTextElement',
    'imput', 'navigate', 'sendData', 'clientSearch', 'clientGetData', 'clientImput'

];

// ************** VARIÁVEIS NÃO USADAS **************
let arrUnused = [
    // [infNomeFuncao] [infNomeFuncao]
    'inf[A-Z0-9].+?', 'ret[A-Z0-9].+?',
    // (for)
    'index', 'value', 'event',
    // (time)
    'time', 'time1', 'time2', 'hour', 'timeout',
    'ee',

    // outros
    'dev1', 'dev2', 'dev3', 'dev4', 'lin',
    'browser',
    'tipo',
    'element',
    'cookies',
    '_stackTrace',
    'nomeList',
    'param1',
    'param2',
    'ret',
    'res',
    'host',
    'room',

];

let arrGlobalObj = {};
for (let variavel of arrGlobal) { arrGlobalObj[variavel] = true; }

module.exports = {
    'env': { 'browser': true, 'node': true, 'es2021': true }, 'extends': 'eslint:recommended',
    'overrides': [{ 'env': { 'node': true }, 'files': ['.eslintrc.{js,cjs}'], 'parserOptions': { 'sourceType': 'script' } }],
    'parserOptions': { 'ecmaVersion': 'latest', 'sourceType': 'module' },
    'rules': {
        'no-extra-semi': 'off', // PONTO E VÍRGULA
        //  'no-undef': 'error', // VARIÁVEL NÃO DEFINIDA
        'no-inner-declarations': 'off', // ERRO DE FUNÇÃO NO MEIO DO CÓDIGO
        'no-useless-escape': 'off', // ESCAPE DO REGEX
        'no-empty': 'off', // CHAVE VAZIA → { }
        'no-regex-spaces': 'off', // ESPAÇO NO REGEX
        'no-control-regex': 'off', // DIVISÃO DE COLUNAS NO REGEX
        'no-unreachable': 'off', // CÓDIGO APÓS O RETURN
        'no-unused-vars': ['error', { 'varsIgnorePattern': "^(" + arrUnused.join('|') + ")$" }]
    }, 'globals': arrGlobalObj,
    'ignorePatterns': ['*teste*.js', '*Teste*.js', '*TESTE*.js',] // ARQUIVOS IGNORADOS
}

