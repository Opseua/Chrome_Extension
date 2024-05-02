// let infRawText, retRawText
// let obj = {
//     'e': e, 'key1': `
//       <li>
//         <a href="logout.php?empresa=interface">
//           <i class="fa fa-sign-out fa-fw"></i> Logout
//         </a>
//       </li>
//     `,
//     'key2': `
//       <div>
//         <p>Este é um exemplo de HTML.</p>
//       </div>
//     `,
//     subObj: {
//         'keyA': 'valor1',
//         'keyB': 'valor2'
//     }
// };
// infRawText = { 'obj': obj }
// retRawText = await rawText(infRawText)
// console.log(retRawText)

let e = import.meta.url, ee = e;
async function rawText(inf) {
    e = inf && inf.e ? inf.e : e
    let ret = ''
    try {
        let obj = inf.obj
        if ((/<!.* html>.*<\/html>/s.test(obj) || !(typeof obj === 'object'))) {
            return obj
        } else {
            let raw = '';
            let concat = inf.concat ? inf.concat : `\n\n######################################################################\n\n`
            for (let chave in obj) {
                if (typeof obj[chave] === 'object') {
                    for (let subChave in obj[chave]) {
                        raw += obj[chave][subChave] + concat;
                    }
                } else {
                    raw += obj[chave] + concat;
                }
            }
            ret = `${JSON.stringify(obj)}\n\n\n\n${raw}`
        }

    } catch (catchErr) {
        regexE({ 'inf': inf, 'e': catchErr, });
    };
    return ret
}

if (eng) { // CHROME
    window['rawText'] = rawText;
} else { // NODEJS
    global['rawText'] = rawText;
}
