// Shared sidebar code for dashboard, purchase and sell pages

// ================= Get elements =================
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const menuToggle = document.getElementById("menuToggle");
const logoutBtn = document.getElementById("logoutBtn");

const navDashboard = document.getElementById("navDashboard");
const navPurchase = document.getElementById("navPurchase");
const navSell = document.getElementById("navSell");

// ================= Sidebar navigation =================
navDashboard.onclick = () => {
  window.location.href = "dashboard.html";
};

navPurchase.onclick = () => {
  window.location.href = "purchase.html";
};

navSell.onclick = () => {
  window.location.href = "sell.html";
};

logoutBtn.onclick = () => {
  window.location.href = "login.html";
};

// ================= Mobile sidebar =================
let isSidebarOpen = false;

const toggleSidebar = () => {
  isSidebarOpen = !isSidebarOpen;
  sidebar.classList.toggle("open", isSidebarOpen);
  sidebarOverlay.classList.toggle("show", isSidebarOpen);
};

menuToggle.onclick = toggleSidebar;
sidebarOverlay.onclick = toggleSidebar;
