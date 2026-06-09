//! 1) show and hide sections
const sections = document.querySelectorAll("section");
const launchesLink = document.querySelector('a[data-section="launches"]');
const planetsLink = document.querySelector('a[data-section="planets"]');
const todayLink = document.querySelector('a[data-section="today-in-space"]');
function showSection(id) {
  sections.forEach((section) => {
    section.classList.add("hidden");
  });

  document.getElementById(id).classList.remove("hidden");
}

launchesLink.addEventListener("click", (e) => {
  e.preventDefault();
  showSection("launches");
});

planetsLink.addEventListener("click", (e) => {
  e.preventDefault();
  showSection("planets");
});

todayLink.addEventListener("click", (e) => {
  e.preventDefault();
  showSection("today-in-space");
});
//* active links
const links = document.querySelectorAll("[data-section]");

links.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    // شيل active من الكل
    links.forEach((item) => {
      item.classList.remove("bg-blue-500/10", "text-blue-400");
    });

    // ضيف active للحالي
    link.classList.add("bg-blue-500/10", "text-blue-400");

    showSection(link.dataset.section);
  });
});
