async function Api(inf) {

  if (typeof fetch == "undefined") {
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
    try {
      var req = await fetch(inf.url, {
        method: inf.method,
        body: inf.method === "POST" ? typeof inf.body === 'object' ? JSON.stringify(inf.body) : inf.body : null,
        headers: inf.headers,
        redirect: 'follow',
        keepalive: true
      });
      console.log('API: OK');
      return req;
    } catch (error) {
      console.log('API: ERRO');
      return error;
    }
  }

}

export default Api