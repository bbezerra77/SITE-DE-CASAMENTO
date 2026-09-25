/* ============================================================
   INTERACTIVE SCRIPTS
   Save the Date — Isabelle & Bruno
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    initSparkleCanvas();
    initScrollAnimations();
    initCountdown();
    initScrollIndicator();
    initParallaxEffect();
});

/* ============================================================
   SPARKLE CANVAS — Floating gold particles in the background
   ============================================================ */
function initSparkleCanvas() {
    const canvas = document.getElementById('sparkle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedY = -(Math.random() * 0.3 + 0.1);
            this.speedX = (Math.random() - 0.5) * 0.2;
            this.opacity = 0;
            this.maxOpacity = Math.random() * 0.5 + 0.1;
            this.fadeSpeed = Math.random() * 0.005 + 0.002;
            this.phase = 'fadein';
            this.twinkle = Math.random() * Math.PI * 2;
            this.twinkleSpeed = Math.random() * 0.02 + 0.01;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.twinkle += this.twinkleSpeed;

            if (this.phase === 'fadein') {
                this.opacity += this.fadeSpeed;
                if (this.opacity >= this.maxOpacity) {
                    this.phase = 'visible';
                }
            } else if (this.phase === 'visible') {
                this.opacity = this.maxOpacity * (0.7 + 0.3 * Math.sin(this.twinkle));
                if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
                    this.phase = 'fadeout';
                }
            } else if (this.phase === 'fadeout') {
                this.opacity -= this.fadeSpeed * 2;
                if (this.opacity <= 0) {
                    this.reset();
                }
            }
        }

        draw() {
            if (this.opacity <= 0) return;

            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = '#c9a84c';
            ctx.shadowBlur = this.size * 4;
            ctx.shadowColor = 'rgba(201, 168, 76, 0.5)';

            // Draw a 4-pointed star
            const s = this.size;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y - s * 2);
            ctx.lineTo(this.x + s * 0.5, this.y - s * 0.5);
            ctx.lineTo(this.x + s * 2, this.y);
            ctx.lineTo(this.x + s * 0.5, this.y + s * 0.5);
            ctx.lineTo(this.x, this.y + s * 2);
            ctx.lineTo(this.x - s * 0.5, this.y + s * 0.5);
            ctx.lineTo(this.x - s * 2, this.y);
            ctx.lineTo(this.x - s * 0.5, this.y - s * 0.5);
            ctx.closePath();
            ctx.fill();

            ctx.restore();
        }
    }

    // Create initial particles
    const particleCount = Math.min(60, Math.floor(window.innerWidth / 25));
    for (let i = 0; i < particleCount; i++) {
        const p = new Particle();
        // Stagger initial phases
        p.opacity = Math.random() * p.maxOpacity;
        p.phase = 'visible';
        particles.push(p);
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        animationId = requestAnimationFrame(animate);
    }

    animate();

    // Cleanup on page hide
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animate();
        }
    });
}

/* ============================================================
   SCROLL ANIMATIONS — Intersection Observer & Dynamic Cascade
   ============================================================ */
function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay || 0, 10);
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));

    // Ensure hero elements reveal gracefully on initial page load
    window.addEventListener('load', () => {
        const heroAnimates = document.querySelectorAll('.hero .animate-on-scroll');
        heroAnimates.forEach(el => {
            const delay = parseInt(el.dataset.delay || 0, 10);
            setTimeout(() => {
                el.classList.add('visible');
            }, delay);
        });
    });
}

/* ============================================================
   COUNTDOWN TIMER — to January 13, 2029
   ============================================================ */
function initCountdown() {
    const weddingDate = new Date('2029-01-13T00:00:00-03:00');
    
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    function updateCountdown() {
        const now = new Date();
        const diff = weddingDate - now;

        if (diff <= 0) {
            daysEl.textContent = '000';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        // Animate number changes
        animateNumber(daysEl, days.toString().padStart(3, '0'));
        animateNumber(hoursEl, hours.toString().padStart(2, '0'));
        animateNumber(minutesEl, minutes.toString().padStart(2, '0'));
        animateNumber(secondsEl, seconds.toString().padStart(2, '0'));
    }

    function animateNumber(el, newValue) {
        if (el.textContent !== newValue) {
            el.style.transform = 'translateY(-5px)';
            el.style.opacity = '0.5';
            
            setTimeout(() => {
                el.textContent = newValue;
                el.style.transform = 'translateY(0)';
                el.style.opacity = '1';
            }, 150);
        }
    }

    // Add transition styles to countdown numbers
    [daysEl, hoursEl, minutesEl, secondsEl].forEach(el => {
        el.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    });

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

/* ============================================================
   SCROLL INDICATOR — hide on scroll
   ============================================================ */
function initScrollIndicator() {
    const indicator = document.getElementById('scroll-indicator');
    let hasScrolled = false;

    function checkScroll() {
        if (window.scrollY > 80 && !hasScrolled) {
            hasScrolled = true;
            indicator.classList.add('hidden');
        } else if (window.scrollY <= 80 && hasScrolled) {
            hasScrolled = false;
            indicator.classList.remove('hidden');
        }
    }

    window.addEventListener('scroll', checkScroll, { passive: true });
}

/* ============================================================
   INTERACTIVE 3D CREST TILT & PARALLAX ON MOUSE / SCROLL
   ============================================================ */
function initParallaxEffect() {
    const crest = document.getElementById('monogram-crest');
    const monogramWrapper = document.getElementById('monogram-wrapper');
    const saveTheDate = document.querySelector('.save-the-date');
    const dateDisplay = document.querySelector('.date-display');
    const messageCard = document.querySelector('.message-card');

    // 3D Tilt on Desktop Mouse Movement
    if (window.matchMedia('(hover: hover)').matches) {
        let mouseX = 0;
        let mouseY = 0;
        let targetTiltX = 0;
        let targetTiltY = 0;

        window.addEventListener('mousemove', (e) => {
            if (!crest) return;
            const rect = crest.getBoundingClientRect();
            const crestCenterX = rect.left + rect.width / 2;
            const crestCenterY = rect.top + rect.height / 2;

            // Normalized distance from center (-1 to 1)
            const deltaX = (e.clientX - crestCenterX) / (window.innerWidth / 2);
            const deltaY = (e.clientY - crestCenterY) / (window.innerHeight / 2);

            const maxTilt = 10;
            mouseX = Math.max(-1, Math.min(1, deltaX));
            mouseY = Math.max(-1, Math.min(1, deltaY));

            targetTiltY = mouseX * maxTilt;
            targetTiltX = -mouseY * maxTilt;

            requestAnimationFrame(() => {
                if (crest) {
                    crest.style.transform = `perspective(850px) rotateX(${targetTiltX.toFixed(2)}deg) rotateY(${targetTiltY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
                }
                if (saveTheDate) {
                    saveTheDate.style.transform = `translate(${mouseX * 5}px, ${mouseY * 4}px)`;
                }
                if (dateDisplay) {
                    dateDisplay.style.transform = `translate(${mouseX * 7}px, ${mouseY * 5}px)`;
                }
            });
        });

        // Smooth reset when mouse leaves window
        window.addEventListener('mouseleave', () => {
            if (crest) {
                crest.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                crest.style.transform = 'perspective(850px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
                setTimeout(() => { if (crest) crest.style.transition = ''; }, 800);
            }
            if (saveTheDate) {
                saveTheDate.style.transition = 'transform 0.8s ease';
                saveTheDate.style.transform = 'translate(0, 0)';
                setTimeout(() => { if (saveTheDate) saveTheDate.style.transition = ''; }, 800);
            }
            if (dateDisplay) {
                dateDisplay.style.transition = 'transform 0.8s ease';
                dateDisplay.style.transform = 'translate(0, 0)';
                setTimeout(() => { if (dateDisplay) dateDisplay.style.transition = ''; }, 800);
            }
        });
    }

    // Scroll depth parallax: subtly shifts layers as the mouse wheel scrolls
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        
        requestAnimationFrame(() => {
            if (monogramWrapper && scrolled < 750) {
                monogramWrapper.style.transform = `translateY(${scrolled * 0.1}px)`;
            }
            if (messageCard) {
                const cardRect = messageCard.getBoundingClientRect();
                if (cardRect.top < window.innerHeight && cardRect.bottom > 0) {
                    const offset = (window.innerHeight / 2 - (cardRect.top + cardRect.height / 2)) * 0.035;
                    messageCard.style.transform = `translateY(${offset}px)`;
                }
            }
        });
    }, { passive: true });
}
