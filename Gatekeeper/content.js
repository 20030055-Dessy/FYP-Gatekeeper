
//Get current domain   
var urlDomain = window.location.hostname;
var fullurl = window.location.href;

//Line 8 - 9 Dessy 
//Auto validation is ON is true then sendMessage to the background.js
chrome.storage.local.get(['onOrOff'], function (results) {
  if (results.onOrOff == true) {

    //Line 11 - 30 Derren
    //If fetch's response.data is a status then send a "check" command to background to inject ui(yellow/red/green) to the browser.
    //If fetch's response.data is checkFirebase then send "checkFirebase" command to background to query the firebase then send "check" command to background to inject ui(yellow/red/green) to the browser.
    chrome.runtime.sendMessage({ command: "fetch", data: urlDomain }, (response) => {
      if(response.data == "checkFirebase"){
        chrome.runtime.sendMessage({ command: "checkFirebase", data: urlDomain }, (response) => {
          chrome.runtime.sendMessage({ command: "check", data: response.data, data1: fullurl });
        });
      }

      
      chrome.runtime.sendMessage({ command: "check", data: response.data, data1: fullurl });
    });
  }
})
//Derren
//Activate the code to increment the count field of the visited link in firebase.
chrome.runtime.sendMessage({command: "increment",data:urlDomain}, (response) => {
  console.log(response.data);
});



