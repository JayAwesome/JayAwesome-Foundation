(function () {
  const btn = document.querySelector("[data-mobile-toggle]");
  const panel = document.querySelector("[data-mobile-panel]");
  if (btn && panel) {
    btn.addEventListener("click", () => {
      const open = panel.style.display === "block";
      panel.style.display = open ? "none" : "block";
      btn.setAttribute("aria-expanded", String(!open));
    });
  }

  // Update year in footer
  const y = document.querySelector("[data-year]");
  if (y) y.textContent = String(new Date().getFullYear());
})();
