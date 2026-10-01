/*
 * publications.js: filter the publications by category (spec 8.11).
 * The address #category=<tag> picks the category. Without it, or with an unknown tag,
 * every publication shows. Without JavaScript the list is complete and the category
 * block stays hidden.
 */
(function () {
  "use strict";

  function wanted(links) {
    var match = /[#&]category=([^&]*)/.exec(location.hash);
    var name = match ? decodeURIComponent(match[1]) : "";
    for (var i = 0; i < links.length; i++) {
      if (links[i].dataset.category === name) {
        return name;
      }
    }
    return "";
  }

  function init() {
    var entries = document.querySelectorAll(".lacort-pub");
    var links = document.querySelectorAll("[data-category]");
    var sections = document.querySelectorAll("[data-pub-section]");
    var block = document.querySelector("[data-categories]");
    var status = document.querySelector("[data-pub-status]");
    if (block) {
      block.removeAttribute("hidden");
    }

    function apply() {
      var category = wanted(links);
      var shown = 0;
      for (var i = 0; i < entries.length; i++) {
        var tags = (entries[i].dataset.tags || "").split("|");
        var visible = category === "" || tags.indexOf(category) >= 0;
        entries[i].hidden = !visible;
        shown += visible ? 1 : 0;
      }
      for (var s = 0; s < sections.length; s++) {
        var inside = sections[s].querySelectorAll(".lacort-pub");
        var any = false;
        for (var j = 0; j < inside.length; j++) {
          any = any || !inside[j].hidden;
        }
        sections[s].hidden = !any;
      }
      for (var k = 0; k < links.length; k++) {
        if (links[k].dataset.category === category) {
          links[k].setAttribute("aria-current", "true");
        } else {
          links[k].removeAttribute("aria-current");
        }
      }
      if (status) {
        var template = (status.dataset && status.dataset.text) || "{n}/{total}";
        status.textContent = template.replace("{n}", shown).replace("{total}", entries.length);
      }
    }

    window.addEventListener("hashchange", apply);
    apply();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
