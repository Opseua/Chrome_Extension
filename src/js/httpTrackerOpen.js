const bringToFront={focused:!0},createWindowProperties={type:"popup",url:httpTracker.browser.extension.getURL(httpTracker.PAGE_PATH),state:httpTracker.isFF?"maximized":"normal"};function openAddonOptions(){httpTracker.browser.windows.getAll({populate:!0},getAddonOptions)}function getAddonOptions(t){let r;0<t.length&&t.some(t=>{t.tabs&&t.tabs.some(t=>t.url.includes("/src/html/options.html"))&&(r=t)}),r?httpTracker.browser.tabs.query({windowId:r.id,url:httpTracker.browser.runtime.getURL("/src/html/options.html")},function(t){t&&1==t.length&&(httpTracker.browser.windows.update(r.id,{focused:!0}),httpTracker.browser.tabs.update(t[0].id,{active:!0}))}):httpTracker.browser.runtime.openOptionsPage()}function openAddon(){httpTracker.browser.windows.getAll({populate:!0},getAddonWindow)}function getAddonWindow(r){httpTracker.browser.storage.sync.get([httpTracker.STORAGE_KEY_OPEN_ADDON_IN_TAB],function(t){t=getPropertyFromStorage(t,httpTracker.STORAGE_KEY_OPEN_ADDON_IN_TAB);void 0===t&&setPropertyToStorage(httpTracker.STORAGE_KEY_OPEN_ADDON_IN_TAB,!1),(t?openInTab:openInPopWindow)(r)})}function openInTab(t){var r=getExistingAddonWindow(t);r?httpTracker.browser.tabs.query({windowId:r.id,url:httpTracker.browser.runtime.getURL(httpTracker.PAGE_PATH)},function(t){t&&1==t.length&&(httpTracker.browser.windows.update(r.id,{focused:!0}),httpTracker.browser.tabs.update(t[0].id,{active:!0}))}):httpTracker.browser.tabs.create({url:httpTracker.browser.runtime.getURL(httpTracker.PAGE_PATH)})}function getExistingAddonWindow(t){let r;return 0<t.length&&t.some(t=>{t.tabs&&t.tabs.some(t=>t.url.includes(httpTracker.PAGE_PATH))&&(r=t)}),r}function openInPopWindow(t){t=getExistingAddonWindow(t);t?httpTracker.browser.windows.get(t.id,focusExistingWindow):httpTracker.browser.windows.create(createWindowProperties)}function focusExistingWindow(t){httpTracker.browser.runtime.lastError?onError(httpTracker.browser.runtime.lastError):t?httpTracker.browser.windows.update(t.id,bringToFront):createNewAddonPopup()}httpTracker.browser.browserAction.setTitle({title:getManifestDetails().title}),httpTracker.browser.browserAction.onClicked.addListener(openAddon);