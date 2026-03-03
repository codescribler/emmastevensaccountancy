/* ============================================================
   Emma Stevens Accountancy — Premium Interactions v2
   ============================================================ */
(function () {
    'use strict';

    /* ---------- PAGE LOADER ---------- */
    var loader = document.getElementById('loader');
    document.body.classList.add('is-loading');

    function hideLoader() {
        if (!loader) return;
        loader.classList.add('is-hidden');
        document.body.classList.remove('is-loading');
        revealHeroElements();
    }

    window.addEventListener('load', function () {
        setTimeout(hideLoader, 1400);
    });
    // Fallback in case load fires before script
    setTimeout(hideLoader, 3000);

    /* ---------- HERO REVEAL ---------- */
    function revealHeroElements() {
        var els = document.querySelectorAll('.reveal-hero');
        els.forEach(function (el) {
            var delay = parseInt(el.getAttribute('data-delay') || '0', 10);
            setTimeout(function () {
                el.classList.add('is-visible');
            }, delay * 120);
        });
        // Trigger counter animation
        setTimeout(animateCounters, 800);
    }

    /* ---------- COUNTER ANIMATION ---------- */
    function animateCounters() {
        var counters = document.querySelectorAll('[data-count]');
        counters.forEach(function (el) {
            var target = parseInt(el.getAttribute('data-count'), 10);
            var duration = 1600;
            var start = 0;
            var startTime = null;

            function step(timestamp) {
                if (!startTime) startTime = timestamp;
                var progress = Math.min((timestamp - startTime) / duration, 1);
                // Ease out cubic
                var eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.floor(eased * (target - start) + start);
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    el.textContent = target;
                }
            }
            requestAnimationFrame(step);
        });
    }

    /* ---------- SCROLL REVEAL ---------- */
    var revealEls = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

        revealEls.forEach(function (el) {
            revealObserver.observe(el);
        });
    } else {
        revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    }

    /* ---------- PLAN LINE ANIMATION ---------- */
    var planLine = document.getElementById('planLine');
    if (planLine && 'IntersectionObserver' in window) {
        var planObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    planLine.style.height = '100%';
                    planObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        planObserver.observe(planLine.parentElement);
    }

    /* ---------- NAVBAR ---------- */
    var nav = document.getElementById('nav');

    function onScroll() {
        var scrollY = window.scrollY || window.pageYOffset;
        if (scrollY > 60) {
            nav.classList.add('nav--scrolled');
        } else {
            nav.classList.remove('nav--scrolled');
        }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- MOBILE NAV ---------- */
    var navToggle = document.getElementById('navToggle');
    var navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            var isOpen = navMenu.classList.toggle('is-open');
            navToggle.setAttribute('aria-expanded', String(isOpen));
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });
        navMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navMenu.classList.remove('is-open');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    /* ---------- MOBILE STICKY CTA ---------- */
    var mobileCta = document.getElementById('mobileCta');
    if (mobileCta && 'IntersectionObserver' in window) {
        var ctaObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                mobileCta.classList.toggle('is-visible', !entry.isIntersecting);
            });
        }, { threshold: 0 });
        var hero = document.getElementById('hero');
        if (hero) ctaObserver.observe(hero);
    }

    /* ---------- SMOOTH SCROLL ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var id = this.getAttribute('href');
            if (id === '#') return;
            var target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ---------- TESTIMONIAL CAROUSEL ---------- */
    var track = document.getElementById('testimonialTrack');
    var prevBtn = document.getElementById('testimonialPrev');
    var nextBtn = document.getElementById('testimonialNext');
    var dotsContainer = document.getElementById('testimonialDots');

    if (track && prevBtn && nextBtn && dotsContainer) {
        var cards = track.querySelectorAll('.testimonials__card');
        var currentIndex = 0;
        var visibleCards = getVisibleCards();
        var totalPages = Math.ceil(cards.length / visibleCards);

        function getVisibleCards() {
            var w = window.innerWidth;
            if (w >= 960) return 3;
            if (w >= 600) return 2;
            return 1;
        }

        function buildDots() {
            dotsContainer.innerHTML = '';
            totalPages = Math.ceil(cards.length / visibleCards);
            for (var i = 0; i < totalPages; i++) {
                var dot = document.createElement('button');
                dot.className = 'testimonials__dot' + (i === currentIndex ? ' is-active' : '');
                dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
                dot.addEventListener('click', (function (idx) {
                    return function () { goTo(idx); };
                })(i));
                dotsContainer.appendChild(dot);
            }
        }

        function goTo(index) {
            currentIndex = Math.max(0, Math.min(index, totalPages - 1));
            var card = cards[0];
            var gap = parseFloat(getComputedStyle(track).gap) || 32;
            var cardWidth = card.offsetWidth + gap;
            track.style.transform = 'translateX(' + (-currentIndex * visibleCards * cardWidth) + 'px)';
            updateDots();
        }

        function updateDots() {
            var dots = dotsContainer.querySelectorAll('.testimonials__dot');
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === currentIndex);
            });
        }

        prevBtn.addEventListener('click', function () { goTo(currentIndex - 1); });
        nextBtn.addEventListener('click', function () { goTo(currentIndex + 1); });

        buildDots();

        // Auto-play
        var autoPlay = setInterval(function () {
            goTo(currentIndex + 1 >= totalPages ? 0 : currentIndex + 1);
        }, 5000);

        // Pause on hover
        track.addEventListener('mouseenter', function () { clearInterval(autoPlay); });
        track.addEventListener('mouseleave', function () {
            autoPlay = setInterval(function () {
                goTo(currentIndex + 1 >= totalPages ? 0 : currentIndex + 1);
            }, 5000);
        });

        // Recalculate on resize
        var resizeTimer;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                visibleCards = getVisibleCards();
                currentIndex = 0;
                buildDots();
                goTo(0);
            }, 200);
        });
    }

    /* ---------- LEAD FORM (Demo) ---------- */
    var leadForm = document.getElementById('leadForm');
    if (leadForm) {
        leadForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var btn = leadForm.querySelector('button[type="submit"]');
            var original = btn.innerHTML;
            btn.innerHTML = 'Sending&hellip;';
            btn.disabled = true;

            setTimeout(function () {
                btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Guide Sent &mdash; Check Your Inbox!';
                btn.style.background = 'var(--color-primary)';
                btn.style.borderColor = 'var(--color-primary)';

                setTimeout(function () {
                    btn.innerHTML = original;
                    btn.disabled = false;
                    btn.style.background = '';
                    btn.style.borderColor = '';
                    leadForm.reset();
                }, 3000);
            }, 1200);
        });
    }

    /* ---------- PARALLAX-LITE (hero shapes) ---------- */
    var shapes = document.querySelectorAll('.hero__shape');
    if (shapes.length && window.innerWidth >= 768) {
        var ticking = false;
        window.addEventListener('scroll', function () {
            if (!ticking) {
                requestAnimationFrame(function () {
                    var scrollY = window.scrollY;
                    shapes.forEach(function (shape, i) {
                        var speed = 0.03 + i * 0.015;
                        shape.style.transform = 'translateY(' + (scrollY * speed) + 'px)';
                    });
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

})();
