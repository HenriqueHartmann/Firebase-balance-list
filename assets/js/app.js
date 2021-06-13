const firestore = firebase.firestore();
let currentUser = {};
let records = [];

function checkAuth() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      currentUser.uid = user.uid;
      getRecords();
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

function renderChart(qtdInc, qtdExp) {
  if (qtdInc == 0 && qtdExp == 0) {
    qtdInc = 1;
    qtdExp = 1;
  }

  var ctxP = document.getElementById("myChart").getContext("2d");
  var myPieChart = new Chart(ctxP, {
    plugins: [ChartDataLabels],
    type: "doughnut",
    data: {
      /* labels: ["Income", "Expenses"], */
      datasets: [
        {
          data: [qtdInc, qtdExp],
          backgroundColor: ["#28a745", "#dc3545"],
        },
      ],
    },
    options: {
      tooltips: { enabled: false },
      hover: { mode: null },
      responsive: true,
      legend: {
        position: "left",
        labels: {
          padding: 20,
          boxWidth: 10,
          fontSize: 15,
          fontColor: "white",
        },
      },
      plugins: {
        datalabels: {
          formatter: (value, ctx) => {
            let total = qtdInc + qtdExp;
            let percentage = ((value * 100) / total).toFixed(2) + "%";
            return percentage;
          },
          color: "white",
          labels: {
            title: {
              font: {
                size: 18,
              },
            },
          },
        },
      },
    },
  });
}

function renderAmount(qtdInc, qtdExp) {
  const elInc = document.getElementById("qtdInc");
  const elExp = document.getElementById("qtdExp");

  elInc.innerHTML = "R$" + qtdInc;
  elExp.innerHTML = "R$" + qtdExp;

  renderChart(qtdInc, qtdExp);
}

function renderRecords() {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";
  for (let record of records) {
    // Create HTML elements
    let tr = document.createElement("tr");
    let tdType = document.createElement("td");
    let tdAmount = document.createElement("td");
    let tdDesc = document.createElement("td");
    let tdButton = document.createElement("td");
    let button = document.createElement("button");

    // Add texts
    tdType.appendChild(document.createTextNode(record.type));
    tdAmount.appendChild(document.createTextNode(record.amount));
    tdDesc.appendChild(document.createTextNode(record.description));
    button.appendChild(document.createTextNode("Delete"));

    // Add atributes to button
    button.setAttribute("type", "button");
    button.classList.add("btn", "btn-danger");
    button.setAttribute("onclick", `delRecord("${record.id}")`);

    // Get together
    tdButton.appendChild(button);
    tr.appendChild(tdType);
    tr.appendChild(tdAmount);
    tr.appendChild(tdDesc);
    tr.appendChild(tdButton);

    tbody.appendChild(tr);
  }
}

async function getRecords() {
  records = [];
  const logRecords = await firestore
    .collection("records")
    .where("owner", "==", currentUser.uid)
    .get();

  let qtdInc = 0;
  let qtdExp = 0;

  for (doc of logRecords.docs) {
    if (doc.data().type == "income") {
      qtdInc += doc.data().amount;
    } else {
      qtdExp += doc.data().amount;
    }

    records.push({
      id: doc.id,
      type: doc.data().type,
      amount: doc.data().amount,
      description: doc.data().description,
    });
  }

  renderAmount(qtdInc, qtdExp);
  renderRecords();
}

async function addRecord(type, amount, text) {
  if (isNaN(amount) && text == "") {
    swal({
      icon: "error",
      title: "Amount and Description: cannot be blank",
      text: "Try again",
    });
  } else if (isNaN(amount)) {
    swal({
      icon: "error",
      title: "Amount: cannot be blank",
      text: "Try again",
    });
  } else if (amount <= 0) {
    swal({
      icon: "error",
      title: "Amount cannot be negative or zero",
      text: "Try again",
    });
  } else if (text == "") {
    swal({
      icon: "error",
      title: "Description: cannot be blank",
      text: "Try again",
    });
  } else {
    const record = {
      type: type,
      amount: amount,
      description: text,
      owner: currentUser.uid,
    };

    await firestore.collection("records").add(record);
    getRecords();
  }
}

async function delRecord(id) {
  await firestore.collection("records").doc(id).delete();
  getRecords();
}

function signOut() {
  firebase.auth().signOut();
}

window.onload = function () {
  checkAuth();
};
