fetch('https://desk.oneforma.com/scribo_apps/HT_new_process/submit.php', {
    method: 'POST',
    headers: {
        'host': 'desk.oneforma.com',
        'content-length': '423',
        'cache-control': 'max-age=0',
        'sec-ch-ua': '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'origin': 'https://desk.oneforma.com',
        'dnt': '1',
        'upgrade-insecure-requests': '1',
        'content-type': 'application/x-www-form-urlencoded',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-user': '?1',
        'sec-fetch-dest': 'iframe',
        'referer': 'https://desk.oneforma.com/scribo_apps/HT_new_process/postediting.php?flogin=2&success=true',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'cookie': 'HttpOnly; HttpOnly; _ga=GA1.1.266408210.1682032234; offline_language=en; __cflb=0H28vJqtHK3XM5LrkWT1pJAtLfW6sAJFdX66rG7c2qA; HttpOnly; PHPSESSID=7vh6sl3kht0e8j5cjtjl25opal; __cf_bm=8ogEaz9Ne81DL6VG_n8il5rnXW.RtO2yBIFJYuLLNbQ-1682397277-0-AevPydV2x0G2Il02z/H39gUZTM2SipQq2qH1yrTqrr4SeUSpCF+t5k/zB2zWSuD0NDvVqZbcCbqJ0S6NwyqMwF2owyIPdJb1Ht4hervqCvJ9; _ga_D36BJJJV7S=GS1.1.1682393583.37.1.1682397374.0.0.0'
    },
    body: 'hitid=414204074&taskid=3507214&webapp_id=2735&warnings=&mt_textbox=&translation_textbox=Accumulate+dust&final_json=%%7B%%22id%%22%%3A14993%%2C%%22locale%%22%%3A%%22pt_BR%%22%%2C%%22inputText%%22%%3A%%22Acumular+p%%C3%%B3%%22%%2C%%22translation1%%22%%3A%%22Accumulate+dust%%22%%2C%%22translation2%%22%%3A%%22%%22%%2C%%22not_sure%%22%%3A%%22%%22%%2C%%22no2translation%%22%%3A%%22false%%22%%2C%%22guid%%22%%3A%%2214992%%22%%7D'
}).then(response => {
    return response.text();
}).then(data => {
    console.log(data);
}).catch(error => {
    console.error(error);
});