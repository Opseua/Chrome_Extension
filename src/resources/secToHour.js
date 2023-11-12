// let infSecToHour = 65
// let retSecToHour = secToHour(infSecToHour)
// console.log(retSecToHour)

function secToHour(inf) { // NÃO POR COMO 'async'!!!
    (async () => { await import('./@functions.js') })()
    let ret = { 'ret': false };
    try {
        let hou = Math.floor(inf / 3600).toString().padStart(2, "0");
        let min = Math.floor((inf % 3600) / 60).toString().padStart(2, "0");
        let sec = (inf % 60).toString().padStart(2, "0");
        ret['res'] = String(`${hou}:${min}:${sec}`)
        ret['msg'] = `SEC TO HOUR: OK` // manter o 'String' para forcar o '0' (zero) na frente → '001'
        ret['ret'] = true;
    } catch (e) {
        (async () => {
            let m = await regexE({ 'e': e });
            ret['msg'] = m.res
        })()
    };
    return ret
}

if (typeof eng === 'boolean') {
    if (eng) { // CHROME
        window['secToHour'] = secToHour;
    } else { // NODEJS
        global['secToHour'] = secToHour;
    }
}