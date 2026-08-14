(function () {
  "use strict";

  var root = document.body;
  if (!root.classList.contains("purelane-home")) {
    return;
  }

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var revs = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window && !reduce) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          ro.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });
    revs.forEach(function (el) {
      ro.observe(el);
    });
  } else {
    revs.forEach(function (el) {
      el.classList.add("in");
    });
  }

  var scenes = Array.prototype.slice.call(document.querySelectorAll(".purelane-scene"));
  var zones = Array.prototype.slice.call(document.querySelectorAll("[data-scene]"));
  var stage = document.getElementById("purelane-scenes");
  var current = 0;

  function setScene(n) {
    if (n === current) {
      return;
    }
    current = n;
    scenes.forEach(function (scene, index) {
      scene.classList.toggle("on", index + 1 === n);
    });
    if (stage) {
      stage.setAttribute("data-d", String(n));
    }
  }

  function pickScene() {
    var focus = window.scrollY + window.innerHeight * 0.5;
    var n = 1;
    for (var i = 0; i < zones.length; i += 1) {
      var zone = zones[i];
      var top = 0;
      var el = zone;
      while (el) {
        top += el.offsetTop;
        el = el.offsetParent;
      }
      if (top <= focus) {
        n = parseInt(zone.getAttribute("data-scene"), 10) || n;
      }
    }
    setScene(n);
  }

  var railLinks = Array.prototype.slice.call(document.querySelectorAll(".purelane-rail a"));
  var targets = railLinks.map(function (link) {
    return document.querySelector(link.getAttribute("href"));
  });

  function syncRail() {
    var mid = window.scrollY + window.innerHeight * 0.42;
    var idx = 0;
    targets.forEach(function (target, index) {
      if (target && target.offsetTop <= mid) {
        idx = index;
      }
    });
    railLinks.forEach(function (link, index) {
      link.classList.toggle("on", index === idx);
    });
  }

  var hdr = document.getElementById("purelane-header");
  var heroProducts = Array.prototype.slice.call(document.querySelectorAll("[data-purelane-hero-product]"));
  var raf = null;
  var mx = 0;
  var my = 0;

  function frame() {
    raf = null;
    var y = window.scrollY || window.pageYOffset;
    if (hdr) {
      hdr.classList.toggle("up", y > 90);
    }
    if (!reduce) {
      var layers = document.querySelectorAll("#purelane-water .purelane-wl");
      for (var i = 0; i < layers.length; i += 1) {
        var depth = [0.05, 0.09, 0.03, 0.02][i] || 0.05;
        layers[i].style.setProperty("--px", (mx * depth * 130).toFixed(1) + "px");
        layers[i].style.setProperty("--py", (-y * depth + my * depth * 90).toFixed(1) + "px");
      }
      heroProducts.forEach(function (prod) {
        var fade = Math.min(y / 700, 1);
        prod.style.transform = "translate3d(" + (mx * -16).toFixed(2) + "px," + (-fade * 54 + my * -10).toFixed(2) + "px,0) scale(" + (1 - fade * 0.06).toFixed(3) + ")";
        prod.style.opacity = (1 - fade * 0.55).toFixed(3);
      });
    }
    syncRail();
    pickScene();
  }

  function onScroll() {
    if (!raf) {
      raf = requestAnimationFrame(frame);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  if (!reduce && window.matchMedia("(min-width: 1024px)").matches) {
    window.addEventListener("mousemove", function (event) {
      mx = (event.clientX / window.innerWidth - 0.5) * 2;
      my = (event.clientY / window.innerHeight - 0.5) * 2;
      onScroll();
    }, { passive: true });
  }

  if (!reduce) {
    heroProducts.forEach(function (prod) {
      if (!prod.animate) {
        return;
      }
      prod.animate(
        [
          { filter: "drop-shadow(0 34px 54px rgba(2,20,19,.6))" },
          { filter: "drop-shadow(0 42px 68px rgba(2,20,19,.68))" },
          { filter: "drop-shadow(0 34px 54px rgba(2,20,19,.6))" }
        ],
        { duration: 7000, iterations: Infinity, easing: "ease-in-out" }
      );
    });
  }

  function initHeroStages(scope) {
    var roots = [];
    if (scope && scope.matches && scope.matches("[data-purelane-hero]")) {
      roots = [scope];
    } else if (scope && scope.querySelectorAll) {
      roots = Array.prototype.slice.call(scope.querySelectorAll("[data-purelane-hero]"));
    }

    roots.forEach(function (hero) {
      if (hero.dataset.purelaneHeroReady === "true") {
        return;
      }

      var hstage = hero.querySelector("[data-purelane-hero-stage]");
      if (!hstage) {
        return;
      }

      hero.dataset.purelaneHeroReady = "true";
      var slides = Array.prototype.slice.call(hstage.querySelectorAll(".hslide"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-purelane-hero-dots] button"));
      var slideIndex = 0;
      var slideTimer = null;
      var slideObserver = null;

      function goToSlide(n) {
        if (!slides.length) {
          return;
        }
        slideIndex = (n + slides.length) % slides.length;
        slides.forEach(function (slide, index) {
          slide.classList.toggle("on", index === slideIndex);
        });
        dots.forEach(function (dot, index) {
          dot.classList.toggle("on", index === slideIndex);
        });
      }

      function playSlides() {
        if (!slideTimer && !reduce && slides.length > 1) {
          slideTimer = setInterval(function () {
            goToSlide(slideIndex + 1);
          }, 3800);
        }
      }

      function stopSlides() {
        if (slideTimer) {
          clearInterval(slideTimer);
          slideTimer = null;
        }
      }

      dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
          stopSlides();
          goToSlide(index);
          playSlides();
        });
      });

      hstage.addEventListener("mouseenter", stopSlides);
      hstage.addEventListener("mouseleave", playSlides);

      if ("IntersectionObserver" in window) {
        slideObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              playSlides();
            } else {
              stopSlides();
            }
          });
        }, { threshold: 0.2 });
        slideObserver.observe(hstage);
      } else {
        playSlides();
      }

      hero._purelaneHeroDestroy = function () {
        stopSlides();
        if (slideObserver) {
          slideObserver.disconnect();
        }
      };
    });
  }

  initHeroStages(document);

  document.addEventListener("shopify:section:load", function (event) {
    initHeroStages(event.target);
  });

  document.addEventListener("shopify:section:unload", function (event) {
    var hero = event.target.matches && event.target.matches("[data-purelane-hero]")
      ? event.target
      : event.target.querySelector && event.target.querySelector("[data-purelane-hero]");
    if (hero && hero._purelaneHeroDestroy) {
      hero._purelaneHeroDestroy();
    }
  });

  var rot = document.getElementById("rot");
  if (rot) {
    var rotImages = Array.prototype.slice.call(rot.querySelectorAll(".frame .pimg"));
    var rotDots = Array.prototype.slice.call(rot.querySelectorAll(".dots i"));
    var rotCapTitle = rot.querySelector(".cap b");
    var rotCapNote = rot.querySelector(".cap span");
    var rotIndex = 0;
    var rotTimer = null;

    function rotStep() {
      rotImages[rotIndex].classList.remove("on");
      if (rotDots[rotIndex]) {
        rotDots[rotIndex].classList.remove("on");
      }
      rotIndex = (rotIndex + 1) % rotImages.length;
      rotImages[rotIndex].classList.add("on");
      if (rotDots[rotIndex]) {
        rotDots[rotIndex].classList.add("on");
      }
      if (rotCapTitle) {
        rotCapTitle.textContent = rotImages[rotIndex].getAttribute("data-name") || "";
      }
      if (rotCapNote) {
        rotCapNote.textContent = rotImages[rotIndex].getAttribute("data-note") || "";
      }
    }

    function playRot() {
      if (!rotTimer && !reduce && rotImages.length > 1) {
        rotTimer = setInterval(rotStep, 3200);
      }
    }

    function stopRot() {
      if (rotTimer) {
        clearInterval(rotTimer);
        rotTimer = null;
      }
    }

    rot.addEventListener("mouseenter", stopRot);
    rot.addEventListener("mouseleave", playRot);

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            playRot();
          } else {
            stopRot();
          }
        });
      }, { threshold: 0.3 }).observe(rot);
    } else {
      playRot();
    }
  }

  var menuToggle = document.querySelector("[data-purelane-menu-toggle]");
  var mobileMenu = document.querySelector("[data-purelane-mobile-menu]");
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", function () {
      var expanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", expanded ? "false" : "true");
      if (expanded) {
        mobileMenu.setAttribute("hidden", "");
      } else {
        mobileMenu.removeAttribute("hidden");
      }
    });

    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenu.setAttribute("hidden", "");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  onScroll();
})();
