console.log("Users frontend javascript file");

$(function () {
  $(".status-select").on("change", function (e) {
    const id = $(this).data("id");
    const memberStatus = $(this).val();

    //loading state
    $(this).prop("disabled", true);

    axios
      .post("/admin/user/edit", {
        _id: id,
        memberStatus: memberStatus,
      })
      .then((response) => {
        console.log("Response:", response);
        const result = response.data;

        if (result.data) {
          $(this).prop("disabled", false);

          // Remove old status classes and add new one
          $(this)
            .removeClass("status-active status-block status-delete")
            .addClass(`status-${memberStatus.toLowerCase()}`);

          $(this).blur();
        }
      })
      .catch((err) => {
        console.error("Error updating user:", err);

        $(this).prop("disabled", false);
        alert("Failed to update user status. Please try again.");
        location.reload();
      });
  });

  //Smooth animation (reload)
  $(".user-row").each(function (index) {
    $(this).css({
      opacity: 0,
      transform: "translateY(20px)",
    });

    setTimeout(() => {
      $(this).css({
        opacity: 1,
        transform: "translateY(0)",
        transition: "all 0.4s ease",
      });
    }, index * 50);
  });
});
