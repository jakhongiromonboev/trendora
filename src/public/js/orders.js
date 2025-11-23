console.log("Orders page loaded");

$(function () {
  // ==============================
  // VARIABLES
  // ==============================
  const page = Number(currentPage || 1);
  const limit = Number(currentLimit || 10);
  const status = currentStatus || "";

  // ==============================
  // BUILD URL WITH FILTERS
  // ==============================
  function buildURL(page, limit, status) {
    let url = "/admin/order/all?";
    if (page) url += "page=" + page + "&";
    if (limit) url += "limit=" + limit + "&";
    if (status) url += "orderStatus=" + status;
    return url;
  }

  // ==============================
  // PAGE RELOAD WITH FILTERS
  // ==============================
  $("#statusFilter").on("change", function () {
    window.location.href = buildURL(1, limit, $(this).val());
  });

  $("#limitSelect").on("change", function () {
    window.location.href = buildURL(1, $(this).val(), status);
  });

  $(".page-circle").on("click", function () {
    window.location.href = buildURL($(this).data("page"), limit, status);
  });

  // ==============================
  // TOAST NOTIFICATION
  // ==============================
  function showToast(message, type) {
    $(".toast-notification").remove();

    const icon =
      type === "success" ? "bi-check-circle-fill" : "bi-x-circle-fill";
    const toastClass = "toast-" + type;

    const toast = $(`<div class="toast-notification ${toastClass}"></div>`);
    toast.append(`<i class="bi ${icon}"></i>`);
    toast.append(`<span>${message}</span>`);

    $("body").append(toast);

    setTimeout(() => toast.addClass("show"), 100);
    setTimeout(() => {
      toast.removeClass("show");
      setTimeout(() => toast.remove(), 300);
    }, 2500);

    if ($("#toast-styles").length === 0) {
      $("head").append(`
        <style id="toast-styles">
          .toast-notification { position: fixed; bottom: -80px; right: 25px; background: #fff; padding: 0.9rem 1.3rem; border-radius: 10px; box-shadow: 0 6px 25px rgba(0,0,0,0.2); display: flex; align-items: center; gap: 0.7rem; z-index: 10000; transition: all 0.3s ease; min-width: 250px; border-left: 4px solid #d4a574; font-weight: 600; }
          .toast-notification.show { bottom: 25px; }
          .toast-notification.toast-success { border-left-color: #4ade80; }
          .toast-notification.toast-success i { color: #4ade80; font-size: 1.3rem; }
          .toast-notification.toast-error { border-left-color: #c85a54; }
          .toast-notification.toast-error i { color: #c85a54; font-size: 1.3rem; }
          .toast-notification span { color: #2d2d2d; font-size: 0.9rem; }
        </style>
      `);
    }
  }

  // ==============================
  // UPDATE ORDER STATUS
  // ==============================
  $(".status-select").on("change", function () {
    const el = $(this);
    const orderId = el.data("id");
    const newStatus = el.val();

    el.removeClass("status-pending status-processing status-delivered");
    el.addClass("status-" + newStatus.toLowerCase());

    axios
      .post("/admin/order/update", { orderId, orderStatus: newStatus })
      .then((res) => {
        console.log("Status updated:", res.data);
        showToast("Order status updated successfully", "success");
        el.blur();
      })
      .catch((err) => {
        console.error("Status update error:", err);
        showToast("Failed to update status", "error");
        location.reload();
      });
  });

  // ==============================
  // EXPAND / COLLAPSE ORDER ITEMS
  // ==============================
  $(".expand-btn-text").on("click", function () {
    const button = $(this);
    const orderId = button.data("order-id");
    const row = $(`.order-row[data-order-id='${orderId}']`);
    const itemsRow = $(`.order-items-row[data-order-id='${orderId}']`);
    const tableWrapper = itemsRow.find(".items-table-wrapper");
    const loading = itemsRow.find(".loading-spinner");
    const totalSection = itemsRow.find(".items-total");
    const textEl = button.find(".expand-text");
    const iconEl = button.find(".expand-icon");

    if (button.hasClass("active")) {
      // Collapse
      button.removeClass("active");
      row.removeClass("expanded");
      itemsRow.slideUp(300);
      textEl.text("View Items");
      iconEl.removeClass("bi-arrow-down").addClass("bi-arrow-right");
      return;
    }

    // Close other expanded rows
    $(".expand-btn-text.active")
      .removeClass("active")
      .find(".expand-text")
      .text("View Items");
    $(".expand-btn-text.active")
      .find(".expand-icon")
      .removeClass("bi-arrow-down")
      .addClass("bi-arrow-right");
    $(".order-row.expanded").removeClass("expanded");
    $(".order-items-row").slideUp(300);

    // Expand this row
    button.addClass("active");
    row.addClass("expanded");
    itemsRow.slideDown(400);
    textEl.text("Hide Items");
    iconEl.removeClass("bi-arrow-right").addClass("bi-arrow-down");

    // Load items if not already loaded
    if (tableWrapper.children().length === 0) {
      loading.show();
      axios
        .get("/admin/order/all/items", { params: { id: orderId } })
        .then((res) => {
          loading.hide();
          renderOrderItems(res.data, tableWrapper, totalSection);
        })
        .catch((err) => {
          console.error("Load items error:", err);
          loading.hide();
          tableWrapper.html(
            '<div class="no-items error">Failed to load items</div>'
          );
          showToast("Failed to load items", "error");
        });
    }
  });

  // ==============================
  // RENDER ORDER ITEMS TABLE
  // ==============================
  function renderOrderItems(data, tableWrapper, totalSection) {
    if (!data || data.length === 0) {
      tableWrapper.html('<div class="no-items">No items found</div>');
      return;
    }

    const order = data[0];
    const items = order.orderItems || [];
    const products = order.productData || [];

    if (items.length === 0) {
      tableWrapper.html('<div class="no-items">No items in this order</div>');
      return;
    }

    let tableHTML = '<table class="items-table"><thead><tr>';
    tableHTML +=
      "<th>IMAGE</th><th>PRODUCT NAME</th><th>SIZE</th><th>GENDER</th><th>QUANTITY</th><th>PRICE</th>";
    tableHTML += "</tr></thead><tbody>";

    let orderTotal = 0;

    items.forEach((item) => {
      const product = products.find(
        (p) => p._id.toString() === item.productId.toString()
      );
      const itemTotal = item.itemPrice * item.itemQuantity;
      orderTotal += itemTotal;

      if (product) {
        const img =
          product.productImages && product.productImages.length > 0
            ? "/" + product.productImages[0]
            : null;
        const size = product.productSize || product.productShoeSize || "-";
        const gender = product.productGender || "-";

        tableHTML += "<tr>";
        tableHTML += `<td class="item-image-cell">${
          img
            ? `<img src="${img}" alt="${product.productName}" class="item-image">`
            : '<div class="item-image-placeholder"><i class="bi bi-box-seam"></i></div>'
        }</td>`;
        tableHTML += `<td class="item-name">${product.productName}</td>`;
        tableHTML += `<td class="item-size">${size}</td>`;
        tableHTML += `<td class="item-gender">${gender}</td>`;
        tableHTML += `<td class="item-quantity">${item.itemQuantity}</td>`;
        tableHTML += `<td class="item-price">$${item.itemPrice.toFixed(
          2
        )}</td>`;
        tableHTML += "</tr>";
      } else {
        tableHTML += `<tr>
          <td class="item-image-cell"><div class="item-image-placeholder"><i class="bi bi-question-circle"></i></div></td>
          <td class="item-name item-not-found">Product Not Found</td>
          <td class="item-size">-</td>
          <td class="item-gender">-</td>
          <td class="item-quantity">${item.itemQuantity}</td>
          <td class="item-price">$${item.itemPrice.toFixed(2)}</td>
        </tr>`;
      }
    });

    tableHTML += "</tbody></table>";

    tableWrapper.html(tableHTML);
    totalSection.find(".total-amount").text("$" + orderTotal.toFixed(2));
    totalSection.show();
  }

  console.log("Current page:", page);
  console.log("Current limit:", limit);
  console.log("Current status:", status || "All");
});
