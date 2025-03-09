// → NO FINAL DA PÁGINA

let e = import.meta.url, ee = e; let libs = ['cheerio',];
async function htmlToJson(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        /* IMPORTAR BIBLIOTECA [NODEJS] */ if (libs.length > 0) { libs = await importLibs(libs, [{ 'm': 'cheerio', 'l': ['cheerio',], },]); }

        let { html, mode, } = inf;

        let $ = _cheerio.load(html); let result = [], headers = [], randomCol = !(mode === 1); let hasHeader = $('table thead').length > 0;

        // SE CONTEM O CABEÇALHO 
        if (hasHeader) { $('table thead th').each((i, header) => { headers.push(randomCol ? `col${i + 1}` : $(header).text().trim()); }); }
        $('table tbody tr').each((index, row) => {
            let rowData = {}; $(row).find('td').each((i, cell) => { let key = hasHeader ? headers[i] : `col${i + 1}`; rowData[key] = $(cell).text().trim(); });
            if (!hasHeader && index === 0) { result.push(Object.fromEntries(Object.entries(rowData).map(([key, value,]) => [key, value,]))); }
            else { result.push(rowData); }
        });

        if (mode === 3) { let keys = Object.values(result[0]); result = result.slice(1).map(obj => { let newObj = {}; keys.forEach((key, index) => { newObj[key] = obj[`col${index + 1}`]; }); return newObj; }); }

        ret['ret'] = true;
        ret['msg'] = `HTML TO JSON: OK`;
        ret['res'] = JSON.stringify(result);

    } catch (catchErr) {
        let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    }

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.res && { 'res': ret.res, }), };
}

// CHROME | NODEJS
globalThis['htmlToJson'] = htmlToJson;

// // 'mode' 1 → CHAVE IGUAL O CABEÇALHO (SE TIVER)
// // 'mode' 2 → CHAVE ALEATÓRIA
// // 'mode' 3 → CHAVE IGUAL AO PRIMEIRO VALOR DA TABELA

// let infHtmlToJson, retHtmlToJson;
// infHtmlToJson = {
//     e, 'mode': 1,
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

// infHtmlToJson = {
//     e, 'mode': 2,
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
//     `,
// }

// infHtmlToJson = {
//     e, 'mode': 3,
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
//     `,
// }
// retHtmlToJson = await htmlToJson(infHtmlToJson); console.log(retHtmlToJson.res);