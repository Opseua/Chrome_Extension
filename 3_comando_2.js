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

function comando_2(inf1, inf2, inf3, inf4) {
    console.log("RODANDO: comando 1");

    if (!(inf4 == 'c') && !(inf4 == 'C')) {
        var json = {
            tempo: 5,
            clipboard: `${inf4}`,
            title: '✴️ ÁREA DE TRANSFERÊNCIA ✴️',
            message: `${inf4.substring(0, 128)}`,
            iconUrl: `z_icon.png`,
            buttons: [{ title: 'OK Botão 1' }, { title: 'OK Botão 2' }]
        };
    };

    if ((inf4 == 'c') || (inf4 == 'C')) {
        console.log("MANDAR CLIPBOARD PARA: " + inf3)
    };

    if (json) { fun_notificacao(json) };

}

export default comando_2