// const { dateHour } = await import('./dateHour.js');
// const RetDH = dateHour()
// console.log(RetDH)

function dateHour() { // NAO POR COMO 'async'!!!
    let ret = { 'ret': false };
    try {
        const date = new Date();
        const retDate = {
            'day': String(date.getDate()).padStart(2, '0'),
            'mon': String(date.getMonth() + 1).padStart(2, '0'),
            'yea': String(date.getFullYear()),
            'hou': String(date.getHours()).padStart(2, '0'),
            'min': String(date.getMinutes()).padStart(2, '0'),
            'sec': String(date.getSeconds()).padStart(2, '0'),
            'mil': String(date.getMilliseconds()).padStart(3, '0'),
            'tim': Date.now()
        }

        ret['ret'] = true;
        ret['msg'] = `DATE HOUR: OK`;
        ret['res'] = retDate;
    }
    catch (e) {
        ret['msg'] = `DATE HOUR: ERRO | ${e}`;
    }

    if (!ret.ret) { console.log(ret.msg) }
    return ret
}

export { dateHour };