(function () {
  "use strict";

  var body = document.body;
  if (!body || !body.classList.contains("purelane-home")) {
    return;
  }

  body.classList.add("purelane-js");

  var instances = new WeakMap();
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function toArray(list) {
    return Array.prototype.slice.call(list || []);
  }

  function queryAll(scope, selector) {
    return toArray((scope || document).querySelectorAll(selector));
  }

  function addListener(target, type, handler, options, cleanups) {
    if (!target) {
      return;
    }
    target.addEventListener(type, handler, options);
    cleanups.push(function () {
      target.removeEventListener(type, handler, options);
    });
  }

  function getSectionRoots(scope) {
    var roots = [];
    if (scope && scope.matches && scope.matches("[data-purelane-section]")) {
      roots.push(scope);
    }
    if (scope && scope.querySelectorAll) {
      roots = roots.concat(queryAll(scope, "[data-purelane-section]"));
    }
    return roots.filter(function (root, index) {
      return roots.indexOf(root) === index;
    });
  }

  function getAnchorTarget(anchor) {
    if (!anchor) {
      return null;
    }
    var escaped = window.CSS && CSS.escape ? CSS.escape(anchor) : anchor.replace(/"/g, '\\"');
    return document.querySelector('[data-purelane-anchor="' + escaped + '"]') || document.getElementById(anchor);
  }

  function createRevealController(root) {
    var cleanups = [];
    var items = queryAll(root, ".rv");

    if (!items.length) {
      return { destroy: function () {} };
    }

    if (!("IntersectionObserver" in window) || reduceMotion.matches) {
      items.forEach(function (item) {
        item.classList.add("in");
      });
      return { destroy: function () {} };
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });

    items.forEach(function (item) {
      observer.observe(item);
    });

    cleanups.push(function () {
      observer.disconnect();
      items.forEach(function (item) {
        item.classList.add("in");
      });
    });

    return {
      destroy: function () {
        cleanups.splice(0).forEach(function (cleanup) {
          cleanup();
        });
      }
    };
  }

  function createHeaderController(root) {
    var cleanups = [];
    var toggle = root.querySelector("[data-purelane-menu-toggle]");
    var menu = root.querySelector("[data-purelane-mobile-menu]");

    function closeMenu() {
      if (!toggle || !menu) {
        return;
      }
      menu.classList.remove("open");
      menu.setAttribute("hidden", "");
      toggle.setAttribute("aria-expanded", "false");
    }

    if (toggle && menu) {
      menu.setAttribute("hidden", "");
      addListener(toggle, "click", function () {
        var expanded = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", expanded ? "false" : "true");
        menu.classList.toggle("open", !expanded);
        if (expanded) {
          menu.setAttribute("hidden", "");
        } else {
          menu.removeAttribute("hidden");
        }
      }, false, cleanups);

      queryAll(menu, "a").forEach(function (link) {
        addListener(link, "click", closeMenu, false, cleanups);
      });

      addListener(window, "keydown", function (event) {
        if (event.key === "Escape") {
          closeMenu();
        }
      }, false, cleanups);

      addListener(window, "resize", function () {
        if (window.matchMedia("(min-width: 1024px)").matches) {
          closeMenu();
        }
      }, false, cleanups);
    }

    return {
      destroy: function () {
        closeMenu();
        cleanups.splice(0).forEach(function (cleanup) {
          cleanup();
        });
      }
    };
  }

  function createHeroController(root) {
    var cleanups = [];
    var stage = root.querySelector("[data-purelane-hero-stage]");
    var slides = queryAll(root, "[data-purelane-slide], .hslide");
    var dots = queryAll(root, "[data-purelane-hero-dots] button");
    var product = root.querySelector("[data-purelane-hero-product]");
    var index = 0;
    var timer = null;
    var observer = null;
    var editorPaused = false;
    var animation = null;

    function goToSlide(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("on", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("on", dotIndex === index);
      });
    }

    function stop() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    function play() {
      if (!timer && !editorPaused && !reduceMotion.matches && slides.length > 1) {
        timer = setInterval(function () {
          goToSlide(index + 1);
        }, 3800);
      }
    }

    function refresh() {
      slides = queryAll(root, "[data-purelane-slide], .hslide");
      dots = queryAll(root, "[data-purelane-hero-dots] button");
      goToSlide(Math.min(index, Math.max(slides.length - 1, 0)));
    }

    dots.forEach(function (dot, dotIndex) {
      addListener(dot, "click", function () {
        stop();
        goToSlide(dotIndex);
        play();
      }, false, cleanups);
    });

    if (stage) {
      addListener(stage, "mouseenter", stop, false, cleanups);
      addListener(stage, "mouseleave", play, false, cleanups);

      if ("IntersectionObserver" in window) {
        observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              play();
            } else {
              stop();
            }
          });
        }, { threshold: 0.2 });
        observer.observe(stage);
      } else {
        play();
      }
    }

    if (!reduceMotion.matches && product && product.animate) {
      animation = product.animate(
        [
          { filter: "drop-shadow(0 34px 54px rgba(2,20,19,.6))" },
          { filter: "drop-shadow(0 42px 68px rgba(2,20,19,.68))" },
          { filter: "drop-shadow(0 34px 54px rgba(2,20,19,.6))" }
        ],
        { duration: 7000, iterations: Infinity, easing: "ease-in-out" }
      );
    }

    goToSlide(0);

    return {
      destroy: function () {
        stop();
        if (observer) {
          observer.disconnect();
        }
        if (animation) {
          animation.cancel();
        }
        cleanups.splice(0).forEach(function (cleanup) {
          cleanup();
        });
      },
      refresh: refresh,
      select: function () {
        editorPaused = true;
        stop();
      },
      deselect: function () {
        editorPaused = false;
        play();
      },
      selectBlock: function (blockId) {
        var block = blockId ? root.querySelector('[data-block-id="' + blockId + '"]') : null;
        var slide = block ? block.closest("[data-purelane-slide], .hslide") : null;
        var slideIndex = slide ? slides.indexOf(slide) : -1;
        if (slideIndex >= 0) {
          editorPaused = true;
          stop();
          goToSlide(slideIndex);
        }
      }
    };
  }

  function createRotatorController(root) {
    var cleanups = [];
    var rotator = root.querySelector("[data-purelane-rotator]");
    if (!rotator) {
      return { destroy: function () {} };
    }

    var images = queryAll(rotator, ".frame .pimg");
    var dots = queryAll(rotator, ".dots i");
    var title = rotator.querySelector(".cap b");
    var note = rotator.querySelector(".cap span");
    var index = 0;
    var timer = null;
    var observer = null;
    var editorPaused = false;

    function goTo(nextIndex) {
      if (!images.length) {
        return;
      }
      index = (nextIndex + images.length) % images.length;
      images.forEach(function (image, imageIndex) {
        image.classList.toggle("on", imageIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("on", dotIndex === index);
      });
      if (title) {
        title.textContent = images[index].getAttribute("data-name") || "";
      }
      if (note) {
        note.textContent = images[index].getAttribute("data-note") || "";
      }
    }

    function stop() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    function play() {
      if (!timer && !editorPaused && !reduceMotion.matches && images.length > 1) {
        timer = setInterval(function () {
          goTo(index + 1);
        }, 3200);
      }
    }

    addListener(rotator, "mouseenter", stop, false, cleanups);
    addListener(rotator, "mouseleave", play, false, cleanups);

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            play();
          } else {
            stop();
          }
        });
      }, { threshold: 0.3 });
      observer.observe(rotator);
    } else {
      play();
    }

    goTo(0);

    return {
      destroy: function () {
        stop();
        if (observer) {
          observer.disconnect();
        }
        cleanups.splice(0).forEach(function (cleanup) {
          cleanup();
        });
      },
      refresh: function () {
        images = queryAll(rotator, ".frame .pimg");
        dots = queryAll(rotator, ".dots i");
        goTo(Math.min(index, Math.max(images.length - 1, 0)));
      },
      select: function () {
        editorPaused = true;
        stop();
      },
      deselect: function () {
        editorPaused = false;
        play();
      }
    };
  }

  function createSectionController(root) {
    var controllers = [createRevealController(root)];
    if (root.matches("[data-purelane-header]")) {
      controllers.push(createHeaderController(root));
    }
    if (root.matches("[data-purelane-hero]")) {
      controllers.push(createHeroController(root));
    }
    if (root.querySelector("[data-purelane-rotator]")) {
      controllers.push(createRotatorController(root));
    }

    return {
      destroy: function () {
        controllers.forEach(function (controller) {
          if (controller && controller.destroy) {
            controller.destroy();
          }
        });
      },
      refresh: function () {
        controllers.forEach(function (controller) {
          if (controller && controller.refresh) {
            controller.refresh();
          }
        });
      },
      select: function () {
        controllers.forEach(function (controller) {
          if (controller && controller.select) {
            controller.select();
          }
        });
      },
      deselect: function () {
        controllers.forEach(function (controller) {
          if (controller && controller.deselect) {
            controller.deselect();
          }
        });
      },
      selectBlock: function (blockId) {
        controllers.forEach(function (controller) {
          if (controller && controller.selectBlock) {
            controller.selectBlock(blockId);
          }
        });
      }
    };
  }

  function initSection(root) {
    if (!root || instances.has(root)) {
      return;
    }
    instances.set(root, createSectionController(root));
  }

  function destroySection(root) {
    var controller = instances.get(root);
    if (!controller) {
      return;
    }
    controller.destroy();
    instances.delete(root);
  }

  function getControllers(scope) {
    return getSectionRoots(scope).map(function (root) {
      return instances.get(root);
    }).filter(Boolean);
  }

  function initSections(scope) {
    getSectionRoots(scope || document).forEach(initSection);
  }

  function destroySections(scope) {
    getSectionRoots(scope || document).forEach(destroySection);
  }

  function createPageController() {
    var cleanups = [];
    var raf = null;
    var mx = 0;
    var my = 0;
    var stages = [];
    var scenes = [];
    var zones = [];
    var railLinks = [];
    var railTargets = [];
    var headers = [];
    var heroProducts = [];
    var waterLayers = [];
    var currentScene = 0;

    function refresh() {
      stages = queryAll(document, "[data-purelane-scenes]");
      scenes = queryAll(document, "[data-purelane-scenes] .scene, [data-purelane-scenes] .purelane-scene");
      zones = queryAll(document, "[data-scene]");
      railLinks = queryAll(document, "[data-purelane-rail] a");
      railTargets = railLinks.map(function (link) {
        var anchor = link.getAttribute("data-purelane-target") || (link.hash || "").replace(/^#/, "");
        return { link: link, anchor: anchor, target: getAnchorTarget(anchor) };
      }).filter(function (item) {
        return item.target;
      });
      headers = queryAll(document, "[data-purelane-header]");
      heroProducts = queryAll(document, "[data-purelane-hero-product]");
      waterLayers = queryAll(document, "[data-purelane-water] .wl, [data-purelane-water] .purelane-wl");
      requestFrame();
    }

    function setScene(nextScene) {
      if (nextScene === currentScene) {
        return;
      }
      currentScene = nextScene;
      scenes.forEach(function (scene, index) {
        scene.classList.toggle("on", index + 1 === nextScene);
      });
      stages.forEach(function (stage) {
        stage.setAttribute("data-d", String(nextScene));
      });
    }

    function pickScene() {
      var focus = window.scrollY + window.innerHeight * 0.5;
      var nextScene = 1;
      zones.forEach(function (zone) {
        if (zone.getBoundingClientRect().top + window.scrollY <= focus) {
          nextScene = parseInt(zone.getAttribute("data-scene"), 10) || nextScene;
        }
      });
      setScene(nextScene);
    }

    function syncRail() {
      var mid = window.scrollY + window.innerHeight * 0.42;
      var active = railTargets[0];
      railTargets
        .slice()
        .sort(function (a, b) {
          return (a.target.getBoundingClientRect().top + window.scrollY) -
            (b.target.getBoundingClientRect().top + window.scrollY);
        })
        .forEach(function (item) {
          if (item.target.getBoundingClientRect().top + window.scrollY <= mid) {
            active = item;
          }
        });
      railLinks.forEach(function (link) {
        link.classList.toggle("on", Boolean(active && link === active.link));
      });
    }

    function frame() {
      raf = null;
      var y = window.scrollY || window.pageYOffset;

      headers.forEach(function (header) {
        header.classList.toggle("up", y > 90);
      });

      if (!reduceMotion.matches) {
        waterLayers.forEach(function (layer, index) {
          var depth = [0.05, 0.09, 0.03, 0.02][index % 4] || 0.05;
          layer.style.setProperty("--px", (mx * depth * 130).toFixed(1) + "px");
          layer.style.setProperty("--py", (-y * depth + my * depth * 90).toFixed(1) + "px");
        });

        heroProducts.forEach(function (product) {
          var fade = Math.min(y / 700, 1);
          product.style.transform = "translate3d(" + (mx * -16).toFixed(2) + "px," +
            (-fade * 54 + my * -10).toFixed(2) + "px,0) scale(" +
            (1 - fade * 0.06).toFixed(3) + ")";
          product.style.opacity = (1 - fade * 0.55).toFixed(3);
        });
      }

      syncRail();
      pickScene();
    }

    function requestFrame() {
      if (!raf) {
        raf = requestAnimationFrame(frame);
      }
    }

    function onPointerMove(event) {
      if (reduceMotion.matches || !window.matchMedia("(min-width: 1024px)").matches) {
        return;
      }
      mx = (event.clientX / window.innerWidth - 0.5) * 2;
      my = (event.clientY / window.innerHeight - 0.5) * 2;
      requestFrame();
    }

    function onAnchorClick(event) {
      var link = event.target.closest && event.target.closest('a[href^="#"]');
      if (!link || !link.hash || link.hash === "#") {
        return;
      }
      var target = getAnchorTarget(link.hash.slice(1));
      if (!target) {
        return;
      }
      event.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "start" });
      if (!window.Shopify || !Shopify.designMode) {
        history.pushState(null, "", link.hash);
      }
    }

    addListener(window, "scroll", requestFrame, { passive: true }, cleanups);
    addListener(window, "resize", refresh, false, cleanups);
    addListener(window, "mousemove", onPointerMove, { passive: true }, cleanups);
    addListener(document, "click", onAnchorClick, false, cleanups);

    refresh();

    return {
      refresh: refresh,
      destroy: function () {
        if (raf) {
          cancelAnimationFrame(raf);
          raf = null;
        }
        cleanups.splice(0).forEach(function (cleanup) {
          cleanup();
        });
      }
    };
  }

  var page = createPageController();

  initSections(document);

  document.addEventListener("shopify:section:load", function (event) {
    initSections(event.target);
    page.refresh();
  });

  document.addEventListener("shopify:section:unload", function (event) {
    destroySections(event.target);
    window.setTimeout(page.refresh, 0);
  });

  document.addEventListener("shopify:section:select", function (event) {
    getControllers(event.target).forEach(function (controller) {
      controller.select();
    });
  });

  document.addEventListener("shopify:section:deselect", function (event) {
    getControllers(event.target).forEach(function (controller) {
      controller.deselect();
    });
  });

  document.addEventListener("shopify:section:reorder", function (event) {
    getControllers(event.target).forEach(function (controller) {
      controller.refresh();
    });
    page.refresh();
  });

  document.addEventListener("shopify:block:select", function (event) {
    if (!window.Shopify || !Shopify.designMode) {
      return;
    }
    var blockId = event.detail && event.detail.blockId;
    getControllers(event.target).forEach(function (controller) {
      controller.selectBlock(blockId);
    });
  });

  document.addEventListener("shopify:block:deselect", function (event) {
    if (!window.Shopify || !Shopify.designMode) {
      return;
    }
    getControllers(event.target).forEach(function (controller) {
      controller.deselect();
    });
  });
})();
