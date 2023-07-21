const { regex, fileRead, fileWrite, configStorage } = await import('./functions.js');
const { api } = await import('./api.js');

// const infApi1 = {
//     url: `https://thetvapp.to/tv/wabc-new-york-abc-east-live-stream/`,
//     method: 'GET',
//     headers: {
//         "cookie": "_ga=GA1.1.722422937.1689607052; XSRF-TOKEN=eyJpdiI6IjdOekRkL2NWWmVoSHo1N3pyY09IdEE9PSIsInZhbHVlIjoibklBenBJdW1sVndWRlhYRlpoTWk0ZVlPN1h0UHNaQlpDT2wxOG52OXA0MzJhV25tUHh0cFFJcGc4Um1pcVJFRVdXUzNYa213aXJGMXYwOHk0bktFT3p6SkRBZnNDdll4WTBKK1RrallBOUJNalpSdmk4RGQ0SUFMWHFTRlpLdDQiLCJtYWMiOiJiOThiNDllZDE5OTY1YWRmMjUxYWQ4M2FhYTZkMjZjYzNhNWQ4N2U5ZDc5YTU5ZDkxN2ZlMmJiMTY2NTUxYjUwIiwidGFnIjoiIn0%3D; tvnow_session=eyJpdiI6IkFwZWcxaGs0dFE3clpnTHE3c2NOVHc9PSIsInZhbHVlIjoiMXprRCtvWW5qQWZNR21aRHdrK21BRUowS3JRM3lMaVFSUWxNU3hMZzNnVFBFa0lZYWlSNDRYTmVFdklYa28xbmd6V1Uzbm9OTkpuNytudXRSalp4N2JBVDMyaDQ1NVFOdTFSVkwvbkRDMVFmcWt0a21vNTltR0xlTHRlRzJnbFIiLCJtYWMiOiI1YWYzMjk3NGRiYWIzNDIxOWFmNmU5NDFlNTVkNWI5MDUyYzBmYzAzZjJiZmExYmI3MDY1OGE2OGQ5MTNmYzkxIiwidGFnIjoiIn0%3D; _ga_KDJRXWJ0P0=GS1.1.1689832775.7.1.1689834279.0.0.0"
//     }
// };
// const retApi1 = await api(infApi1);
// const infRegex = { 'pattern': 'csrf-token" content="(.*?)">', 'text': retApi1.res.body }
// const retRegex = regex(infRegex)

// const infApi2 = {
//     url: `https://thetvapp.to/token/WABCDT1/`,
//     method: 'POST',
//     headers: {
//         "x-csrf-token": retRegex.res.text,
//         "cookie": "_ga=GA1.1.722422937.1689607052; XSRF-TOKEN=eyJpdiI6IkZoM3pEd2Q2ZXRoYzc3V2VVZGszQUE9PSIsInZhbHVlIjoibFZEbThQQkdWSSs1anNiS3BzWDFUOFlDdmk2N1hrUVZoUk5Scm4vTFZzWTVud2NEcDNjYW5wQjVLYzlNVnNHSkxDUlNVTzhqT01TR3hiSUlaZXE3blE4RkxQYXQrUWUxMXZuYnU0UmhZS1hISUhoVEJzeTJiemtqZHQ2Snp1VjMiLCJtYWMiOiI1NjUxN2QyZjJmYTM0ZjE5MjAzYjdjMTQzOGExNTNiYWE3ODMxMzc1NzE3ZjJiMzM5MjUwMDhiMWQwMzUwNzQwIiwidGFnIjoiIn0%3D; tvnow_session=eyJpdiI6Imo1eHc0cmo5RHpsQm1RdzVKaEwrcGc9PSIsInZhbHVlIjoiKzcreDAwNlphdnhwZnpiSHRPMWt6bVFjOGlFYktqQ0tNdGpoc3VqbkpLdTZmSDFKd1JQOWg1UUdwQXkrSDg4a1JDdm5SYjdFMUR5V2xMTkhSMHl1dHlKYzFpRFpSZFZuVUg3amplSGZCQU1DZHhqZzM3Z1FFeU9kNDVCWmZtOS8iLCJtYWMiOiJjZGQ4NGVjOWJiYWNjZDY3ZDA5NjUxNjFkOWFkNzM0ZGU0MDFkZTIyNTlmZDFmMzM3YTFiNmY4Njk5NzdkNjA4IiwidGFnIjoiIn0%3D; _ga_KDJRXWJ0P0=GS1.1.1689832775.7.1.1689833133.0.0.0",
//     }
// };
// const retApi2 = await api(infApi2);
// console.log('x-csrf-token', retRegex.res.text)
// console.log('url', retApi2.res.body)


import fs from 'fs'
// const filePath = "D:/ARQUIVOS/33333333.txt";
// const content = '2222';
// const overwrite = false;
// const flag = overwrite ? 'w' : 'a';
// await fs.promises.writeFile(filePath, content, { flag });


const pasta = './src/resources/leads';
import { readdir } from 'fs/promises';

async function listarArquivos(pasta) {
  try {
    const files = await readdir(pasta); // Usa o fs com suporte a promessas
    for (const file of files) {
      //console.log(file);
      const infFileRead = { 'file': `./src/resources/leads/${file}` }
      const retFileRead = await fileRead(infFileRead)
      const res = JSON.parse(retFileRead.res)
      //console.log(res.data.user.username)

      const use = res.data.user.username
      const bio = JSON.stringify(res.data.user.biography_with_entities.raw_text)
      const lin = JSON.stringify(res.data.user.bio_links[0]) ? JSON.stringify(res.data.user.bio_links[0].url) : null
      const med = res.data.user.edge_owner_to_timeline_media.count
      const fld = res.data.user.edge_followed_by.count
      const flw = res.data.user.edge_follow.count
      const nam = res.data.user.full_name
      const pri = res.data.user.is_private
      const ver = res.data.user.is_verified

      const infFileWrite = {
        'file': `src/resources/leadsResult/CSV.txt`,
        'rewrite': true, // 'true' adiciona no MESMO arquivo, 'false' cria outro em branco
        'text': `${use}=:=${bio}=:=${lin}=:=${med}=:=${fld}=:=${flw}=:=${nam}=:=${pri}=:=${ver}\n`
      };
      const retFileWrite = await fileWrite(infFileWrite);
      //console.log(retFileWrite.ret);

      console.log(retFileWrite.ret, use)
    }
  } catch (err) {
    console.error('Erro ao ler a pasta:', err);
  }
}
listarArquivos(pasta);


