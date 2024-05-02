// let retDateHour
// retDateHour = dateHour() // dateHour(86400) + 1 DIA | dateHour(-43200) - 12 HORAS
// console.log(retDateHour)

// let timestamp = Math.floor(new Date().getTime() / 1000);

let e = import.meta.url, ee = e;
function dateHour(inf) { // NÃO POR COMO 'async'!!!
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        let errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
    try {
        let dt1;
        if (typeof inf === 'number') {
            dt1 = new Date();
            dt1.setSeconds(new Date().getSeconds() + inf);
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

        ret['res'] = { // manter o 'String' para forçar o '0' (zero) na frente → '001'
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
            let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, 'catchGlobal': false });
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
