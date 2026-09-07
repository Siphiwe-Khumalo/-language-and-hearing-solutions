/* ==========================================================================
   Language and Hearing Solutions — interaction layer
   No frameworks or external dependencies.
   ========================================================================== */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  function updateMenuAccessibility(nav, open) {
    if (window.innerWidth <= 900) {
      nav.setAttribute("aria-hidden", String(!open));
      nav.toggleAttribute("inert", !open);
    } else {
      nav.removeAttribute("aria-hidden");
      nav.removeAttribute("inert");
    }
  }

  function closeMenu(toggle, nav) {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    document.body.classList.remove("menu-open");
    updateMenuAccessibility(nav, false);
  }

  function initNavigation() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".main-nav");
    if (!toggle || !nav) return;
    updateMenuAccessibility(nav, false);

    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.classList.toggle("menu-open", open);
      updateMenuAccessibility(nav, open);
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (nav.classList.contains("is-open")) closeMenu(toggle, nav);
      });
    });

    document.addEventListener("click", function (event) {
      if (nav.classList.contains("is-open") && !nav.contains(event.target) && !toggle.contains(event.target)) {
        closeMenu(toggle, nav);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        closeMenu(toggle, nav);
        toggle.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 900 && nav.classList.contains("is-open")) {
        closeMenu(toggle, nav);
      } else if (!nav.classList.contains("is-open")) {
        updateMenuAccessibility(nav, false);
      } else {
        updateMenuAccessibility(nav, true);
      }
    });
  }

  function markCurrentPage() {
    var current = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a").forEach(function (link) {
      var href = link.getAttribute("href");
      if (href === current || (current === "" && href === "index.html")) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function initReveal() {
    var elements = document.querySelectorAll(".reveal");
    if (!elements.length) return;
    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      elements.forEach(function (element) { element.classList.add("is-visible"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -30px 0px" });
    elements.forEach(function (element) { observer.observe(element); });
  }

  function initCounters() {
    var counters = document.querySelectorAll("[data-count-to]");
    if (!counters.length) return;
    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function animateCounter(el) {
      var target = parseFloat(el.getAttribute("data-count-to"));
      if (isNaN(target)) return;
      if (reduced || !("requestAnimationFrame" in window)) {
        el.textContent = String(target);
        return;
      }
      var duration = 1200;
      var start = null;
      el.textContent = "0";
      function step(timestamp) {
        if (start === null) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.round(target * eased);
        el.textContent = String(current);
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          el.textContent = String(target);
        }
      }
      window.requestAnimationFrame(step);
    }

    if (!("IntersectionObserver" in window)) {
      counters.forEach(animateCounter);
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { observer.observe(el); });
  }

  function initAccordions() {
    document.querySelectorAll(".faq-question").forEach(function (button) {
      button.addEventListener("click", function () {
        var expanded = button.getAttribute("aria-expanded") === "true";
        var panel = document.getElementById(button.getAttribute("aria-controls"));
        button.setAttribute("aria-expanded", String(!expanded));
        if (panel) panel.hidden = expanded;
      });
    });
  }

  function initContactForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;
    var feedback = document.getElementById("form-feedback");
    var validators = {
      name: function (value) { return value.trim().length >= 2; },
      email: function (value) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()); },
      phone: function (value) { return value.trim().length >= 7; },
      service: function (value) { return value.trim().length > 0; },
      message: function (value) { return value.trim().length >= 10; }
    };
    var errors = {
      name: "Please enter your full name.",
      email: "Please enter a valid email address.",
      phone: "Please enter a valid phone number.",
      service: "Please select a service.",
      message: "Please add a little more detail (at least 10 characters)."
    };

    function validate(input) {
      var field = input.closest(".field");
      var error = field && field.querySelector(".error-msg");
      var valid = validators[input.name] ? validators[input.name](input.value || "") : true;
      if (field) field.toggleAttribute("data-invalid", !valid);
      input.setAttribute("aria-invalid", String(!valid));
      if (error) {
        error.id = input.id + "-error";
        input.setAttribute("aria-describedby", error.id);
        error.textContent = valid ? "" : errors[input.name];
      }
      return valid;
    }

    form.querySelectorAll("input, select, textarea").forEach(function (input) {
      input.addEventListener("blur", function () { validate(input); });
      input.addEventListener("input", function () {
        if (input.getAttribute("aria-invalid") === "true") validate(input);
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      feedback.className = "form-feedback";
      feedback.textContent = "";
      var data = {};
      var valid = true;
      form.querySelectorAll("[name]").forEach(function (input) {
        if (!validate(input)) valid = false;
        data[input.name] = input.value.trim();
      });
      if (!valid) {
        feedback.classList.add("is-error");
        feedback.textContent = "Please review the highlighted fields before sending your enquiry.";
        var first = form.querySelector('[aria-invalid="true"]');
        if (first) first.focus();
        return;
      }
      var subject = encodeURIComponent("Website enquiry: " + data.service);
      var body = encodeURIComponent([
        "Name: " + data.name,
        "Email: " + data.email,
        "Phone: " + data.phone,
        "Service needed: " + data.service,
        "",
        "Message:",
        data.message
      ].join("\n"));
      feedback.classList.add("is-success");
      feedback.innerHTML = "Your enquiry is ready in your email app. If it did not open, <a href=\"mailto:info@languageandhearingsolutions.co.za\">email us directly</a> or <a href=\"https://wa.me/27797195743\" target=\"_blank\" rel=\"noopener\">WhatsApp the practice</a>.";
      window.location.href = "mailto:info@languageandhearingsolutions.co.za?subject=" + subject + "&body=" + body;
    });
  }

  function initStagger() {
    document.querySelectorAll("[data-stagger]").forEach(function (group) {
      Array.prototype.forEach.call(group.children, function (child, index) {
        if (child.classList.contains("reveal")) {
          child.style.transitionDelay = Math.min(index * 70, 420) + "ms";
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNavigation();
    markCurrentPage();
    initStagger();
    initReveal();
    initAccordions();
    initCounters();
    initContactForm();
  });
})();
