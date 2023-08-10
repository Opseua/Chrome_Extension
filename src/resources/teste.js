
// let ret = { 'ret': false };
// const text2 = `UMDOISTRESQUATROTRES`
// const text = `UMDOISTRES
// QUATRO
// TRES`
// const inf = { 'pattern': 'UM(.*?)TRES', 'text': text }

// if (inf.pattern.includes('(.*?)')) {
//     let res = {}
//     const patternSplit = inf.pattern.split('(.*?)');
//     const split1 = patternSplit[0].replace(/[.+?^${}()|[\]\\]/g, '\\$&')
//     const split2 = patternSplit[1].replace(/[.+?^${}()|[\]\\]/g, '\\$&')
//     const result1 = inf.text.match(`${split1}(.*?)${split2}`);
//     const result2 = inf.text.match(`${split1}([\\s\\S]*?)${split2}`);
//     const result3 = inf.text.match(`(?<=${split1})(.+)(?=${split2})`);
//     const result4 = inf.text.match(`(?<=${split1})([\\s\\S]+)(?=${split2})`);

//     if (result1 && result1.length > 0) {
//         res['1'] = result1[1]
//     } else {
//         res['1'] = `[-|<] PADRAO '${inf.pattern}' NAO ENCONTRADO`
//     }
//     if (result2 && result2.length > 0) {
//         res['2'] = result2[1]
//     } else {
//         res['2'] = `[^|<] PADRAO '${inf.pattern}' NAO ENCONTRADO`
//     }
//     if (result3 && result3.length > 0) {
//         res['3'] = result3[1]
//     } else {
//         res['3'] = `[-|>] PADRAO '${inf.pattern}' NAO ENCONTRADO`
//     }
//     if (result4 && result4.length > 0) {
//         res['4'] = result4[1]
//     } else {
//         res['4'] = `[^|>] PADRAO '${inf.pattern}' NAO ENCONTRADO`
//     }


//     console.log(res)

// }

await import('./functions.js');
const text2 = `UMDOISTRESQUATROTRES`
const text = `UM
DOISTRES
QUATRO
TRES`
const infRegex = { 'pattern': 'UM(.*?)TRES', 'text': text }
const retRegex = regex(infRegex)
console.log(retRegex)

