const firestore = firebase.firestore();

function formBalance(action, value, text) {
  let record = {
    action: action,
    value: value,
    description: text,
    uid: firebase.auth().currentUser.uid,
  };
  console.log(record);
}

async function updateBalance(record) {
  await firestore.collection("balance").add(record);
}
