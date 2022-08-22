//Done by Dessy

function hasAccepted() {
  let acceptedTerms = localStorage['accepted-terms'];

  if (acceptedTerms) {
    return true;
  }
  return false;
}

// privacy policy has not been accepted yet
if (!hasAccepted()) {
  window.location.href = "privacy.html";
}


//To display the URL in the pop up page
window.onload = function () {
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    const url = new URL(tab.url);
    const urlDomain = url.hostname;
    var show = document.getElementById("showURL");
    if (show) {
      show.innerHTML = urlDomain;
    }
  }
  );

//redirect to GateKeeper website for reporting
  const redirectBtn = document.getElementById("goBtn");
redirectBtn.onclick = function () {
  chrome.tabs.update({url: "http://localhost:8080/login"});
 
  
};

}





//Auto validation is ON is false then sendMessage to the background.js by clicking.
chrome.storage.local.get(['onOrOff'], function (results) {
  if (results.onOrOff == false) {
    window.onload = function () {
      var btn = document.getElementById('manual');

//redirect to GateKeeper website for reporting
const redirectBtn = document.getElementById("goBtn");
redirectBtn.onclick = function () {
  chrome.tabs.update({url: "http://localhost:8080/login"});
 
  
};
      
      function onClick() {
        chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
          const url = new URL(tab.url);
          const domain = url.hostname;
         
          //Send user entered domain to background.js and recieve a response. 
          chrome.runtime.sendMessage({ command: "fetch", data: domain}, (response) => {
            //response.data retrieves status of the domain
            chrome.runtime.sendMessage({ command: "check", data: response.data, data1: url });
          });
          
        });
      }
      if (btn) {
        btn.onclick = onClick;
      }

      chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        const url = new URL(tab.url);
        const urlDomain = url.hostname;
        var show = document.getElementById("showURL");
        if (show) {
          show.innerHTML = urlDomain;
        }
      }

      );
    }
  }
});







