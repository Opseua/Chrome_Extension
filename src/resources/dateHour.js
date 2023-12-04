// let retDateHour
// retDateHour = dateHour() // dateHour(86400) + 1 DIA | dateHour(-43200) - 12 HORAS
// console.log(retDateHour)

// let timestamp = Math.floor(new Date().getTime() / 1000);

let e = import.meta.url;
function dateHour(inf = 0) { // NÃO POR COMO 'async'!!!
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        const errs = async (err, ret) => { if (!ret.stop) { ret['stop'] = true; let retRegexE = await regexE({ 'e': err, 'inf': inf, 'catchGlobal': true }) } }
        if (typeof window !== 'undefined') { window.addEventListener('error', (err) => errs(err, ret)); window.addEventListener('unhandledrejection', (err) => errs(err, ret)) }
        else { process.on('uncaughtException', (err) => errs(err, ret)); process.on('unhandledRejection', (err) => errs(err, ret)) }
    }
    try {
        let dt1 = new Date();
        dt1.setSeconds(new Date().getSeconds() + inf).setSeconds;
        let dt2 = Date.now() + (inf * 1000);
        ret['res'] = { // manter o 'String' para forçar o '0' (zero) na frente → '001'
            'day': String(dt1.getDate()).padStart(2, '0'),
            'mon': String(dt1.getMonth() + 1).padStart(2, '0'),
            'yea': String(dt1.getFullYear()),
            'hou': String(dt1.getHours()).padStart(2, '0'),
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
    } catch (e) {
        (async () => {
            let retRegexE = await regexE({ 'inf': inf, 'e': e, 'catchGlobal': false });
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
