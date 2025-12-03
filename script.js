// ============================================
// Navigation Functionality
// ============================================

const navDots = document.querySelectorAll('.nav-dot');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const topNavbar = document.getElementById('topNavbar');
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");


// Update active navigation based on scroll position
function updateActiveNav() {
    let currentSection = '';
    const scrollOffset = 150; // Offset for navbar height

    sections.forEach((section) => {
        const sectionTop = section.offsetTop - scrollOffset;
        const sectionHeight = section.offsetHeight;
        const scrollPosition = window.scrollY + scrollOffset;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    // Update nav dots
    navDots.forEach((dot) => {
        dot.classList.remove('active');
        if (dot.getAttribute('data-section') === currentSection) {
            dot.classList.add('active');
        }
    });

    // Update nav links
    navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === currentSection) {
            link.classList.add('active');
        }
    });
}

// Handle navbar scroll effect
function handleNavbarScroll() {
    if (window.scrollY > 50) {
        topNavbar.classList.add('scrolled');
    } else {
        topNavbar.classList.remove('scrolled');
    }
}

// Smooth scroll function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const navHeight = topNavbar ? topNavbar.offsetHeight : 0;
    const sectionTop = section.offsetTop - navHeight - 20;

    window.scrollTo({
        top: sectionTop,
        behavior: 'smooth',
    });
}

// Smooth scroll to section when nav dot is clicked
navDots.forEach((dot) => {
    dot.addEventListener('click', () => {
        const targetSection = dot.getAttribute('data-section');
        if (targetSection) {
            scrollToSection(targetSection);
        }
    });
});

// Smooth scroll to section when nav link is clicked
navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
        const targetSection = link.getAttribute('data-section');
        const hrefTarget = link.getAttribute('href');

        if (targetSection || (hrefTarget && hrefTarget.startsWith('#'))) {
            e.preventDefault();
            const id = targetSection || hrefTarget.slice(1);
            scrollToSection(id);
        }
    });
});

// ============================================
// Scroll Animation for Sections
// ============================================

const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px',
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all sections for scroll animations
sections.forEach((section) => {
    observer.observe(section);
});

// ============================================
// Skill Bar Animation
// ============================================

function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar-fill');

    skillBars.forEach((bar) => {
        const percentage = bar.getAttribute('data-percentage');
        if (percentage && !bar.classList.contains('animated')) {
            bar.style.width = percentage + '%';
            bar.classList.add('animated');
        }
    });
}

// Observe skill bars for animation
const skillBarObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animateSkillBars();
                skillBarObserver.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.3,
    }
);

// Observe the skills section
const skillsSection = document.getElementById('skills');
if (skillsSection) {
    skillBarObserver.observe(skillsSection);
}

// ============================================
// Scroll Event Listeners
// ============================================

let ticking = false;

function onScroll() {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateActiveNav();
            handleNavbarScroll();
            ticking = false;
        });
        ticking = true;
    }
}

window.addEventListener('scroll', onScroll);
window.addEventListener('load', () => {
    updateActiveNav();
    handleNavbarScroll();
});

// ============================================
// Project Card Interactions
// ============================================

const projectCards = document.querySelectorAll('.project-card');
const projectButtons = document.querySelectorAll('.project-button');

projectButtons.forEach((button, index) => {
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        // Placeholder for project detail modal or navigation
        console.log(`Viewing details for project ${index + 1}`);
    });
});

projectCards.forEach((card) => {
    card.addEventListener('click', () => {
        const button = card.querySelector('.project-button');
        if (button) {
            button.click();
        }
    });
});

// ============================================
// Performance Optimization - Lazy load images
// ============================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach((img) => {
        imageObserver.observe(img);
    });
}

// ============================================
// Init
// ============================================

window.addEventListener('DOMContentLoaded', () => {
    updateActiveNav();
});



// Toggle menu on mobile
navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("active");
    navMenu.classList.toggle("active");
});

// Close menu when clicking a link
document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
            navToggle.classList.remove("active");
            navMenu.classList.remove("active");
        }
    });
});

// Click outside to close
document.addEventListener("click", (e) => {
    if (window.innerWidth <= 768) {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove("active");
            navToggle.classList.remove("active");
        }
    }
});

/* ============================================
   THEME TOGGLE (Light / Dark Mode)
   ============================================ */

const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    // Change icon based on mode
    if (document.body.classList.contains("dark-mode")) {
        themeIcon.textContent = "☀️"; // Light Mode icon
        localStorage.setItem("theme", "dark");
    } else {
        themeIcon.textContent = "🌙"; // Dark Mode icon
        localStorage.setItem("theme", "light");
    }
});

// Load saved theme
window.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        themeIcon.textContent = "☀️";
    }
});
