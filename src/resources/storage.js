// const { storageSet, storageGet, storageDel } = await import('./storage.js');

// const infStorageSet = { 'key': 'nome', 'value': '111111' }
// const retStorageSet = await storageSet(infStorageSet);
// console.log(retStorageSet);

// const infStorageGet = { 'key': 'nome' }
// const retStorageGet = await storageGet(infStorageGet);
// console.log(retStorageGet);

// const infStorageDel = { 'key': 'nome' }
// const retStorageDel = await storageDel(infStorageDel);
// console.log(retStorageDel);

function storageSet(inf) {
  return new Promise((resolve) => {
    let ret = { 'ret': false };

    const data = {};
    if (!inf.key) {
      ret['msg'] = 'STORAGE SET: ERRO | INFORMAR A "key"';
    } else if (!inf.value) {
      ret['msg'] = 'STORAGE SET: ERRO | INFORMAR O "value"';
    } else {
      data[inf.key] = inf.value;
      chrome.storage.local.set(data, () => {
        if (chrome.runtime.lastError) {
          ret['msg'] = `STORAGE SET: ERRO | ${chrome.runtime.lastError}`;
        } else {
          ret['ret'] = true;
          ret['msg'] = 'STORAGE SET: OK';
        }
        resolve(ret);
      });
      return;
    }

    if (!ret.ret) { console.log(ret.msg) }
    resolve(ret);
  });
}

function storageGet(inf) {
  return new Promise((resolve) => {
    let ret = { 'ret': false };

    chrome.storage.local.get(inf.key, (result) => {
      if (chrome.runtime.lastError) {
        ret['msg'] = `STORAGE GET: ERRO | ${chrome.runtime.lastError}`;
      } else if (Object.keys(result).length === 0) {
        ret['msg'] = `STORAGE GET: ERRO | CHAVE '${inf.key}' NAO ENCONTRADA`;
      } else {
        ret['ret'] = true;
        ret['msg'] = 'STORAGE GET: OK';
        ret['res'] = result[inf.key]
      }

      if (!ret.ret) { console.log(ret.msg) }
      resolve(ret);
    });
  });
}

function storageDel(inf) {
  return new Promise((resolve) => {
    let ret = { 'ret': false };

    chrome.storage.local.get(inf.key, (result) => {
      if (chrome.runtime.lastError) {
        ret['msg'] = `STORAGE DEL: ERRO | ${chrome.runtime.lastError}`;
      } else if (Object.keys(result).length === 0) {
        ret['msg'] = `STORAGE DEL: ERRO | CHAVE '${inf.key}' NAO ENCONTRADA`;
      } else {
        chrome.storage.local.remove(inf.key, () => { });
        ret['ret'] = true;
        ret['msg'] = 'STORAGE DEL: OK';
      }

      if (!ret.ret) { console.log(ret.msg) }
      resolve(ret);
    });
  });
}

export { storageSet, storageGet, storageDel }