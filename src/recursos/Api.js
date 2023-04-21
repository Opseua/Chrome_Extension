async function Api(inf_ok) {

  const inf = {
    url: inf_ok.url,
    method: inf_ok.method,
    headers: inf_ok.headers,
    body: inf_ok.body
  };

  if (typeof fetch == "undefined") {
    // Google App Script
    try {
      var req = UrlFetchApp.fetch(inf.url, {
        'method': inf.method,
        'payload': inf.method === "POST" ? typeof inf.body === 'object' ? JSON.stringify(inf.body) : inf.body : null,
        'headers': inf.headers,
        redirect: 'follow',
        keepalive: true,
        muteHttpExceptions: true,
        validateHttpsCertificates: true,
      });
      console.log('API: OK');
      return req.getContentText();
    } catch (error) {
      console.log('API: ERRO');
      return error.message;
    }
  } else {
    // JavaScript
    try {
      var req = await fetch(inf.url, {
        method: inf.method,
        body: inf.method === "POST" ? typeof inf.body === 'object' ? JSON.stringify(inf.body) : inf.body : null,
        headers: inf.headers,
        redirect: 'follow',
        keepalive: true
      });
      console.log('API: OK');
      return await req.text();
    } catch (error) {
      console.log('API: ERRO');
      return error;
    }
  }

}

export default Api




/* const valor = String.raw`ESSA \ É / " A ' INFORMACAO`;
//const valor = { teste: 'OLA TUDO BEM' };
const requisicao = {
  url: 'https://ntfy.sh/OPSEUA',
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: valor
};
const re = await Api(requisicao);
console.log(re) */