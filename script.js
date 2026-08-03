(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------------
     Navbar: scrolled state + mobile menu toggle
  --------------------------------------------------------------------- */
  var navbar = document.getElementById("navbar");
  var hamburger = document.getElementById("hamburger");
  var navLinksEl = document.getElementById("nav-links");

  function onScroll() {
    if (window.scrollY > 12) {
      navbar.classList.add("is-scrolled");
    } else {
      navbar.classList.remove("is-scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (hamburger && navLinksEl) {
    hamburger.addEventListener("click", function () {
      var open = navLinksEl.classList.toggle("is-open");
      hamburger.classList.toggle("is-open", open);
      hamburger.setAttribute("aria-expanded", open ? "true" : "false");
    });

    navLinksEl.querySelectorAll(".nav-link").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinksEl.classList.remove("is-open");
        hamburger.classList.remove("is-open");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------------------------------------------------------------
     Active nav link — highlight the section currently in view
  --------------------------------------------------------------------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll("section[id]"));
  var navLinkMap = {};
  document.querySelectorAll(".nav-link").forEach(function (link) {
    var id = link.getAttribute("href");
    if (id && id.charAt(0) === "#") navLinkMap[id.slice(1)] = link;
  });

  if (sections.length && "IntersectionObserver" in window) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var link = navLinkMap[entry.target.id];
          if (!link) return;
          if (entry.isIntersecting) {
            document.querySelectorAll(".nav-link.is-active").forEach(function (l) {
              l.classList.remove("is-active");
            });
            link.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) { navObserver.observe(s); });
  }

  /* ---------------------------------------------------------------------
     Typed role effect
  --------------------------------------------------------------------- */
  var typedEl = document.getElementById("typed");
  var roles = ["Backend Engineer", "Java & Spring Boot Developer", "Distributed Systems Builder", "Security-minded Engineer"];

  function typeLoop() {
    if (!typedEl) return;
    var roleIndex = 0;
    var charIndex = 0;
    var deleting = false;

    function tick() {
      var current = roles[roleIndex];
      if (!deleting) {
        charIndex++;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, 1600);
          return;
        }
        setTimeout(tick, 55);
      } else {
        charIndex--;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(tick, 350);
          return;
        }
        setTimeout(tick, 28);
      }
    }
    tick();
  }

  if (typedEl) {
    if (prefersReducedMotion) {
      typedEl.textContent = roles[0];
    } else {
      typeLoop();
    }
  }

  /* ---------------------------------------------------------------------
     Scroll reveal — skill categories (uses data-delay already in markup)
  --------------------------------------------------------------------- */
  var revealItems = document.querySelectorAll(".skill-category");
  if (revealItems.length && "IntersectionObserver" in window && !prefersReducedMotion) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var delay = parseInt(entry.target.getAttribute("data-delay") || "0", 10);
            setTimeout(function () {
              entry.target.classList.add("is-visible");
            }, delay);
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealItems.forEach(function (item) { revealObserver.observe(item); });
  } else {
    revealItems.forEach(function (item) { item.classList.add("is-visible"); });
  }

  /* ---------------------------------------------------------------------
     Avatar fallback — shows initials if avatar.png hasn't been added yet
  --------------------------------------------------------------------- */
  var avatarImg = document.querySelector(".avatar-img");
  var avatarInner = document.querySelector(".avatar-inner");
  if (avatarImg && avatarInner) {
    avatarImg.addEventListener("error", function () {
      avatarInner.classList.add("avatar-fallback");
    });
    if (avatarImg.complete && avatarImg.naturalWidth === 0) {
      avatarInner.classList.add("avatar-fallback");
    }
  }

  /* ---------------------------------------------------------------------
     Project demo videos — play/pause toggle + graceful error handling
  --------------------------------------------------------------------- */
  document.querySelectorAll(".video-play-btn").forEach(function (btn) {
    var wrapper = btn.closest(".browser-media-wrapper");
    var video = wrapper ? wrapper.querySelector(".project-video") : null;
    if (!video) return;

    btn.addEventListener("click", function () {
      if (video.paused) {
        video.play().catch(function () {});
        btn.classList.add("playing");
      } else {
        video.pause();
        btn.classList.remove("playing");
      }
    });

    video.addEventListener("error", function () {
      wrapper.classList.add("media-error");
    });
  });

  /* ---------------------------------------------------------------------
     Distraction-blocker toggle — demo interaction only
  --------------------------------------------------------------------- */
  document.querySelectorAll(".widget-toggle").forEach(function (toggle) {
    toggle.addEventListener("click", function () {
      toggle.classList.toggle("active");
    });
  });

  /* ---------------------------------------------------------------------
     Contact form — client-side simulation
  --------------------------------------------------------------------- */
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var submitBtn = document.getElementById("submit-btn");
      var btnText = submitBtn.querySelector(".btn-text");
      if (!btnText) return;
      var original = btnText.textContent;
      btnText.textContent = "Sending...";
      submitBtn.disabled = true;

      setTimeout(function () {
        btnText.textContent = "Message sent";
        form.classList.add("is-sent");
        setTimeout(function () {
          btnText.textContent = original;
          submitBtn.disabled = false;
          form.classList.remove("is-sent");
          form.reset();
        }, 2200);
      }, 700);
    });
  }

  /* ---------------------------------------------------------------------
     Certificate Lightbox Modal Handler (Origin Morphing Animation)
  --------------------------------------------------------------------- */
  var certModal = document.getElementById("cert-modal");
  var certModalBackdrop = document.getElementById("cert-modal-backdrop");
  var certModalClose = document.getElementById("cert-modal-close");
  var certModalContainer = document.querySelector(".cert-modal-container");
  var certModalImg = document.getElementById("cert-modal-img");
  var certModalTitle = document.getElementById("cert-modal-title");
  var certModalIssuer = document.getElementById("cert-modal-issuer");
  var certModalDownload = document.getElementById("cert-modal-download");

  var activeOriginButton = null;
  var isModalAnimating = false;

  function updateModalOrigin(btn) {
    if (!btn || !certModalContainer) return;
    var rect = btn.getBoundingClientRect();
    var btnCenterX = rect.left + rect.width / 2;
    var btnCenterY = rect.top + rect.height / 2;
    var screenCenterX = window.innerWidth / 2;
    var screenCenterY = window.innerHeight / 2;

    var deltaX = btnCenterX - screenCenterX;
    var deltaY = btnCenterY - screenCenterY;

    certModalContainer.style.setProperty("--origin-x", deltaX + "px");
    certModalContainer.style.setProperty("--origin-y", deltaY + "px");
  }

  function openCertModal(btn, imgSrc) {
    if (!certModal || !certModalImg || isModalAnimating) return;
    isModalAnimating = true;
    activeOriginButton = btn;

    updateModalOrigin(btn);

    certModalImg.src = imgSrc || "";

    certModal.classList.add("is-visible");
    document.body.style.overflow = "hidden";

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        certModal.classList.add("is-active");
        setTimeout(function () {
          isModalAnimating = false;
        }, 400);
      });
    });
  }

  function closeCertModal() {
    if (!certModal || !certModal.classList.contains("is-active") || isModalAnimating) return;
    isModalAnimating = true;

    if (activeOriginButton) {
      updateModalOrigin(activeOriginButton);
    }

    certModal.classList.remove("is-active");

    setTimeout(function () {
      certModal.classList.remove("is-visible");
      document.body.style.overflow = "";
      isModalAnimating = false;
    }, 380);
  }

  document.querySelectorAll(".cert-trigger").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var imgSrc = this.getAttribute("data-cert-img");
      openCertModal(this, imgSrc);
    });
  });

  if (certModalClose) certModalClose.addEventListener("click", closeCertModal);
  if (certModalBackdrop) certModalBackdrop.addEventListener("click", closeCertModal);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && certModal && certModal.classList.contains("is-active")) {
      closeCertModal();
    }
  });

  /* ---------------------------------------------------------------------
     Load More / Show Less Toggle Handler (Shows Top 3 by default)
  --------------------------------------------------------------------- */
  function setupLoadMore(buttonId, containerSelector, itemSelector, visibleCount, defaultText, expandedText) {
    var btn = document.getElementById(buttonId);
    if (!btn) return;
    var container = document.querySelector(containerSelector);
    if (!container) return;
    var items = container.querySelectorAll(itemSelector);
    if (items.length <= visibleCount) {
      btn.style.display = "none";
      return;
    }

    // Hide items beyond visibleCount initially
    items.forEach(function (item, index) {
      if (index >= visibleCount) {
        item.classList.add("hidden-item");
      }
    });

    btn.addEventListener("click", function () {
      var isExpanded = btn.classList.contains("is-expanded");
      if (isExpanded) {
        // Collapse back to visibleCount
        items.forEach(function (item, index) {
          if (index >= visibleCount) {
            item.classList.add("hidden-item");
          }
        });
        btn.classList.remove("is-expanded");
        btn.querySelector("span").textContent = defaultText;
      } else {
        // Expand all items
        items.forEach(function (item) {
          item.classList.remove("hidden-item");
        });
        btn.classList.add("is-expanded");
        btn.querySelector("span").textContent = expandedText;
      }
    });
  }

  setupLoadMore("load-more-achievements", "#achievements", ".achieve-timeline-item", 3, "Load More Achievements", "Show Less");
  setupLoadMore("load-more-certs", "#certifications", ".achieve-timeline-item", 3, "Load More Certifications", "Show Less");
})();
