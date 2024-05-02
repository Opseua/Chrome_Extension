// let retDateHour
// retDateHour = dateHour() // HORA ATUAL
// retDateHour = dateHour(new Date()) // HORA ATUAL [Chrome/NodeJS/Google]
// retDateHour = dateHour('Wed Jan 11 2024 22:33:44 GMT-0300 (Horário Padrão de Brasília)') // [Chrome/NodeJS/Google]
// retDateHour = dateHour('2024-01-11T22:33:44.000Z') // [Chrome/NodeJS/Google] (o retorno é 3 horas a MENOS)
// retDateHour = dateHour(`-${(3600 * 12)}`) // HORA ATUAL - 12 HORAS | OBRIGATÓRIO SER STRING!!!
// retDateHour = dateHour(`+${(86400 * 1)}`) // HORA ATUAL + 1 DIA | OBRIGATÓRIO SER STRING!!!
// retDateHour = dateHour(65) // *** ANTIGO 'secToHour' *** | OBS: se o parametro for NÚMERO e NÃO tiver '-' ou '+' será a 'secToHour'
// console.log(retDateHour)

// let timestamp = Math.floor(new Date().getTime() / 1000);

let e = import.meta.url, ee = e;
function dateHour(inf) { // NÃO POR COMO 'async'!!!
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    try {
        let dt1;
        if (typeof inf === 'number') {

            // ******************************************************************************************
            // ANTIGO 'secToHour'
            if (inf > 0) {
                let hou = Math.floor(inf / 3600).toString().padStart(2, "0");
                let min = Math.floor((inf % 3600) / 60).toString().padStart(2, "0");
                let sec = (inf % 60).toString().padStart(2, "0");
                ret['res'] = String(`${hou}:${min}:${sec}`) // manter o 'String' para forcar o '0' (zero) na frente → '001'
                ret['msg'] = `DATE HOUR [SEC TO HOUR]: OK`
                ret['ret'] = true;
                return ret
            }
            // ******************************************************************************************

            dt1 = new Date();
            dt1.setSeconds(new Date().getSeconds() + inf);
        } else if (typeof inf === 'string' && (inf[0] === '-' || inf[0] === '+')) {
            dt1 = new Date();
            dt1.setSeconds(new Date().getSeconds() + Number(inf));
        } else if (inf instanceof Date && !isNaN(inf)) {
            dt1 = new Date(inf);
            inf = 0;
        } else {
            let parsedDate = new Date(inf);
            if (!isNaN(parsedDate)) {
                dt1 = parsedDate;
            } else {
                dt1 = new Date();
            }
            inf = 0;
        }
        let dt2 = Date.now() + (inf * 1000);
        let hou = dt1.getHours()

        ret['res'] = {
            // manter o 'String' para forçar o '0' (zero) na frente → '001'
            'day': String(dt1.getDate()).padStart(2, '0'),
            'mon': String(dt1.getMonth() + 1).padStart(2, '0'),
            'yea': String(dt1.getFullYear()),
            'hou': String(hou).padStart(2, '0'),
            'hou12': String(hou < 13 ? hou : (hou - 12)).padStart(2, '0'),
            'houAmPm': hou < 13 ? 'AM' : 'PM',
            'min': String(dt1.getMinutes()).padStart(2, '0'),
            'sec': String(dt1.getSeconds()).padStart(2, '0'),
            'mil': String(dt2.toString().slice(-3)),
            'tim': String(dt2.toString().slice(0, -3)),
            'timMil': String(dt2.toString()),
            'dayNam': ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'][dt1.getDay()],
            'monNam': ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'][dt1.getMonth()],
        };
        ret['msg'] = `DATE HOUR: OK`
        ret['ret'] = true;

    } catch (catchErr) {
        (async () => {
            let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, });
            ret['msg'] = retRegexE.res
        })()
    };
    return {
        ...({ ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}

if (eng) { // CHROME
    window['dateHour'] = dateHour;
} else { // NODEJS
    global['dateHour'] = dateHour;
}
