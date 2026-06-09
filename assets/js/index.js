//!(1) Show & Hide Sections
const sections = document.querySelectorAll("section");
const links = document.querySelectorAll(".nav-link");

function showSection(id) {
  // اخفي كل السكاشن
  sections.forEach((section) => {
    section.classList.add("hidden");
  });

  // اظهر السكشن المطلوب
  document.getElementById(id).classList.remove("hidden");
}

//& Active Link + Navigation
links.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    // شيل الـ active من كل اللينكات
    links.forEach((item) => {
      item.classList.remove("bg-blue-500/10", "text-blue-400");
      item.classList.add("text-slate-300");
    });

    // حط active على اللينك الحالي
    link.classList.remove("text-slate-300");
    link.classList.add("bg-blue-500/10", "text-blue-400");

    // اعرض السكشن المطلوب
    showSection(link.dataset.section);
  });
});