const API  = 'https://biz-boost.onrender.com/api';

function createGradient(ctx, chartArea, color) {
  const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
  gradient.addColorStop(0, `${color}00`); // transparent
  gradient.addColorStop(0.5, `${color}80`); // semi-transparent
  gradient.addColorStop(1, `${color}FF`); // solid
  return gradient;
}

function createLineChart(ctx, labels, data, color) {
  return new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "",
          data: data,
          fill: true,
          tension: 0.4,
          borderColor: color,
          backgroundColor: (context) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return null;
            return createGradient(ctx, chartArea, color);
          },
          pointRadius: 0,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: {
          grid: { display: false },
        },
        y: {
          beginAtZero: true,
          grid: { color: "#f0f0f0" },
        },
      },
    },
  });
}

// ==========================
// Fetch Dashboard Summary (Totals)
// ==========================
async function fetchSummary() {
  try {
    const res = await fetch(`${API}/dashboard/summary`);
    if (!res.ok) throw new Error("Failed to fetch summary");
    const data = await res.json();

    document.getElementById("totalSales").textContent = data.totalSales.toLocaleString();
    document.getElementById("totalExpenses").textContent = data.expenses.toLocaleString();
    document.getElementById("totalProfit").textContent = data.profit.toLocaleString();
  } catch (error) {
    console.error("Error fetching summary:", error);
  }
}

// ==========================
// Fetch Sales Analytics and initialize/update chart
// ==========================
let salesChart;
async function fetchSalesAnalytics(view = "monthly") {
  try {
    const res = await fetch(`${API}/dashboard/sales-analytics`);
    if (!res.ok) throw new Error("Failed to fetch sales analytics");
    const data = await res.json();

    // Data format expected from your API (adjust if necessary):
    // {
    //   monthly: { labels: [], sales: [], payments: [] },
    //   yearly: { labels: [], sales: [], payments: [] }
    // }

    const labels = data[view].labels;
    const salesData = data[view].sales;

    const ctx = document.getElementById("salesChart").getContext("2d");

    if (salesChart) {
      salesChart.data.labels = labels;
      salesChart.data.datasets[0].data = salesData;
      salesChart.update();
    } else {
      salesChart = createLineChart(ctx, labels, salesData, "#009879");
    }
  } catch (error) {
    console.error("Error fetching sales analytics:", error);
  }
}

// ==========================
// Fetch Overdue Payments and initialize/update payment chart
// ==========================
let paymentChart;
async function fetchOverduePayments(view = "monthly") {
  try {
    const res = await fetch(`${API}/dashboard/overdue-payments`);
    if (!res.ok) throw new Error("Failed to fetch overdue payments");
    const data = await res.json();

    // Assuming data format similar to sales analytics
    // { monthly: { labels: [], payments: [] }, yearly: { labels: [], payments: [] } }

    const labels = data[view].labels;
    const paymentsData = data[view].payments;

    const ctx = document.getElementById("paymentChart").getContext("2d");

    if (paymentChart) {
      paymentChart.data.labels = labels;
      paymentChart.data.datasets[0].data = paymentsData;
      paymentChart.update();
    } else {
      paymentChart = createLineChart(ctx, labels, paymentsData, "#ff9800");
    }
  } catch (error) {
    console.error("Error fetching overdue payments:", error);
  }
}

// ==========================
// Fetch Quick Stats and populate list
// ==========================
async function fetchQuickStats() {
  try {
    const res = await fetch(`${API}/dashboard/quick-stats`);
    if (!res.ok) throw new Error("Failed to fetch quick stats");
    const data = await res.json();

    // Assuming data is array of strings or objects; adjust as per actual API response
    // For example: [{ item: "Tomato Rice", amount: "56000" }, ...]
    const list = data.map((item, i) => `<li>${i + 1}. ${item}</li>`).join("");
    document.getElementById("quickStats").innerHTML = list;
  } catch (error) {
    console.error("Error fetching quick stats:", error);
  }
}

// ==========================
// Fetch Top Customers and populate list
// ==========================
async function fetchTopCustomers() {
  try {
    const res = await fetch(`${API}/dashboard/top-customers`);
    if (!res.ok) throw new Error("Failed to fetch top customers");
    const data = await res.json();

    // Assuming data = [{ name: "John Doe", amount: 500000 }, ...]
    const list = data
      .map((c) => `<li>${c.name} <span>${Number(c.amount).toLocaleString()}</span></li>`)
      .join("");
    document.getElementById("topCustomers").innerHTML = list;
  } catch (error) {
    console.error("Error fetching top customers:", error);
  }
}

// ==========================
// Tabs Switching (Monthly/Yearly) for sales and payments charts
// ==========================
function setupTabs() {
  const salesTabs = document.querySelectorAll("#salesTabs button");
  const paymentTabs = document.querySelectorAll("#paymentTabs button");

  salesTabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      salesTabs.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const view = btn.dataset.view;
      fetchSalesAnalytics(view);
    });
  });

  paymentTabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      paymentTabs.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const view = btn.dataset.view;
      fetchOverduePayments(view);
    });
  });
}

// ==========================
// Init on DOM Ready
// ==========================
document.addEventListener("DOMContentLoaded", async () => {
  await fetchSummary();
  await fetchSalesAnalytics("monthly");
  await fetchOverduePayments("monthly");
  await fetchQuickStats();
  await fetchTopCustomers();
  setupTabs();
});