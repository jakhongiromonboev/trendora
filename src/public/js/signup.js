console.log("Signup frontend javascript file");

$(function () {
  // ===== IMAGE UPLOAD & PREVIEW =====
  const fileTarget = $("#memberImage");
  const uploadText = $(".upload-text");
  const previewImg = $("#previewImg");
  const imagePreview = $("#imagePreview");

  fileTarget.on("change", function (e) {
    const uploadFile = e.target.files[0];

    if (!uploadFile) return;

    console.log("uploadFile:", uploadFile);

    // Validate file type
    const fileType = uploadFile.type;
    const validImageTypes = ["image/jpg", "image/jpeg", "image/png"];

    if (!validImageTypes.includes(fileType)) {
      alert("Please insert only jpeg, jpg or png!");
      $(this).val("");
      return;
    }

    //Image preview
    if (window.FileReader) {
      const reader = new FileReader();
      reader.onload = function (e) {
        previewImg.attr("src", e.target.result);
        imagePreview.addClass("active");
      };
      reader.readAsDataURL(uploadFile);
    }

    uploadText.text(uploadFile.name);
  });

  // ===== FORM VALIDATION =====
  $("#signupForm").on("submit", function (e) {
    e.preventDefault();

    const memberNick = $("#memberNick").val().trim();
    const memberEmail = $("#memberEmail").val().trim();
    const memberPhone = $("#memberPhone").val().trim();
    const memberPassword = $("#memberPassword").val().trim();
    const confirmPassword = $("#confirmPassword").val().trim(); //confirmation of password
    const memberImage = fileTarget.get(0).files[0];

    if (
      !memberNick ||
      !memberEmail ||
      !memberPhone ||
      !memberPassword ||
      !confirmPassword
    ) {
      alert("Please fill out all required fields!");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(memberEmail)) {
      alert("Please enter a valid email address!");
      return false;
    }

    if (memberPhone.length < 10) {
      alert("Please enter a valid phone number!");
      return false;
    }

    if (memberPassword !== confirmPassword) {
      alert("Passwords do not match, please check!");
      return false;
    }

    if (memberPassword.length < 6) {
      alert("Password must be at least 6 characters long!");
      return false;
    }

    if (!memberImage) {
      alert("Please upload a profile image!");
      return false;
    }

    console.log("Form validation passed, submitting...");
    this.submit();
  });
});
