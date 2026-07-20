(function () {
  var root = document.documentElement;
  var stored = null;
  try {
    stored = localStorage.getItem("theme");
  } catch (e) {}

  function resolveTheme(choice) {
    if (choice === "light" || choice === "dark") return choice;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function applyTheme(choice) {
    var resolved = resolveTheme(choice || "light");
    root.setAttribute("data-theme", resolved);
    document.querySelectorAll("[data-theme-btn]").forEach(function (btn) {
      btn.classList.toggle(
        "is-active",
        btn.getAttribute("data-theme-btn") === (choice || "light")
      );
    });
  }

  applyTheme(stored || "light");

  document.querySelectorAll("[data-theme-btn]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var choice = btn.getAttribute("data-theme-btn");
      try {
        localStorage.setItem("theme", choice);
      } catch (e) {}
      applyTheme(choice);
    });
  });

  var toggle = document.querySelector("[data-menu-toggle]");
  var nav = document.querySelector("[data-primary-nav]");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute(
        "aria-label",
        open ? "Close navigation menu" : "Open navigation menu"
      );
    });
  }

  document.querySelectorAll("[data-contact-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = form.parentElement.querySelector("[data-form-note]");
      if (note) {
        note.textContent = "Thanks! Your message was received (demo only).";
      }
      form.reset();
    });
  });

})();
