/**
 * CodeHex Scenarios Documentation — Client-side JavaScript
 *
 * Handles sidebar navigation, mobile menu toggle, DSL reference search,
 * and active-link highlighting. No dependencies.
 */

(function () {
  "use strict";

  // ── Mobile menu toggle ──────────────────────────────────────────────────

  document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.querySelector(".menu-toggle");
    var sidebar = document.querySelector(".sidebar");

    if (toggle && sidebar) {
      toggle.addEventListener("click", function () {
        sidebar.classList.toggle("open");
      });

      // Close sidebar when clicking a link (mobile)
      sidebar.addEventListener("click", function (e) {
        if (e.target.tagName === "A") {
          sidebar.classList.remove("open");
        }
      });
    }

    // ── Highlight active sidebar link ───────────────────────────────────

    var currentPage = window.location.pathname.split("/").pop() || "index.html";
    var links = document.querySelectorAll(".sidebar-nav a");
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute("href");
      var linkPage = href.split("/").pop();
      if (linkPage === currentPage) {
        links[i].classList.add("active");
      }
    }

    // ── DSL Reference search filter ─────────────────────────────────────

    var searchBox = document.querySelector(".search-box");
    if (searchBox) {
      var entries = document.querySelectorAll(".dsl-entry");
      searchBox.addEventListener("input", function () {
        var query = this.value.toLowerCase().trim();
        for (var j = 0; j < entries.length; j++) {
          var text = entries[j].textContent.toLowerCase();
          if (!query || text.indexOf(query) !== -1) {
            entries[j].style.display = "";
          } else {
            entries[j].style.display = "none";
          }
        }
      });
    }

    // ── Smooth scroll for anchor links ──────────────────────────────────

    document.addEventListener("click", function (e) {
      var link = e.target.closest("a[href^='#']");
      if (!link) return;
      var id = link.getAttribute("href").slice(1);
      var target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", "#" + id);
      }
    });

    // ── TOC scroll spy ──────────────────────────────────────────────────

    var tocLinks = document.querySelectorAll(".toc a");
    if (tocLinks.length > 0) {
      var headings = [];
      for (var k = 0; k < tocLinks.length; k++) {
        var targetId = tocLinks[k].getAttribute("href").slice(1);
        var el = document.getElementById(targetId);
        if (el) headings.push({ el: el, link: tocLinks[k] });
      }

      function updateToc() {
        var scrollY = window.scrollY + 100;
        var active = null;
        for (var m = 0; m < headings.length; m++) {
          if (headings[m].el.offsetTop <= scrollY) {
            active = headings[m];
          }
        }
        for (var n = 0; n < headings.length; n++) {
          headings[n].link.classList.remove("active");
        }
        if (active) active.link.classList.add("active");
      }

      window.addEventListener("scroll", updateToc, { passive: true });
      updateToc();
    }
  });
})();
