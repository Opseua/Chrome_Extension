// PROMPT
async function command1(inf) {

}

if (typeof window !== 'undefined') { // CHROME
    window['command1'] = command1;
  } else { // NODEJS
    global['command1'] = command1;
  }