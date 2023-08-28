await import('./src/resources/@functions.js');
const p = new Error()

// let infFile, retFile
// infFile = { 'p': p, 'action': 'inf' }
//infFile = { 'p': p, 'action': 'relative', 'relative': 'aaa.txt' }
//infFile = { 'p': p, 'action': 'write', 'path': 'aaa.txt', 'rewrite': true, 'text': '1234\n' }
//infFile = { 'p': p, 'action': 'read', 'path': './ola/aaa.txt', 'pathCurrent': true }
// infFile = { 'p': p, 'action': 'del', 'path': 'aaa.txt' }
// infFile = { 'p': p, 'action': 'list', 'path': '.', 'max': 10 }
//retFile = await file(infFile);
//console.log(retFile)