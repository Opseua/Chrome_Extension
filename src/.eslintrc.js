

// ************** VARIÁVEIS NÃO DECLARADAS [globais] **************
let arrGlobal = [
  // FUNÇÃO DE FÁBRICA
  'console', 'setTimeout', 'setInterval', 'clearTimeout', 'AbortController', 'TextEncoder', 'fetch', 'prompt', 'document', 'XPathResult', 'Blob', 'URL', 'DOMParser', 'atob', 'btoa', ,
  'alert',


  'esLintIgnore',
  'window', 'global', 'devSend', 'wsClients', 'wsClientLoc', 'eng', 'engName', 'cng', 'letter', 'conf', 'infGlobal', 'gORem', 'gOAdd', 'csf',
  'gW', 'legacy', 'platforms', 'ori', 'des',

  // VARIÁVEIS DO SISTEMA
  'fileChrome_Extension', 'fileProjetos', 'fileWindows',

  // CHROME
  // ## BIBLIOTECAS / NATIVO
  'chrome',

  // NODEJS
  // ## BIBLIOTECAS / NATIVO
  '_WebSocketServer', '_WebSocket', '_fs', '_path', '_url', '_cheerio', '_clipboard', '_http', '_exec', '_google', '_crypto', '_puppeteer', '_net', '_util', '_getFolderSize',
  'process', 'Buffer', '_parse', '_stackTrace', '_googleapisAuth', '_googleapisSheets',
  // ## VARIÁVEIS
  'cs',
  // ## GLOBAL OBJECT [NOVO]
  'gO', 'gOList',
  // ## FUNÇÕES
  'rateLimiter', 'awaitTimeout', 'randomNumber',

  // GOOGLE 
  // ## BIBLIOTECAS / NATIVO
  'UrlFetchApp', 'Browser',

  // [Chrome_Extension]
  // → funções globais
  'api', 'chat', 'chromeActions', 'client', 'clipboard', 'commandLine', 'configStorage', 'dateHour', 'devFun', 'file', 'getPath', 'googleSheets', 'googleTranslate', 'htmlToJson',
  'log', 'logConsole', 'logsDelOld', 'messageSend', 'messageReceived', 'notification', 'objFilter', 'regex', 'regexE', 'tabSearch', 'GPT4js', 'listenerAcionar', 'listenerMonitorar',
  'chromeActionsNew', 'funImport', 'funGeneric', 'funLibrary', 'taskInfTryRating', 'clearRun', 'zachey01___gpt4free_js',
  // scripts
  'background', 'command1', 'command2', 'tryRatingComplete',

  // [WebSocket]
  // → funções globais
  'html', 'logsDelOld', 'messageAction', 'performanceDev', 'roomParams',

  // [Sniffer_Python]
  // → funções globais
  'ewoq', 'tryRating', 'getResponseTryRating', 'performTask',

  // [URA_Reversa]
  // → funções globais
  'leadChangeStatus', 'leadGet', 'leads', 'leadsJsf', 'login',

  // [WebScraper]
  // → funções globais
  'apiCnpj', 'apiNire', 'awaitLoad', 'browsers', 'buttonElement', 'checkPage', 'cookiesGetSet', 'getTextElement', 'imput', 'navigate', 'sendData', 'clientSearch', 'clientGetData', 'clientImput',

];

// ************** VARIÁVEIS NÃO USADAS **************
let arrUnused = [
  // [infNomeFuncao] [infNomeFuncao]
  // 'inf[A-Z0-9].+?', 'ret[A-Z0-9].+?',
  // (for)
  'index', 'value', 'index1', 'value1', 'index2', 'value2', 'index3', 'value3', 'index4', 'value4', 'event',
  // (time)
  'time', 'time1', 'time2', 'hour', 'timeout', 'notificationLegacy',
  'ee',

  // outros
  'dev1', 'dev2', 'dev3', 'dev4', 'lin', 'browser', 'tipo', 'element', 'cookies', '_stackTrace', 'nomeList', 'param1', 'param2', 'ret', 'res', 'host', 'room', 'teste', 'big', 'write',
  'msg', 'sendNtfy', 'e',

];


let arrGlobalObj = {}; for (let variavel of arrGlobal) { arrGlobalObj[variavel] = 'writable'; }

export let jsConfig = [
  {

    // PASTAS OU ARQUIVOS IGNORADOS
    'ignores': [
      // TODA A PASTA
      // '**/resources/chats/**',

      // PARTE DO NOME DO ARQUIVO
      // '**/*lipboard.js',

      '**/resources/chats/**',
      '**/teste*.js',
    ],

    // VARIÁVEIS GLOBAIS
    'languageOptions': { 'globals': arrGlobalObj, },

    'rules': {

      // ********************* [CORREÇÃO AUTOMÁTICA: SIM] ********************* 

      // PONTO E VÍRGULA NO FINAL
      'semi': 'error',

      //   === e !==    EM VEZ DE    == e !=
      'eqeqeq': 'error',

      // VÍRGULA NO FINAL
      'comma-dangle': ['error', {
        'objects': 'always',
        'arrays': 'always',

        'imports': 'never',
        'exports': 'never',
        'functions': 'never',
      },],

      // 'return' DESNECESSÁRIO
      'no-useless-return': 'error',

      // REDUNÂNCIA → let casa = true; let nova = casa ? true : false
      'no-unneeded-ternary': ['error',],

      // 'if' DESNECESSÁRIO
      'no-lonely-if': 'error',

      // CHAVES E VALORES COM ASPAS SIMPLES
      'quotes': ['error', 'single', {
        'allowTemplateLiterals': true, // IGNORAR ENTRE CRASE → let variavel = { 'chave': `NOME ${pessoa} IDADE: 1`}
        'avoidEscape': true,           // IGNORAR QUANDO INCLUIR ASPAS SIMPLES → let variavel = { 'chave': "O NOME 'ONU' É UMA SIGLA" }
      },],

      // ********************* [CORREÇÃO AUTOMÁTICA: NÃO] ********************* 

      // VARIÁVEIS NÃO USADAS
      'no-unused-vars': ['error', { 'varsIgnorePattern': `^(${arrUnused.join('|')})$`, },],

      // VARIÁVEL NÃO DEFINIDA
      'no-undef': 'error',

      // ERRO DE FUNÇÃO NO MEIO DO CÓDIGO
      'no-inner-declarations': 'off',

      // ESCAPE DO REGEX
      'no-useless-escape': 'off',

      // OBJETO VAZIO → { }
      'no-empty': 'off',

      // ESPAÇO NO REGEX
      'no-regex-spaces': 'off',

      // DIVISÃO DE COLUNAS NO REGEX
      'no-control-regex': 'off',

      // CÓDIGO APÓS O RETURN
      'no-unreachable': 'off', // off | error

      // 'true' NO WHILE
      'no-constant-condition': 'off',

      // 'return' OBRIGATÓRIO NA FUNÇÃO
      // 'consistent-return': 'error',

      // VARIÁVEIS EM camelCase E NÃO snack_case
      'camelcase': ['error', { 'properties': 'always', },], // (IGNORAR [POR NO TOPO])   /* eslint-disable camelcase */

      // GARANTIR USO DE 'let' E NÃO 'const' (IGNORAR [POR NO TOPO])   /* eslint-disable no-restricted-syntax */
      'no-restricted-syntax': ['error', { 'selector': 'VariableDeclaration[kind=\'const\']', 'message': 'NÃO USAR \'const\'', },],

      // LINHAS MUITO LONGAS (IGNORAR [POR NO TOPO])   /* eslint-disable max-len */
      'max-len': ['error', {
        'code': 222, // TAMANHO
        'tabWidth': 4,
        //'ignoreStrings': true, // IGNORAR STRING
        'ignoreRegExpLiterals': true, // IGNORAR REGEX
        'ignoreUrls': true, // IGNORAR URL
        'ignoreTrailingComments': true,// IGNORAR COMENTÁRIO (//)
        'ignoreComments': true, // IGNORAR COMENTÁRIO (/* ALGO AQUI */ )
        'ignoreTemplateLiterals': true, // IGNORAR CRASE
      },],

    },

  },
];


