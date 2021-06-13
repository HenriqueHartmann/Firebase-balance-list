const firestore = firebase.firestore();
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
    document.getElementById("btnAuth").setAttribute("onclick", "signUp()");

    /*
      <div id="forms">
        <div id="fullnameForm" class="form-group mt-5">
          <label for="fullname">FULLNAME</label>
          <input id="fullname" type="text" autocomplete="nope" name="fullname"
              placeholder="Enter your full name" class="form-control-plaintext">
        </div>
        <div class="form-group mt-5">
          <label for="email">E-MAIL</label>
          <input id="email" type="text" class="form-control-plaintext" autocomplete="off"
              name="email" placeholder="Enter your email">
        </div>
        <div class="form-group mt-5">
            <label for="password">PASSWORD</label>
            <input id="password" type="password" class="form-control-plaintext" name="password"
                placeholder="********">
        </div>
      </div>
      <div class="text-center">
          <button type="button" id="btnAuth" class="btn btn-outline btn-lg block mt-5 mb-5"
              onclick="signUp()">Sign
              Up</button>
      </div>
    */

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
    document.getElementById("btnAuth").setAttribute("onclick", "signIn()");

    /*
      <div id="forms">
        <div class="form-group mt-5">
          <label for="email">E-MAIL</label>
          <input id="email" type="text" class="form-control-plaintext" autocomplete="off"
              name="email" placeholder="Enter your email">
        </div>
        <div class="form-group mt-5">
            <label for="password">PASSWORD</label>
            <input id="password" type="password" class="form-control-plaintext" name="password"
                placeholder="********">
        </div>
      </div>
      <div class="text-center">
          <button type="button" id="btnAuth" class="btn btn-outline btn-lg block mt-5 mb-5"
              onclick="signIn()">Sign
              In</button>
      </div>
    */

    // change state
    authState = 1;
  }

  // add class auth-selected
  document.getElementById(id).setAttribute("class", cl);
}

async function addProfile(profile) {
  await firestore.collection("profile").add(profile);
}

function signUp() {
  const fullname = document.getElementById("fullname").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (email == "" || password == "" || fullname == "") {
    swal({
      icon: "error",
      title: "You need to fill all fields",
    });
  } else {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        const profile = {
          fullname: fullname,
          uid: firebase.auth().currentUser.uid,
        };
        addProfile(profile);

        swal({
          icon: "success",
          title: "Sign Up was successful",
        }).then(() => {
          setTimeout(() => {
            window.location.replace("index.html");
          }, 300);
        });
      })
      .catch((error) => {
        let errMessage = "";

        switch (error.code) {
          case "auth/weak-password":
            errMessage = "Weak password";
            break;

          default:
            errMessage = error.message;
            break;
        }
        swal({
          icon: "error",
          title: errMessage,
        });
      });
  }
}

function signIn() {
  if (firebase.auth().currentUser) {
    firebase.auth().signOut();
  }

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (email == "" || password == "") {
    swal({
      icon: "error",
      title: "You need to fill both fields",
    });
  } else {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        swal({
          icon: "success",
          title: "Login was successful",
        }).then(() => {
          setTimeout(() => {
            window.location.replace("index.html");
          }, 300);
        });
      })
      .catch((error) => {
        let swalConf = {};
        swalConf["icon"] = "error";

        switch (error.code) {
          case "auth/wrong-password":
            swalConf["title"] = "Wrong password";
            break;
          case "auth/invalid-email":
            swalConf["title"] = "Invalid E-Mail";
            break;
          case "auth/user-not-found":
            swalConf["title"] = "User not found";
            authSelection("authSignUp");
            break;
          default:
            swalConf["title"] = error.message;
            break;
        }

        swal(swalConf);
      });
  }
}
