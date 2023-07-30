await import('./functions.js');

async function excel(inf) {
    let ret = { 'ret': false };
    try {
        let clientRequestId, sessionId, transientEditSessionToken, infConfigStorage, retConfigStorage
        infConfigStorage = { 'path': '/src/config.json', 'action': 'get', 'key': 'excel' }
        retConfigStorage = await configStorage(infConfigStorage);
        if (retConfigStorage.ret) {
            clientRequestId = retConfigStorage.res.clientRequestId
            sessionId = retConfigStorage.res.sessionId
            transientEditSessionToken = retConfigStorage.res.transientEditSessionToken
        } else {
            await import('./sniffer.js');
            const infSniffer = { 'arrUrl': ['https://excel.officeapps.live.com/x/_vti_bin/DynamicGridContent.json/GetRangeContentJson?context=*'] }
            const retSniffer = await sniffer(infSniffer)

            let infRegex = { 'pattern': 'ClientRequestId%22%3A%22(.*?)%22%2C%22InstantaneousType', 'text': retSniffer.res.url }
            let retRegex = regex(infRegex)
            clientRequestId = retRegex.res.text

            infRegex = { 'pattern': 'SessionId%22%3A%22(.*?)%22%2C%22TransientEditSessionToken', 'text': retSniffer.res.url }
            retRegex = regex(infRegex)
            sessionId = retRegex.res.text

            infRegex = { 'pattern': 'TransientEditSessionToken%22%3A%22(.*?)%22%2C%22PermissionFlags', 'text': retSniffer.res.url }
            retRegex = regex(infRegex)
            transientEditSessionToken = retRegex.res.text

            infConfigStorage = { 'path': '/src/config.json', 'action': 'set', 'key': 'excel', 'value': { 'clientRequestId': clientRequestId, 'sessionId': sessionId, 'transientEditSessionToken': transientEditSessionToken } }
            retConfigStorage = await configStorage(infConfigStorage);
        }

        let col = inf.col
        let lin = Number(inf.lin)
        function getColLin(column) {
            var result = 0; for (var i = 0; i < column.length; i++) {
                result *= 26;
                result += column.charCodeAt(i) - 'A'.charCodeAt(0) + 1;
            } return result;
        }
        col = col.toUpperCase()
        let linT = lin - 1
        let linD = lin + 1
        let colLin = `${col}${lin}`
        let colNum = getColLin(col) - 1

        if (inf.action == 'set') {
            const send = inf.value
            //const send = dateHour().res.mil
            const infApi = {
                url: `https://excel.officeapps.live.com/x/_vti_bin/EwaInternalWebService.json/SetRichTextCell?waccluster=BR2`,
                method: 'POST',
                headers: {
                    "content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({ 'context': { 'WorkbookMetadataParameter': { 'WorkbookMetadataState': { 'MetadataVersion': 1, 'ServerEventVersion': 0 } }, 'ClientRequestId': clientRequestId, 'InstantaneousType': 1, 'MakeInstantaneousChange': true, 'SessionId': decodeURIComponent(sessionId), 'TransientEditSessionToken': decodeURIComponent(transientEditSessionToken), 'PermissionFlags': 786431, 'Configurations': 5767952, 'CompleteResponseTimeout': 0, 'IsWindowHidden': false, 'IsWindowVisible': true, 'CollaborationParameter': { 'CollaborationState': { 'UserListVersion': linD, 'CollabStateId': 72 } }, 'MachineCluster': 'BR2', 'AjaxOptions': 0, 'ReturnSheetProcessedData': false, 'ActiveItemId': 'Sheet4', 'ViewportStateChange': { 'SheetViewportStateChanges': [{ 'SheetName': 'CQPT', 'SelectedRanges': { 'SheetName': 'CQPT', 'NamedObjectName': '', 'Ranges': [{ 'FirstRow': lin, 'FirstColumn': colNum, 'LastRow': lin, 'LastColumn': 0 }] }, 'ActiveCell': colLin }] }, 'MergeCount': { 'Current': 14, 'Pending': 14, 'SuspensionStartTimestamp': null }, 'ClientRevisions': { 'Min': 72, 'Max': 72, 'MaxFromBlockCache': 72 }, 'HasAnyNonOcsCoauthor': false, 'PaneType': 1, 'CellHtml': '', 'CellIfmt': 30, 'OriginalIfmt': 30 }, 'ewaControlId': 'm_excelWebRenderer_ewaCtl_m_ewa', 'currentObject': 'CQPT', 'isNamedItem': false, 'revision': 72, 'activeCell': { 'SheetName': 'CQPT', 'NamedObjectName': '', 'FirstRow': linT, 'FirstColumn': colNum }, 'formattedText': { 'Text': send, 'Fonts': null, 'TextRuns': null }, 'row': linT, 'column': 0, 'rowCount': 1, 'columnCount': 30, 'setCellRanges': { 'SheetName': 'CQPT', 'NamedObjectName': '', 'Ranges': [{ 'FirstRow': linT, 'FirstColumn': colNum, 'LastRow': linT, 'LastColumn': 0 }] }, 'comboKey': 0, 'allowedSetCellModes': 127, 'renderingOptions': 0, 'richValueParameter': { 'ParameterType': 5 }, 'colorScheme': null })
            };
            const retApi = await api(infApi);
            if ((retApi.ret) && (retApi.res.body.toString().includes(`,"Text":"${send}","`))) {
                ret['ret'] = true;
                ret['msg'] = `EXCEL: OK`;
            } else {
                infConfigStorage = { 'path': '/src/config.json', 'action': 'del', 'key': 'excel' }
                retConfigStorage = await configStorage(infConfigStorage)
                ret['msg'] = `\n #### ERRO ####  EXCEL \n NAO CONSEGUIU ENVIAR A INFORMACAO \n\n`;
            }
        } else if (inf.action == 'get') {
            let infApi
            if (lin < 5) {
                infApi = {
                    url: `https://excel.officeapps.live.com/x/_vti_bin/DynamicGridContent.json/GetRangeContentJson?context=%7B%22WorkbookMetadataParameter%22%3A%7B%22WorkbookMetadataState%22%3A%7B%22MetadataVersion%22%3A0%2C%22ServerEventVersion%22%3A0%7D%7D%2C%22ClientRequestId%22%3A%22${clientRequestId}%22%2C%22InstantaneousType%22%3A0%2C%22MakeInstantaneousChange%22%3Afalse%2C%22SessionId%22%3A%22${sessionId}%22%2C%22TransientEditSessionToken%22%3A%22${transientEditSessionToken}%22%2C%22PermissionFlags%22%3A786431%2C%22Configurations%22%3A5767952%2C%22CompleteResponseTimeout%22%3A0%2C%22IsWindowHidden%22%3Afalse%2C%22IsWindowVisible%22%3Atrue%2C%22CollaborationParameter%22%3A%7B%22CollaborationState%22%3A%7B%22UserListVersion%22%3A2%2C%22CollabStateId%22%3A1%7D%7D%2C%22MachineCluster%22%3A%22BR2%22%2C%22AjaxOptions%22%3A0%2C%22ReturnSheetProcessedData%22%3Afalse%2C%22ActiveItemId%22%3A%22Sheet4%22%7D&ewaControlId=%22m_excelWebRenderer_ewaCtl_m_ewa%22&currentObject=%22CQPT%22&namedObjectViewData=%7B%22Mode%22%3A1%2C%22Settings%22%3A0%7D&row=0&column=${colNum}&rowCount=1&columnCount=1&blockPosition=%7B%22X%22%3A0%2C%22Y%22%3A0%2C%22PaneType%22%3A3%7D&revision=1&previousRevision=-1&digest=%22%22&renderingOptions=16&colorScheme=null&ecsSpreadsheetDigest=%223920761415%22&waccluster=BR2`,
                    method: 'GET',
                    headers: { "content-type": "application/json; charset=utf-8", }
                }
            } else {
                lin = lin - 5
                infApi = {
                    url: `https://excel.officeapps.live.com/x/_vti_bin/DynamicGridContent.json/GetRangeContentJson?context=%7B%22WorkbookMetadataParameter%22%3A%7B%22WorkbookMetadataState%22%3A%7B%22MetadataVersion%22%3A0%2C%22ServerEventVersion%22%3A0%7D%7D%2C%22ClientRequestId%22%3A%22${clientRequestId}%22%2C%22InstantaneousType%22%3A0%2C%22MakeInstantaneousChange%22%3Afalse%2C%22SessionId%22%3A%22${sessionId}%22%2C%22TransientEditSessionToken%22%3A%22${transientEditSessionToken}%22%2C%22PermissionFlags%22%3A786431%2C%22Configurations%22%3A5767952%2C%22CompleteResponseTimeout%22%3A0%2C%22IsWindowHidden%22%3Afalse%2C%22IsWindowVisible%22%3Atrue%2C%22CollaborationParameter%22%3A%7B%22CollaborationState%22%3A%7B%22UserListVersion%22%3A2%2C%22CollabStateId%22%3A1%7D%7D%2C%22MachineCluster%22%3A%22BR2%22%2C%22AjaxOptions%22%3A0%2C%22ReturnSheetProcessedData%22%3Afalse%2C%22ActiveItemId%22%3A%22Sheet4%22%2C%22HasAnyNonOcsCoauthor%22%3Afalse%7D&ewaControlId=%22m_excelWebRenderer_ewaCtl_m_ewa%22&currentObject=%22CQPT%22&namedObjectViewData=%7B%22Mode%22%3A1%2C%22Settings%22%3A0%7D&row=${lin}&column=${colNum}&rowCount=1&columnCount=1&blockPosition=%7B%22X%22%3A0%2C%22Y%22%3A7%2C%22PaneType%22%3A1%7D&revision=1&previousRevision=-1&digest=%22%22&renderingOptions=16&colorScheme=null&ecsSpreadsheetDigest=%223274680637%22&waccluster=BR2`,
                    method: 'GET',
                    headers: { "content-type": "application/json; charset=utf-8", }
                }
            }
            const retApi = await api(infApi);
            if ((retApi.ret) && (retApi.res.body.toString().includes(`GridBlockModelJson`))) {
                let res = JSON.parse(retApi.res.body)
                res = JSON.parse(res.d.Result.GridBlockModelJson)
                ret['ret'] = true;
                ret['msg'] = `EXCEL: OK`;
                console.log(res.Cells)
                ret['res'] = res.Cells[0].Text;
            } else {
                infConfigStorage = { 'path': '/src/config.json', 'action': 'del', 'key': 'excel' }
                retConfigStorage = await configStorage(infConfigStorage)
                ret['msg'] = `\n #### ERRO ####  EXCEL \n NAO CONSEGUIU PEGAR A INFORMACAO \n\n`;
            }
        }

    } catch (e) {
        ret['msg'] = regexE({ 'e': e }).res
    }

    if (!ret.ret) { console.log(ret.msg) }
    return ret
}

// export { excel }

if (typeof window !== 'undefined') { // CHROME
    window['excel'] = excel;
} else if (typeof global !== 'undefined') { // NODE
    global['excel'] = excel;
}












