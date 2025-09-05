let e = currentFile(new Error()), ee = e;
async function clientImputChromeNew(inf = {}) {
    let ret = { 'ret': false, }; e = inf.e || e;
    try {
        let { lead = 'ITAMAR CORREIA	61563879000174	itamarflp@gmail.com	67992911238	SINALIZA+ COMUNICACAO VISUAL E COMERCIO LTDA', } = inf;

        // ABRIR PÁGINA INICIAL DE INPUT
        let urlTarget = `*c6bank.my.site.com*`; lead = lead.trim(); let campos = lead.split('\t'), administrador = campos[0], cnpj = campos[1], email = campos[2], telefone = campos[3], razaoSocial = campos[4];
        let nomes = administrador.split(' '), primeiroNome = nomes[0], sobrenome = nomes.length > 1 ? administrador.substring(administrador.indexOf(' ') + 1) : '';

        let params, params1, params2, res, pageValue, imputRes;
        let leadPrimeiroNome = primeiroNome, leadSobrenome = sobrenome, leadEmail = email, leadRazaoSocial = razaoSocial, leadTelefone = `${telefone}`, leadCnpj = cnpj;

        params = { // [button] 'X [fechar popup]'
            'nameSearch': `[button] 'X [fechar popup]'`, 'element': {
                'maxAwaitMil': 250, 'tag': 'button',
                'propriedades': [{ 'atributoNome': 'class', 'atributoValor': 'slds-button slds-button_icon slds-button_icon-bare', },
                { 'atributoNome': 'title', 'atributoValor': 'Cancelar e fechar', }, { 'atributoNome': 'type', 'atributoValor': 'button', },],
            }, 'actions': [{ 'action': 'elementClick', },],
        }; res = await chromeActions({ e, 'action': 'injectNew', 'target': urlTarget, 'fun': elementAction, 'funInf': params, }); res = res?.res || res; // console.log(res); 

        // await new Promise(r => { setTimeout(r, 500); });

        params = { // [a] 'Leads'
            'nameSearch': `[a] 'Leads'`, 'element': {
                'maxAwaitMil': 500, 'tag': 'a', 'content': 'Leads',
                'propriedades': [{ 'atributoNome': 'role', 'atributoValor': 'menuitem', }, { 'atributoNome': 'class', 'atributoValor': 'comm-navigation__top-level-item-link js-top-level-menu-item linkBtn', },],
            }, 'actions': [{ 'action': 'elementClick', },],
        }; res = await chromeActions({ e, 'action': 'injectNew', 'target': urlTarget, 'fun': elementAction, 'funInf': params, }); res = res?.res || res; // console.log(res); 

        // await new Promise(r => { setTimeout(r, 500); });

        params = { // [span] 'Novo Lead'
            'nameSearch': `[span] 'Novo Lead'`, 'element': {
                'maxAwaitMil': 5000, 'tag': 'span', 'content': 'Novo Lead',
                'propriedades': [{ 'atributoNome': 'class', 'atributoValor': 'label bBody', },],
            }, 'actions': [{ 'action': 'elementClick', },],
        }; res = await chromeActions({ e, 'action': 'injectNew', 'target': urlTarget, 'fun': elementAction, 'funInf': params, }); res = res?.res || res; // console.log(res); 

        await new Promise(r => { setTimeout(r, 1500); });

        params = { // [INPUT] 'Primeiro Nome'
            'nameSearch': `[INPUT] 'Primeiro Nome'`, 'element': {
                'maxAwaitMil': 5000, 'tag': 'input',
                'propriedades': [{ 'atributoNome': 'part', 'atributoValor': 'input', }, { 'atributoNome': 'name', 'atributoValor': 'firstName', },
                { 'atributoNome': 'type', 'atributoValor': 'text', },
                ],
            }, 'actions': [{ 'action': 'elementSetValue', 'elementValue': `${leadPrimeiroNome}`, },],
        }; res = await chromeActions({ e, 'action': 'injectNew', 'target': urlTarget, 'fun': elementAction, 'funInf': params, }); res = res?.res || res; // console.log(res); 

        // await new Promise(r => { setTimeout(r, 500); });

        params = { // [INPUT] 'Sobrenome'
            'nameSearch': `[INPUT] 'Sobrenome'`, 'element': {
                'maxAwaitMil': 250, 'tag': 'input',
                'propriedades': [{ 'atributoNome': 'part', 'atributoValor': 'input', }, { 'atributoNome': 'name', 'atributoValor': 'lastName', }, { 'atributoNome': 'placeholder', 'atributoValor': 'Sobrenome', },],
            }, 'actions': [{ 'action': 'elementSetValue', 'elementValue': `${leadSobrenome}`, },],
        }; res = await chromeActions({ e, 'action': 'injectNew', 'target': urlTarget, 'fun': elementAction, 'funInf': params, }); res = res?.res || res; // console.log(res); 

        // await new Promise(r => { setTimeout(r, 500); });

        params = { // [INPUT] 'Email'
            'nameSearch': `[INPUT] 'Email'`, 'element': {
                'maxAwaitMil': 250, 'tag': 'input',
                'propriedades': [{ 'atributoNome': 'part', 'atributoValor': 'input', }, { 'atributoNome': 'name', 'atributoValor': 'Email', }, { 'atributoNome': 'inputmode', 'atributoValor': 'email', },],
            }, 'actions': [{ 'action': 'elementSetValue', 'elementValue': `${leadEmail}`, },],
        }; res = await chromeActions({ e, 'action': 'injectNew', 'target': urlTarget, 'fun': elementAction, 'funInf': params, }); res = res?.res || res; // console.log(res); 

        // await new Promise(r => { setTimeout(r, 500); });

        params = { // [INPUT] 'Razão Social'
            'nameSearch': `[INPUT] 'Razão Social'`, 'element': {
                'maxAwaitMil': 250, 'tag': 'input',
                'propriedades': [{ 'atributoNome': 'part', 'atributoValor': 'input', }, { 'atributoNome': 'name', 'atributoValor': 'RazaoSocial__c', }, { 'atributoNome': 'class', 'atributoValor': 'slds-input', },
                    // { 'atributoNome': 'maxlength', 'atributoValor': '255', }, { 'atributoNome': 'type', 'atributoValor': 'text', }, // EM ÚLTIMO CASO
                ],
            }, 'actions': [{ 'action': 'elementSetValue', 'elementValue': `${leadRazaoSocial}`, },],
        }; res = await chromeActions({ e, 'action': 'injectNew', 'target': urlTarget, 'fun': elementAction, 'funInf': params, }); res = res?.res || res; // console.log(res); 

        // await new Promise(r => { setTimeout(r, 500); });

        params = { // [INPUT] 'Telefone'
            'nameSearch': `[INPUT] 'Telefone'`, 'element': {
                'maxAwaitMil': 250, 'tag': 'input',
                'propriedades': [{ 'atributoNome': 'part', 'atributoValor': 'input', }, { 'atributoNome': 'name', 'atributoValor': 'Phone', }, { 'atributoNome': 'type', 'atributoValor': 'text', },],
            }, 'actions': [{ 'action': 'elementSetValue', 'elementValue': `${leadTelefone}`, },],
        }; res = await chromeActions({ e, 'action': 'injectNew', 'target': urlTarget, 'fun': elementAction, 'funInf': params, }); res = res?.res || res; // console.log(res); 

        // await new Promise(r => { setTimeout(r, 500); });

        params = { // [INPUT] 'CNPJ'
            'nameSearch': `[INPUT] 'CNPJ'`, 'element': {
                'maxAwaitMil': 250, 'tag': 'input',
                'propriedades': [{ 'atributoNome': 'part', 'atributoValor': 'input', }, { 'atributoNome': 'name', 'atributoValor': 'CNPJ__c', }, { 'atributoNome': 'type', 'atributoValor': 'text', },],
            }, 'actions': [{ 'action': 'elementSetValue', 'elementValue': `${leadCnpj}`, },],
        }; res = await chromeActions({ e, 'action': 'injectNew', 'target': urlTarget, 'fun': elementAction, 'funInf': params, }); res = res?.res || res; // console.log(res); 

        // await new Promise(r => { setTimeout(r, 500); });

        params = { // [BUTTON] 'Confirmar'
            'nameSearch': `[BUTTON] 'Confirmar'`, 'element': {
                'maxAwaitMil': 250, 'tag': 'button', 'content': 'Confirmar',
                'propriedades': [{ 'atributoNome': 'class', 'atributoValor': 'slds-button slds-button_neutral', }, { 'atributoNome': 'type', 'atributoValor': 'button', },
                { 'atributoNome': 'part', 'atributoValor': 'button', },],
            }, 'actions': [{ 'action': 'elementClick', },],
        }; res = await chromeActions({ e, 'action': 'injectNew', 'target': urlTarget, 'fun': elementAction, 'funInf': params, }); res = res?.res || res; // console.log(res); 

        // await new Promise(r => { setTimeout(r, 500); });

        params1 = { // [tag] {ALERTA DE ERRO} [30000]
            'nameSearch': `[tag] {ALERTA DE ERRO}`, 'element': {
                'maxAwaitMil': 30000, 'tag': 'div',
                'propriedades': [{ 'atributoNome': 'class', 'atributoValor': 'slds-notify slds-notify_toast slds-theme_error', },],
            }, 'actions': [{ 'action': 'elementGetValue', },],
        };
        params2 = { // [???] '{INDICADO}'
            'nameSearch': `{INDICADO}`, 'element': {
                'maxAwaitMil': 30000, 'tag': 'span',
                'propriedades': [{ 'atributoNome': 'class', 'atributoValor': 'test-id__section-header-title', },],
            }, 'actions': [{ 'action': 'elementGetValue', },],
        };
        res = await Promise.race([
            chromeActions({ e, action: 'injectNew', target: `*c6bank.my.site.com*`, fun: elementAction, funInf: params1, }),
            chromeActions({ e, action: 'injectNew', target: `*c6bank.my.site.com*`, fun: elementAction, funInf: params2, }),
        ]); res = res.res; // console.log(res);

        // await new Promise(r => { setTimeout(r, 500); });

        if (!res?.ret) {
            // CHECAGEM DE CAPTCHA
            pageValue = (await chromeActions({ e, action: 'getBody', target: `*c6bank.my.site.com*`, })).res;
            if (pageValue.includes(`Score is too low or not applicable`) || pageValue.includes(`muito baixa ou`)) {
                imputRes = 'CAPTCHA';
            } else {
                // NENHUM ALERTA DE ERRO OU POPUP DE SUCESSO (FORÇAR PARADA)
                // await screenshotAndStop({ 'err': `Sem status de finalização`, 'screenshot': '2', });
                imputRes = 'SEM STATUS DE INDICAÇÃO';
            }
        } else if (res?.res?.includes('Criação concluída') || res?.res?.includes('Informações')) {
            imputRes = `INDICAÇÃO OK`;
        } else {
            pageValue = (await chromeActions({ e, action: 'getBody', target: `*c6bank.my.site.com*`, })).res;
            if (pageValue.includes('O formato correto para o telefone')) {
                res['res'] = 'Inválido telefone';
            } else if (pageValue.includes('CNPJ informado é inválido')) {
                res['res'] = 'Inválido CNPJ';
            } else if (pageValue.includes('Insira um endereço de email válido')) {
                res['res'] = 'Inválido email';
            } else if (pageValue.includes('Preencha esse campo')) {
                res['res'] = 'Inválido nome completo';
            } else if (pageValue.includes('Os seguintes campos obrigatórios devem ser preenchidos')) {
                res['res'] = 'Os seguintes campos obrigatórios devem ser preenchidos';
            }
            imputRes = res?.res;
        }

        // await screenshot({ e, page, 'fileName': `screenshot`, }); await screenshot({ e, page, 'fileName': `${leadCnpj}_clientImput_1`, 'awaitPageFinish': false, });

        ret['ret'] = true;
        ret['msg'] = `CLIENT INPUT CHROMENEW: OK`;
        ret['res'] = {
            imputRes,
        };

        // console.log(ret);
        // await new Promise(r => { setTimeout(r, 9999999); }); // TESTES


    } catch (catchErr) {
        let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    }

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.hasOwnProperty('res') && { 'res': ret.res, }), };
}

// CHROME | NODE
globalThis['clientImputChromeNew'] = clientImputChromeNew;


