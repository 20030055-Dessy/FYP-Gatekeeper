//Done by Dessy



function hasAccepted() {
  let acceptedTerms = localStorage['accepted-terms'];

  if (acceptedTerms) {
    return true;
  }
}

// privacy policy has not been accepted yet
if (hasAccepted()) {
  document.getElementById("okButton").style.display = "none";
}

let okButton = document.getElementById("okButton");

okButton.onclick = function (element) {
  localStorage['accepted-terms'] = true;
  window.location.href = "popup.html";
};