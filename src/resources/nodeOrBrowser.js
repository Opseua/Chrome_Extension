async function nodeOrBrowser() {
    let ret = { ret: false }

    try {
        if (typeof process.versions.node !== 'undefined') {
            ret['ret'] = true; ret['res'] = 'NodeJS'
        }
    } catch { }

    try {
        if (typeof window !== 'undefined') {
            ret['ret'] = true; ret['res'] = 'Chrome'
        }
    } catch { }

    try {
        if (typeof UrlFetchApp !== 'undefined') {
            ret['ret'] = true; ret['res'] = 'Google App Script'
        }
    } catch { }

}

export { nodeOrBrowser }
