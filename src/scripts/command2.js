async function command2(inf) {
  let ret = { 'ret': false };
  try {
    let infSniffer, retSniffer, infRegex, retRegex, infNotification, retNotification, infChatGpt, retChatGpt, infClipboard, retClipboard, infTranslate1, retTranslate1, infTranslate2, retTranslate2
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
      console.log(retSniffer)

      if (regex({ 'simple': true, 'text': retSniffer.res.res.url, 'pattern': 'https://desk.oneforma.com/scribo_apps/MTPE_new_process/postediting.php*' })) {
        console.log('OneForma')
      } else if (regex({ 'simple': true, 'text': retSniffer.res.res.url, 'pattern': 'https://www.tryrating.com/api/survey' })) {
        console.log('Peroptyx')
      } else if (regex({ 'simple': true, 'text': retSniffer.res.res.url, 'pattern': 'https://rating.ewoq.google.com/u/0/rpc/rating/SafeTemplateService/GetTemplate' })) {
        console.log('Welocalize TASK NAME')
      } else if (regex({ 'simple': true, 'text': retSniffer.res.res.url, 'pattern': 'https://rating.ewoq.google.com/u/0/rpc/rating/AssignmentAcquisitionService/GetNewTasks' })) {
        console.log('Welocalize HIT')
      }

      ret['ret'] = true;
      ret['msg'] = `COMMAND 2: OK`;
      ret['res'] = `resposta aqui`;
      if (gO.inf.sniffer == 1) { await run() }
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