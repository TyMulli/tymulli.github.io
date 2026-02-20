(function () {
    'use strict';

    /* ── DOM References ──────────────────────────────────────── */
    const header       = document.getElementById('header');
    const navbarToggle = document.getElementById('navbarToggle');
    const navbarMenu   = document.getElementById('navbarMenu');
    const navLinks     = document.querySelectorAll('.navbar__link');
    const sections     = document.querySelectorAll('section[id]');
    const contactForm  = document.getElementById('contactForm');
    const formSuccess  = document.getElementById('formSuccess');

    /* ── Scroll: header shadow + active nav link ─────────────── */
    function onScroll() {
        // Header shadow on scroll
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Highlight active nav link
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === '#' + current || (current === 'hero' && href === '#hero')) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run on load

    /* ── Mobile nav toggle ───────────────────────────────────── */
    navbarToggle.addEventListener('click', () => {
        const isOpen = navbarMenu.classList.toggle('open');
        navbarToggle.classList.toggle('open', isOpen);
        navbarToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile nav when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navbarMenu.classList.remove('open');
            navbarToggle.classList.remove('open');
            navbarToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Close mobile nav on outside click
    document.addEventListener('click', (e) => {
        if (!header.contains(e.target)) {
            navbarMenu.classList.remove('open');
            navbarToggle.classList.remove('open');
        }
    });

    /* ── Contact form: async Formspree submission ────────────── */
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

            try {
                const data = new FormData(contactForm);
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    contactForm.reset();
                    if (formSuccess) {
                        formSuccess.style.display = 'flex';
                        setTimeout(() => { formSuccess.style.display = 'none'; }, 6000);
                    }
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (err) {
                alert('There was an error sending your message. Please try again or reach out via LinkedIn.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }

    /* ── Scroll-reveal animation ─────────────────────────────── */
    const revealElements = document.querySelectorAll(
        '.highlight, .timeline__card, .cert-card, .skill-category, .edu-card, .stat'
    );

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        revealObserver.observe(el);
    });

    /* ── Stat counter animation ──────────────────────────────── */
    const statNumbers = document.querySelectorAll('.stat__number');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const text = el.textContent;
                const num = parseInt(text);
                const suffix = text.replace(/[0-9]/g, '');

                if (!isNaN(num)) {
                    let start = 0;
                    const duration = 1200;
                    const step = Math.ceil(num / (duration / 16));
                    const timer = setInterval(() => {
                        start = Math.min(start + step, num);
                        el.textContent = start + suffix;
                        if (start >= num) clearInterval(timer);
                    }, 16);
                }
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));

})();

/* ============================================================
   KONAMI CODE EASTER EGG
   ============================================================ */
(function() {
    const konamiCode = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'b', 'a'
    ];
    let konamiIndex = 0;
    let konamiActivated = false;

    document.addEventListener('keydown', function(e) {
        const key = e.key.toLowerCase();
        const expectedKey = konamiCode[konamiIndex].toLowerCase();
        
        if (key === expectedKey || e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateKonamiMode();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    function activateKonamiMode() {
        if (konamiActivated) {
            deactivateKonamiMode();
            return;
        }
        
        konamiActivated = true;
        createConfetti();
        showKonamiNotification();
        document.body.classList.add('konami-mode');
        createMatrixEffect();
    }

    function deactivateKonamiMode() {
        konamiActivated = false;
        document.body.classList.remove('konami-mode');
        const matrix = document.getElementById('matrix-canvas');
        if (matrix) matrix.remove();
    }

    function showKonamiNotification() {
        const notification = document.createElement('div');
        notification.className = 'konami-notification';
        notification.innerHTML = `
            <div class="konami-notification__content">
                <div class="konami-notification__icon">🎮</div>
                <div class="konami-notification__text">
                    <strong>KONAMI CODE ACTIVATED!</strong>
                    <p>Gaming mode enabled • Matrix effect active</p>
                </div>
            </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    }

    function createConfetti() {
        const colors = ['#2a9d8f', '#264653', '#e9c46a', '#f4a261', '#e76f51'];
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
                document.body.appendChild(confetti);
                setTimeout(() => confetti.remove(), 4000);
            }, i * 30);
        }
    }

    function createMatrixEffect() {
        const canvas = document.createElement('canvas');
        canvas.id = 'matrix-canvas';
        Object.assign(canvas.style, {
            position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
            pointerEvents: 'none', zIndex: '0', opacity: '0.2'
        });
        document.body.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);
        
        function draw() {
            if (!konamiActivated) return;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#14b8a6';
            ctx.font = fontSize + 'px monospace';
            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            }
            requestAnimationFrame(draw);
        }
        draw();
    }
})();
