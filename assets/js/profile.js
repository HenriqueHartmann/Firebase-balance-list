const firestore = firebase.firestore();
let currentUser = {};

function checkAuth() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      currentUser.uid = user.uid;
      getProfile();
      let userLabel = document.getElementById("navbarDropdown");
      userLabel.innerHTML = user.email;
    } else {
      swal({
        icon: "success",
        title: "Redirecting to authentication",
      }).then(() => {
        setTimeout(() => {
          window.location.replace("auth.html");
        }, 500);
      });
    }
  });
}

async function getProfile() {
  const profile = await firestore
    .collection("profile")
    .where("uid", "==", currentUser.uid)
    .get();

  const profileData = profile.docs[0];
  currentUser.id = profileData.id;
  currentUser.fullname = profileData.data().fullname;

  // create elements

  const form = document.createElement("form");

  const formGroup = document.createElement("div");
  const label = document.createElement("label");
  const input = document.createElement("input");

  const parentBtn = document.createElement("div");
  const btn = document.createElement("button");

  // set attributes

  formGroup.setAttribute("class", "form-group");
  label.setAttribute("for", "inputFullname");
  label.innerHTML = "Full Name";
  input.setAttribute("id", "inputFullname");
  input.setAttribute("type", "text");
  input.setAttribute("class", "form-control");
  input.setAttribute("value", currentUser.fullname);

  parentBtn.setAttribute("id", "btnParent");
  btn.setAttribute("type", "button");
  btn.classList.add("btn", "btn-dark");
  btn.setAttribute("onclick", "updateProfile()");
  btn.innerHTML = "Save Profile";

  // get together

  formGroup.appendChild(label);
  formGroup.appendChild(input);

  parentBtn.appendChild(btn);

  form.appendChild(formGroup);
  form.appendChild(parentBtn);

  // set on DOC
  const formProfile = document.getElementById("formProfile");
  formProfile.innerHTML = "";
  formProfile.appendChild(form);
  /*
    <form>
        <div class="form-group">
            <label for="inputFullname">Full name</label>
            <input id="inputFullname" type="text" class="form-control">
        </div>
        <div id="btnParent">
            <button type="button" class="btn btn-dark" onclick="updateProfile()">Save
            Profile</button>
        </div>
    </form>
    */
}

async function updateProfile() {
  const fullname = document.getElementById("inputFullname").value;

  await firestore.collection("profile").doc(currentUser.id).update({
    fullname: fullname,
  });
}

function signOut() {
  firebase.auth().signOut();
}

window.onload = () => {
  checkAuth();
};
