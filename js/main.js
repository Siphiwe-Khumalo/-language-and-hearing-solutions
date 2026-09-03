/* ==========================================================================
   Language and Hearing Solutions (Pty) Ltd — main.js
   Vanilla JS: mobile navigation, scroll reveal, contact form handling.
   No frameworks, no external dependencies.
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------ Mobile nav ------------------------------ */
  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".main-nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    // Close mobile menu when a nav link is clicked
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (nav.classList.contains("is-open")) {
          nav.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
          document.body.style.overflow = "";
        }
      });
    });

    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
        toggle.focus();
      }
    });

    // Close if window resizes up to desktop
    window.addEventListener("resize", function () {
      if (window.innerWidth > 900 && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    });
  }

  /* --------------------------- Active nav link ---------------------------- */
  function markActiveNav() {
    var current = (window.location.pathname.split("/").pop() || "index.html");
    document.querySelectorAll(".nav-links a").forEach(function (link) {
      var href = link.getAttribute("href");
      if (href === current || (current === "" && href === "index.html")) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  /* ------------------------------ Scroll reveal ---------------------------- */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ------------------------------ Contact form ------------------------------ */
  function initContactForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;

    var feedback = document.getElementById("form-feedback");

    var validators = {
      name: function (v) { return v.trim().length >= 2; },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); },
      phone: function (v) { return v.trim().length >= 7; },
      service: function (v) { return v.trim().length > 0; },
      message: function (v) { return v.trim().length >= 10; }
    };

    var errorMessages = {
      name: "Please enter your full name (at least 2 characters).",
      email: "Please enter a valid email address.",
      phone: "Please enter a valid phone number.",
      service: "Please select the service you need.",
      message: "Please tell us a little more (at least 10 characters)."
    };

    function showFieldError(fieldWrap, message) {
      fieldWrap.setAttribute("data-invalid", "true");
      var errorEl = fieldWrap.querySelector(".error-msg");
      if (errorEl) errorEl.textContent = message;
    }

    function clearFieldError(fieldWrap) {
      fieldWrap.removeAttribute("data-invalid");
      var errorEl = fieldWrap.querySelector(".error-msg");
      if (errorEl) errorEl.textContent = "";
    }

    function validateField(input) {
      var fieldWrap = input.closest(".field");
      if (!fieldWrap) return true;
      var validator = validators[input.name];
      if (!validator) return true;
      var valid = validator(input.value || "");
      if (valid) {
        clearFieldError(fieldWrap);
      } else {
        showFieldError(fieldWrap, errorMessages[input.name] || "Please check this field.");
      }
      return valid;
    }

    // Live validation on blur
    form.querySelectorAll("input, select, textarea").forEach(function (input) {
      input.addEventListener("blur", function () { validateField(input); });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      feedback.className = "form-feedback";
      feedback.textContent = "";

      var fields = form.querySelectorAll("input[name], select[name], textarea[name]");
      var allValid = true;
      var data = {};

      fields.forEach(function (input) {
        var valid = validateField(input);
        if (!valid) allValid = false;
        data[input.name] = input.value.trim();
      });

      if (!allValid) {
        feedback.classList.add("is-error");
        feedback.textContent = "Please correct the highlighted fields before sending your enquiry.";
        var firstInvalid = form.querySelector('[data-invalid="true"] input, [data-invalid="true"] select, [data-invalid="true"] textarea');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // This is a static site with no backend/server. We build a mailto:
      // link so the enquiry is sent via the visitor's own email client.
      // To collect submissions automatically instead, connect this form to
      // a service such as Formspree or Netlify Forms (see README.md).
      var subject = encodeURIComponent("Website enquiry: " + data.service);
      var bodyLines = [
        "Name: " + data.name,
        "Email: " + data.email,
        "Phone: " + data.phone,
        "Service needed: " + data.service,
        "",
        "Message:",
        data.message
      ];
      var body = encodeURIComponent(bodyLines.join("\n"));
      var mailtoLink = "mailto:info@languageandhearingsolutions.co.za?subject=" + subject + "&body=" + body;

      feedback.classList.add("is-success");
      feedback.textContent = "Thank you. Your default email app should now open with your enquiry ready to send. If it does not open, please email info@languageandhearingsolutions.co.za directly.";

      window.location.href = mailtoLink;
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    markActiveNav();
    initReveal();
    initContactForm();
  });
})();
