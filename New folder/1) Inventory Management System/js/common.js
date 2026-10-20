// Shared sidebar code for dashboard, purchase and sell pages

import supabase from "./credential.js";

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

logoutBtn.onclick = async () => {
  try {
    await supabase.auth.signOut();
    window.location.href = "login.html";
  } catch (error) {}
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

const checkAuthentication = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error || data.user === null) {
      window.location.href = "login.html";
    }
  } catch (error) {}
};

export default checkAuthentication;
