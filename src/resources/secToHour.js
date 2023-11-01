// const infSecToHour = 65
// const retSecToHour = secToHour(infSecToHour)
// console.log(retSecToHour)

function secToHour(inf) { // NÃO POR COMO 'async'!!!
    (async () => { await import('./@functions.js') })()
    let ret = { 'ret': false }; try {
        const hou = Math.floor(inf / 3600).toString().padStart(2, "0"); const min = Math.floor((inf % 3600) / 60).toString().padStart(2, "0");
        const sec = (inf % 60).toString().padStart(2, "0"); ret['res'] = String(`${hou}:${min}:${sec}`)
        ret['ret'] = true; ret['msg'] = `SEC TO HOUR: OK` // manter o 'String' para forcar o '0' (zero) na frente → '001'
    } catch (e) { (async () => { const m = await regexE({ 'e': e }); ret['msg'] = m.res })() }; return ret
}

if (typeof window !== 'undefined') { // CHROME
    window['secToHour'] = secToHour;
} else { // NODEJS
    global['secToHour'] = secToHour;
}