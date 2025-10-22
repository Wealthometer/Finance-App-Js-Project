
const tags = document.querySelectorAll(".tag");
tags.forEach((tag) => {
  tag.addEventListener("click", function () {
    tags.forEach((t) => t.classList.remove("active"));
    this.classList.add("active");
  });
});


document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});


const navMenu = document.querySelector(".nav-menu");
const authButtons = document.querySelector(".auth-buttons");


window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section[id]");
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    if (pageYOffset >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });

  document.querySelectorAll(".nav-menu a").forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href").slice(1) === current) {
      link.classList.add("active");
    }
  });
});
