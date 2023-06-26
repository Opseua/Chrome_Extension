async function nodeOrBrowser() {

    if (typeof window === 'undefined') { // NODE
        return { ret: true, res: 'node' }
    } else { // BROWSER
        return { ret: true, res: 'browser' }
    }
}

export { nodeOrBrowser }