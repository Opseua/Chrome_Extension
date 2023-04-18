const txt1 = String.raw`ESSA \ É / A " ' INFORMACAO`;
const txt2 = { 'teste': 'ESSA \ É / A " INFORMACAO' };
const txt3 = { 'teste': txt1 };

//console.log("STRING " + objeto.body);
//console.log("OBJETO " + JSON.stringify(objeto.body));

const inf = {
    url: `https://ntfy.sh/OPSEUA`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'title': `TITULO DA NTFY` },
    body: txt2,
}

console.log(typeof inf.body);
console.log(inf.body);

let a = inf.url;
let b = inf.method;
let c = inf.headers;
let d = inf.body;
//let d = typeof inf.body === 'object' ? JSON.stringify(inf.body).replace(/(?:\r\n|\r|\n)/g, '\\n') : inf.body.replace('/', '\/').replace(/(?:\r\n|\r|\n)/g, '\\n').replace(/"/g, '\\"')
try {
    let r = JSON.parse(`{"w": "${a}", "z": { "method": "${b}","headers":${JSON.stringify(c)}${(b == "GET") ? '' : `,"${(typeof UrlFetchApp == "undefined") ? "body" : "payload"}":"${d}"`}}}`);
    let s = (typeof UrlFetchApp == "undefined") ? await fetch(r.w, r.z)  : UrlFetchApp.fetch(r.w, r.z);
    //let s = (typeof UrlFetchApp == "undefined") ? await fetch(r.w, r.z)  : UrlFetchApp.fetch(r.w, r.z);
    console.log('API: OK');
} catch (error) {
    console.log('API: DEU ERRO');
}



