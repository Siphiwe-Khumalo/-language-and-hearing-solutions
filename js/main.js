/* ========================================================================
   Language and Hearing Solutions (Pty) Ltd — main.js
   Vanilla JS: navigation, accessible progressive reveal, FAQ and form handling.
   ========================================================================== */

(function () {
  "use strict";

  // Opt into animation styles only after JavaScript is available.
  document.documentElement.classList.add("js-enhanced");

  function closeMenu(toggle, nav) {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    document.body.style.overflow = "";
  }

  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".main-nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
      document.body.style.overflow = isOpen ? "hidden" : "";
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
      }
    });
  }

  function markActiveNav() {
    var current = window.location.pathname.split("/").pop() || "index.html";
    var marked = false;
    document.querySelectorAll(".nav-links a").forEach(function (link) {
      var href = link.getAttribute("href");
      if (href === current || (current === "" && href === "index.html")) {
        link.setAttribute("aria-current", "page");
        marked = true;
      }
    });
    if (!marked && current === "") {
      var home = document.querySelector('.nav-links a[href="index.html"]');
      if (home) home.setAttribute("aria-current", "page");
    }
  }

  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach(function (item) { item.classList.add("is-visible"); });
      return;
    }

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (item) { item.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -32px 0px" });

    items.forEach(function (item) { observer.observe(item); });
  }

  function initFaq() {
    document.querySelectorAll(".faq-question").forEach(function (button) {
      button.addEventListener("click", function () {
        var expanded = button.getAttribute("aria-expanded") === "true";
        var answerId = button.getAttribute("aria-controls");
        var answer = document.getElementById(answerId);
        button.setAttribute("aria-expanded", expanded ? "false" : "true");
        if (answer) answer.hidden = expanded;
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
    var errorMessages = {
      name: "Please enter your full name (at least 2 characters).",
      email: "Please enter a valid email address.",
      phone: "Please enter a valid phone number.",
      service: "Please select the service you need.",
      message: "Please tell us a little more (at least 10 characters)."
    };

    function setFieldState(input, valid) {
      var field = input.closest(".field");
      if (!field) return;
      var error = field.querySelector(".error-msg");
      var errorId = input.id + "-error";
      if (error) {
        error.id = errorId;
        input.setAttribute("aria-describedby", errorId);
        error.textContent = valid ? "" : (errorMessages[input.name] || "Please check this field.");
      }
      input.setAttribute("aria-invalid", valid ? "false" : "true");
      field.toggleAttribute("data-invalid", !valid);
    }

    function validateField(input) {
      var validator = validators[input.name];
      if (!validator) return true;
      var valid = validator(input.value || "");
      setFieldState(input, valid);
      return valid;
    }

    form.querySelectorAll("input, select, textarea").forEach(function (input) {
      input.addEventListener("blur", function () { validateField(input); });
      input.addEventListener("input", function () {
        if (input.getAttribute("aria-invalid") === "true") validateField(input);
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      feedback.className = "form-feedback";
      feedback.textContent = "";

      var data = {};
      var valid = true;
      var fields = form.querySelectorAll("input[name], select[name], textarea[name]");
      fields.forEach(function (input) {
        if (!validateField(input)) valid = false;
        data[input.name] = input.value.trim();
      });

      if (!valid) {
        feedback.classList.add("is-error");
        feedback.textContent = "Please correct the highlighted fields before sending your enquiry.";
        var firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
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
      var mailto = "mailto:info@languageandhearingsolutions.co.za?subject=" + subject + "&body=" + body;

      feedback.classList.add("is-success");
      feedback.innerHTML = "Your enquiry is ready in your email app. If it did not open, please <a href=\"mailto:info@languageandhearingsolutions.co.za\">email us directly</a> or <a href=\"https://wa.me/27797195743\" target=\"_blank\" rel=\"noopener\">WhatsApp the practice</a>.";
      window.location.href = mailto;
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    markActiveNav();
    initReveal();
    initFaq();
    initContactForm();
  });
})();
