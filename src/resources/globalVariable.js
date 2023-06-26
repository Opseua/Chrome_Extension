//const { api } = await import('./api.js');
import { api } from './api.js';


// *******************************************************

async function globalVariable(inf) {

    let variavel_global = JSON.parse(localStorage.getItem('variavel_global'));
    if (!variavel_global) {
        const inf_api = {
            url: `https://banco-de-dados-9bc75-default-rtdb.firebaseio.com/tasker.json`,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            body: { 'tags': ['1', '2', '3'] }
        }
        const retApi = await api(inf_api);
        window.localStorage.setItem('variavel_global', JSON.stringify(retApi));
        variavel_global = retApi;
        console.log('VARIAVEL GLOBAL: DEFINIDA')
    }

    if (!inf) {
        return
    }

    //console.log(`VARIAVEL GLOBAL: ${inf.met}`);
    if (inf.met == 'get') {
        if (variavel_global[inf.nom] === undefined) {
            var ret = undefined
        } else {
            var ret = variavel_global[inf.nom];
        }
        //console.log(ret);
        return ret;
    };

    if (inf.met == 'post') {
        variavel_global[inf.nom] = inf.val;
        const ret = variavel_global[inf.nom];
        //console.log(ret);
        window.localStorage.setItem('variavel_global', JSON.stringify(variavel_global));

        const inf_api = {
            url: `https://banco-de-dados-9bc75-default-rtdb.firebaseio.com/tasker.json`,
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: variavel_global
        }
        const retApi = await api(inf_api);

        return ret;
    };

    if (inf.met == 'delete') {
        if (variavel_global[inf.nom]) {
            delete variavel_global[inf.nom];
            window.localStorage.setItem('variavel_global', JSON.stringify(variavel_global));
            var ret = 'deletado';

            const inf_api = {
                url: `https://banco-de-dados-9bc75-default-rtdb.firebaseio.com/tasker.json`,
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: variavel_global
            }
            const retApi = await api(inf_api);

        } else {
            var ret = undefined;
        }
        //console.log(ret)
        return ret;
    }

}

export { globalVariable }
