async function Api(inf) {

  let a = inf.url;
  let b = inf.method;
  let c = inf.headers;
  let d = typeof inf.body === 'object' ? JSON.stringify(inf.body).replace(/(?:\r\n|\r|\n)/g, '\\n').replace(/"/g, '\\"') : inf.body.replace(/(?:\r\n|\r|\n)/g, '\\n').replace(/"/g, '\\"')

  try {
    let r = JSON.parse(`{"w": "${a}", "z": { "method": "${b}","headers":${JSON.stringify(c)}${(b == "GET") ? '' : `,"${(typeof UrlFetchApp == "undefined") ? "body" : "payload"}":"${d}"`}}}`);
    let s = (typeof UrlFetchApp == "undefined") ? await fetch(r.w, r.z) : UrlFetchApp.fetch(r.w, r.z);
    //console.log('API: OK');
    return s.json();
  } catch (error) {
    console.log('API: DEU ERRO');
    return error;
  }

}

export default Api