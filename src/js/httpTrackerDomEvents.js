const trackUrls = {
  urls: [
    "*://ntfy.sh/*",
    "*://api.dontpad.com/*",
  ]
};

const metodo = ["POST", "PUT"];

const reqBodyHeaders = httpTracker.isFF ? ["requestBody"] : ["requestBody", "extraHeaders"];
const reqHeaders = httpTracker.isFF ? ["requestHeaders"] : ["requestHeaders", "extraHeaders"];
const reqHeadersBlocking = httpTracker.isFF ? ["blocking", "requestHeaders"] : ["blocking", "requestHeaders", "extraHeaders"];
const resHeaders = httpTracker.isFF ? ["responseHeaders"] : ["responseHeaders", "extraHeaders"];
const errorHeaders = ["extraHeaders"];
const r = httpTracker.browser.webRequest;

let requestInfo = {};

r.onBeforeRequest.addListener(function (e) {
  if (metodo.includes(e.method)) {
    e.callerName = "onBeforeRequest";
    e.requestIdEnhanced = e.requestId;

    let reqBody;
    if (e.requestBody) {
      if (e.requestBody.formData) {
        reqBody = e.requestBody.formData.text.replace(/a/g, "b"); // substituir todas as letras "a" por "b"
      } else if (e.requestBody.raw) {
        const decoder = new TextDecoder("utf-8");
        reqBody = decoder.decode(e.requestBody.raw[0].bytes).replace(/a/g, "b"); // substituir todas as letras "a" por "b"
      }
    }

    const requestInfo = {
      method: e.method,
      url: e.url,
      headers: e.requestHeaders,
      body: reqBody
    };

    console.log(requestInfo);
  }
}, trackUrls, reqBodyHeaders);


r.onBeforeSendHeaders.addListener(function (e) {
  if (metodo.includes(e.method)) {
    e.callerName = "onBeforeSendHeaders";
    e.requestIdEnhanced = e.requestId;
    addModifyRequestHeaders(e);

    const logs = {
      "Request Details": e,
      "Request Info": requestInfo
    };

    const retorno = {
      method: requestInfo.method,
      url: requestInfo.url,
      headers: e.requestHeaders,
      body: requestInfo.reqBody
    }
    console.log(retorno)

    e.requestHeaders = [{ name: "Content-Type", value: "text" }];

    return blockRequests(e) ? { cancel: true } : { requestHeaders: e.requestHeaders };
  }
}, trackUrls, reqHeadersBlocking);
























/* r.onSendHeaders.addListener(function (e) {
  if (metodo.includes(e.method)) {
  e.callerName = "onSendHeaders";
  e.requestIdEnhanced = e.requestId;
  //console.log("Request Details", e);
}}, trackUrls, reqHeaders);

r.onHeadersReceived.addListener(function (e) {
  if (metodo.includes(e.method)) {
  e.callerName = "onHeadersReceived";
  e.requestIdEnhanced = e.requestId;
  //console.log("Response Details", e);
}}, trackUrls, resHeaders);

r.onAuthRequired.addListener(function (e) {
  if (metodo.includes(e.method)) {
  e.callerName = "onAuthRequired";
  e.requestIdEnhanced = e.requestId;
  console.log("Response Details", e);
}}, trackUrls, resHeaders);

r.onBeforeRedirect.addListener(function (e) {
  if (metodo.includes(e.method)) {
  e.callerName = "onBeforeRedirect";
  e.requestIdEnhanced = e.requestId;
  console.log("Response Details", e);
}}, trackUrls, resHeaders);

r.onResponseStarted.addListener(function (e) {
  if (metodo.includes(e.method)) {
  e.callerName = "onResponseStarted";
  e.requestIdEnhanced = e.requestId;
  //console.log("Response Details", e);
}}, trackUrls, resHeaders);

r.onCompleted.addListener(function (e) {
  if (metodo.includes(e.method)) {
  e.callerName = "onCompleted";
  e.requestIdEnhanced = e.requestId;
  //console.log("Response Details", e);
}}, trackUrls, resHeaders);

if (httpTracker.isFF) {
  r.onErrorOccurred.addListener(function (e) {
    if (metodo.includes(e.method)) {
    e.callerName = "onErrorOccurred";
    e.requestIdEnhanced = e.requestId;
    //console.log("Response Details", e);
}}, trackUrls);
} else {
  r.onErrorOccurred.addListener(function (e) {
    if (metodo.includes(e.method)) {
    e.callerName = "onErrorOccurred";
    e.requestIdEnhanced = e.requestId;
    console.log("Response Details", e);
}}, trackUrls, errorHeaders);
}
 */