// ************** VARIÁVEIS NÃO DECLARADAS [globais] **************
let arrGlobal = [
    'window', 'global',
    'eng', 'engName', 'cng', 'letter', 'conf', 'infGlobal', 'acionarListener', 'nomeList', 'gORem', 'gOAdd', 'wsList', 'csf',

    // CHROME
    // ## BIBLIOTECAS / NATIVO
    '_WebSocket', 'chrome',
    // ## VARIÁVEIS
    'cs', 'catchGlobal',
    // ## GLOBAL OBJECT [NOVO]
    'gO', 'gOList',
    // ## GLOBAL OBJECT [SNIFFER CHROME]
    'gOSniffer', 'gOAddSniffer', 'gORemSniffer',
    // ## FUNÇÕES
    'rateLimiter', 'getPath',

    // NODEJS
    // ## BIBLIOTECAS / NATIVO
    '_WebSocketServer', '_WebSocket', '_fs', '_path', '_cheerio', '_clipboard', '_http', '_exec', '_google', '_crypto',
    '_puppeteer', '_net', '_util', '_getFolderSize', '_stackTrace', 'process', 'Buffer',
    // ## VARIÁVEIS
    'cs', 'catchGlobal',
    // ## GLOBAL OBJECT [NOVO]
    'gO', 'gOList',
    // ## GLOBAL OBJECT [SNIFFER CHROME]
    'gOSniffer', 'gOAddSniffer', 'gORemSniffer',
    // ## FUNÇÕES
    'rateLimiter', 'getPath',

    // GOOGLE
    // ## BIBLIOTECAS / NATIVO
    'UrlFetchApp', 'Browser',

    // [Chrome_Extension]
    // @export.js
    'regexE', 'api', 'chatGpt', 'chromeActions', 'clipboard', 'file', 'commandLine', 'configStorage', 'dateHour', 'devFun',
    'getCookies', 'getPage', 'getPath', 'googleSheets', 'hasKey', 'htmlToJson', 'jsonInterpret', 'log', 'keepCookieLive',
    'notification', 'orderObj', 'promptChrome', 'random', 'rawText', 'regex', 'secToHour', 'sniffer', 'splitText',
    'tabSearch', 'translate', 'wsConnect',
    // scripts
    'oneForma_MTPE', 'peroptyx_QueryImageDeservingClassification', 'peroptyx_Search20',
    'action_TryRating_QueryImageDeservingClassification', 'background', 'command1', 'command2', 'command2_old',
    // variáveis / funções
    'secReconnect', 'secPing', 'par1', 'par2', 'par3', 'par4', 'par5', 'par6', 'par7', 'par8', 'par9', 'securityPass', 'port',
    'devSend', 'devGet', 'wsSend', 'fileWrite',

    // [Sniffer_Python]
    // @export.js
    'EWOQ', 'TryRating', 'TryRating_DrivingNavigation3DMaps', 'TryRating_QueryImageDeservingClassification',
    'TryRating_Search20',

    // [URA_Reversa]
    // @export.js
    'leadChangeStatus', 'leadGet', 'leads', 'login',

    // [WebScraper]
    // @export.js
    'apiCnpj', 'apiNire', 'awaitLoad', 'buttonElement', 'checkPage', 'cookiesGetSet', 'getTextElement',
    'imput', 'navigate', 'sendData',

];

// ************** VARIÁVEIS NÃO USADAS **************
let arrUnused = [
    // [infNomeFuncao] [infNomeFuncao]
    'inf[A-Z0-9].+?', 'ret[A-Z0-9].+?',
    // (for)
    'index', 'value', 'event',
    // (time)
    'time', 'time1', 'time2', 'hour',

    // outros
    'dev1', 'dev2', 'dev3', 'dev4', 'lin',
    'browser',
    'tipo',
    'element',
    'cookies',


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

