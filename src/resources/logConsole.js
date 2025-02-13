// // 'write' → 'true' ESCREVE NO 'PROJECT/log/JavaScript/log.txt' A MENSAGEM (ASYNC NÃO!!!)
// logConsole({ e, ee, 'msg': `Mensagem do console`, });

let e = import.meta.url;
async function logConsole(inf = {}) { // NÃO POR COMO 'async'!!!
    let ret = { 'ret': false, }, ee = inf && inf.ee ? inf.ee : e; e = inf && inf.e ? inf.e : e;
    try {
        let { msg = 'x', write = true, } = inf;

        function colorConsole(inf = {}) {
            let { text, } = inf;
            // let texto
            // texto = 'NORMAL1 <amarelo>AMARELO</amarelo> NORMAL2 <azul>AZUL</azul> NORMAL3 <verde>VERDE</verde> NORMAL4 <vermelho>VERMELHO</vermelho> NORMAL5';
            // colorConsole({ 'text': texto });
            // texto = { 'A': 'B' };
            // colorConsole({ 'text': `<verde>VERDE</verde> <azul>${JSON.stringify(texto)}</azul> NORMAL1` });
            // colorConsole({ 'text': 'FIM' });
            let colors = {
                'amarelo': '\x1b[33m',
                'azul': '\x1b[34m',
                'verde': '\x1b[32m',
                'vermelho': '\x1b[31m',
                'reset': '\x1b[0m',
            };
            let textColored = text; textColored = textColored.replace(/<(\w+)>([\s\S]*?)<\/\1>/g, (match, color, data) => {
                if (color.toLowerCase() in colors) {
                    return `${colors[color.toLowerCase()]}${data}${colors.reset}`;
                } else {
                    return match;
                }
            });
            console.log(textColored);
        }

        let time = dateHour().res;
        let fileProject = eng ? 'Chrome' : ee.split('PROJETOS/')[1].split('/')[0];
        let fileCall = ee.split('/').pop();
        msg = typeof msg === 'object' ? JSON.stringify(msg) : msg;
        colorConsole({
            // FORMATO: 24 HORAS (11h, 12h, 13h, 14h...)
            'text': `<verde>→ ${time.day}/${time.mon} ${time.hou}:${time.min}:${time.sec}.${time.mil}</verde> <azul>${fileProject}</azul> <amarelo>${fileCall}</amarelo>\n${msg}\n`,
            // FORMATO: 12 HORAS (11h, 12h, 01h, 02h...)
            // 'text': `<verde>→ ${time.day}/${time.mon} ${time.hou12}:${time.min}:${time.sec}.${time.mil} ${time.houAmPm}</verde> <azul>${fileProject}</azul> <amarelo>${fileCall}</amarelo>\n${msg}\n`
        });
        if (!eng && write) {
            await log({ e, 'folder': 'JavaScript', 'path': `log.txt`, 'text': msg, 'fileProject': fileProject, 'fileCall': fileCall, 'unique': false, });
        }

        ret['msg'] = `LOG CONSOLE: OK`;
        ret['ret'] = true;

    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    };

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.res && { 'res': ret.res, }), };
};

// CHROME | NODEJS
(eng ? window : global)['logConsole'] = logConsole;


