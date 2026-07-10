// Initialize Lenis Smooth Scroll
let lenis;

function initLenis() {
    if (typeof Lenis === 'undefined') {
        console.warn('Lenis library not loaded. Falling back to native smooth scroll.');
        return;
    }

    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    
    // Expose for nested UI (chatbot) that needs native scroll
    window.lenis = lenis;

    // Setup scroll event handlers after Lenis is initialized
    setupScrollHandlers();
}

// Initialize Lenis when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Wait a bit for Lenis script to load
        setTimeout(initLenis, 100);
    });
} else {
    setTimeout(initLenis, 100);
}

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const megaItem = document.querySelector('.nav-item.has-mega');
const megaTrigger = document.querySelector('.nav-mega-trigger');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
        if (!navLinks.classList.contains('active') && megaItem) {
            megaItem.classList.remove('is-open');
            if (megaTrigger) megaTrigger.setAttribute('aria-expanded', 'false');
        }
    });
}

if (megaTrigger && megaItem) {
    megaTrigger.addEventListener('click', (e) => {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        if (!isMobile) {
            // Desktop: jump to services section
            const target = document.querySelector('#services');
            if (target && typeof lenis !== 'undefined' && lenis) {
                e.preventDefault();
                const navHeight = document.querySelector('nav').offsetHeight;
                lenis.scrollTo(target.offsetTop - navHeight, {
                    duration: 1.2,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                });
            } else if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
            return;
        }
        e.preventDefault();
        const open = megaItem.classList.toggle('is-open');
        megaTrigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    document.addEventListener('click', (e) => {
        if (!megaItem.contains(e.target)) {
            megaItem.classList.remove('is-open');
            megaTrigger.setAttribute('aria-expanded', 'false');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            megaItem.classList.remove('is-open');
            megaTrigger.setAttribute('aria-expanded', 'false');
        }
    });
}

// Close mobile menu when clicking on a link (not the mega trigger)
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        if (megaItem) {
            megaItem.classList.remove('is-open');
            if (megaTrigger) megaTrigger.setAttribute('aria-expanded', 'false');
        }
    });
});

// Smooth scrolling for anchor links (using Lenis)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target && lenis) {
            const navHeight = document.querySelector('nav').offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            lenis.scrollTo(targetPosition, {
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                offset: -navHeight
            });
        }
    });
});

// Setup scroll handlers (called after Lenis initialization)
function setupScrollHandlers() {
    // Navbar scroll effect
    let lastScroll = 0;
    const nav = document.querySelector('nav');

    function updateNavbarOnScroll(scroll) {
        if (scroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        // Add active class to nav links based on scroll position
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scroll > sectionTop && scroll <= sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
        
        lastScroll = scroll;
    }

    // Use Lenis scroll event if available, otherwise fallback to window scroll
    if (lenis) {
        lenis.on('scroll', ({ scroll }) => {
            updateNavbarOnScroll(scroll);
        });
    } else {
        window.addEventListener('scroll', () => {
            updateNavbarOnScroll(window.pageYOffset);
        });
    }

    // Motion 3 replaced by DarkVeil WebGL background (see js/darkVeil.js)
    function updateParallax() {
        /* no-op — hero depth is handled by DarkVeil */
    }

    // Use Lenis scroll event if available, otherwise fallback to window scroll
    if (lenis) {
        lenis.on('scroll', ({ scroll }) => {
            updateParallax(scroll);
        });
    } else {
        window.addEventListener('scroll', () => {
            updateParallax(window.pageYOffset);
        });
    }
}

// Fallback: Setup scroll handlers immediately if Lenis fails to load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            if (!lenis) {
                setupScrollHandlers();
            }
        }, 500);
    });
} else {
    setTimeout(() => {
        if (!lenis) {
            setupScrollHandlers();
        }
    }, 500);
}

// Counter Animation
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + (element.dataset.suffix || '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + (element.dataset.suffix || '');
        }
    }, 16);
}

// Intersection Observer for counter animation
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            const target = parseInt(entry.target.getAttribute('data-target'));
            animateCounter(entry.target, target);
            entry.target.classList.add('counted');
        }
    });
}, {
    threshold: 0.5
});

// Observe all counter elements
document.querySelectorAll('.stat-number, .stat-value').forEach(counter => {
    if (counter.getAttribute('data-target')) {
        counterObserver.observe(counter);
    }
});

// Portfolio Filter
const filterButtons = document.querySelectorAll('.portfolio-filter button');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        
        portfolioItems.forEach((item, index) => {
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                setTimeout(() => {
                    item.style.display = 'block';
                    item.style.animation = 'fadeIn 0.5s ease-out';
                }, index * 100);
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Contact Form Submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    const interestSelect = contactForm.querySelector('#contactInterest');
    const budgetSelect = contactForm.querySelector('#contactBudget');
    const subjectInput = contactForm.querySelector('#contactSubject');

    document.querySelectorAll('.contact-plan-link').forEach((link) => {
        link.addEventListener('click', () => {
            const interest = link.getAttribute('data-interest');
            const budget = link.getAttribute('data-budget');
            if (interestSelect && interest) interestSelect.value = interest;
            if (budgetSelect && budget) budgetSelect.value = budget;
            if (subjectInput && interest) {
                subjectInput.value = `Inquiry: ${interest}`;
            }
        });
    });

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        const name = contactForm.querySelector('input[name="name"]').value.trim();
        const email = contactForm.querySelector('input[name="email"]').value.trim();
        const interest = interestSelect ? interestSelect.value : '';
        const budget = budgetSelect ? budgetSelect.value : '';
        const message = contactForm.querySelector('textarea[name="message"]').value.trim();

        if (subjectInput) {
            subjectInput.value = interest ? `Inquiry: ${interest}` : 'New project inquiry';
        }
        
        const formData = {
            name,
            email,
            interest,
            budget,
            message,
            subject: subjectInput ? subjectInput.value : 'New project inquiry'
        };
        
        try {
            const response = await fetch('https://formspree.io/f/mvzjyddy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                submitButton.textContent = 'Inquiry sent';
                submitButton.style.background = 'var(--primary-color)';
                contactForm.reset();
                
                setTimeout(() => {
                    submitButton.textContent = originalText;
                    submitButton.style.background = '';
                    submitButton.disabled = false;
                }, 3000);
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            submitButton.textContent = 'Try again';
            submitButton.style.background = '#dc2626';
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.style.background = '';
                submitButton.disabled = false;
            }, 3000);
        }
    });
}

// Newsletter Form Submission
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        const button = newsletterForm.querySelector('button');
        const originalHTML = button.innerHTML;
        
        // Validate email
        if (!email) {
            alert('Please enter your email address.');
            return;
        }
        
        // Show loading state
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        button.disabled = true;
        
        try {
            const response = await fetch('/api/newsletter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                button.innerHTML = '<i class="fas fa-check"></i>';
                button.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                newsletterForm.reset();
                
                // Show success message
                setTimeout(() => {
                    alert(data.message || 'Thank you for subscribing! Check your email for a welcome message.');
                    button.innerHTML = originalHTML;
                    button.style.background = '';
                    button.disabled = false;
                }, 2000);
            } else {
                throw new Error(data.error || 'Failed to subscribe');
            }
        } catch (error) {
            console.error('Newsletter subscription error:', error);
            button.innerHTML = '<i class="fas fa-times"></i>';
            button.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
            
            setTimeout(() => {
                alert(error.message || 'Failed to subscribe. Please try again.');
                button.innerHTML = originalHTML;
                button.style.background = '';
                button.disabled = false;
            }, 2000);
        }
    });
}

// Motion 2: scroll reveals that support hierarchy
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.14,
    rootMargin: '0px 0px -48px 0px'
});

function initReveals() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const groups = [
        '.capabilities-list > .capability-item',
        '.portfolio-grid > .portfolio-item',
        '.principles-list > .principle-item',
        '.closing-cta-inner',
        '.contact-form'
    ];

    groups.forEach((selector) => {
        document.querySelectorAll(selector).forEach((el, index) => {
            el.classList.add('reveal');
            if (el.parentElement) {
                el.parentElement.classList.add('reveal-stagger');
            }
            if (reduceMotion) {
                el.classList.add('is-visible');
                return;
            }
            el.style.transitionDelay = `${Math.min(index, 4) * 0.06}s`;
            revealObserver.observe(el);
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReveals);
} else {
    initReveals();
}

// Typing effect for hero title (optional enhancement)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// FAQ uses native <details> — no custom accordion needed

document.addEventListener('DOMContentLoaded', () => {
    // Consultation Form Handler
    const consultationForm = document.getElementById('consultationForm');
    
    if (consultationForm) {
        consultationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitButton = consultationForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            // Get form data
            const formData = {
                name: consultationForm.querySelector('input[type="text"]').value.trim(),
                email: consultationForm.querySelector('input[type="email"]').value.trim(),
                phone: consultationForm.querySelector('input[type="tel"]').value.trim(),
                projectType: consultationForm.querySelector('select').value,
                message: consultationForm.querySelector('textarea').value.trim()
            };
            
            // Validate required fields
            if (!formData.name || !formData.email || !formData.phone || !formData.projectType || !formData.message) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Show loading state
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            try {
                const response = await fetch('/api/consultation', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
                
                const data = await response.json();
                
                if (response.ok && data.success) {
                    submitButton.textContent = '✓ Request Sent!';
                    submitButton.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                    consultationForm.reset();
                    
                    setTimeout(() => {
                        submitButton.textContent = originalText;
                        submitButton.style.background = '';
                        submitButton.disabled = false;
                    }, 3000);
                } else {
                    throw new Error(data.error || 'Failed to send request');
                }
            } catch (error) {
                console.error('Consultation form error:', error);
                submitButton.textContent = '✗ Error - Try Again';
                submitButton.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                
                setTimeout(() => {
                    submitButton.textContent = originalText;
                    submitButton.style.background = '';
                    submitButton.disabled = false;
                }, 3000);
            }
        });
    }
    
    // Lead Magnet Form Handler
    const leadMagnetForm = document.getElementById('leadMagnetForm');
    
    if (leadMagnetForm) {
        leadMagnetForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitButton = leadMagnetForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            const nameInput = leadMagnetForm.querySelector('input[type="text"]');
            const emailInput = leadMagnetForm.querySelector('input[type="email"]');
            const companyInput = leadMagnetForm.querySelectorAll('input[type="text"]')[2];
            
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const company = companyInput ? companyInput.value.trim() : '';
            
            // Remove any existing error messages
            const existingError = leadMagnetForm.querySelector('.lead-error-message');
            if (existingError) {
                existingError.remove();
            }
            
            // Show loading state
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            submitButton.disabled = true;
            
            try {
                // Send request to backend
                const response = await fetch('/api/lead-magnet', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        company: company
                    })
                });
                
                const data = await response.json();
                
                if (response.ok && data.success) {
                    // Success
                    submitButton.innerHTML = '<i class="fas fa-check"></i> Check Your Email!';
                    submitButton.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                    
                    // Show success message
                    const successMsg = document.createElement('div');
                    successMsg.className = 'lead-success-message';
                    successMsg.innerHTML = '<i class="fas fa-check-circle"></i> Check your email! We\'ve sent the checklist to ' + email;
                    leadMagnetForm.appendChild(successMsg);
                    
                    // Optional: Trigger direct download if URL provided
                    if (data.downloadUrl) {
                        // You can add a direct download link here if needed
                        // window.open(data.downloadUrl, '_blank');
                    }
                    
                    leadMagnetForm.reset();
                    
                    setTimeout(() => {
                        submitButton.innerHTML = originalText;
                        submitButton.style.background = '';
                        submitButton.disabled = false;
                        if (successMsg.parentNode) {
                            successMsg.remove();
                        }
                    }, 8000);
                } else {
                    // Error from server
                    throw new Error(data.error || 'Failed to process your request');
                }
            } catch (error) {
                console.error('Lead magnet error:', error);
                
                // Show error message
                const errorMsg = document.createElement('div');
                errorMsg.className = 'lead-error-message';
                errorMsg.innerHTML = '<i class="fas fa-exclamation-circle"></i> ' + error.message;
                leadMagnetForm.appendChild(errorMsg);
                
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                
                // Remove error message after 5 seconds
                setTimeout(() => {
                    if (errorMsg.parentNode) {
                        errorMsg.remove();
                    }
                }, 5000);
            }
        });
    }
    
    // Cost Calculator Functionality
    const costCalculatorForm = document.getElementById('costCalculatorForm');
    if (costCalculatorForm) {
        costCalculatorForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const projectType = document.getElementById('projectType').value;
            const pageCount = parseInt(document.getElementById('pageCount').value) || 5;
            const designComplexity = document.getElementById('designComplexity').value;
            const hasSeo = document.getElementById('featureSeo').checked;
            const hasCms = document.getElementById('featureCms').checked;
            const hasPayment = document.getElementById('featurePayment').checked;
            const hasAnalytics = document.getElementById('featureAnalytics').checked;
            
            // Base prices (in KES)
            const basePrices = {
                website: 50000,
                webapp: 120000,
                ecommerce: 150000,
                redesign: 80000,
                jobportal: 180000,
                eventsplatform: 220000,
                leadautomation: 200000,
                skincareecommerce: 170000,
                custom: 200000
            };
            
            // Complexity multipliers
            const complexityMultipliers = {
                simple: 0.8,
                moderate: 1.0,
                complex: 1.5
            };
            
            // Feature prices
            const featurePrices = {
                seo: 15000,
                cms: 20000,
                payment: 25000,
                analytics: 5000
            };
            
            // Calculate base cost
            let baseCost = basePrices[projectType] || 100000;
            
            // Apply page/feature multiplier (for webapp and custom)
            if (projectType === 'webapp' || projectType === 'custom') {
                baseCost += (pageCount - 5) * 10000;
            } else {
                baseCost += (pageCount - 5) * 3000;
            }
            
            // Apply complexity multiplier
            baseCost *= complexityMultipliers[designComplexity] || 1.0;
            
            // Add feature costs
            if (hasSeo) baseCost += featurePrices.seo;
            if (hasCms) baseCost += featurePrices.cms;
            if (hasPayment) baseCost += featurePrices.payment;
            if (hasAnalytics) baseCost += featurePrices.analytics;
            
            // Round to nearest 1000
            const estimatedCost = Math.round(baseCost / 1000) * 1000;
            
            // Display result
            const resultDiv = document.getElementById('calculatorResult');
            const amountSpan = document.getElementById('estimatedAmount');
            
            amountSpan.textContent = estimatedCost.toLocaleString('en-KE');
            resultDiv.style.display = 'block';
            
            // Smooth scroll to result
            resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }
});
