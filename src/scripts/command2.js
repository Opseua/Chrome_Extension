async function command2(inf) {
  let ret = { 'ret': false };
  try {
    let infSniffer, retSniffer
    const gOEve = async (i) => {
      if (i.inf.sniffer === 2) { gORem(gOEve); chrome.browserAction.setBadgeText({ text: '' }); ret = { 'ret': false }; return ret }
    }; gOAdd(gOEve);
    async function run() {
      ret = { 'ret': false }
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
        console.log('OneForma', retOneFormaMTPE)
        if (retOneFormaMTPE.ret) {
          ret['ret'] = true;
          ret['msg'] = `COMMAND 2: OK | OneForma`;
        }
      } else if (regex({ 'simple': true, 'text': retSniffer.res.res.url, 'pattern': 'https://www.tryrating.com/api/survey*' })) {
        const infPeroptyx = { 'sniffer': retSniffer.res.res.body }
        const retPeroptyx = await peroptyx(infPeroptyx)
        const infFile = {
          'action': 'write',
          'file': `sniffer.txt`,
          'rewrite': true, // 'true' adiciona, 'false' limpa
          'text': `${retSniffer.res.res.body}\n\n`
        };
        const retFile = await file(infFile);
        console.log(retFile);
        console.log('Peroptyx', retPeroptyx)
        if (retPeroptyx.ret) {
          ret['ret'] = true;
          ret['msg'] = `COMMAND 2: OK | Peroptyx`;
        }
      }

      if (gO.inf.sniffer == 1 && ret.ret) { await run() } else { chrome.browserAction.setBadgeText({ text: '' }); }
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