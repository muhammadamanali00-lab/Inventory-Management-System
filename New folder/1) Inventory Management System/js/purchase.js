import { productValidation } from "./validation.js";
import supabase from "./credential.js";
import Swal from "./alert.js";
import "./common.js";
// Sidebar navigation is in common.js

// ================= Get elements =================
const purchaseProduct = document.getElementById("purchaseProduct");
const purchaseQty = document.getElementById("purchaseQty");
const purchasePrice = document.getElementById("purchasePrice");
const purchaseTotal = document.getElementById("purchaseTotal");
const purchaseClearBtn = document.getElementById("purchaseClearBtn");
const purchaseSaveBtn = document.getElementById("purchaseSaveBtn");
const purchaseTableBody = document.getElementById("purchaseTableBody");


const totalPrice = () => purchaseQty.value * purchasePrice.value;

purchasePrice.oninput = () => {
  purchaseTotal.value = totalPrice();
};

purchaseQty.oninput = () => {
  purchaseTotal.value = totalPrice();
};


// ================= Reset =================
// har field ki value khali, total 0
const resetForm = () => {
  purchaseProduct.value = "";
  purchaseQty.value = "";
  purchasePrice.value = "";
  purchaseTotal.value = 0;
};


const getAllPurchases = async () => {
  try {
    const { data, error } = await supabase
      .from('purchases')
      .select()

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
    } else {
      purchaseTableBody.innerHTML = '';
      for (let i = 0; i < data.length; i++) {
        const element = data[i];
        purchaseTableBody.innerHTML += `<tr>
                <td>${element.product_name}</td>
                <td>${element.quantity}</td>
                <td>${element.price}</td>
                <td>${element.price * element.quantity}</td>
                <td class="action-btns">
                  <button class="btn-edit">Edit</button>
                  <button class="btn-delete">Delete</button>
                </td>
              </tr>`
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


purchaseClearBtn.onclick = resetForm;

// ================= Save purchase =================
purchaseSaveBtn.onclick = async () => {
  // click hote hi button ka text badlo aur disable kar do
  purchaseSaveBtn.innerHTML = "Saving...";
  purchaseSaveBtn.disabled = true;

  const validateForm = productValidation(
    purchaseProduct.value,
    purchaseQty.value,
    purchasePrice.value
  );

  // validation false hui to button wapis theek karo aur yahin ruk jao
  if (validateForm === false) {
    purchaseSaveBtn.innerHTML = "Save purchase";
    purchaseSaveBtn.disabled = false;
    return;
  }

  const purchase = {
    product_name: purchaseProduct.value,
    quantity: Number(purchaseQty.value),
    available_quantity: Number(purchaseQty.value),
    price: Number(purchasePrice.value),
  };

  try {
    const { error } = await supabase
      .from('purchases')
      .insert(purchase)

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Purchase saved successfully",
      });
      resetForm();
      getAllPurchases();
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error.message,
    });
  }

  // function ke akhir me button wapis theek
  purchaseSaveBtn.innerHTML = "Save purchase";
  purchaseSaveBtn.disabled = false;
};


getAllPurchases();
