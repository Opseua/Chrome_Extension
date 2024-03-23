// // 'write' → 'true' ESCREVE NO 'PROJECT/log/JavaScript/log.txt' A MENSAGEM (ASYNC NÃO!!!)
// logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `[api] Mensagem do console` });

let e = import.meta.url
async function logConsole(inf) { // NÃO POR COMO 'async'!!!
    let ret = { 'ret': false }, ee = inf && inf.ee ? inf.ee : e; e = inf && inf.e ? inf.e : e;
    try {
        if (catchGlobal) {
            let errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; let retRegexE = await regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
            if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
            else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
        }
        let { msg, write } = inf

        function colorConsole(inf) {
            // let texto
            // texto = 'NORMAL1 <amarelo>AMARELO</amarelo> NORMAL2 <azul>AZUL</azul> NORMAL3 <verde>VERDE</verde> NORMAL4 <vermelho>VERMELHO</vermelho> NORMAL5';
            // colorConsole({ 'text': texto });
            // texto = { 'A': 'B' };
            // colorConsole({ 'text': `<verde>VERDE</verde> <azul>${JSON.stringify(texto)}</azul> NORMAL1` });
            // colorConsole({ 'text': 'FIM' });
            let { text } = inf;
            let colors = {
                'amarelo': '\x1b[33m',
                'azul': '\x1b[34m',
                'verde': '\x1b[32m',
                'vermelho': '\x1b[31m',
                'reset': '\x1b[0m',
            };
            let textColored = text; textColored = textColored.replace(/<(\w+)>([\s\S]*?)<\/\1>/g, (match, color, data) => {
                if (color.toLowerCase() in colors) { return `${colors[color.toLowerCase()]}${data}${colors.reset}`; }
                else { return match; }
            });
            console.log(textColored);
        }

        let time = dateHour().res;
        let fileProject = eng ? 'Chrome' : ee.split('PROJETOS/')[1].split('/')[0]
        let fileCall = ee.split('/').pop()
        msg = typeof msg === 'object' ? JSON.stringify(msg) : msg
        colorConsole({
            'text': `<verde>→ ${time.day}/${time.mon} ${time.hou}:${time.min}:${time.sec}.${time.mil}</verde> <azul>${fileProject}</azul> <amarelo>${fileCall}</amarelo>\n${msg}\n`
        });
        if (!eng && write) {
            await log({ 'e': e, 'folder': 'JavaScript', 'path': `log.txt`, 'text': msg, 'fileProject': fileProject, 'fileCall': fileCall })
        }
        ret['msg'] = `LOG CONSOLE: OK`;
        ret['ret'] = true;

        // ### LOG FUN ###
        if (inf && inf.logFun) {
            let infFile = { 'e': e, 'action': 'write', 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }
            infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; file(infFile);
        }
    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, 'catchGlobal': false });
        ret['msg'] = retRegexE.res
    };
    return {
        ...({ ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}

if (eng) { // CHROME
    window['logConsole'] = logConsole;
} else { // NODEJS
    global['logConsole'] = logConsole;
}


