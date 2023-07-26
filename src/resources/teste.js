async function teste() {
  console.log('rodando')

  await import('./translate.js');
  const infTranslate = { 'source': 'auto', 'target': 'pt', 'text': 'Hi, what your name?' };
  const retTranslate = await translate(infTranslate)
  console.log(retTranslate)

}
teste()

