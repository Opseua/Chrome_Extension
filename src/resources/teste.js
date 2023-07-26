console.log('rodando')
await import('./chatGpt.js');
await import('./tabSearch.js');

async function teste() {

  const infChatGpt = { 'provider': 'ora.ai', 'input': `Qual a idade da Vênus?` }
  const retChatGpt = await chatGpt(infChatGpt)
  console.log(retChatGpt)

}
teste()


