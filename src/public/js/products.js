console.log("Products page loaded");

$(document).ready(function () {
  /* ---------------------------------------------------------
   * PANEL OPEN / CLOSE
   * --------------------------------------------------------- */
  $("#newProductBtn").on("click", function () {
    $("#productFormPanel").addClass("active");
    $("#panelOverlay").addClass("active");
    $("body").css("overflow", "hidden");
  });

  $("#closePanelBtn, #cancelBtn, #panelOverlay").on("click", closePanel);

  function closePanel() {
    $("#productFormPanel").removeClass("active");
    $("#panelOverlay").removeClass("active");
    $("body").css("overflow", "auto");

    const form = $("#createProductForm")[0];
    if (form) form.reset();
    for (let i = 1; i <= 5; i++) {
      $(`#imagePreview${i}`).attr("src", "/img/default.jpeg");
    }

    $("#clothingSizeGroup").show();
    $("#shoeSizeGroup").hide();
    $("#productSize").attr("required", "required");
    $("#productShoeSize").removeAttr("required");
  }

  /* ---------------------------------------------------------
   * COLLECTION CHANGE → CLOTHING VS SHOES
   * --------------------------------------------------------- */
  $("#productCollection").on("change", function () {
    const collection = $(this).val();

    if (collection === "SHOES") {
      // Shoes -> use shoe size
      $("#clothingSizeGroup").hide();
      $("#shoeSizeGroup").show();

      $("#productSize").removeAttr("required");
      $("#productShoeSize").attr("required", "required");
    } else {
      // Clothes + other collections -> use clothing size
      $("#clothingSizeGroup").show();
      $("#shoeSizeGroup").hide();

      $("#productShoeSize").removeAttr("required");
      $("#productSize").attr("required", "required");
    }
  });

  /* ---------------------------------------------------------
   * IMAGE PREVIEW
   * --------------------------------------------------------- */
  $(".image-input").on("change", function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowed.includes(file.type)) {
      alert("Please select only JPEG, JPG or PNG images!");
      $(this).val("");
      return;
    }

    const inputId = $(this).attr("id");
    const previewId = inputId.replace("productImage", "imagePreview");

    const reader = new FileReader();
    reader.onload = (e) => {
      $(`#${previewId}`).attr("src", e.target.result);
    };
    reader.readAsDataURL(file);
  });

  /* ---------------------------------------------------------
   * CREATE PRODUCT — FORM SUBMIT
   * --------------------------------------------------------- */
  $("#createProductForm").on("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(this);

    const firstImage = formData.get("productImages");
    if (!firstImage || !firstImage.name) {
      alert("Please upload at least one product image!");
      return;
    }

    //Removing empty field
    const productSize = formData.get("productSize");
    const productShoeSize = formData.get("productShoeSize");

    if (!productSize || productSize === "") {
      formData.delete("productSize");
    }

    if (!productShoeSize || productShoeSize === "") {
      formData.delete("productShoeSize");
    }

    try {
      const response = await axios.post("/admin/product/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Product created successfully!");
      window.location.reload();
    } catch (err) {
      console.error("Create product error:", err);
      alert(err.response?.data?.message || "Failed to create product.");
    }
  });

  /* ---------------------------------------------------------
   * STATUS CHANGE — UPDATE PRODUCT
   * --------------------------------------------------------- */
  $(".status-select").on("change", async function () {
    const productId = $(this).data("id");
    const newStatus = $(this).val();
    const element = $(this);

    try {
      await axios.post(`/admin/product/${productId}`, {
        productStatus: newStatus,
      });

      element.removeClass("status-pause status-process status-delete");
      element.addClass(`status-${newStatus.toLowerCase()}`);

      element.blur();
    } catch (err) {
      console.error("Status update error:", err);
      alert("Failed to update product status.");
      location.reload();
    }
  });

  /* ---------------------------------------------------------
   * EDIT BTN — PLACEHOLDER
   * --------------------------------------------------------- */
  $(".btn-edit").on("click", function () {
    const id = $(this).data("id");
    alert(`Edit panel for product ${id} is coming soon!`);
  });
});
