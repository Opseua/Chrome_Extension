async function command2(inf) {
  let ret = { 'ret': false }; try {
    let reRun = false
    let infSniffer, retSniffer, infConfigStorage, retConfigStorage
    infConfigStorage = { 'action': 'get', 'key': 'sniffer' }; retConfigStorage = await configStorage(infConfigStorage)
    if (!retConfigStorage.ret) { return } else { retConfigStorage = retConfigStorage.res }; const arrUrl = retConfigStorage.arrUrl
    const gOEve = async (i) => {
      if (i.inf.sniffer === 2) { gORem(gOEve); chrome.browserAction.setBadgeText({ text: '' }); reRun = false; return ret }
    }; gOAdd(gOEve);
    async function run() {
      reRun = false
      infSniffer = { 'newReqSend': true, 'arrUrl': arrUrl }
      retSniffer = await sniffer(infSniffer)
      if (!retSniffer.res || !gO.inf.sniffer == 1) { return ret }

      // #### OneForma
      if (regex({ 'simple': true, 'text': retSniffer.res.res.url, 'pattern': arrUrl[9] })) {
        if (regex({ 'simple': true, 'text': JSON.stringify(retSniffer.res.res.body), 'pattern': '*MTPE_New_PortugueseBrazilToEnglish*' })) {
          // MTPE_New_PortugueseBrazilToEnglish
          const infOneFormaMPTE = { 'sniffer': retSniffer.res.res.body }
          const retoneForma_MTPE = await oneForma_MTPE(infOneFormaMPTE)
          if (retoneForma_MTPE.ret) {
            reRun = true
            ret['msg'] = `COMMAND 2: OK | OneForma`;
          }
        }
        // #### Peroptyx
      } else if (regex({ 'simple': true, 'text': retSniffer.res.res.url, 'pattern': arrUrl[7] })) {
        if (regex({ 'simple': true, 'text': JSON.stringify(retSniffer.res.res.body), 'pattern': '*Search 2.0*' })) {
          // Search 2.0
          const infPeroptyx_Search20 = { 'sniffer': retSniffer.res.res.body }
          const retPeroptyx_Search20 = await peroptyx_Search20(infPeroptyx_Search20)
          if (retPeroptyx_Search20.ret) {
            reRun = true
            ret['msg'] = `COMMAND 2: OK | Peroptyx`;
          }
        } else if (regex({ 'simple': true, 'text': JSON.stringify(retSniffer.res.res.body), 'pattern': '*Query Image Deserving Classification*' })) {
          // Query Image Deserving Classification
          const infPeroptyx_QueryImageDeservingClassification = { 'sniffer': retSniffer.res.res.body }
          const retPeroptyx_QueryImageDeservingClassification = await peroptyx_QueryImageDeservingClassification(infPeroptyx_QueryImageDeservingClassification)
          if (retPeroptyx_QueryImageDeservingClassification.ret) {
            reRun = true
            ret['msg'] = `COMMAND 2: OK | Peroptyx`;
          }
        }
      }
      if (gO.inf.sniffer == 1 && reRun) { await run() } else { chrome.browserAction.setBadgeText({ text: '' }); }
    }
    await run()
    ret['ret'] = true;
  } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; if (!ret.ret) { console.log(ret.msg) }; return ret
}

if (typeof window !== 'undefined') { // CHROME
  window['command2'] = command2;
} else { // NODEJS
  // global['command2'] = command2;
}