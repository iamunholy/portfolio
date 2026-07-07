/**
 * Portfolio Interaction Logic
 * Handles scroll animations, navbar behavior, and parallax effects.
 */

document.addEventListener("DOMContentLoaded", () => {
  // --- Theme Toggle Logic ---
  const themeToggleBtn = document.getElementById("theme-toggle");
  
  // Check for saved theme or OS preference
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  if (savedTheme === "light" || (!savedTheme && !prefersDark)) {
    document.documentElement.setAttribute("data-theme", "light");
    themeToggleBtn.textContent = "🌙";
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    themeToggleBtn.textContent = "☀️";
  }

  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
    let targetTheme = "light";
    
    if (currentTheme === "light") {
      targetTheme = "dark";
      themeToggleBtn.textContent = "☀️";
    } else {
      targetTheme = "light";
      themeToggleBtn.textContent = "🌙";
    }
    
    document.documentElement.setAttribute("data-theme", targetTheme);
    localStorage.setItem("theme", targetTheme);
  });

  // --- Navbar Scroll Effect ---
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // --- Smooth Scrolling for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop,
          behavior: "smooth"
        });
      }
    });
  });

  // --- Intersection Observer for Scroll Animations ---
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.15
  };

  const animationObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      } else {
        entry.target.classList.remove("visible");
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll(".animate-on-scroll");
  animatedElements.forEach(el => animationObserver.observe(el));

  // --- Parallax Effect ---
  const parallaxElements = document.querySelectorAll(".parallax");
  
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    
    parallaxElements.forEach(el => {
      const speed = el.getAttribute("data-speed") || 0.5;
      const offset = scrollY * speed;
      // Limit parallax to prevent breaking layout
      el.style.transform = `translateY(${offset}px)`;
    });
  });
});