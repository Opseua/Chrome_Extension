// let infExcel, retExcel, lin // CQPT    KQRE
// infExcel = { 'action': 'get', 'tab': 'KQRE', 'col': 'A', 'lin': 1 }
// retExcel = await excel(infExcel)

// infExcel = { 'action': 'set', 'tab': 'KQRE', 'col': 'A', 'lin': lin, 'value': `A ${lin} B` }
// retExcel = await excel(infExcel)
// console.log(retExcel)

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

        let tab = inf.tab
        let col = inf.col
        let lin = Number(inf.lin)
        let value = inf.value

        if (inf.action == 'set' && !lin) {
            let infExcel, retExcel
            infExcel = { 'action': 'get', 'tab': tab, 'col': col, 'lin': 1 }
            retExcel = await excel(infExcel)

            infExcel = { 'action': 'set', 'tab': tab, 'col': col, 'lin': retExcel.res, 'value': value }
            retExcel = await excel(infExcel)
            return retExcel
        }

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
            const infApi = {
                url: `https://excel.officeapps.live.com/x/_vti_bin/EwaInternalWebService.json/SetRichTextCell?waccluster=BR2`,
                method: 'POST',
                headers: {
                    "content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({ 'context': { 'WorkbookMetadataParameter': { 'WorkbookMetadataState': { 'MetadataVersion': 1, 'ServerEventVersion': 0 } }, 'ClientRequestId': clientRequestId, 'InstantaneousType': 1, 'MakeInstantaneousChange': true, 'SessionId': decodeURIComponent(sessionId), 'TransientEditSessionToken': decodeURIComponent(transientEditSessionToken), 'PermissionFlags': 786431, 'Configurations': 5767952, 'CompleteResponseTimeout': 0, 'IsWindowHidden': false, 'IsWindowVisible': true, 'CollaborationParameter': { 'CollaborationState': { 'UserListVersion': linD, 'CollabStateId': 72 } }, 'MachineCluster': 'BR2', 'AjaxOptions': 0, 'ReturnSheetProcessedData': false, 'ActiveItemId': 'Sheet4', 'ViewportStateChange': { 'SheetViewportStateChanges': [{ 'SheetName': tab, 'SelectedRanges': { 'SheetName': tab, 'NamedObjectName': '', 'Ranges': [{ 'FirstRow': lin, 'FirstColumn': colNum, 'LastRow': lin, 'LastColumn': 0 }] }, 'ActiveCell': colLin }] }, 'MergeCount': { 'Current': 14, 'Pending': 14, 'SuspensionStartTimestamp': null }, 'ClientRevisions': { 'Min': 1, 'Max': 2, 'MaxFromBlockCache': 2 }, 'HasAnyNonOcsCoauthor': false, 'PaneType': 1, 'CellHtml': '', 'CellIfmt': 1, 'OriginalIfmt': 1 }, 'ewaControlId': 'm_excelWebRenderer_ewaCtl_m_ewa', 'currentObject': tab, 'isNamedItem': false, 'revision': 1, 'activeCell': { 'SheetName': tab, 'NamedObjectName': '', 'FirstRow': linT, 'FirstColumn': colNum }, 'formattedText': { 'Text': value, 'Fonts': null, 'TextRuns': null }, 'row': linT, 'column': 0, 'rowCount': 1, 'columnCount': 1, 'setCellRanges': { 'SheetName': tab, 'NamedObjectName': '', 'Ranges': [{ 'FirstRow': linT, 'FirstColumn': colNum, 'LastRow': linT, 'LastColumn': 0 }] }, 'comboKey': 0, 'allowedSetCellModes': 50, 'renderingOptions': 0, 'richValueParameter': { 'ParameterType': 5 }, 'colorScheme': null })
            };
            const retApi = await api(infApi);
            const res = JSON.parse(retApi.res.body)
            let valueOk
            try { valueOk = res.d.Result.CellModel.Cells[0].Text } catch (e) { }
            if (retApi.ret && valueOk) {
                ret['ret'] = true;
                ret['msg'] = `EXCEL: OK`;
            } else {
                infConfigStorage = { 'path': '/src/config.json', 'action': 'del', 'key': 'excel' }
                retConfigStorage = await configStorage(infConfigStorage)
                ret['msg'] = `\n #### ERRO ####  EXCEL \n NAO CONSEGUIU ENVIAR A INFORMACAO \n\n`;
            }
        } else if (inf.action == 'get') {
            let url
            if (lin < 6) {
                lin = 0
                url = `https://excel.officeapps.live.com/x/_vti_bin/DynamicGridContent.json/GetRangeContentJson?context=%7B%22WorkbookMetadataParameter%22%3A%7B%22WorkbookMetadataState%22%3A%7B%22MetadataVersion%22%3A0%2C%22ServerEventVersion%22%3A0%7D%7D%2C%22ClientRequestId%22%3A%22${clientRequestId}%22%2C%22InstantaneousType%22%3A0%2C%22MakeInstantaneousChange%22%3Afalse%2C%22SessionId%22%3A%22${sessionId}%22%2C%22TransientEditSessionToken%22%3A%22${transientEditSessionToken}%22%2C%22PermissionFlags%22%3A786431%2C%22Configurations%22%3A1573648%2C%22CompleteResponseTimeout%22%3A0%2C%22IsWindowHidden%22%3Atrue%2C%22IsWindowVisible%22%3Afalse%2C%22CollaborationParameter%22%3A%7B%22CollaborationState%22%3A%7B%22CollabStateId%22%3A0%2C%22UserListVersion%22%3A0%7D%7D%2C%22MachineCluster%22%3A%22BR2%22%2C%22AjaxOptions%22%3A0%2C%22ReturnSheetProcessedData%22%3Afalse%2C%22ActiveItemId%22%3A%22Sheet4%22%7D&ewaControlId=%22m_excelWebRenderer_ewaCtl_m_ewa%22&currentObject=%22${tab}%22&namedObjectViewData=%7B%22Mode%22%3A1%2C%22Settings%22%3A0%7D&row=${lin}&column=${colNum}&rowCount=1&columnCount=1&blockPosition=%7B%22X%22%3A0%2C%22Y%22%3A0%2C%22PaneType%22%3A3%7D&revision=0&previousRevision=-1&digest=%22%22&renderingOptions=24&colorScheme=%7B%22BackgroundColor%22%3A1579547%2C%22TextColor%22%3A15263459%2C%22LinkColor%22%3A15263459%7D&ecsSpreadsheetDigest=null&waccluster=BR2`
            } else {
                lin = lin - 6
                url = `https://excel.officeapps.live.com/x/_vti_bin/DynamicGridContent.json/GetRangeContentJson?context=%7B%22WorkbookMetadataParameter%22%3A%7B%22WorkbookMetadataState%22%3A%7B%22MetadataVersion%22%3A0%2C%22ServerEventVersion%22%3A0%7D%7D%2C%22ClientRequestId%22%3A%22${clientRequestId}%22%2C%22InstantaneousType%22%3A0%2C%22MakeInstantaneousChange%22%3Afalse%2C%22SessionId%22%3A%22${sessionId}%22%2C%22TransientEditSessionToken%22%3A%22${transientEditSessionToken}%22%2C%22PermissionFlags%22%3A786431%2C%22Configurations%22%3A1573648%2C%22CompleteResponseTimeout%22%3A0%2C%22IsWindowHidden%22%3Afalse%2C%22IsWindowVisible%22%3Atrue%2C%22MachineCluster%22%3A%22BR2%22%2C%22AjaxOptions%22%3A0%2C%22ReturnSheetProcessedData%22%3Afalse%2C%22ActiveItemId%22%3A%22Sheet4%22%7D&ewaControlId=%22m_excelWebRenderer_ewaCtl_m_ewa%22&currentObject=%22${tab}%22&namedObjectViewData=%7B%22Mode%22%3A1%2C%22Settings%22%3A0%7D&row=${lin}&column=${colNum}&rowCount=1&columnCount=1&blockPosition=%7B%22X%22%3A0%2C%22Y%22%3A0%2C%22PaneType%22%3A1%7D&revision=0&previousRevision=-1&digest=%22%22&renderingOptions=24&colorScheme=%7B%22BackgroundColor%22%3A1579547%2C%22TextColor%22%3A15263459%2C%22LinkColor%22%3A15263459%7D&ecsSpreadsheetDigest=null&waccluster=BR2`
            }
            const infApi = {
                'url': url,
                method: 'GET',
                headers: {
                    "content-type": "application/json; charset=UTF-8"
                }
            };
            const retApi = await api(infApi);
            if ((retApi.ret) && (retApi.res.body.toString().includes(`GridBlockModelJson`))) {
                let res = JSON.parse(retApi.res.body)
                res = JSON.parse(res.d.Result.GridBlockModelJson)
                ret['ret'] = true;
                ret['msg'] = `EXCEL: OK`;
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

if (typeof window !== 'undefined') { // CHROME
    window['excel'] = excel;
} else if (typeof global !== 'undefined') { // NODE
    global['excel'] = excel;
}











