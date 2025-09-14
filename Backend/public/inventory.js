//inventory.js
/*let products = [
  {
    id: 1,
    name: "Tomato Rice",
    stock: 100,
    reorder: 15,
    price: 65000,
    expiry: "2025-12-31",
    img: "Assets/tomato.png",
    category: "Category A"
  }
];*/
const API  = 'https://biz-boost.onrender.com';

let products = [];

async function fetchProducts() {
  try {
    const response = await fetch(`${API}/products`);
    if (!response.ok) throw new Error("Failed to fetch products");
    products = await response.json();
    renderTables();
  } catch (error) {
    console.error("Error fetching products:", error);
    alert("Could not load products from backend.");
  }
}

fetchProducts();




// DOM Elements
const allTableBody = document.querySelector("#main tbody");
const lowTableBody = document.querySelector("#low tbody");
const expiredTableBody = document.querySelector("#expired tbody");

const addProductForm = document.getElementById("addProductForm");
const searchInput = document.querySelector(".filters input[type='text']");
const categorySelect = document.querySelector(".filters select");

// =========================
// Functions
// =========================

// Render Products
function renderTables() {
  // Clear tables
  allTableBody.innerHTML = "";
  lowTableBody.innerHTML = "";
  expiredTableBody.innerHTML = "";

  const today = new Date();

  // Apply filters
  const searchTerm = searchInput.value.toLowerCase();
  const selectedCategory = categorySelect.value;

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm);
    const matchesCategory =
      selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Loop and add rows
  filteredProducts.forEach((product, index) => {
    const row = `
      <tr>
        <td>${index + 1}</td>
        <td><img src="${product.img}" alt="${product.name}" width="32"></td>
        <td>${product.name}</td>
        <td>${product.stock}</td>
        <td>${product.reorder}</td>
        <td>NGN${product.price.toLocaleString()}</td>
      </tr>
    `;

    // All Products
    allTableBody.insertAdjacentHTML("beforeend", row);

    // Low Stock
    if (product.stock < product.reorder) {
      lowTableBody.insertAdjacentHTML("beforeend", row);
    }

    // Expired
    if (new Date(product.expiry) < today) {
      expiredTableBody.insertAdjacentHTML("beforeend", row);
    }
  });
}

// Add Product (includes backend POST)
async function addProduct(product) {
  try {
    const response = await fetch(`${API}/products`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(product)
    });

    if (!response.ok) {
      throw new Error("Failed to save product to backend");
    }

    const savedProduct = await response.json(); // Assuming backend returns saved product
    products.push(savedProduct); // Add to local list
    renderTables(); // Update UI

    console.log("Product saved to backend successfully.");
  } catch (error) {
    console.error("Error posting product:", error);
    alert("There was an error saving the product to the backend.");
  }
}

// =========================
// Event Listeners
// =========================

// Handle Add Product Form
addProductForm.addEventListener("submit", async e => {
  e.preventDefault();

  const name = document.getElementById("productName").value;
  const stock = parseInt(document.getElementById("stockLevel").value);
  const reorder = parseInt(document.getElementById("reorderLevel").value);
  const price = parseFloat(document.getElementById("unitPrice").value);
  const expiry = document.getElementById("expiryDate").value;

  // Default image and category (could be dynamic later)
  const img = "Assets/tomato.png";
  const category = "Category A";

  const newProduct = {
    name,
    stock,
    reorder,
    price,
    expiry,
    img,
    category
  };

  await addProduct(newProduct); // Save to backend and update UI

  addProductForm.reset();
  document.getElementById("addProductModal").style.display = "none";
});

// Filters (Search & Category)
searchInput.addEventListener("input", renderTables);
categorySelect.addEventListener("change", renderTables);

// Init
renderTables();