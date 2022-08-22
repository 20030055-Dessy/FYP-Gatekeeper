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
  window.location.href = "/privacy.html";
}

