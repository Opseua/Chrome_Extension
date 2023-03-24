function api(inf1, inf2, inf3, inf4, inf5) {

  var a = `${inf4}`;
  var fim_res = `${inf5}`;
  //var a = `https://ntfy.sh/OPSEUA`;
  //var a = `https://joinjoaomgcd.appspot.com/_ah/api/messaging/v1/sendPush?apikey=fd5ced3a0e0d48cd841a319c4032d81f&deviceNames=Chrome_1&text=`;

  var b = { url: a.match(/ntfy/) ? `${a}` : `${a}${fim_res}`, params: a.match(/ntfy/) ? { method: `POST`, headers: { "Content_Type": "text/plain", "Title": `[${inf1}>${inf2}] ${inf3}` }, [(typeof UrlFetchApp !== "undefined") ? "payload" : "body"]: `${fim_res}` } : { method: `GET` } };
  var c = (typeof UrlFetchApp !== "undefined") ? UrlFetchApp.fetch(b.url, b.params) : fetch(b.url, b.params);

  console.log(`COMANDO ENVIADO: [${inf1}>${inf2}]\n${inf3}\n${inf5}`);

}

export default api


