console.log("Profile page loaded");

$(function () {
  /* =====================================================
   * OPEN/CLOSE EDIT PROFILE PANEL
   * ===================================================== */
  $("#editProfileBtn, #changeAvatarBtn").on("click", function () {
    $("#editProfilePanel").addClass("active");
    $("#panelOverlay").addClass("active");
    $("body").css("overflow", "hidden");
  });

  $("#closeProfilePanelBtn, #cancelProfileBtn").on("click", closeEditPanel);

  function closeEditPanel() {
    $("#editProfilePanel").removeClass("active");
    $("#panelOverlay").removeClass("active");
    $("body").css("overflow", "auto");

    const form = $("#editProfileForm")[0];
    if (form) form.reset();
    $("#avatarPreview").hide();
  }

  /* =====================================================
   * OPEN/CLOSE CHANGE PASSWORD PANEL
   * ===================================================== */
  $("#changePasswordBtn").on("click", function () {
    $("#changePasswordPanel").addClass("active");
    $("#panelOverlay").addClass("active");
    $("body").css("overflow", "hidden");
  });

  $("#closePasswordPanelBtn, #cancelPasswordBtn").on(
    "click",
    closePasswordPanel
  );

  function closePasswordPanel() {
    $("#changePasswordPanel").removeClass("active");
    $("#panelOverlay").removeClass("active");
    $("body").css("overflow", "auto");

    const form = $("#changePasswordForm")[0];
    if (form) form.reset();
  }

  // Close panels on overlay click
  $("#panelOverlay").on("click", function () {
    closeEditPanel();
    closePasswordPanel();
  });

  /* =====================================================
   * AVATAR PREVIEW
   * ===================================================== */
  $("#avatarInput").on("change", function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowed.includes(file.type)) {
      alert("Please select only JPEG, JPG or PNG images!");
      $(this).val("");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      $("#previewImage").attr("src", e.target.result);
      $("#avatarPreview").show();
    };
    reader.readAsDataURL(file);
  });

  // Remove preview while cancellation
  $("#removePreviewBtn").on("click", function () {
    $("#avatarInput").val("");
    $("#avatarPreview").hide();
    $("#previewImage").attr("src", "");
  });

  /* =====================================================
   * UPDATE PROFILE - FORM SUBMIT
   * ===================================================== */
  $("#editProfileForm").on("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(this);

    try {
      const response = await axios.post("/admin/profile/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Profile updated:", response.data);
      alert("Profile updated successfully!");
      window.location.reload();
    } catch (err) {
      console.error("Update profile error:", err);
      alert(err.response?.data?.message || "Failed to update profile.");
    }
  });

  /* =====================================================
   * CHANGE PASSWORD - FORM SUBMIT
   * ===================================================== */
  $("#changePasswordForm").on("submit", async function (e) {
    e.preventDefault();

    const newPassword = $("#newPassword").val();
    const confirmPassword = $("#confirmPassword").val();

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Check minimum length
    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }

    try {
      const response = await axios.post("/admin/profile/update", {
        memberPassword: newPassword,
      });

      console.log("Password updated:", response.data);
      alert("Password updated successfully!");
      closePasswordPanel();
    } catch (err) {
      console.error("Update password error:", err);
      alert(err.response?.data?.message || "Failed to update password.");
    }
  });

  console.log("Profile page ready");
});
