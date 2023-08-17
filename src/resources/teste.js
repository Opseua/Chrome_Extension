var encodedText = "It&#39;s all so surreal";
let doc = new DOMParser().parseFromString(encodedText, "text/html");
var decodedText = doc.documentElement.textContent;
console.log(decodedText); // Saída: It's all so surreal