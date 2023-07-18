// import { api } from './api.js';
// ########## TYPE → text
// const infApi = {
//   url: 'https://ntfy.sh/',
//   method: 'PUT',
//   headers: {
//     'accept': '*/*',
//     'content-type': 'text/plain;charset=UTF-8'
//   },
//   body: '{"topic":"OPSEUA","message":"a"}'
// };
// const retApi = await api(infApi);
// console.log(retApi)

// ########## TYPE → json
// const infApi = {
//   url: 'https://ora.ai/api/conversation',
//   method: 'POST',
//   headers: {
//     'accept': '*/*',
//     'accept-language': 'application/json'
//   },
//   body: { 'Chave': 'aaaaaaaaaaa', 'Valor': 'bbbbbbbbb' }
// };
// const retApi = await api(infApi);
// console.log(retApi)

// ########## TYPE → x-www-form-urlencoded
// const formData = new URLSearchParams();
// formData.append('grant_type', 'client_credentials');
// formData.append('resource', 'https://graph.microsoft.com');
// const infApi = {
//   url: 'https://login.microsoft.com/c5a6c78e/oauth2/token',
//   method: 'POST',
//   headers: {
//     'accept': '*/*',
//     'Content-Type': 'application/x-www-form-urlencoded'
//   },
//   body: formData.toString()
// };
// const retApi = await api(infApi);
// console.log(retApi)

async function api(infOk) {
  let ret = { 'ret': false };

  try {

    const inf = { url: infOk.url, method: infOk.method, headers: infOk.headers, body: infOk.body };

    if (typeof UrlFetchApp !== 'undefined') { // ################ GOOGLE APP SCRIPT

      const reqOpt = { 'method': inf.method, 'redirect': 'follow', 'keepalive': true, 'muteHttpExceptions': true, 'validateHttpsCertificates': true, };
      if (inf.headers) {
        reqOpt['headers'] = inf.headers
      }
      if (inf.body && (inf.method == 'POST' || inf.method == 'PUT')) {
        reqOpt['payload'] = typeof inf.body === 'object' ? JSON.stringify(inf.body) : inf.body
      }
      const req = UrlFetchApp.fetch(inf.url, reqOpt);

      ret['ret'] = true;
      ret['msg'] = 'API: OK';
      ret['res'] = {
        'code': req.getResponseCode(),
        'headers': req.getAllHeaders(),
        'body': req.getContentText()
      }

    } else { // ######################################### NODEJS ou CHROME

      const reqOpt = { 'method': inf.method, 'redirect': 'follow', 'keepalive': true };
      if (inf.headers) {
        reqOpt['headers'] = inf.headers
      }
      if (inf.body && (inf.method == 'POST' || inf.method == 'PUT')) {
        reqOpt['body'] = typeof inf.body === 'object' ? JSON.stringify(inf.body) : inf.body
      }
      const req = await fetch(inf.url, reqOpt)

      const resHeaders = {};
      req.headers.forEach((value, name) => { resHeaders[name] = value; });
      ret['ret'] = true;
      ret['msg'] = 'API: OK';
      ret['res'] = {
        'code': req.status,
        'headers': resHeaders,
        'body': await req.text()
      }

    }

  } catch (e) {
    ret['msg'] = `API: ERRO | ${e}`
  }

  // if (typeof UrlFetchApp !== 'undefined') { // ################ GOOGLE APP SCRIPT
  //   try {
  //     const req = UrlFetchApp.fetch(inf.url, {
  //       'method': inf.method,
  //       'payload': inf.method === 'POST' || inf.method === 'PATCH' ? typeof inf.body === 'object' ? JSON.stringify(inf.body) : inf.body : null,
  //       'headers': inf.headers,
  //       redirect: 'follow',
  //       keepalive: true,
  //       muteHttpExceptions: true,
  //       validateHttpsCertificates: true,
  //     });

  //     ret['ret'] = true;
  //     ret['msg'] = 'API: OK';
  //     ret['res'] = req.getContentText();
  //   } catch (e) {
  //     ret['msg'] = `API: ERRO | ${e.message}`;
  //   }
  // } else { // ######################################### NODEJS ou CHROME
  //   try {
  //     const req = await fetch(inf.url, {
  //       method: inf.method,
  //       body: inf.method === 'POST' || inf.method === 'PATCH' ? typeof inf.body === 'object' ? JSON.stringify(inf.body) : inf.body : null,
  //       headers: inf.headers,
  //       redirect: 'follow',
  //       keepalive: true
  //     });

  //     ret['ret'] = true;
  //     ret['msg'] = 'API: OK';
  //     ret['res'] = await req.text();
  //   } catch (e) {
  //     ret['msg'] = `API: ERRO | ${e}`;
  //   }
  // }

  if (!ret.ret) { console.log(ret.msg) }
  return ret
}

export { api }

