// ************** VARIÁVEIS NÃO DECLARADAS [globais] **************
let arrGlobal = [
  // FUNÇÃO NATIVAS
  'console', 'setTimeout', 'setInterval', 'clearTimeout', 'AbortController', 'TextEncoder', 'fetch', 'prompt', 'document', 'XPathResult', 'Blob', 'URL', 'DOMParser', 'atob', 'btoa',
  'alert', 'MutationObserver', 'Event', 'clearInterval', 'KeyboardEvent', 'getComputedStyle', 'alertConsole', 'currentFile', 'NodeFilter', 'Node', 'MouseEvent', 'window', 'navigator',
  'XmlService',

  // VARIÁVEIS GLOBAIS
  'devSend', 'wsClients', 'wsClientLoc', 'eng', 'engName', 'cng', 'letter', 'conf', 'infGlobal', 'gORem', 'gOAdd', 'csf', 'gW', 'legacy', 'platforms', 'ori', 'des', 'portStopwatch', 'sP',

  // VARIÁVEIS DO SISTEMA
  'fileChrome_Extension', 'fileProjetos', 'fileWindows',

  // ### BIBLIOTECAS / NATIVO → CHROME
  'chrome',

  // ### BIBLIOTECAS / NATIVO → NODE
  '_WebSocketServer', '_WebSocket', '_fs', '_path', '_cheerio', '_clipboardy', '_http', '_exec', '_google', '_createHash', '_puppeteer', '_net', '_getFolderSize', 'process',
  'Buffer', '_parse', '_stackTrace', '_auth', '_sheets', '_clipboard', '_createRequire', '_axios', '_createWriteStream', '_getVideoDurationInSeconds', '_https', '_m3u8Parser',
  '_createServer', '_createInterface', '_zlib',
  // GLOBAL OBJECT
  'gO', 'gOList', 'cs',
  // FUNÇÕES
  'rateLimiter', 'awaitTimeout', 'randomNumber',

  // ### BIBLIOTECAS / NATIVO → GOOGLE 
  'UrlFetchApp', 'Browser',

  // funções globais → [Chrome_Extension]
  'api', 'chat', 'chromeActions', 'client', 'clipboard', 'commandLine', 'configStorage', 'dateHour', 'devFun', 'file', 'getPath', 'googleSheets', 'googleTranslate', 'htmlToJson',
  'log', 'logConsole', 'messageSend', 'messageReceived', 'notification', 'objFilter', 'regex', 'regexE', 'tabAction', 'GPT4js', 'listenerAcionar',
  'listenerMonitorar', 'chromeActionsNew', 'importFun', 'importLibs', 'taskInfTryRating', 'clearRun', 'zachey01___gpt4free_js', 'background', 'command1', 'audioTranscribe',
  'command2', 'tryRatingComplete', 'startupTime', 'crashCode', 'replaceVars', 'stringGet',

  // funções globais → [Sniffer_Python]
  'ewoq', 'scilliance', 'tryRating', 'getResponseTryRating', 'performTask', 'correiosServer', 'targetAlert',

  // funções globais → [URA_Reversa]
  'leadChangeStatus', 'leadGet', 'leads', 'leadsJsf', 'login',

  // funções globais → [WebScraper]
  'apiCnpj', 'apiNire', 'awaitLoad', 'browsers', 'buttonElement', 'checkPage', 'cookiesGetSet', 'getTextElement', 'imput', 'navigate', 'sendData', 'clientSearch', 'clientGetData',
  'clientImput', 'maquinaInput', 'screenshot', 'elementAction', 'newAccounts',

  // funções globais → [WebSocket]
  'html', 'logsDel', 'messageAction', 'performanceDev', 'roomParams', 'timGetOrderDetails',

  // funções globais → [IPTV]
  'parseM3u', 'chunksOrder', 'redeCanais',
],

  // ************** VARIÁVEIS NÃO USADAS **************
  arrUnused = [
    // 'inf[A-Z0-9].+?', 'ret[A-Z0-9].+?',  // outros
    'dev1', 'dev2', 'dev3', 'dev4', 'lin', 'browser', 'tipo', 'element', 'cookies', '_stackTrace', 'nomeList', 'param1', 'param2', 'ret', 'res', 'host', 'room', 'teste', 'big', 'write',
    'msg', 'sendNtfy', 'e', 'ee', 'index', 'idx', 'value', 'index1', 'value1', 'index2', 'value2', 'index3', 'value3', 'stdout',
  ],

  arrGlobalObj = {}; for (let variavel of arrGlobal) { arrGlobalObj[variavel] = 'writable'; }
export let jsConfig = [
  {
    // PASTAS OU ARQUIVOS IGNORADOS
    'ignores': [
      // '**/resources/chats/**', '**/*lipboard.js', // TODA A PASTA | PARTE DO NOME DO ARQUIVO
      '**/resources/chats/**', // '**/teste*.js',
    ],
    // VARIÁVEIS GLOBAIS
    'languageOptions': { 'globals': arrGlobalObj, },

    'rules': {
      // ##################################################################################################################################################################

      // ********************* [CORREÇÃO AUTOMÁTICA: SIM] ********************* 

      // PONTO E VÍRGULA NO FINAL
      'semi': 'error',

      //   === e !==    EM VEZ DE    == e !=
      'eqeqeq': 'error',

      // VÍRGULA NO FINAL
      'comma-dangle': ['error', { 'objects': 'always', 'arrays': 'always', 'imports': 'never', 'exports': 'never', 'functions': 'never', },],

      // 'return' DESNECESSÁRIO
      'no-useless-return': 'error',

      // REDUNDÂNCIA → let casa = true; let nova = casa ? true : false
      'no-unneeded-ternary': ['error',],

      // 'if' DESNECESSÁRIO
      'no-lonely-if': 'error',

      // REUTILIZAR VARIÁVEIS COM O MESMO NOME DA CHAVE     let key = { 'a': 'b', }; let keyNew = { 'key': key, };  →  let key = { 'a': 'b', }; let keyNew = { key, };
      'object-shorthand': 'error',

      // IF ELSE SEM CHAVES if (foo) foo++  →  if (foo) { foo++; }
      'curly': 'error',

      // ';' DESNECESSÁRIO
      'no-extra-semi': 'error',

      // CHAVES E VALORES COM ASPAS SIMPLES
      'quotes': ['error', 'single', {
        'allowTemplateLiterals': true, // IGNORAR ENTRE CRASE → let variavel = { 'chave': `NOME ${pessoa} IDADE: 1`}
        'avoidEscape': true,           // IGNORAR QUANDO INCLUIR ASPAS SIMPLES → let variavel = { 'chave': "O NOME 'ONU' É UMA SIGLA" }
      },],

      // ********************* [CORREÇÃO AUTOMÁTICA: NÃO] ********************* 

      // VARIÁVEIS NÃO USADAS E 'catchErr'
      'no-unused-vars': ['error', { 'varsIgnorePattern': `^(${arrUnused.join('|')})$`, 'caughtErrors': 'none', },],

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

      // CHAVES DUPLICADAS → { bar: "baz", bar: "qux" }
      'no-dupe-keys': 'error',

      // IF DESNECESSÁRIO
      'no-self-compare': 'error',

      // IMPORT DUPLICADO
      'no-duplicate-imports': 'error',

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

      // ##################################################################################################################################################################
    },
  },
];


