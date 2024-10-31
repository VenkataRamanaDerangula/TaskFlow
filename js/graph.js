// Initialize chart variables
let pieChart, barChart;

localStorage.setItem("kanbanTasks", JSON.stringify(sampleTasks));

// Function to update or create charts
function updateCharts() {
  const tasks = JSON.parse(localStorage.getItem("kanbanTasks")) || {
    todo: [],
    inprogress: [],
    done: [],
  };

  // Count tasks in each category
  const taskCounts = [
    tasks.todo.length,
    tasks.inprogress.length,
    tasks.done.length,
  ];

  // Pie chart setup
  if (!pieChart) {
    const ctxPie = document.getElementById("pie-chart").getContext("2d");
    pieChart = new Chart(ctxPie, {
      type: "pie",
      data: {
        labels: ["To Do", "In Progress", "Done"],
        datasets: [
          {
            label: "Tasks Distribution",
            data: taskCounts,
            backgroundColor: ["#FF6384", "#36A2EB", "#4BC0C0"],
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
  } else {
    pieChart.data.datasets[0].data = taskCounts;
    pieChart.update();
  }

  // Bar chart setup
  if (!barChart) {
    const ctxBar = document.getElementById("bar-chart").getContext("2d");
    barChart = new Chart(ctxBar, {
      type: "bar",
      data: {
        labels: ["To Do", "In Progress", "Done"],
        datasets: [
          {
            label: "Tasks Count",
            data: taskCounts,
            backgroundColor: ["#FF6384", "#36A2EB", "#4BC0C0"],
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  } else {
    barChart.data.datasets[0].data = taskCounts;
    barChart.update();
  }
}

// Function to show Pie Chart
function showPieChart() {
  document.getElementById("pie-chart").style.display = "block";
  document.getElementById("bar-chart").style.display = "none";
  updateCharts();
}

// Function to show Bar Chart
function showBarChart() {
  document.getElementById("bar-chart").style.display = "block";
  document.getElementById("pie-chart").style.display = "none";
  updateCharts();
}

// Initialize the charts data but keep them hidden
updateCharts();
