import { sellValidation } from "./validation.js";
import supabase from "./credential.js";
import Swal from "./alert.js";
import "./common.js";

// ================= Get elements =================
const sellCustomer = document.getElementById("sellCustomer");
const sellProduct = document.getElementById("sellProduct");
const sellQty = document.getElementById("sellQty");
const sellPrice = document.getElementById("sellPrice");
const sellClearBtn = document.getElementById("sellClearBtn");
const sellTableBody = document.getElementById("sellTableBody");
const sellSaveBtn = document.getElementById("sellSaveBtn");
let allPurchases = [];

const resetForm = () => {
  sellCustomer.value = "";
  sellProduct.value = "";
  sellQty.value = "";
  sellPrice.value = "";
};

const getAllPurchases = async () => {
  try {
    const { data, error } = await supabase.from("purchases").select();
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
    } else {
      allPurchases = data;
      sellProduct.innerHTML = `
      <option value="">Select product</option>
      `;
      for (let i = 0; i < data.length; i++) {
        const element = data[i];
        sellProduct.innerHTML += `
        <option value=${element.id}>${element.product_name} ( ${element.available_quantity} )</option>
        `;
      }
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error.message,
    });
  }
};

const getAllSales = async () => {
  try {
    const { data, error } = await supabase.from("sales")
    .select("*, purchases(product_name)")
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
    } else {
      sellTableBody.innerHTML = "";
      for (let i = 0; i < data.length; i++) {
        const element = data[i];
        console.log("element", element);
        sellTableBody.innerHTML += `
         <tr>
                <td>${element.customer_name}</td>
                <td>${element.purchases.product_name}</td>
                <td>${element.quantity}</td>
                <td>${element.price}</td>
                <td>${element.price * element.quantity}</td>
                <td class="action-btns">
                  <button class="btn-delete">Delete</button>
                </td>
              </tr>
        `;
      }
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error.message,
    });
  }
};

sellClearBtn.onclick = resetForm;

// ================= Save sale =================
sellSaveBtn.onclick = async () => {
  sellSaveBtn.innerHTML = "Saving...";
  sellSaveBtn.disabled = true;

  const validateForm = sellValidation(
    sellCustomer.value,
    sellProduct.value,
    sellQty.value,
    sellPrice.value,
  );

  if (validateForm === false) {
    sellSaveBtn.innerHTML = "Save sale";
    sellSaveBtn.disabled = false;
    return;
  }

  const sale = {
    customer_name: sellCustomer.value,
    purchase_id: Number(sellProduct.value),
    quantity: Number(sellQty.value),
    price: Number(sellPrice.value),
  };

  const findProduct = allPurchases.find((item) => {
    return item.id === sale.purchase_id;
  });

  if (sale.quantity > findProduct.available_quantity) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: `Only ${findProduct.available_quantity} available in stock`,
    });
    sellSaveBtn.innerHTML = "Save sale";
    sellSaveBtn.disabled = false;
    return;
  }

  try {
    const { error } = await supabase.from("sales").insert(sale);
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
    } else {
      await supabase
        .from("purchases")
        .update({
          available_quantity: findProduct.available_quantity - sellQty.value,
        })
        .eq("id", sale.purchase_id);
      Swal.fire({
        icon: "success",
        title: "Done",
        text: "Sale has been created",
      });
      resetForm();
      getAllPurchases();
      getAllSales();
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error.message,
    });
  }

  // function ke akhir me button wapis theek
  sellSaveBtn.innerHTML = "Save sale";
  sellSaveBtn.disabled = false;
};

getAllPurchases();
getAllSales();
