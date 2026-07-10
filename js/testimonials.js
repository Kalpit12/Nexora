/**
 * Clone testimonial tracks for seamless CSS marquee loops.
 * Keeps initial HTML lean — duplicates are added once at runtime.
 */
function initTestimonialMarquees() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.querySelectorAll('.testimonials-scroll').forEach((scroll) => {
        const track = scroll.querySelector('.testimonials-track');
        if (!track || scroll.querySelector('.testimonials-track[aria-hidden="true"]')) {
            return;
        }

        if (!reduceMotion) {
            const clone = track.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            scroll.appendChild(clone);
            scroll.classList.add('is-ready');
        }
    });
}

initTestimonialMarquees();
