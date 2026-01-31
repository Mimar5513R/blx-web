(function () {
  'use strict';

  var header = document.querySelector('.header');
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  var mainContent = document.getElementById('main-content');
  var backToTop = document.querySelector('.back-to-top');
  var sections = document.querySelectorAll('section[id]');
  var hero = document.querySelector('.hero');

  /* Animation d'entrée hero */
  if (hero) {
    requestAnimationFrame(function () {
      hero.classList.add('hero-loaded');
    });
  }

  /* Reveal au scroll (Intersection Observer) */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.05 });
    revealEls.forEach(function (el) {
      revealObs.observe(el);
    });
  }

  function setMenuOpen(open) {
    if (!nav || !toggle) return;
    if (open) {
      nav.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Fermer le menu');
    } else {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Ouvrir le menu');
    }
  }

  /* Menu mobile */
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setMenuOpen(!nav.classList.contains('open'));
    });
  }

  /* Fermer menu : clic extérieur */
  document.addEventListener('click', function (e) {
    if (!nav || !toggle) return;
    if (nav.classList.contains('open') && !nav.contains(e.target)) {
      setMenuOpen(false);
    }
  });

  /* Fermer menu : touche Escape */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav && nav.classList.contains('open')) {
      setMenuOpen(false);
      toggle.focus();
    }
  });

  /* Smooth scroll + fermer menu */
  navLinks.forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        setMenuOpen(false);
      }
    });
  });

  /* Retour en haut : visibilité + clic */
  if (backToTop) {
    function updateBackToTop() {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
    window.addEventListener('scroll', updateBackToTop, { passive: true });
    updateBackToTop();
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* Section active dans la nav au scroll */
  function updateActiveSection() {
    var scrollY = window.scrollY;
    var padding = 120;
    var current = null;
    sections.forEach(function (section) {
      var id = section.getAttribute('id');
      if (!id) return;
      var top = section.offsetTop - padding;
      var height = section.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        current = id;
      }
    });
    navLinks.forEach(function (a) {
      var href = a.getAttribute('href');
      if (href && href.startsWith('#')) {
        if (href === '#' + current) {
          a.classList.add('active');
        } else {
          a.classList.remove('active');
        }
      }
    });
  }
  window.addEventListener('scroll', updateActiveSection, { passive: true });
  updateActiveSection();

  /* Copier dans le presse-papiers */
  document.querySelectorAll('.copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = this.getAttribute('data-copy') || (this.previousElementSibling && this.previousElementSibling.textContent) || '';
      if (!text) return;
      var self = this;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          self.classList.add('copied');
          self.textContent = 'Copié';
          setTimeout(function () {
            self.classList.remove('copied');
            self.textContent = 'Copier';
          }, 2000);
        }).catch(function () {
          fallbackCopy(text, self);
        });
      } else {
        fallbackCopy(text, self);
      }
    });
  });

  function fallbackCopy(text, btn) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      btn.classList.add('copied');
      btn.textContent = 'Copié';
      setTimeout(function () {
        btn.classList.remove('copied');
        btn.textContent = 'Copier';
      }, 2000);
    } catch (err) {}
    document.body.removeChild(ta);
  }
})();
