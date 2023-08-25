await import('./@functions.js');

let infFile, retFile, reg
const time = dateHour().res
const time1 = `${time.mon}-${time.day}`
const time2 = `${time.hou}.${time.min}.${time.sec}`

// ##################################################

infFile = { 'action': 'read', 'file': "D:/Área de Trabalho/Outros Programas/Peroptyx/Search 2.0/JSON_GET.txt" }; retFile = await file(infFile);
const jsonGet = retFile.res

infFile = { // ############# json GET
    'action': 'write',
    'file': `log/TryRating/${time1}/${time2} RES.txt`,
    'rewrite': true, // 'true' adiciona, 'false' limpa
    'text': `${JSON.stringify(jsonGet)}\n\n`
}; retFile = await file(infFile);

infFile = { // #############  time json GET
    'action': 'write',
    'file': `log/TryRating/lastTime.txt`,
    'rewrite': false, // 'true' adiciona, 'false' limpa
    'text': dateHour().res.tim
}; retFile = await file(infFile);

// ##################################################

infFile = { 'action': 'read', 'file': "D:/Área de Trabalho/Outros Programas/Peroptyx/Search 2.0/JSON_SEND.txt", }; retFile = await file(infFile);
const jsonSend = retFile.res

infFile = { // ############# json SEND
    'action': 'write',
    'file': `log/TryRating/${time1}/${time2} REQ.txt`,
    'rewrite': true, // 'true' adiciona, 'false' limpa
    'text': `${JSON.stringify(jsonSend)}\n\n`
}; retFile = await file(infFile);

// ##################################################

infFile = { 'action': 'read', 'file': `log/TryRating/lastTime.txt`, }; retFile = await file(infFile);
const dif = (Number(dateHour().res.tim) + 60) - Number(retFile.res)
console.log(dif)

infFile = { 'action': 'read', 'file': `log/TryRating/${time1}/### REG ###.txt`, }; retFile = await file(infFile);
if (!retFile.ret) { reg = 0 } else { reg = retFile.res }

const total = Number(reg) + dif

infFile = { // ############# total trabalhado
    'action': 'write',
    'file': `log/TryRating/${time1}/### REG ###.txt`,
    'rewrite': false, // 'true' adiciona, 'false' limpa
    'text': JSON.stringify(total)
}; retFile = await file(infFile);

// ##################################################
console.log(total)