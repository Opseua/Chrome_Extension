// let retGetXAppId = false
// async function getXAppId() {
//     try {
//         const response = await fetch("https://www.instagram.com/adelar_santos_/", {
//             "headers": {
//                 "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
//                 "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
//                 "sec-ch-prefers-color-scheme": "dark",
//                 "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Google Chrome\";v=\"114\"",
//                 "sec-ch-ua-full-version-list": "\"Not.A/Brand\";v=\"8.0.0.0\", \"Chromium\";v=\"114.0.5735.199\", \"Google Chrome\";v=\"114.0.5735.199\"",
//                 "sec-ch-ua-mobile": "?0",
//                 "sec-ch-ua-platform": "\"Windows\"",
//                 "sec-ch-ua-platform-version": "\"15.0.0\"",
//                 "sec-fetch-dest": "document",
//                 "sec-fetch-mode": "navigate",
//                 "sec-fetch-site": "none",
//                 "sec-fetch-user": "?1",
//                 "upgrade-insecure-requests": "1",
//                 //"cookie": "dpr=1.25; ig_did=F66BF6CD-C1F8-4831-9E27-4C994B66893A; ig_nrcb=1; datr=_LqlZINp88m9HnZGIFGO2lA4; mid=ZKW6_wALAAEUS9Zxybqg1FXEZS2C; csrftoken=1tBgSan0IX4cDutrkWl64efOExEVQYzt; ds_user_id=2229804097; fbm_124024574287414=base_domain=.instagram.com; shbid=\"9407\\0542229804097\\0541721230309:01f73937a7258d6234d0eb9d23abc1e442f3d2e1158dbdda9e7124e6411fdac29f59b0f3\"; shbts=\"1689694309\\0542229804097\\0541721230309:01f7f2a455ee60ed45811bbbeafd8844f8883430c12b146a5a9876e17a8281ff4844d0b5\"; sessionid=2229804097%3AGglnprjcSY8Dur%3A7%3AAYev6OLN-CdWAe8x0E67zr-4YiIVtEeKc-thnpZkLJE; rur=\"VLL\\0542229804097\\0541721241957:01f7746cb6767a5c370a0508eef93894ef8502cb1bb245f50b3be5f367a4fab3121fc56b\""
//             },
//             "referrerPolicy": "strict-origin-when-cross-origin",
//             "body": null,
//             "method": "GET"
//         });

//         const status = response.status;
//         const data = await response.text();
//         const regex = /,"APP_ID":"(.*?)","IS_BUSINESS_DOMAIN":/;
//         const match = data.match(regex);

//         if (match && match[1]) {
//             return match[1].replace(/\\/g, '');
//         } else {
//             return 'NAO ENCONTRADO';
//         }

//         console.log(status);
//     } catch (error) {
//         console.error('Erro ao fazer a requisição:', error);
//     }
// }


// retGetXAppId = await getXAppId();
// console.log('Resultado fora da função:', retGetXAppId);

// const { dateHour } = await import('./functions.js');
// const RetDateHour = dateHour()
// console.log(RetDateHour)

const { random } = await import('./functions.js');


const arrProfiles = ["adelar_santos_", "lightbrotherz", "carolescavassini", "cafe_light_", "djtavinhotavares", "manoel_doa_teclados", "prmauriciorr"];

async function runLoop() {
    while (arrProfiles.length > 0) {
        console.log('Valor do índice 0:', arrProfiles[0]);
        arrProfiles.shift();
    }
    
    console.log("Loop concluído!");
}

runLoop();


//console.log('b', arrProfiles)