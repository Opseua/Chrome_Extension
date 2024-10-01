// let infObjFilter, retObjFilter
// infObjFilter = { 'e': e, 'obj': { 'comida': 'carro', 'cadeira': { 'moto': 'carro', 'comida': 'carro', } }, 'values': ['carro',], 'filters': [{ 'includes': ['*cadeira*',] }, { 'excludes': ['*cadeira.comida*',] },] }
// retObjFilter = objFilter(infObjFilter); console.log(retObjFilter)

let e = import.meta.url, ee = e;
async function objFilter(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    try {
        let results = []; let { obj, values, keys, filters, } = inf;

        function search(current, path = []) {
            if (typeof current === 'object' && current !== null) {
                for (let key in current) {
                    if (current.hasOwnProperty(key)) {
                        if (values && values.includes(current[key])) {
                            // CHECA SE EXISTE: VALOR
                            results.push({ key: path.concat(key).join('.'), value: current[key] });
                        } else if (keys && keys.includes(key)) {
                            // CHECA SE EXISTE: CHAVE
                            results.push({ key: path.concat(key).join('.'), value: current[key] });
                        }
                        search(current[key], path.concat(key));
                    }
                }
            }
        }

        search(obj);

        // FILTRAR OS RESULTADOS
        function filter(inf) {
            let resultsOk = []
            for (let [index, value] of inf.results.entries()) {
                let regexRes = []
                for (let [index1, value1] of (inf.filters.includes || inf.filters.excludes).entries()) {
                    let regexRet = regex({ 'e': e, 'simple': true, 'pattern': value1, 'text': value.key })
                    regexRes.push(inf.filters.includes ? regexRet : !regexRet);
                }
                if (regexRes.includes(true)) {
                    resultsOk.push(value)
                }
            };
            return resultsOk
        }

        // REFILTRA OS RESULTADOS
        if (filters && filters.length > 0) {
            for (let [index, value] of filters.entries()) {
                if (value.includes || value.excludes) {
                    results = filter({ 'results': results, 'filters': value });
                }
            }
        }

        ret['ret'] = true;
        ret['msg'] = `OBJ FILTER: OK`;
        ret['res'] = [...new Map(results.map(i => [i.key, i])).values()]; // REMOVER DUPLICATAS

    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res;
    }; return { ...({ ret: ret.ret }), ...(ret.msg && { msg: ret.msg }), ...(ret.res && { res: ret.res }), };
};

// CHROME | NODEJS
(eng ? window : global)['objFilter'] = objFilter;