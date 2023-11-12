// let objeto = { 'chave1': { 'chave2': { 'chave3': 'VALOR' } } };
// let infHasKey = { 'key': 'chave3', 'obj': objeto };
// let retHaskey = hasKey(infHasKey);
// console.log(retHaskey)

function hasKey(inf) { // NÃO POR COMO 'async'!!!
    (async () => { await import('./@functions.js') })()
    let ret = { 'ret': false };
    try {
        function hk(key, obj) {
            if (obj.hasOwnProperty(key)) {
                return true
            };
            for (let prop in obj) {
                if (typeof obj[prop] === 'object' && obj[prop] !== null) {
                    if (hk(key, obj[prop])) {
                        return true
                    }
                }
            };
            return false
        };
        ret['res'] = hk(inf.key, typeof inf.obj === 'object' ? inf.obj : JSON.parse(inf.obj));
        ret['msg'] = `HAS KEY: OK`;
        ret['ret'] = true
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
        window['hasKey'] = hasKey;
    } else { // NODEJS
        global['hasKey'] = hasKey;
    }
}
