let e = import.meta.url;
async function command2(inf) {
  let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
  try {
    let reRun = false
    let infSniffer, retSniffer, infConfigStorage, retConfigStorage
    infConfigStorage = { 'e': e, 'action': 'get', 'key': 'sniffer' };
    retConfigStorage = await configStorage(infConfigStorage); if (!retConfigStorage.ret) { return retConfigStorage } else { retConfigStorage = retConfigStorage.res };
    let arrUrl = retConfigStorage.arrUrl
    let gOEve = async (i) => {
      if (i.inf.sniffer === 2) {
        gORem(gOEve);
        chrome.browserAction.setBadgeText({ text: '' });
        reRun = false;
        return ret
      }
    }; gOAdd(gOEve);
    async function run() {
      reRun = false
      infSniffer = { 'newReqSend': true, 'arrUrl': arrUrl }
      retSniffer = await sniffer(infSniffer)
      if (!retSniffer.res || !gO.inf.sniffer == 1) {
        return ret
      }

      // #### OneForma
      if (regex({ 'simple': true, 'text': retSniffer.res.res.url, 'pattern': arrUrl[9] })) {
        if (regex({ 'simple': true, 'text': JSON.stringify(retSniffer.res.res.body), 'pattern': '*MTPE_New_PortugueseBrazilToEnglish*' })) {
          // MTPE_New_PortugueseBrazilToEnglish
          let infOneFormaMPTE = { 'sniffer': retSniffer.res.res.body }
          let retoneForma_MTPE = await oneForma_MTPE(infOneFormaMPTE)
          if (retoneForma_MTPE.ret) {
            reRun = true
            ret['msg'] = `COMMAND 2: OK | OneForma`;
          }
        }
        // #### Peroptyx
      } else if (regex({ 'simple': true, 'text': retSniffer.res.res.url, 'pattern': arrUrl[7] })) {
        if (regex({ 'simple': true, 'text': JSON.stringify(retSniffer.res.res.body), 'pattern': '*Search 2.0*' })) {
          // Search 2.0
          let infPeroptyx_Search20 = { 'sniffer': retSniffer.res.res.body }
          let retPeroptyx_Search20 = await peroptyx_Search20(infPeroptyx_Search20)
          if (retPeroptyx_Search20.ret) {
            reRun = true
            ret['msg'] = `COMMAND 2: OK | Peroptyx`;
          }
        } else if (regex({ 'simple': true, 'text': JSON.stringify(retSniffer.res.res.body), 'pattern': '*Query Image Deserving Classification*' })) {
          // Query Image Deserving Classification
          let infPeroptyx_QueryImageDeservingClassification = { 'sniffer': retSniffer.res.res.body }
          let retPeroptyx_QueryImageDeservingClassification = await peroptyx_QueryImageDeservingClassification(infPeroptyx_QueryImageDeservingClassification)
          if (retPeroptyx_QueryImageDeservingClassification.ret) {
            reRun = true
            ret['msg'] = `COMMAND 2: OK | Peroptyx`;
          }
        }
      }
      if (gO.inf.sniffer == 1 && reRun) {
        await run()
      } else {
        chrome.browserAction.setBadgeText({ text: '' });
      }
    }
    await run()
    ret['ret'] = true;
  } catch (e) {
    let retRegexE = await regexE({ 'inf': inf, 'e': e, 'catchGlobal': false });
    ret['msg'] = retRegexE.res
  };
  return {
    ...({ ret: ret.ret }),
    ...(ret.msg && { msg: ret.msg }),
    ...(ret.res && { res: ret.res }),
  };
}

if (eng) { // CHROME
  window['command2'] = command2;
} else { // NODEJS
  global['command2'] = command2;
}
