// ===== DASHBOARD JS - WITH ACTIVE STATE =====
document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".sidebar");

  // Highlight active link based on current URL
  const links = sidebar.querySelectorAll("nav a");
  const currentPath = window.location.pathname;

  links.forEach((link) => {
    const linkPath = link.getAttribute("href");

    // Exact match or starts with match for active state
    if (
      currentPath === linkPath ||
      (linkPath !== "/admin/dashboard" && currentPath.startsWith(linkPath))
    ) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  // Optional: collapse sidebar on small screens by default
  if (window.innerWidth <= 992) {
    sidebar.classList.add("collapsed");
  }

  // Re-adjust on resize
  window.addEventListener("resize", () => {
    if (window.innerWidth <= 992) {
      sidebar.classList.add("collapsed");
    } else {
      sidebar.classList.remove("collapsed");
    }
  });
});
