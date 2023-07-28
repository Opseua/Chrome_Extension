function throwError() {
  throw new Error('Ocorreu um erro!');
}

try {
  throwError();
} catch (error) {
  const lineNumber = error.stack.split('\n')[1].split(':')[1];
  console.log(error.stack);
}