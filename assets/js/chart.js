var ctxP = document.getElementById("myChart").getContext("2d");
var myPieChart = new Chart(ctxP, {
  plugins: [ChartDataLabels],
  type: "doughnut",
  data: {
    /* labels: ["Income", "Expenses"], */
    datasets: [
      {
        data: [400.0, 92.9],
        backgroundColor: ["#41cd7d", "#f44236"],
        hoverBackgroundColor: ["#68eba1", "#cd4b3d"],
      },
    ],
  },
  options: {
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
          let percentage = "R$" + value.toFixed(2);
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
