var customManifestDetails,addModifyRequestHeadersList,blockURLSList,includeURLsList,excludeURLsList;function onError(e){console.error(e)}function getById(e){return document.getElementById(e)}function getByClassNames(e){return document.getElementsByClassName(e)}function sortArray(e,t){let r=/^\d/,s=/^[a-zA-Z]/,n=/^[^\w\s]/;e=e.toLowerCase(),t=t.toLowerCase();let o=1*n.test(e)||10*r.test(e)||100*s.test(e),i=1*n.test(t)||10*r.test(t)||100*s.test(t);return o!==i?o-i:e<t?-1:e>t?1:0}function stringToArray(e,t=","){return e&&e.trim().length>0?e.split(t).map(e=>e.trim()).filter(e=>e):void 0}function filterWithLength(e,t=0){if(e&&e.length>0)return e.filter(e=>e.length>t)}function uniqueArray(e){return e&&e.length?[...new Set(e)]:""}function sortMapByKey(e){return new Map([...e.entries()].sort())}function sortJsonByProperty(e,t){return e.sort(function(e,r){return e[t].localeCompare(r[t])})}function getStoredDetails(e){if(httpTracker.browser.runtime.lastError)onError(httpTracker.browser.runtime.lastError);else{let t=[];return e.httpTrackerGlobalExcludePatterns&&(t=e.httpTrackerGlobalExcludePatterns),t}}function setRequestHeadersList(e){addModifyRequestHeadersList=e}function getManifestDetails(){if(!customManifestDetails){let e=httpTracker.browser.runtime.getManifest();e&&((customManifestDetails={}).title=`${e.browser_action.default_title} (version : ${e.version})`)}return customManifestDetails}function blockRequests(e){let t=!1;return blockURLSList&&blockURLSList.some(r=>{e.url.includes(r)&&(t=!0)}),t}function addModifyRequestHeaders(e){return includeURLsList&&!includeURLsList.some(t=>e.url.toLowerCase().includes(t))||excludeURLsList&&excludeURLsList.some(t=>e.url.includes(t))||addModifyRequestHeadersList&&addModifyRequestHeadersList.forEach(t=>{if(t.hasOwnProperty("url")&&e.url.includes(t.url)||!t.hasOwnProperty("url")){let r=!1;for(let s of e.requestHeaders)if(s.name.toLowerCase()===t.name.toLowerCase()){s.value=t.value,r=!0;break}r||e.requestHeaders.push({name:t.name,value:t.value})}}),e.requestHeaders}function getPropertyFromStorage(e,t){if(!httpTracker.browser.runtime.lastError)return e[t];onError(httpTracker.browser.runtime.lastError)}function setPropertyToStorage(e,t){httpTracker.browser.storage.sync.set({[e]:t},function(){})}