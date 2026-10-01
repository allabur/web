/*
 * lacort-theme.js: light, dark or system theme (spec 2.5).
 * Load it in <head>, without defer, so the theme is set before the first paint.
 * It writes data-theme ("light" or "dark") and data-theme-mode ("system", "light" or
 * "dark") on <html>, and wires the button [data-lacort-theme-toggle].
 */
(function () {
  "use strict";

  var KEY = "lacort-theme";
  var MODES = ["system", "light", "dark"];
  var root = document.documentElement;
  var query = matchMedia("(prefers-color-scheme: dark)");
  var button = null;

  function readMode() {
    try {
      var value = localStorage.getItem(KEY);
      return value === "light" || value === "dark" ? value : "system";
    } catch (error) {
      return "system";
    }
  }

  function writeMode(mode) {
    try {
      if (mode === "system") {
        localStorage.removeItem(KEY);
      } else {
        localStorage.setItem(KEY, mode);
      }
    } catch (error) {
      /* Storage is blocked: the choice lasts until the page closes. */
    }
  }

  var mode = readMode();

  function apply() {
    var theme = mode === "system" ? (query.matches ? "dark" : "light") : mode;
    root.setAttribute("data-theme", theme);
    root.setAttribute("data-theme-mode", mode);
    if (button) {
      var labels = {
        system: button.dataset.labelSystem,
        light: button.dataset.labelLight,
        dark: button.dataset.labelDark,
      };
      button.textContent = labels[mode];
    }
  }

  function wire() {
    button = document.querySelector("[data-lacort-theme-toggle]");
    if (button) {
      button.removeAttribute("hidden");
      button.addEventListener("click", function () {
        mode = MODES[(MODES.indexOf(mode) + 1) % MODES.length];
        writeMode(mode);
        apply();
      });
    }
    apply();
  }

  query.addEventListener("change", function () {
    if (mode === "system") {
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
