/*
 * lacort-theme.js: light or dark theme, system by default (spec 2.5).
 * Load it in <head>, without defer, so the theme is set before the first paint.
 * It writes data-theme ("light" or "dark") on <html>. Without a stored choice, the system
 * decides. The button [data-lacort-theme-toggle] picks the opposite of the current theme.
 */
(function () {
  "use strict";

  var KEY = "lacort-theme";
  var root = document.documentElement;
  var query = matchMedia("(prefers-color-scheme: dark)");
  var button = null;

  function stored() {
    try {
      var value = localStorage.getItem(KEY);
      return value === "light" || value === "dark" ? value : null;
    } catch (error) {
      return null;
    }
  }

  var choice = stored();

  function current() {
    return choice || (query.matches ? "dark" : "light");
  }

  function apply() {
    var theme = current();
    root.setAttribute("data-theme", theme);
    if (button) {
      var label = theme === "dark" ? button.dataset.labelToLight : button.dataset.labelToDark;
      button.setAttribute("aria-label", label);
    }
  }

  function wire() {
    button = document.querySelector("[data-lacort-theme-toggle]");
    if (button) {
      button.removeAttribute("hidden");
      button.addEventListener("click", function () {
        choice = current() === "dark" ? "light" : "dark";
        try {
          localStorage.setItem(KEY, choice);
        } catch (error) {
          /* Storage is blocked: the choice lasts until the page closes. */
        }
        apply();
      });
    }
    apply();
  }

  query.addEventListener("change", function () {
    if (!choice) {
      apply();
    }
  });

  apply();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wire);
  } else {
    wire();
  }
})();
