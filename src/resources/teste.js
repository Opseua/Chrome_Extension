await import('./functions.js');

let sendCol = 'A'
let sendLin = 11
const send = dateHour().res.mil


function colLin(column) {
    var result = 0; for (var i = 0; i < column.length; i++) {
        result *= 26;
        result += column.charCodeAt(i) - 'A'.charCodeAt(0) + 1;
    } return result;
}

sendCol = sendCol.toUpperCase()
let sendLinT = Number(sendLin) - 1
let sendLinD = Number(sendLin) + 1
let sendColLin = `${sendCol}${sendLin}`
let sendColNum = colLin(sendCol) - 1

const sendBody = { 'context': { 'WorkbookMetadataParameter': { 'WorkbookMetadataState': { 'MetadataVersion': 1, 'ServerEventVersion': 0 } }, /*'ClientRequestId': '8a988f77-5712-42cc-933e-8f1dadc75887',*/ 'InstantaneousType': 1, 'MakeInstantaneousChange': true, 'SessionId': '15.CP1PEPF00000B9B1.A108.1.U36.4ef22f6f-42c5-4d5d-a5df-09e4d407574d14.5.pt-BR5.pt-BR16.e3f16b7a20292bbb1.S24.oVLd/wrfwEqa9Q+EL6oJgA==16.16.0.16725.4230214.5.pt-BR5.pt-BR1.M1.N0.1.S', /* 'TransientEditSessionToken': 'sSxzGr3fA0iKu73ljR8vEQ==', */ 'PermissionFlags': 786431, 'Configurations': 5767952, 'CompleteResponseTimeout': 0, 'IsWindowHidden': false, 'IsWindowVisible': true, 'CollaborationParameter': { 'CollaborationState': { 'UserListVersion': sendLinD, 'CollabStateId': 72 } }, 'MachineCluster': 'BR2', 'AjaxOptions': 0, 'ReturnSheetProcessedData': false, 'ActiveItemId': 'Sheet4', 'ViewportStateChange': { 'SheetViewportStateChanges': [{ 'SheetName': 'CQPT', 'SelectedRanges': { 'SheetName': 'CQPT', 'NamedObjectName': '', 'Ranges': [{ 'FirstRow': sendLin, 'FirstColumn': sendColNum, 'LastRow': sendLin, 'LastColumn': 0 }] }, 'ActiveCell': sendColLin }] }, 'MergeCount': { 'Current': 14, 'Pending': 14, 'SuspensionStartTimestamp': null }, 'ClientRevisions': { 'Min': 72, 'Max': 72, 'MaxFromBlockCache': 72 }, 'HasAnyNonOcsCoauthor': false, 'PaneType': 1, 'CellHtml': '', 'CellIfmt': 30, 'OriginalIfmt': 30 }, 'ewaControlId': 'm_excelWebRenderer_ewaCtl_m_ewa', 'currentObject': 'CQPT', 'isNamedItem': false, 'revision': 72, 'activeCell': { 'SheetName': 'CQPT', 'NamedObjectName': '', 'FirstRow': sendLinT, 'FirstColumn': sendColNum }, 'formattedText': { 'Text': send, 'Fonts': null, 'TextRuns': null }, 'row': sendLinT, 'column': 0, 'rowCount': 1, 'columnCount': 30, 'setCellRanges': { 'SheetName': 'CQPT', 'NamedObjectName': '', 'Ranges': [{ 'FirstRow': sendLinT, 'FirstColumn': sendColNum, 'LastRow': sendLinT, 'LastColumn': 0 }] }, 'comboKey': 0, 'allowedSetCellModes': 127, 'renderingOptions': 0, 'richValueParameter': { 'ParameterType': 5 }, 'colorScheme': null }

const infApi = {
    url: `https://excel.officeapps.live.com/x/_vti_bin/EwaInternalWebService.json/SetRichTextCell?waccluster=BR2`,
    method: 'POST',
    headers: {
        "content-type": "application/json; charset=UTF-8"
    },
    body: JSON.stringify(sendBody)
};
const retApi = await api(infApi);
console.log(retApi.res)


console.log(send)




// const infApi = {
//     url: `https://excel.officeapps.live.com/x/_layouts/xlviewerinternal.aspx?unified=1&ui=pt-BR&rs=pt-BR&hid=u0a7nkAKbEy7cnqiozAKwQ.0&wopisrc=https%3A%2F%2Fwopi.onedrive.com%2Fwopi%2Ffiles%2FE3F16B7A20292BBB!16738&wdorigin=OFFICECOM-WEB.START.EDGEWORTH&wdprevioussessionsrc=HarmonyWeb&wdprevioussession=62f980e0-a1a2-437f-84db-f1b730a853b2&wde=xlsm&sc=host%3D%26qt%3DDefault&mscc=1&wdp=0&uih=OneDrive&jsapi=1&jsapiver=v2&corrid=06905d9e-288c-4edb-a703-6146f2eceb06&usid=06905d9e-288c-4edb-a703-6146f2eceb06&newsession=1&sftc=1&mtf=1&wdredirectionreason=Force_SingleStepBoot&instantedit=1`,
//     method: 'POST',
//     headers: {
//         // "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
//         // "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
//         // "cache-control": "max-age=0",
//         "content-type": "application/x-www-form-urlencoded",
//         // "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Google Chrome\";v=\"114\"",
//         // "sec-ch-ua-mobile": "?0",
//         // "sec-ch-ua-platform": "\"Windows\"",
//         // "sec-fetch-dest": "iframe",
//         // "sec-fetch-mode": "navigate",
//         // "sec-fetch-site": "same-site",
//         // "upgrade-insecure-requests": "1",
//         //"cookie": "ExcelIsPreviousSessionSimplifiedRibbonOn=true; PLTCoreResourcesPrefetchCookie=%7B%22Wok%22%3A%2216.0.16725.42302%22%2C%22%24oj%22%3A%2216.0.16727.42307%22%2C%22timeStamp%22%3A1690702989800%7D; PageLoadSkeletonState=%7B%22IsEnabled%22%3Atrue%2C%22Options%22%3A3140%7D; timeZoneId=America%2FSao_Paulo; PPLState=1; MSPAuth=Disabled; MSPProf=Disabled; NAP=V=1.9&E=1c31&C=gkFXas5lDB3DffsoY50lJCNvKb3cQDLjWLFaAnJsKUlMVHUsekG1AQ&W=1; ANON=A=6834FE5B04DD35EE6DD44138FFFFFFFF&E=1c8b&W=1; mkt=pt-BR; wlidperf=FR=L&ST=1688799800543; RPSSecAuth=FACGARRfNdV9BksQq3NKbMc4RaXgkCWnEA5mAAAMgAAAEEB53OUxAp3FmLBMcaD0UCAwAVIPiGp39/h4oeAamDbrFUpZntqRHCzPpoKF5LSCU3OXKPek8hHtc8o%2BXx/DAQW7kDDTyBco6QWrXEaRnV%2B0s%2BPiAjpFBEqad35ermYv0I2s127YhPA%2B2FxTi96CJyB7VDFO6vrT64fMJ%2B2r9qrX4F6jB4rKjkoL%2BtJXt6XdYwE0VbHpZv4CS5rFBFohmhvgHbFt4byNzreeME5yuOhBSZ33gkjM%2BxWdzSFzQZ%2BrKqvyfVa6xzNuro53v3bLHRiA5Rzaa%2BqUptDp4cAOW5VY3JBkVfFusB/aPvk2HWN2kMwROHJuk1179CGpU7L/7sXVCmpDyZLkkG9WBuZI%2Bdmdd7tbeTz386MW8OO639UnOMCY21QL5Do3JgbSr78G1nb08579flZeJITMUCVuaeS3No8gAPED6DDW9b0xmMlpcuQow1EBS2Yshp25xb3ILo3Jqcpm; MUID=3CFEE01347226B3304A6F34543226F06; wla42=; WLSSC=EgA6AgMAAAAMgAAADwABUhIUmzbiq0slS4EOcQ2/7jzqRkBDI3A3X3HH7QJ7aKuZbPPXCQBM1VyJzqO4zcjtzhw/XhqssgmyUyPkflX7vsYSA6G8igwrTb6mFhD690zm26WSvPILvQZRyAhMV4+8gzX67PrmgcPE+OwOAVwPFgU9ALwgeYOiqrlyxo+XJQqUCWZ4k4x3sX2/hjwCA2+qJoJWOLYwn2uzHYZSFLttJKUCSK6OZPFWgUxyCawqtnN3VJXuRTHHl0SkbAmP5txHxUknXLMsjzg/gs3EzAZeLWVM1No3ddAccbKp3B1nz6aYJ0Q2+WV9OnQ7fTRptyi0ja66Q/dB7rl+1+KXXISvWikBfgApAQBABgBMzIuwY//FZDkKqWQQJwAAChOgABAeAG9ybGFuZG8ucGVyZWlyYTM4QGhvdG1haWwuY29tAGYAAB1vcmxhbmRvLnBlcmVpcmEzOEBob3RtYWlsLmNvbQAABthCUgAJMjMwMTItMTIwAABsqgQWAgAAh/htQBAEQwAHT3JsYW5kbwALQ29ubmVjdGljdXQEfAAAAAAAAAAAAAAAAAABAAAgKSu74/FregAAY//FZDmxH2UAAAAAAAAAAAAAAAANADE4OS45NS44Ny40NQAFBwAAAAAAAAAAAAAAABAEAAAAAAAAAAAA/sm3VQAA8F7eUIVkhN4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAA; xid=4d1a3e36-92c8-4c2d-ab10-2597532cf2dd&j21Ev&RD00155D749F6A&254; BR2-Excel-ARRAffinity=8767ff5f633fb82451e9f2b385ee510abcae908a6b7fae999a9d8e97fd1e6e68; ShCLSessionID=1690697580230_0.025672443425810654; BR2-ARRAffinity=a2be49c8d56d1aac37acc1d6335c8c0fd43e67dd4f9297b9c76797744554f34a; E=P:HD6JaNSQ24g=:PPVw3SCfC/mfLj8KGjxtEXjV2b4WB0ADC2qJ/ErCDKQ=:F; xidseq=14",
//         // "Referer": "https://onedrive.live.com/",
//         // "Referrer-Policy": "origin-when-cross-origin"
//     },
//     body: 'highdpi=true&softblockedbrowser=false&hostname=OneDrive&feature_status=%7B%7D&jsapibuild=16.0.16719.42309&access_token_ttl=1692519017777&filename=WELOCALIZE+%28Excel%29+old.xlsm&fileextension=xlsm&filegeturl=https%3A%2F%2F5e9dla.bn.files.1drv.com%2Fy4mufJjoAFNvlOwBBKVXU6XjbaOtSG8LGBsgp1TMOyKv2VsTGvvSVO-g7yWkpHJpNq_YquJTVFYXujkr84xtenfJF95Sw6QRT-fSWs1_zum1C-YBCQsPiO-TYNbZ22HkZah3amnqjQNTWdPGyejRB18CHFsFLagUSsCrht3raeL1gUeDML1BGhGLS20sr4O96Md%2FWELOCALIZE%2520%2528Excel%2529%2520old.xlsm%3Fdownload%26psid%3D1&filesize=522363&etag=E3F16B7A20292BBB%2116738.140&docid=E3F16B7A20292BBB%2116738&user_id=e3f16b7a20292bbb&owner_id=e3f16b7a20292bbb&host_diagnostics=%7B%22HostInitializeDiagnostics%22%3A%7B%22entryPoint%22%3A%22OFFICECOM-WEB.START.EDGEWORTH%22%2C%22hostPageNavigationStartTime%22%3A1690704614352%2C%22hostPageFetchStartTime%22%3A1690704614365%2C%22hostPageResponseStartTime%22%3A1690704617825%2C%22hostPageFirstFlushTime%22%3A1690704616933%2C%22officeBootstrapperStartTime%22%3A1690704617048%2C%22officeBootstrapperEndTime%22%3A1690704617170%2C%22officeInitializationTime%22%3A1690704617174%2C%22hostInitializeCallTime%22%3A1690704617180%2C%22hostPageRequestStartTime%22%3A1690704614365%2C%22hostPageResponseEndTime%22%3A1690704616181%2C%22hostPageDomCompleteTime%22%3A0%2C%22hostPageRedirectCount%22%3A0%2C%22hostPageNavigationType%22%3A%22RELOAD%22%7D%2C%22ClientDiagnostics%22%3A%7B%22perfNowSupported%22%3Atrue%2C%22browser%22%3A%22Chrome%22%2C%22touchMode%22%3Afalse%2C%22highContrast%22%3Afalse%2C%22netDownlink%22%3A3.85%2C%22netEffectiveType%22%3A%224g%22%2C%22netRtt%22%3A150%2C%22netSaveData%22%3Afalse%2C%22deviceMemory%22%3A8%2C%22logicalProcessors%22%3A8%7D%7D&hfck=XlHc_-452603419&hfcv=%7B%22ViewportCacheItem%22%3A%7B%22SheetName%22%3A%22CQPT%22%2C%22Top%22%3A5%2C%22Left%22%3A1%2C%22ActiveCellTop%22%3A12%2C%22ActiveCellLeft%22%3A1%2C%22FirstFrozenRow%22%3A1%2C%22FirstScrollableRow%22%3A5%2C%22FirstFrozenColumn%22%3A-1%2C%22FirstScrollableColumn%22%3A1%2C%22OffsetWithinRangePxX%22%3A0%2C%22OffsetWithinRangePxY%22%3A0%2C%22PanesWidthPx%22%3A0%2C%22PanesHeightPx%22%3A78%2C%22AppZoom%22%3A-1%7D%2C%22LastModified%22%3A1690715354148%7D&timezoneid=America%2FSao_Paulo&frameheightpx=714&framewidthtpx=1134&touchmode=false&highcontrast=false&forceslr=undefined&darkcssmedia=true'
// };
// const retApi = await api(infApi);
// if (retApi.res.body.includes('\\",\\"SessionId\\":\\"')) {
//     console.log('sim')
// } else {
//     console.log('nao')
// }
// //console.log(retApi.res)
// // const infRegex = { 'pattern': '\\\\",\\\\"SessionId\\\\":\\\\"(.*?)\\\\",\\\\"StateId\\\\":', 'text': retApi.res.body}
// // const retRegex = regex(infRegex)
// // console.log(retRegex.res.text)



