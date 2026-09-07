/* ==========================================================================
   Language and Hearing Solutions — Premium Interaction Layer
   Complete rewrite · No frameworks or external dependencies
   ========================================================================== */
(function () {
  "use strict";

  /* -----------------------------------------------------------------------
     Utility: detect reduced-motion preference
     ----------------------------------------------------------------------- */
  var prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -----------------------------------------------------------------------
     Add html.js class immediately so CSS can hide .reveal elements
     before the IntersectionObserver kicks in
     ----------------------------------------------------------------------- */
  document.documentElement.classList.add("js");

  /* -----------------------------------------------------------------------
     1. initNavigation() — Mobile menu toggle with ARIA states
     ----------------------------------------------------------------------- */
  function updateMenuAccessibility(nav, isOpen) {
    if (window.innerWidth <= 900) {
      nav.setAttribute("aria-hidden", String(!isOpen));
      if (!isOpen) {
        nav.setAttribute("inert", "");
      } else {
        nav.removeAttribute("inert");
      }
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

    /* Toggle button click */
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
      document.body.classList.toggle("menu-open", isOpen);
      updateMenuAccessibility(nav, isOpen);
    });

    /* Close when clicking a nav link */
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (nav.classList.contains("is-open")) {
          closeMenu(toggle, nav);
        }
      });
    });

    /* Close on outside click */
    document.addEventListener("click", function (event) {
      if (
        nav.classList.contains("is-open") &&
        !nav.contains(event.target) &&
        !toggle.contains(event.target)
      ) {
        closeMenu(toggle, nav);
      }
    });

    /* Close on Escape key */
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        closeMenu(toggle, nav);
        toggle.focus();
      }
    });

    /* Reset on resize */
    window.addEventListener("resize", function () {
      if (window.innerWidth > 900 && nav.classList.contains("is-open")) {
        closeMenu(toggle, nav);
      } else if (window.innerWidth > 900) {
        nav.removeAttribute("aria-hidden");
        nav.removeAttribute("inert");
      } else if (!nav.classList.contains("is-open")) {
        updateMenuAccessibility(nav, false);
      }
    });
  }

  /* -----------------------------------------------------------------------
     2. markCurrentPage() — Highlights current nav link with aria-current
     ----------------------------------------------------------------------- */
  function markCurrentPage() {
    var path = window.location.pathname;
    var current = path.split("/").pop() || "index.html";
    if (current === "") current = "index.html";

    document.querySelectorAll(".nav-links a").forEach(function (link) {
      var href = link.getAttribute("href");
      if (href === current || (current === "index.html" && href === "index.html")) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  /* -----------------------------------------------------------------------
     3. initReveal() — IntersectionObserver scroll-triggered animations
        Adds .is-visible to .reveal elements as they enter viewport.
        The html.js class (added above) enables CSS transitions:
          opacity 0 → 1, translateY(42px) → 0, 750ms duration
     ----------------------------------------------------------------------- */
  function initReveal() {
    var elements = document.querySelectorAll(".reveal");
    if (!elements.length) return;

    /* Reduced motion or no IntersectionObserver: show everything immediately */
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      elements.forEach(function (el) {
        el.classList.add("is-visible");
      });
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
      {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* -----------------------------------------------------------------------
     4. initStagger() — Adds incremental transition-delay to children of
        [data-stagger] containers for cascade reveal effect
     ----------------------------------------------------------------------- */
  function initStagger() {
    if (prefersReducedMotion) return;

    document.querySelectorAll("[data-stagger]").forEach(function (container) {
      var children = container.children;
      for (var i = 0; i < children.length; i++) {
        var child = children[i];
        if (child.classList.contains("reveal")) {
          /* Cap at 500ms to prevent very long waits */
          child.style.transitionDelay = Math.min(i * 80, 500) + "ms";
        }
      }
    });
  }

  /* -----------------------------------------------------------------------
     5. initCounters() — Animates [data-count-to] elements from 0 to
        their target value with ease-out-cubic easing when scrolled into view
     ----------------------------------------------------------------------- */
  function initCounters() {
    var counters = document.querySelectorAll("[data-count-to]");
    if (!counters.length) return;

    function animateCounter(el) {
      var target = parseFloat(el.getAttribute("data-count-to"));
      if (isNaN(target)) return;

      /* Reduced motion: just set the value */
      if (prefersReducedMotion || !("requestAnimationFrame" in window)) {
        el.textContent = String(target);
        return;
      }

      var duration = 1400; /* ms — slightly longer for dramatic effect */
      var startTime = null;
      el.textContent = "0";

      function step(timestamp) {
        if (startTime === null) startTime = timestamp;
        var elapsed = timestamp - startTime;
        var progress = Math.min(elapsed / duration, 1);

        /* Ease-out cubic: fast start, smooth deceleration */
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

    /* Use IntersectionObserver so counters animate when scrolled into view */
    if (!("IntersectionObserver" in window)) {
      counters.forEach(animateCounter);
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );

    counters.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* -----------------------------------------------------------------------
     6. initAccordions() — FAQ toggle with ARIA expanded state
     ----------------------------------------------------------------------- */
  function initAccordions() {
    document.querySelectorAll(".faq-question").forEach(function (button) {
      button.addEventListener("click", function () {
        var expanded = button.getAttribute("aria-expanded") === "true";
        var panelId = button.getAttribute("aria-controls");
        var panel = panelId ? document.getElementById(panelId) : null;

        button.setAttribute("aria-expanded", String(!expanded));
        if (panel) {
          panel.hidden = expanded;
        }
      });
    });
  }

  /* -----------------------------------------------------------------------
     7. initContactForm() — Client-side validation with mailto: fallback
        Target: info@languageandhearingsolutions.co.za
     ----------------------------------------------------------------------- */
  function initContactForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;

    var feedback = document.getElementById("form-feedback");

    /* Validation rules per field name */
    var validators = {
      name: function (value) {
        return value.trim().length >= 2;
      },
      email: function (value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
      },
      phone: function (value) {
        return value.trim().length >= 7;
      },
      service: function (value) {
        return value.trim().length > 0;
      },
      message: function (value) {
        return value.trim().length >= 10;
      }
    };

    /* Error messages per field name */
    var errorMessages = {
      name: "Please enter your full name.",
      email: "Please enter a valid email address.",
      phone: "Please enter a valid phone number.",
      service: "Please select a service.",
      message: "Please add a little more detail (at least 10 characters)."
    };

    /* Validate a single input and show/hide error */
    function validateField(input) {
      var field = input.closest(".field");
      var errorEl = field ? field.querySelector(".error-msg") : null;
      var isValid = validators[input.name]
        ? validators[input.name](input.value || "")
        : true;

      if (field) {
        if (isValid) {
          field.removeAttribute("data-invalid");
        } else {
          field.setAttribute("data-invalid", "true");
        }
      }

      input.setAttribute("aria-invalid", String(!isValid));

      if (errorEl) {
        errorEl.id = input.id + "-error";
        input.setAttribute("aria-describedby", errorEl.id);
        errorEl.textContent = isValid ? "" : (errorMessages[input.name] || "");
      }

      return isValid;
    }

    /* Attach blur and input listeners to each field */
    form.querySelectorAll("input, select, textarea").forEach(function (input) {
      input.addEventListener("blur", function () {
        validateField(input);
      });
      input.addEventListener("input", function () {
        if (input.getAttribute("aria-invalid") === "true") {
          validateField(input);
        }
      });
    });

    /* Submit handler */
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      /* Reset feedback */
      if (feedback) {
        feedback.className = "form-feedback";
        feedback.textContent = "";
      }

      var formData = {};
      var allValid = true;

      form.querySelectorAll("[name]").forEach(function (input) {
        if (!validateField(input)) allValid = false;
        formData[input.name] = input.value.trim();
      });

      if (!allValid) {
        if (feedback) {
          feedback.classList.add("is-error");
          feedback.textContent = "Please review the highlighted fields before sending your enquiry.";
        }
        var firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      /* Build mailto link */
      var subject = encodeURIComponent("Website enquiry: " + formData.service);
      var body = encodeURIComponent(
        [
          "Name: " + formData.name,
          "Email: " + formData.email,
          "Phone: " + formData.phone,
          "Service needed: " + formData.service,
          "",
          "Message:",
          formData.message
        ].join("\n")
      );

      /* Show success feedback */
      if (feedback) {
        feedback.classList.add("is-success");
        feedback.innerHTML =
          'Your enquiry is ready in your email app. If it did not open, ' +
          '<a href="mailto:info@languageandhearingsolutions.co.za">email us directly</a> or ' +
          '<a href="https://wa.me/27797195743" target="_blank" rel="noopener">WhatsApp the practice</a>.';
      }

      /* Open mailto */
      window.location.href =
        "mailto:info@languageandhearingsolutions.co.za?subject=" + subject + "&body=" + body;
    });
  }

  /* -----------------------------------------------------------------------
     Initialise everything on DOMContentLoaded
     ----------------------------------------------------------------------- */
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



/* ---------------------------------------------------------------------------
   Art direction layer: directional reveals, subtle depth and header state.
   All effects are disposable enhancements; content remains fully usable without JS.
   --------------------------------------------------------------------------- */
(function () {
  "use strict";
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initArtDirectedMotion() {
    document.querySelectorAll(".editorial-image, .service-intro__image, .corporate-band__visual, .hero-art").forEach(function (el) {
      el.classList.add("reveal--scale");
    });

    document.querySelectorAll(".editorial-grid > :first-child, .service-intro > :first-child").forEach(function (el) {
      if (!el.classList.contains("reveal--scale")) el.classList.add("reveal--left");
    });

    document.querySelectorAll(".editorial-grid > :last-child, .service-intro > :last-child").forEach(function (el) {
      if (!el.classList.contains("reveal--scale")) el.classList.add("reveal--right");
    });

    document.querySelectorAll(".credential-belt__track").forEach(function (track) {
      track.parentElement.setAttribute("tabindex", "0");
    });

    if (reduced) return;

    var backdrop = document.querySelector(".home-hero__backdrop");
    var artFrame = document.querySelector(".hero-art__frame");
    var ticking = false;

    function updateDepth() {
      var scrollY = window.scrollY || window.pageYOffset || 0;
      if (backdrop) backdrop.style.setProperty("--parallax-y", Math.min(scrollY * .08, 28) + "px");
      if (artFrame) artFrame.style.setProperty("--parallax-y", Math.min(scrollY * .035, 16) + "px");
      ticking = false;
    }

    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(updateDepth);
        ticking = true;
      }
    }, { passive: true });
    updateDepth();
  }

  function initHeaderState() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    function update() {
      header.classList.toggle("is-scrolled", (window.scrollY || 0) > 12);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initArtDirectedMotion();
    initHeaderState();
  });
})();
