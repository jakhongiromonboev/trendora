document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".sidebar");

  const links = sidebar.querySelectorAll("nav a");
  const currentPath = window.location.pathname;

  links.forEach((link) => {
    const linkPath = link.getAttribute("href");

    if (
      currentPath === linkPath ||
      (linkPath !== "/admin/dashboard" && currentPath.startsWith(linkPath))
    ) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  if (window.innerWidth <= 992) {
    sidebar.classList.add("collapsed");
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth <= 992) {
      sidebar.classList.add("collapsed");
    } else {
      sidebar.classList.remove("collapsed");
    }
  });
});
