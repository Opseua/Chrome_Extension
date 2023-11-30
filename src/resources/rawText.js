// let infRawText, retRawText
// let obj = {
//     'key1': `
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
// retRawText = await rawtext(infRawText)
// console.log(retRawText)

async function rawtext(inf) {
    let ret = ''
    try {
        let raw = '';
        let obj = inf.obj
        let concat = inf.concat ? inf.concat : `\n\n#######\n\n`
        for (let chave in obj) {
            if (typeof obj[chave] === 'object') {
                for (let subChave in obj[chave]) {
                    raw += obj[chave][subChave] + concat;
                }
            } else {
                raw += obj[chave] + concat;
            }
        }
        ret = raw
    } catch (e) {
        let retRegexE = await regexE({ 'inf': inf, 'e': e });
    };
    return ret
}

if (eng) { // CHROME
    window['rawtext'] = rawtext;
} else { // NODEJS
    global['rawtext'] = rawtext;
}
