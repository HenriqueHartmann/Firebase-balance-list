let authState = 1;

function authSelection(id) {
  const sUp = "authSignUp";
  const sIn = "authSignIn";
  const cl = "auth-selected";

  if (id == sUp && authState == 1) {
    document.getElementById(sIn).removeAttribute("class", cl);

    // save it then remove it from the page
    const el = document.getElementById("forms");
    const contentBefore = el.innerHTML;
    el.innerHTML = "";

    // create div -> fullname
    const fullname = document.createElement("div");
    fullname.setAttribute("id", "fullnameForm");
    fullname.classList.add("form-group", "mt-5");

    // create label -> fullname
    const labelFN = document.createElement("label");
    labelFN.setAttribute("for", "fullname");
    labelFN.appendChild(document.createTextNode("FULLNAME"));

    // create input -> fullname
    const inputFN = document.createElement("input");
    inputFN.setAttribute("id", "fullname");
    inputFN.setAttribute("type", "text");
    inputFN.setAttribute("autocomplete", "nope");
    inputFN.setAttribute("name", "fullname");
    inputFN.setAttribute("placeholder", "Enter your full name");
    inputFN.classList.add("form-control-plaintext");

    // append component
    fullname.appendChild(labelFN);
    fullname.appendChild(inputFN);
    el.appendChild(fullname);
    el.innerHTML = el.innerHTML + contentBefore;

    // change button
    document.getElementById("btnAuth").innerHTML = "Sign Up";

    // change state
    authState = 0;
  }
  if (id == sIn && authState == 0) {
    // remove class auth-selected
    document.getElementById(sUp).removeAttribute("class", cl);

    if (document.getElementById("fullnameForm") != null) {
      // remove fullname
      document.getElementById("fullnameForm").remove();
    }

    // change button
    document.getElementById("btnAuth").innerHTML = "Sign In";

    // change state
    authState = 1;
  }

  // add class auth-selected
  document.getElementById(id).setAttribute("class", cl);
}
