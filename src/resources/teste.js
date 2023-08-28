await import('./src/resources/@functions.js');

let infFile, retFile
infFile = { 'p': new Error(), 'action': 'inf' }
//infFile = { 'p': new Error(), 'action': 'relative', 'relative': 'aaa.txt' }
//infFile = { 'p': new Error(), 'action': 'write', 'path': 'aaa.txt', 'rewrite': true, 'text': '1234\n' }
//infFile = { 'p': new Error(), 'action': 'read', 'path': './ola/aaa.txt', 'pathCurrent': true }
// infFile = { 'p': new Error(), 'action': 'del', 'path': 'aaa.txt' }
// infFile = { 'p': new Error(), 'action': 'list', 'path': '.', 'max': 10 }
retFile = await file(infFile);
//console.log(retFile)