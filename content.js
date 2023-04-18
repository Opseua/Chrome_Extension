(function() {
    console.log("OK")
    var url_filter_obj = { urls: ["<all_urls>"] };
    var post_obj = null;
  
    function beforeRequest(req_details) {
      if (post_obj) post_obj.postMessage({ type: "beforeRequest", req_details: req_details });
    }
  
    function beforeSendHeaders(req_details) {
      if (post_obj) post_obj.postMessage({ type: "beforeSendHeaders", req_details: req_details });
    }
  
    function headersReceived(req_details) {
      if (post_obj) post_obj.postMessage({ type: "headersReceived", req_details: req_details });
    }
  
    function completed(req_details) {
      if (post_obj) post_obj.postMessage({ type: "completed", req_details: req_details });
    }
  
    function errorOccurred(req_details) {
      if (post_obj) post_obj.postMessage({ type: "errorOccurred", req_details: req_details });
    }
  
    chrome.runtime.onConnect.addListener(function(port) {
      console.assert(port.name == "sniffing_background");
      post_obj = port;
    });
  
    chrome.webRequest.onBeforeRequest.addListener(beforeRequest, url_filter_obj, ["requestBody"]);
    chrome.webRequest.onBeforeSendHeaders.addListener(beforeSendHeaders, url_filter_obj, ["requestHeaders"]);
    chrome.webRequest.onHeadersReceived.addListener(headersReceived, url_filter_obj, ["responseHeaders"]);
    chrome.webRequest.onCompleted.addListener(completed, url_filter_obj, ["responseHeaders", "blocking"]);
    chrome.webRequest.onErrorOccurred.addListener(errorOccurred, url_filter_obj);
  
  })();
  