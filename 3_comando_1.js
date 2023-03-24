let fun_api;
import('./2_api.js').then(module => {
    fun_api = module.default;
});

let fun_clipboard;
import('./2_clipboard.js').then(module => {
    fun_clipboard = module.default;
});

let fun_notificacao;
import('./2_notificacao.js').then(module => {
    fun_notificacao = module.default;
});

let fun_prompt;
import('./2_prompt.js').then(module => {
    fun_prompt = module.default;
});

///////////////////////////////////////////////////////

function fun_comando_1(inf1, inf2, inf3, inf4, inf5) {
    console.log("RODANDO: comando 1");

    var inf3 = ``;
    fun_api(`${inf1}`, `${inf2}`, `${inf3}`, `${inf4}`, `${inf5}`)

}

export default fun_comando_1 