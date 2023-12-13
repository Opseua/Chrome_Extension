// let infHtmlToJson, retHtmlToJson // 'logFun': true,
// infHtmlToJson = {
//     'randomCol': false,
//     'html': `

//     <table>
//     <thead>
//       <tr>
//         <th>Nome</th>
//         <th>Idade</th>
//         <th>País</th>
//       </tr>
//     </thead>
//     <tbody>
//       <tr>
//         <td>João</td>
//         <td>25</td>
//         <td>Brasil</td>
//       </tr>
//       <tr>
//         <td>Maria</td>
//         <td>30</td>
//         <td>Portugal</td>
//       </tr>
//       <tr>
//         <td>Carlos</td>
//         <td>22</td>
//         <td>Espanha</td>
//       </tr>
//     </tbody>
//   </table>

//  ` }
// retHtmlToJson = await htmlToJson(infHtmlToJson)
// console.log(retHtmlToJson)

let e = import.meta.url;
async function htmlToJson(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        const errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; let retRegexE = await regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
    try {
        if (!`rodar no →  NODEJS`.includes(engName)) { // [ENCAMINHAR PARA DEVICE]
            let infDevAndFun = { 'enc': true, 'data': { 'name': 'htmlToJson', 'par': inf, 'retInf': inf.retInf } };
            let retDevAndFun = await devFun(infDevAndFun); return retDevAndFun
        };

        let $ = _cheerio.load(inf.html);
        let columnNames = [], tableData = []
        $('table tbody tr').each((index, row) => {
            let columns = $(row).find('td');
            let rowData = {};
            // Se ainda não tiver os nomes das colunas, obtenha-os do primeiro objeto
            if (index === 0 && columnNames.length === 0) {
                columns.each((colInd, column) => {
                    columnNames.push($(column).text().trim());
                });
            } else {
                // Adiciona os dados usando os nomes reais das colunas
                columns.each((colInd, column) => {
                    let columnName
                    if (inf.randomCol) {
                        columnName = 'colInd' + colInd; // NOME DAS COLUNAS 'col0', 'col1', 'col2'...
                    } else {
                        columnName = columnNames[colInd]; // NOME REAL DAS COLUNAS
                    }
                    rowData[columnName] = $(column).text().trim();
                });
                tableData.push(rowData);
            }
        });
        ret['ret'] = true;
        ret['msg'] = `HTML TO JSON: OK`;
        ret['res'] = JSON.stringify(tableData);

        // ### LOG FUN ###
        if (inf && inf.logFun) {
            let infFile = { 'e': e, 'action': 'write', 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }, retFile
            infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; retFile = await file(infFile);
        }
    } catch (e) {
        let retRegexE = await regexE({ 'inf': inf, 'e': e, 'catchGlobal': false });
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
