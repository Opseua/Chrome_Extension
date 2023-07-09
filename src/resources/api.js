// import { api } from './api.js';
// // POST → normal
// const infApi = {
//     url: 'https://ntfy.sh/OPSEUA',
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: String.raw`ESSA \ É / " A ' INFORMACAO`
// };
// const retApi = await api(infApi);
// const res = JSON.parse(retApi.res);
// console.log(res)

// // POST → x-www-form-urlencoded
// const formData = new URLSearchParams();
// formData.append('grant_type', 'client_credentials');
// formData.append('resource', 'https://graph.microsoft.com');
// const infApi = {
//     url: 'https://login.microsoft.com/c5a6c78e/oauth2/token',
//     method: 'POST',
//     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//     body: formData.toString()
// };
// const retApi = await api(infApi);
// const res = JSON.parse(retApi.res);
// console.log(res)

async function api(infOk) {
  const inf = {
    url: infOk.url,
    method: infOk.method,
    headers: infOk.headers,
    body: infOk.body
  };

  const ret = { ret: false };

  if (typeof UrlFetchApp !== 'undefined') { // ################ GOOGLE APP SCRIPT
    try {
      const req = UrlFetchApp.fetch(inf.url, {
        'method': inf.method,
        'payload': inf.method === 'POST' || inf.method === 'PATCH' ? typeof inf.body === 'object' ? JSON.stringify(inf.body) : inf.body : null,
        'headers': inf.headers,
        redirect: 'follow',
        keepalive: true,
        muteHttpExceptions: true,
        validateHttpsCertificates: true,
      });

      ret['ret'] = true;
      ret['msg'] = 'API: OK';
      ret['res'] = req.getContentText();
    } catch (e) {
      ret['msg'] = `API: ERRO | ${e.message}`;
    }
  } else { // ######################################### NODEJS ou CHROME
    try {
      const req = await fetch(inf.url, {
        method: inf.method,
        body: inf.method === 'POST' || inf.method === 'PATCH' ? typeof inf.body === 'object' ? JSON.stringify(inf.body) : inf.body : null,
        headers: inf.headers,
        redirect: 'follow',
        keepalive: true
      });
      
      ret['ret'] = true;
      ret['msg'] = 'API: OK';
      ret['res'] = await req.text();
    } catch (e) {
      ret['msg'] = `API: ERRO | ${e}`;
    }
  }

  if (!ret.ret) { console.log(ret.msg) }
  return ret
}
export { api }

