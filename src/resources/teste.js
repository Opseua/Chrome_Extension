// async function sniffer(inf) {
//     let ret = { 'ret': false, 'res': { 'req': {}, 'res': {} } };

//     return new Promise(resolve => {
//         let lisOnBeforeRequest, lisOnBeforeSendHeaders, lisOnCompleted
//         function snifferOff(inf) {

//             if (inf) { console.log('sniffer parou');return } else { console.log('sniffer off'); resolve(ret) }
//         }
//         try {
//             gO.inf = { 'sniffer': 1 }
//             const gOEve = async (i) => { if (i.inf.sniffer === 2) { gO.inf = { 'sniffer': 0 }; gORem(gOEve); snifferOff(true) } };
//             gOAdd(gOEve);

//         } catch (e) {
//             ret['msg'] = regexE({ 'e': e }).res
//             ret['msg'] = `\n #### ERRO ####  CONFIG SET \n INFORMAR A 'key' \n\n`;
//             console.log(ret.msg)
//             snifferOff()
//         }
//     });

// }


