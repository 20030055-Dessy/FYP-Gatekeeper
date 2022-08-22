//Done by Dessy

var btn = document.querySelector("button");

function updateButton() {
    // update button based on storage
    chrome.storage.local.get(['onOrOff'], result => {
      btn.innerHTML = result.onOrOff ? "enabled" : "disabled";
      btn.className = result.onOrOff ? "buttonON" : "buttonOFF";
      btn.style.backgroundColor  = result.onOrOff ? "green" : "red";
    })
}

function toggleButton(e) {
    // check className of button
    var bool = e.target.className === 'buttonON' ? false : true
    chrome.storage.local.set({ 'onOrOff': bool }, result => {
        updateButton()
    })

}

updateButton()
btn.onclick = toggleButton

