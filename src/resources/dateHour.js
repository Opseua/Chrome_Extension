// let retDateHour;
// retDateHour = dateHour() // → DATA/HORA ATUAL
// retDateHour = dateHour(new Date()) // → DATA/HORA ATUAL (OBJ DATA)
// retDateHour = dateHour(`-60`) // → DATA/HORA ATUAL (- 60 SEGUNDOS)
// retDateHour = dateHour(`+60`) // → DATA/HORA ATUAL (+ 60 SEGUNDOS)
// retDateHour = dateHour(90) // → [SEC TO HOUR] '00:01:30'
// retDateHour = dateHour(946695599) // → DATA/HORA DO TIMESTAMP (SEM MILISSEGUNDOS)
// retDateHour = dateHour(946695599123) // → DATA/HORA DO TIMESTAMP (COM MILISSEGUNDOS)
// retDateHour = dateHour('1999*12*31*23*59*59') // → DATA/HORA DO TEMPO
// retDateHour = dateHour('31*12*1999*23*59*59') // → DATA/HORA DO TEMPO
// retDateHour = dateHour('31#12#23#59#59') // → DATA/HORA DO TEMPO (ANO ATUAL)
// console.log(retDateHour);

// let timestamp = Math.floor(Date.now() / 1000);

function dateHour(inf) { // NÃO POR COMO 'async'!!!
    let ret = { 'ret': false, };
    try {
        let dt1;
        if (typeof inf === 'string' && (/^[+-]\d+$/).test(inf)) {
            // [STRING] function(`-60`)/function(`+60`) → DATA/HORA ATUAL -/+ {inf} SEGUNDOS
            dt1 = new Date(Date.now() + (Number(inf) * 1000));
        } else if (typeof inf === 'number') {
            if (inf > 946695598) {
                // [NUMBER] function(946695599)/function(946695599123) → DATA/HORA DO TIMESTAMP
                dt1 = new Date(inf > 9999999999 ? inf : inf * 1000);
            } else {
                // [NUMBER] function(90) → [SEC TO HOUR] '00:01:30'
                let hou = Math.floor(inf / 3600).toString().padStart(2, '0');
                let min = Math.floor((inf % 3600) / 60).toString().padStart(2, '0');
                let sec = Math.min(Math.floor(inf % 60), 59).toString().padStart(2, '0');

                ret['msg'] = `DATE HOUR [SEC TO HOUR]: OK`;
                ret['ret'] = true;
                ret['res'] = `${hou}:${min}:${sec}`;
                return ret;
            }
        } else if (Object.prototype.toString.call(inf) === '[object Date]') {
            // [OBJ DATE] function(1999-31-12T23:59:59.123Z) DATA/HORA DO TEMPO
            dt1 = new Date(inf);
        } else if (typeof inf === 'string') {
            // [STRING] function('1999*12*31*23*59*59')/function('31*12*1999*23*59*59')/function('31*12*23*59*59') → DATA/HORA DO TEMPO ['*' QUALQUER UM ÚNICO CARACTERE]
            let m = inf.match(/^(\d{2,4}).(\d{2}).(\d{2,4}).(\d{2}).(\d{2}).?(\d{2})?/);
            if (!m) {
                dt1 = new Date(inf); // PADRÃO REGEX NÃO ENCONTRADO NA STRING (TENTAR FAZER O DATE)
            } else {
                if (m[1].length === 4) { m = { 'yea': m[1], 'mon': m[2], 'day': m[3], 'hou': m[4], 'min': m[5], 'sec': m[6] ?? '00', }; } // AAAA/MM/DD HH:MM:SS
                else if (m[3].length === 4) { m = { 'yea': m[3], 'mon': m[2], 'day': m[1], 'hou': m[4], 'min': m[5], 'sec': m[6] ?? '00', }; } // DD/MM/AAAA HH:MM:SS
                else { m = { 'yea': new Date().getFullYear(), 'mon': m[2], 'day': m[1], 'hou': m[3], 'min': m[4], 'sec': m[5] ?? '00', }; } // DD/MM HH:MM:SS (USAR ANO ATUAL)
                dt1 = new Date(`${m.yea}-${m.mon}-${m.day}T${m.hou}:${m.min}:${m.sec}-03:00`);
            }
        } else if (inf === undefined) {
            // PARÂMETRO VÁZIO! GERAR DATA/HORA ATUAL
            dt1 = new Date();
        }

        // RETORNAR SE A DATA FOR INVÁLIDA
        if (!(dt1 instanceof Date && !isNaN(dt1) && dt1.getFullYear() >= 1999 && dt1.getFullYear() <= 2030)) { ret['msg'] = `DATE HOUR: ERRO | DATA/TIMESTAMP INVÁLIDO`; return ret; }

        // FORÇAR (UTC-3) (MODO 2)
        let utc = dt1.getTime() + (dt1.getTimezoneOffset() * 60000); let local = new Date(utc - (3 * 60 * 60000));
        let hou = local.getHours(); let localGetMonth = local.getMonth(); let localGetTime = local.getTime();

        ret['res'] = {
            'day': local.getDate().toString().padStart(2, '0'), // DIA (01)
            'mon': (localGetMonth + 1).toString().padStart(2, '0'), // MÊS (01)
            'yea': local.getFullYear().toString(), // ANO (1999)
            'hou': hou.toString().padStart(2, '0'), // HORA (01)
            'hou12': (hou % 12 || 12).toString().padStart(2, '0'), // HORA (01)
            'houAmPm': hou < 12 ? 'AM' : 'PM', // AM ou PM
            'min': local.getMinutes().toString().padStart(2, '0'), // MINUTO (01)
            'sec': local.getSeconds().toString().padStart(2, '0'), // SEGUNDO (01)
            'mil': local.getMilliseconds().toString().padStart(3, '0'), // MILISSEGUNDOS (123)
            'tim': Math.floor(localGetTime / 1000).toString(), // TIMESTAMP (1234567890) [SEM MILISSEGUNDOS]
            'timMil': localGetTime.toString(), // TIMESTAMP (1234567890123) [COM MILISSEGUNDOS]
            'wee': Math.ceil(local.getDate() / 7).toString(), // NÚMERO DA SEMANA NO MÊS (1)
            'dayNam': ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB',][local.getDay()], // DIA (XXX)
            'monNam': ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ',][localGetMonth], // MÊS (XXX)
        };
        ret['msg'] = `DATE HOUR: OK`;
        ret['ret'] = true;

    } catch (catchErr) {
        (async () => { let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res']; })();
    }

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.res && { 'res': ret.res, }), };
}

// CHROME | NODE
globalThis['dateHour'] = dateHour;


