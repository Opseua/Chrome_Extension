async function command2(inf) {
  let ret = { 'ret': false };
  try {
    ret['ret'] = true;
    let reRun = false
    let infSniffer, retSniffer
    const gOEve = async (i) => {
      if (i.inf.sniffer === 2) { gORem(gOEve); chrome.browserAction.setBadgeText({ text: '' }); reRun = false; return ret }
    }; gOAdd(gOEve);
    async function run() {
      reRun = false
      infSniffer = {
        'newReqSend': true,
        'arrUrl': [
          'https://desk.oneforma.com/scribo_apps/MTPE_new_process/postediting.php*',
          'https://www.tryrating.com/api/survey',
          'https://rating.ewoq.google.com/u/0/rpc/rating/SafeTemplateService/GetTemplate',
          'https://rating.ewoq.google.com/u/0/rpc/rating/AssignmentAcquisitionService/GetNewTasks'
        ]
      }
      retSniffer = await sniffer(infSniffer)
      if (!retSniffer.res || !gO.inf.sniffer == 1) { return ret }

      if (regex({ 'simple': true, 'text': retSniffer.res.res.url, 'pattern': 'https://desk.oneforma.com/scribo_apps/MTPE_new_process/postediting.php*' })) {
        const infOneFormaMPTE = { 'sniffer': retSniffer.res.res.body }
        const retOneFormaMTPE = await oneFormaMTPE(infOneFormaMPTE)
        if (retOneFormaMTPE.ret) {
          reRun = true
          ret['msg'] = `COMMAND 2: OK | OneForma`;
        }
      } else if (regex({ 'simple': true, 'text': retSniffer.res.res.url, 'pattern': 'https://www.tryrating.com/api/survey*' })) {
        const infPeroptyx = { 'sniffer': retSniffer.res.res.body }
        const retPeroptyx = await peroptyx(infPeroptyx)
        if (retPeroptyx.ret) {
          reRun = true
          ret['msg'] = `COMMAND 2: OK | Peroptyx`;
        }
      }

      if (gO.inf.sniffer == 1 && reRun) { await run() } else { chrome.browserAction.setBadgeText({ text: '' }); }
    }
    await run()

  } catch (e) {
    ret['msg'] = regexE({ 'e': e }).res
  }

  if (!ret.ret) { console.log(ret.msg) }
  return ret
}

if (typeof window !== 'undefined') { // CHROME
  window['command2'] = command2;
} else { // NODEJS
  global['command2'] = command2;
}