// sales.js
const API  = 'https://biz-boost.onrender.com';

document.addEventListener("DOMContentLoaded", () => {
  // Modal Elements
  const modal = document.getElementById("addSaleModal");
  const addSaleBtn = document.getElementById("addSaleBtn");
  const closeModal = modal.querySelector(".close");
  const addSaleForm = document.getElementById("addSaleForm");

  // KPI Elements
  const totalSalesEl = document.getElementById("totalSales");
  const cashSalesEl = document.getElementById("cashSales");
  const mobileSalesEl = document.getElementById("mobileSales");
  const pendingOrdersEl = document.getElementById("pendingOrders");

  // Table and Dashboard Elements
  const productTableBody = document.getElementById("productTableBody");
  const pendingOrdersList = document.getElementById("pendingOrdersList");
  const topCustomersList = document.getElementById("topCustomers");
  const topSellingProductsBody = document.getElementById("topSellingProducts");

  // Filter Elements
  const filterSelect = document.getElementById("filterSelect");
  const searchInput = document.getElementById("searchInput");

  // Load Sales Data
  let salesData = JSON.parse(localStorage.getItem("salesData")) || [];
  let currentFilter = "all";

  // Chart.js Sales Analytics
  const ctx = document.getElementById("salesAnalyticsChart").getContext("2d");
  let salesChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Sales",
          data: [],
          borderColor: "#007bff",
          backgroundColor: "rgba(0, 123, 255, 0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } },
    },
  });

  // Switch Chart Data (Month / Year)
  let currentView = "monthly";
  const monthlyTab = document.getElementById("monthlyTab");
  const yearlyTab = document.getElementById("yearlyTab");

  monthlyTab.addEventListener("click", () => {
    currentView = "monthly";
    monthlyTab.classList.add("active");
    yearlyTab.classList.remove("active");
    updateChart();
  });

  yearlyTab.addEventListener("click", () => {
    currentView = "yearly";
    yearlyTab.classList.add("active");
    monthlyTab.classList.remove("active");
    updateChart();
  });

  // Modal Functions
  addSaleBtn.addEventListener("click", () => {
    modal.style.display = "block";
  });

  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) modal.style.display = "none";
  });

  // =========================
  // Handle Form Submission (with backend POST)
  // =========================
  addSaleForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const productName = document.getElementById("productName").value.trim();
    const amount = parseFloat(document.getElementById("amount").value);
    const paymentType = document.getElementById("paymentType").value;
    const customerName = document.getElementById("customerName").value.trim();
    const status = document.getElementById("status").value;

    const newSale = {
      productName,
      amount,
      paymentType,
      customerName,
      status,
      date: new Date().toISOString(),
    };

    try {
      const response = await fetch(`${API}/sales`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newSale)
      });

      if (!response.ok) throw new Error("Failed to save sale to backend");

      const savedSale = await response.json(); // assume backend returns sale with ID
      salesData.push(savedSale);
      localStorage.setItem("salesData", JSON.stringify(salesData)); // optional sync

      updateDashboard();
      addSaleForm.reset();
      modal.style.display = "none";
      console.log("Sale saved successfully");
    } catch (error) {
      console.error("Error saving sale:", error);
      alert("There was a problem saving the sale. Please try again.");
    }
  });

  // =========================
  // Delete Sale
  // =========================
  function deleteSale(id) {
    salesData = salesData.filter((sale) => sale.id !== id);
    localStorage.setItem("salesData", JSON.stringify(salesData));
    updateDashboard();
  }

  // =========================
  // Update Dashboard Sections
  // =========================
  function updateKPIs(filteredData) {
    const total = filteredData.reduce((sum, s) => sum + s.amount, 0);
    const cash = filteredData
      .filter((s) => s.paymentType === "cash")
      .reduce((sum, s) => sum + s.amount, 0);
    const mobile = filteredData
      .filter((s) => s.paymentType === "mobile")
      .reduce((sum, s) => sum + s.amount, 0);
    const pending = filteredData.filter((s) => s.status === "pending").length;

    totalSalesEl.textContent = `₦${total.toLocaleString()}`;
    cashSalesEl.textContent = `₦${cash.toLocaleString()}`;
    mobileSalesEl.textContent = `₦${mobile.toLocaleString()}`;
    pendingOrdersEl.textContent = pending;
  }

  function updateProductTable(filteredData) {
    productTableBody.innerHTML = "";
    filteredData.forEach((sale, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${sale.productName}</td>
        <td>₦${sale.amount.toLocaleString()}</td>
        <td>${sale.paymentType}</td>
        <td>${sale.customerName}</td>
        <td>${sale.status}</td>
        <td>
          <button class="btn delete" data-id="${sale.id}">
            <i class="fa fa-trash"></i> Delete
          </button>
        </td>
      `;
      productTableBody.appendChild(row);
    });

    document.querySelectorAll(".btn.delete").forEach((btn) => {
      btn.addEventListener("click", () =>
        deleteSale(parseInt(btn.dataset.id))
      );
    });
  }

  function updatePendingOrders(filteredData) {
    pendingOrdersList.innerHTML = "";
    filteredData
      .filter((s) => s.status === "pending")
      .forEach((sale) => {
        const li = document.createElement("li");
        li.textContent = `${sale.productName} `;
        const span = document.createElement("span");
        span.textContent = `₦${sale.amount.toLocaleString()}`;
        li.appendChild(span);
        pendingOrdersList.appendChild(li);
      });
  }

  function updateTopCustomers(filteredData) {
    const topCustomers = {};
    filteredData.forEach((sale) => {
      if (!topCustomers[sale.customerName])
        topCustomers[sale.customerName] = 0;
      topCustomers[sale.customerName] += sale.amount;
    });

    const sorted = Object.entries(topCustomers).sort((a, b) => b[1] - a[1]);
    topCustomersList.innerHTML = "";
    sorted.slice(0, 5).forEach(([name, total]) => {
      const li = document.createElement("li");
      li.textContent = `${name} `;
      const span = document.createElement("span");
      span.textContent = `₦${total.toLocaleString()}`;
      li.appendChild(span);
      topCustomersList.appendChild(li);
    });
  }

  function updateTopProducts(filteredData) {
    const topProducts = {};
    filteredData.forEach((sale) => {
      if (!topProducts[sale.productName]) topProducts[sale.productName] = 0;
      topProducts[sale.productName] += sale.amount;
    });

    const sorted = Object.entries(topProducts).sort((a, b) => b[1] - a[1]);
    topSellingProductsBody.innerHTML = "";
    sorted.slice(0, 5).forEach(([name, total], index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${name}</td>
        <td>₦${total.toLocaleString()}</td>
      `;
      topSellingProductsBody.appendChild(row);
    });
  }

  function updateChart(filteredData = salesData) {
    if (currentView === "monthly") {
      let monthlyTotals = new Array(12).fill(0);
      filteredData.forEach((sale) => {
        const month = new Date(sale.date).getMonth();
        monthlyTotals[month] += sale.amount;
      });
      salesChart.data.labels = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      salesChart.data.datasets[0].data = monthlyTotals;
    } else {
      let yearlyTotals = {};
      filteredData.forEach((sale) => {
        const year = new Date(sale.date).getFullYear();
        if (!yearlyTotals[year]) yearlyTotals[year] = 0;
        yearlyTotals[year] += sale.amount;
      });
      const years = Object.keys(yearlyTotals).sort();
      const values = years.map((y) => yearlyTotals[y]);
      salesChart.data.labels = years;
      salesChart.data.datasets[0].data = values;
    }
    salesChart.update();
  }

  // Filter Logic
  function applyFilter() {
    let filtered = [...salesData];

    if (currentFilter !== "all") {
      if (currentFilter === "pending") {
        filtered = filtered.filter((s) => s.status === "pending");
      } else {
        filtered = filtered.filter((s) => s.paymentType === currentFilter);
      }
    }

    if (searchInput.value.trim() !== "") {
      filtered = filtered.filter(
        (s) =>
          s.productName
            .toLowerCase()
            .includes(searchInput.value.toLowerCase()) ||
          s.customerName
            .toLowerCase()
            .includes(searchInput.value.toLowerCase())
      );
    }

    return filtered;
  }

  filterSelect.addEventListener("change", () => {
    currentFilter = filterSelect.value;
    updateDashboard();
  });

  searchInput.addEventListener("input", () => {
    updateDashboard();
  });

  // Update all dashboard parts
  function updateDashboard() {
    const filteredData = applyFilter();
    updateKPIs(filteredData);
    updateProductTable(filteredData);
    updatePendingOrders(filteredData);
    updateTopCustomers(filteredData);
    updateTopProducts(filteredData);
    updateChart(filteredData);
  }

  // Init
  updateDashboard();
});