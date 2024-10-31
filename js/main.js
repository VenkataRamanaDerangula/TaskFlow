document.addEventListener("DOMContentLoaded", () => {
  const toggleSidebarBtn = document.querySelector(".toggle-sidebar");
  const sidebar = document.querySelector(".sidebar");
  const container = document.querySelector(".container");

  adjustLayout();

  // Toggle sidebar
  toggleSidebarBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    adjustLayout();
  });

  // Adjust layout based on sidebar state
  function adjustLayout() {
    container.style.marginLeft = sidebar.classList.contains("collapsed")
      ? "80px"
      : "250px";
    updateLinksVisibility();
  }

  // Show or hide links
  function updateLinksVisibility() {
    const links = document.querySelectorAll(".links h3");
    links.forEach(
      (link) =>
        (link.style.display = sidebar.classList.contains("collapsed")
          ? "none"
          : "block")
    );
  }

  // Go to page based on link name
  function navigateToPage(event) {
    const linkName = event.target
      .closest(".links")
      .querySelector("h3")
      .textContent.trim()
      .toLowerCase();
    let targetUrl;

    // Set page URL based on the link name
    if (linkName === "tasks") targetUrl = "task.html";
    else if (linkName === "home")
      targetUrl = window.location.href; // Refresh the current page
    else if (linkName === "boards") targetUrl = "boards.html";
    // else if (linkName === "graph view") targetUrl = "graph.html";
    // else if (linkName === "calendar") targetUrl = "calendar.html";
    // else if (linkName === "settings") targetUrl = "settings.html";
    else if (linkName === "log out") targetUrl = "index.html";

    if (targetUrl) {
      if (linkName === "log out") {
        window.location.replace(targetUrl); // Redirect to index.html and close all pages
      } else if (targetUrl === window.location.href) {
        window.location.reload(); // Refresh the current page
      } else {
        window.location.href = targetUrl; // Redirect to the new URL
      }
    }
  }

  // Add click events to links
  document.querySelectorAll(".links h3, .links a").forEach((element) => {
    element.addEventListener("click", navigateToPage);
  });
});
