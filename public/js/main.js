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

  function setNavOpen(open) {
    if (!toggle || !nav) return;
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute(
      "aria-label",
      open ? "Close navigation menu" : "Open navigation menu"
    );
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setNavOpen(!nav.classList.contains("is-open"));
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setNavOpen(false);
      });
    });

    window.addEventListener("resize", function () {
      if (window.matchMedia("(min-width: 1024px)").matches) {
        setNavOpen(false);
      }
    });
  }
})();
