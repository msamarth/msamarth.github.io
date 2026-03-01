// Premium Interactions & Magic Effects

// 1. Custom Smooth Cursor
const initCustomCursor = () => {
    const cursor = document.getElementById('custom-cursor');
    if (!cursor) return;

    // Use requestAnimationFrame for smoother following
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const animateCursor = () => {
        // Smooth interpolation (easing)
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;

        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
        requestAnimationFrame(animateCursor);
    };

    requestAnimationFrame(animateCursor);

    // Expand cursor on interactive elements
    const interactives = document.querySelectorAll('a, button, .card');
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('active'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });
};

// 2. 3D Tilt Effect and Dynamic Glow on Cards
const init3DCardEffects = () => {
    const cards = document.querySelectorAll('.tilt-card');

    cards.forEach(card => {
        const glow = card.querySelector('.card-glow');
        let rect = null;
        let isHovered = false;
        let mouseX = 0;
        let mouseY = 0;
        let rafId = null;

        const updateTransform = () => {
            if (!isHovered) return;

            const x = mouseX - rect.left;
            const y = mouseY - rect.top;

            // Move glow
            if (glow) {
                glow.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
            }

            // Calculate 3D rotation based on mouse position relative to center
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -5; // Max rotation 5deg
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            rafId = null;
        };

        card.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (!rafId && rect && isHovered) {
                rafId = requestAnimationFrame(updateTransform);
            }
        }, { passive: true });

        card.addEventListener('mouseleave', () => {
            isHovered = false;
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
            // Reset transforms with a smooth transition
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
            if (glow) {
                glow.style.opacity = '0';
            }
        });

        card.addEventListener('mouseenter', () => {
            // Cache rect on enter to avoid reflow on every mousemove
            rect = card.getBoundingClientRect();
            isHovered = true;
            // Remove transition on enter so it tracks mouse instantly
            card.style.transition = 'transform 0.1s ease-out';
            if (glow) {
                glow.style.opacity = '1';
            }
        });
    });
};

// 3. Header scroll effect
const initHeader = () => {
    const header = document.querySelector('.header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });
};

// 4. Reveal Animations on Scroll
const initScrollAnimations = () => {
    const faders = document.querySelectorAll('.fade-in');

    const appearOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                // Optional: unobserve to only animate once, or keep observing to animate repeatedly
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });
};

// 5. Circle chart animation
const animateCircle = () => {
    const circle = document.querySelector('.circle');

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && circle) {
            setTimeout(() => {
                circle.style.transition = "stroke-dasharray 2s cubic-bezier(0.19, 1, 0.22, 1)";
                circle.style.strokeDasharray = "100, 100";
            }, 300); // Wait for card reveal
            observer.disconnect();
        }
    });

    if (circle) {
        observer.observe(circle);
    }
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Only init custom cursor on non-touch devices
    if (window.matchMedia("(pointer: fine)").matches) {
        initCustomCursor();
        init3DCardEffects();
    }
    initHeader();
    initScrollAnimations();
    animateCircle();
});
