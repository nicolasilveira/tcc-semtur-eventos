/* Currais Novos – interações do tema (v1.1) */
(function () {
	'use strict';

	// ===== Mobile nav =====
	var toggle = document.querySelector('.nav-toggle');
	var nav = document.querySelector('.primary-nav');
	if (toggle && nav) {
		toggle.addEventListener('click', function () {
			var open = nav.classList.toggle('is-open');
			toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
			document.body.style.overflow = open ? 'hidden' : '';
		});
	}

	// ===== Hero carousel com setas =====
	document.querySelectorAll('[data-carousel]').forEach(function (carousel) {
		var slides = carousel.querySelectorAll('.hero__slide');
		var dots = carousel.querySelectorAll('.hero__dot');
		var prev = carousel.querySelector('[data-prev]');
		var next = carousel.querySelector('[data-next]');
		if (slides.length < 2) return;
		var current = 0;
		var timer;

		function go(idx) {
			slides[current].classList.remove('is-active');
			dots[current] && dots[current].classList.remove('is-active');
			current = (idx + slides.length) % slides.length;
			slides[current].classList.add('is-active');
			dots[current] && dots[current].classList.add('is-active');
		}
		function reset() { clearInterval(timer); autoplay(); }
		function autoplay() { timer = setInterval(function () { go(current + 1); }, 6500); }

		dots.forEach(function (dot) {
			dot.addEventListener('click', function () {
				go(parseInt(dot.dataset.go, 10)); reset();
			});
		});
		prev && prev.addEventListener('click', function () { go(current - 1); reset(); });
		next && next.addEventListener('click', function () { go(current + 1); reset(); });
		carousel.addEventListener('mouseenter', function () { clearInterval(timer); });
		carousel.addEventListener('mouseleave', autoplay);
		autoplay();
	});

	// ===== Smooth back-to-top =====
	document.querySelectorAll('.back-to-top, a[href="#top"]').forEach(function (el) {
		el.addEventListener('click', function (e) {
			e.preventDefault();
			window.scrollTo({ top: 0, behavior: 'smooth' });
		});
	});

	// ===== Acessibilidade: tamanho da fonte =====
	var SCALE_KEY = 'cn_fs';
	var saved = parseFloat(localStorage.getItem(SCALE_KEY));
	if (saved && !isNaN(saved)) document.documentElement.style.setProperty('--fs', saved);

	document.querySelectorAll('[data-font]').forEach(function (btn) {
		btn.addEventListener('click', function () {
			var cur = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--fs')) || 1;
			var next = btn.dataset.font === '+' ? Math.min(cur + 0.1, 1.4)
				: btn.dataset.font === '-' ? Math.max(cur - 0.1, 0.85)
				: 1;
			document.documentElement.style.setProperty('--fs', next);
			localStorage.setItem(SCALE_KEY, next);
		});
	});

	// ===== Acessibilidade: alto contraste =====
	var HC_KEY = 'cn_hc';
	if (localStorage.getItem(HC_KEY) === '1') document.body.classList.add('hc');
	document.querySelectorAll('[data-contrast]').forEach(function (btn) {
		btn.addEventListener('click', function () {
			var on = document.body.classList.toggle('hc');
			localStorage.setItem(HC_KEY, on ? '1' : '0');
		});
	});

	// ===== Sombra ao rolar no header =====
	var header = document.querySelector('.site-header');
	if (header) {
		var onScroll = function () {
			header.classList.toggle('is-scrolled', window.scrollY > 10);
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		onScroll();
	}
})();
