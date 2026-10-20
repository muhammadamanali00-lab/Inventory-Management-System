import supabase from "./credential.js";
import "./common.js";

// ================= Get elements =================
const totalProducts = document.getElementById("totalProducts");
const lowStockCount = document.getElementById("lowStockCount");
const monthPurchases = document.getElementById("monthPurchases");
const monthSales = document.getElementById("monthSales");
const activityTableBody = document.getElementById("activityTableBody");

// ================= Format currency =================
const formatRs = (amount) =>
  "Rs " + Number(amount || 0).toLocaleString("en-PK", {
    maximumFractionDigits: 2,
  });


  // ================= Load dashboard =================
const loadDashboard = async () => {
    try {
      // Get purchases
      const { data: purchases, error: purchaseError } = await supabase
        .from("purchases")
        .select("id, product_name, quantity, available_quantity, price, created_at");
  
      if (purchaseError) throw purchaseError;
  
      // Get sales with linked product name
      const { data: sales, error: salesError } = await supabase
        .from("sales")
        .select(`
          id,
          purchase_id,
          quantity,
          price,
          customer_name,
          created_at,
          purchases(product_name)
        `);
  
      if (salesError) throw salesError;
  
      // ================= Dashboard cards =================
  
      // Total distinct product names
      const uniqueProducts = new Set(
        purchases.map((item) =>
          item.product_name.trim().toLowerCase()
        )
      );
  
      totalProducts.textContent = uniqueProducts.size;
  
      // Low stock: available quantity 5 or less
      lowStockCount.textContent = purchases.filter(
        (item) => Number(item.available_quantity) <= 5
      ).length;
  
      // Current month range
      const now = new Date();
      const monthStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );
  
      const nextMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        1
      );
  
      const isThisMonth = (date) => {
        const d = new Date(date);
        return d >= monthStart && d < nextMonth;
      };
  
      // Purchase amount = quantity × purchase price
      const purchaseTotal = purchases
        .filter((item) => isThisMonth(item.created_at))
        .reduce(
          (sum, item) =>
            sum + Number(item.quantity) * Number(item.price),
          0
        );
  
      // Sale amount = sold quantity × sale price
      const salesTotal = sales
        .filter((item) => isThisMonth(item.created_at))
        .reduce(
          (sum, item) =>
            sum + Number(item.quantity) * Number(item.price),
          0
        );
  
      monthPurchases.textContent = formatRs(purchaseTotal);
      monthSales.textContent = formatRs(salesTotal);
  
      // ================= Recent activity =================
  
      const purchaseActivities = purchases.map((item) => ({
        date: item.created_at,
        type: "Purchase",
        product: item.product_name,
        quantity: item.quantity,
        amount: Number(item.quantity) * Number(item.price),
      }));
  
      const saleActivities = sales.map((item) => ({
        date: item.created_at,
        type: "Sell",
        product: item.purchases?.product_name || "Unknown product",
        quantity: item.quantity,
        amount: Number(item.quantity) * Number(item.price),
      }));
  
      const activities = [...purchaseActivities, ...saleActivities]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10);
  
      activityTableBody.replaceChildren();
  
      if (activities.length === 0) {
        activityTableBody.innerHTML =
          '<tr><td colspan="5">No recent activity</td></tr>';
        return;
      }
  
      activities.forEach((item) => {
        const row = document.createElement("tr");
  
        const dateCell = document.createElement("td");
        dateCell.textContent = new Date(item.date).toLocaleString(
          "en-PK",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }
        );
  
        const typeCell = document.createElement("td");
        const tag = document.createElement("span");
  
        tag.textContent = item.type;
        tag.className =
          item.type === "Sell"
            ? "tag tag-sell"
            : "tag tag-buy";
  
        typeCell.appendChild(tag);
  
        const productCell = document.createElement("td");
        productCell.textContent = item.product;
  
        const quantityCell = document.createElement("td");
        quantityCell.textContent = item.quantity;
  
        const amountCell = document.createElement("td");
        amountCell.textContent = formatRs(item.amount);
  
        row.append(
          dateCell,
          typeCell,
          productCell,
          quantityCell,
          amountCell
        );
  
        activityTableBody.appendChild(row);
      });
    } catch (error) {
      console.error("Dashboard loading error:", error);
  
      activityTableBody.innerHTML =
        '<tr><td colspan="5">Failed to load activity</td></tr>';
    }
  };
  
  // Initial load
  loadDashboard();
  
