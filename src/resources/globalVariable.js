import { api } from './api.js';

// *******************************************************

async function globalVariable(inf) {

    let varGlobal = JSON.parse(localStorage.getItem('varGlobal'));
    if (!varGlobal) {
        const infApi = {
            url: `https://banco-de-dados-9bc75-default-rtdb.firebaseio.com/tasker.json`,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            body: { 'tags': ['1', '2', '3'] }
        }
        const retApi = await api(infApi);
        window.localStorage.setItem('varGlobal', JSON.stringify(retApi));
        varGlobal = retApi;
        console.log('VARIAVEL GLOBAL: DEFINIDA')
    }

    if (!inf) {
        return
    }

    //console.log(`VARIAVEL GLOBAL: ${inf.met}`);
    if (inf.met == 'get') {
        if (varGlobal[inf.nom] === undefined) {
            var ret = undefined
        } else {
            var ret = varGlobal[inf.nom];
        }
        //console.log(ret);
        return ret;
    };

    if (inf.met == 'post') {
        varGlobal[inf.nom] = inf.val;
        const ret = varGlobal[inf.nom];
        //console.log(ret);
        window.localStorage.setItem('varGlobal', JSON.stringify(varGlobal));

        const infApi = {
            url: `https://banco-de-dados-9bc75-default-rtdb.firebaseio.com/tasker.json`,
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: varGlobal
        }
        const retApi = await api(infApi);

        return ret;
    };

    if (inf.met == 'delete') {
        if (varGlobal[inf.nom]) {
            delete varGlobal[inf.nom];
            window.localStorage.setItem('varGlobal', JSON.stringify(varGlobal));
            var ret = 'deletado';

            const infApi = {
                url: `https://banco-de-dados-9bc75-default-rtdb.firebaseio.com/tasker.json`,
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: varGlobal
            }
            const retApi = await api(infApi);

        } else {
            var ret = undefined;
        }
        //console.log(ret)
        return ret;
    }

}

export { globalVariable }
