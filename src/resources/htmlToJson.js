// let infHtmlToJson, retHtmlToJson
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

async function htmlToJson(inf) {
    await import('./@functions.js');
    let ret = { 'ret': false };
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
                columns.each((colIndex, column) => {
                    columnNames.push($(column).text().trim());
                });
            } else {
                // Adiciona os dados usando os nomes reais das colunas
                columns.each((colIndex, column) => {
                    let columnName
                    if (inf.randomCol) {
                        columnName = 'colIndex' + colIndex; // NOME DAS COLUNAS 'col0', 'col1', 'col2'...
                    } else {
                        columnName = columnNames[colIndex]; // NOME REAL DAS COLUNAS
                    }
                    rowData[columnName] = $(column).text().trim();
                });
                tableData.push(rowData);
            }
        });
        ret['ret'] = true;
        ret['msg'] = `HTML TO JSON: OK`;
        ret['res'] = JSON.stringify(tableData);
    } catch (e) {
        let m = await regexE({ 'e': e });
        ret['msg'] = m.res
    };
    return ret
}

if (typeof eng === 'boolean') {
    if (eng) { // CHROME
        window['htmlToJson'] = htmlToJson;
    } else { // NODEJS
        global['htmlToJson'] = htmlToJson;
    }
}