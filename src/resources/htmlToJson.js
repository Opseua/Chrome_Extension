// // 'mode' 1 → CHAVE IGUAL O CABEÇALHO (SE TIVER)
// // 'mode' 2 → CHAVE ALEATÓRIA
// // 'mode' 3 → CHAVE IGUAL AO PRIMEIRO VALOR DA TABELA

// let infHtmlToJson, retHtmlToJson // 'logFun': true,
// infHtmlToJson = {
//     'e': e, 'mode': 1,
//     // TEM O CABEÇALHO [SIM]
//     html:
//         `
//     <table>
//         <thead>
//             <tr>
//                 <th>Nome</th>
//                 <th>Idade</th>
//                 <th>País</th>
//             </tr>
//         </thead>
//         <tbody>
//             <tr>
//                 <td>Amanda</td>
//                 <td>20</td>
//                 <td>Brasil</td>
//             </tr>
//             <tr>
//                 <td>Brenda</td>
//                 <td>25</td>
//                 <td>EUA</td>
//             </tr>
//             <tr>
//                 <td>Carlos</td>
//                 <td>30</td>
//                 <td>Japão</td>
//             </tr>
//         </tbody>
//     </table>
//     `
// }
// retHtmlToJson = await htmlToJson(infHtmlToJson)
// console.log(retHtmlToJson.res)

// infHtmlToJson = {
//     'e': e, 'mode': 2,
//     // TEM O CABEÇALHO [NÃO]
//     html:
//         `
//     <table>
//         <tbody>
//             <tr>
//                 <td>Amanda</td>
//                 <td>20</td>
//                 <td>Brasil</td>
//             </tr>
//             <tr>
//                 <td>Brenda</td>
//                 <td>25</td>
//                 <td>EUA</td>
//             </tr>
//             <tr>
//                 <td>Carlos</td>
//                 <td>30</td>
//                 <td>Japão</td>
//             </tr>
//         </tbody>
//     </table>
//     `
// }
// retHtmlToJson = await htmlToJson(infHtmlToJson)
// console.log(retHtmlToJson.res)

// infHtmlToJson = {
//     'e': e, 'mode': 3,
//     // TEM O CABEÇALHO [SIM → PRIMEIRO VALOR]
//     html:
//         `
//     <table>
//         <tbody>
//             <tr>
//                 <td>VALOR 1</td>
//                 <td>VALOR 2</td>
//                 <td>VALOR 3</td>
//             </tr>
//             <tr>
//                 <td>Amanda</td>
//                 <td>20</td>
//                 <td>Brasil</td>
//             </tr>
//             <tr>
//                 <td>Brenda</td>
//                 <td>25</td>
//                 <td>EUA</td>
//             </tr>
//             <tr>
//                 <td>Carlos</td>
//                 <td>30</td>
//                 <td>Japão</td>
//             </tr>
//         </tbody>
//     </table>
//     `
// }
// retHtmlToJson = await htmlToJson(infHtmlToJson)
// console.log(retHtmlToJson.res)

let e = import.meta.url, ee = e
async function htmlToJson(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        let errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
    try {
        if (!`rodar no →  NODEJS`.includes(engName)) { // [ENCAMINHAR PARA DEVICE]
            let infDevAndFun = { 'e': e, 'enc': true, 'data': { 'name': 'htmlToJson', 'par': inf, 'retInf': inf.retInf } };
            let retDevAndFun = await devFun(infDevAndFun); return retDevAndFun
        };

        let $ = _cheerio.load(inf.html);
        let result = [], headers = [], randomCol = inf.mode == 1 ? false : true
        let hasHeader = $('table thead').length > 0;

        // SE CONTEM O CABEÇALHO 
        if (hasHeader) {
            $('table thead th').each((i, header) => {
                headers.push(randomCol ? `col${i + 1}` : $(header).text().trim());
            });
        }
        $('table tbody tr').each((index, row) => {
            let rowData = {};
            $(row).find('td').each((i, cell) => {
                let key = hasHeader ? headers[i] : `col${i + 1}`;
                rowData[key] = $(cell).text().trim();
            });
            if (!hasHeader && index === 0) {
                result.push(Object.fromEntries(Object.entries(rowData).map(([key, value]) => [key, value])));
            } else {
                result.push(rowData);
            }
        });

        if (inf.mode == 3) {
            let keys = Object.values(result[0]);
            result = result.slice(1).map(obj => {
                let newObj = {};
                keys.forEach((key, index) => {
                    newObj[key] = obj[`col${index + 1}`];
                });
                return newObj;
            });
        }

        ret['ret'] = true;
        ret['msg'] = `HTML TO JSON: OK`;
        ret['res'] = JSON.stringify(result);

        // ### LOG FUN ###
        if (inf && inf.logFun) {
            let infFile = { 'e': e, 'action': 'write', 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }
            infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; file(infFile);
        }
    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, 'catchGlobal': false });
        ret['msg'] = retRegexE.res
    };
    return {
        ...({ ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}

if (eng) { // CHROME
    window['htmlToJson'] = htmlToJson;
} else { // NODEJS
    global['htmlToJson'] = htmlToJson;
}
