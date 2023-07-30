await import('./functions.js');

await import('./sniffer.js');
const infSniffer = { 'arrUrl': ['https://excel.officeapps.live.com/x/_vti_bin/DynamicGridContent.json/GetRangeContentJson?context=*'] }
const retSniffer = await sniffer(infSniffer)
const infRegex = { 'pattern': 'SessionId%22%3A%22(.*?)%22%2C%22TransientEditSessionToken', 'text': retSniffer.res.url }
const retRegex = regex(infRegex)
const token = decodeURIComponent(retRegex.res.text)
console.log(token)


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

const sendBody = { 'context': { 'WorkbookMetadataParameter': { 'WorkbookMetadataState': { 'MetadataVersion': 1, 'ServerEventVersion': 0 } }, /*'ClientRequestId': '8a988f77-5712-42cc-933e-8f1dadc75887',*/ 'InstantaneousType': 1, 'MakeInstantaneousChange': true, 'SessionId': token, /* 'TransientEditSessionToken': 'sSxzGr3fA0iKu73ljR8vEQ==', */ 'PermissionFlags': 786431, 'Configurations': 5767952, 'CompleteResponseTimeout': 0, 'IsWindowHidden': false, 'IsWindowVisible': true, 'CollaborationParameter': { 'CollaborationState': { 'UserListVersion': sendLinD, 'CollabStateId': 72 } }, 'MachineCluster': 'BR2', 'AjaxOptions': 0, 'ReturnSheetProcessedData': false, 'ActiveItemId': 'Sheet4', 'ViewportStateChange': { 'SheetViewportStateChanges': [{ 'SheetName': 'CQPT', 'SelectedRanges': { 'SheetName': 'CQPT', 'NamedObjectName': '', 'Ranges': [{ 'FirstRow': sendLin, 'FirstColumn': sendColNum, 'LastRow': sendLin, 'LastColumn': 0 }] }, 'ActiveCell': sendColLin }] }, 'MergeCount': { 'Current': 14, 'Pending': 14, 'SuspensionStartTimestamp': null }, 'ClientRevisions': { 'Min': 72, 'Max': 72, 'MaxFromBlockCache': 72 }, 'HasAnyNonOcsCoauthor': false, 'PaneType': 1, 'CellHtml': '', 'CellIfmt': 30, 'OriginalIfmt': 30 }, 'ewaControlId': 'm_excelWebRenderer_ewaCtl_m_ewa', 'currentObject': 'CQPT', 'isNamedItem': false, 'revision': 72, 'activeCell': { 'SheetName': 'CQPT', 'NamedObjectName': '', 'FirstRow': sendLinT, 'FirstColumn': sendColNum }, 'formattedText': { 'Text': send, 'Fonts': null, 'TextRuns': null }, 'row': sendLinT, 'column': 0, 'rowCount': 1, 'columnCount': 30, 'setCellRanges': { 'SheetName': 'CQPT', 'NamedObjectName': '', 'Ranges': [{ 'FirstRow': sendLinT, 'FirstColumn': sendColNum, 'LastRow': sendLinT, 'LastColumn': 0 }] }, 'comboKey': 0, 'allowedSetCellModes': 127, 'renderingOptions': 0, 'richValueParameter': { 'ParameterType': 5 }, 'colorScheme': null }

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


