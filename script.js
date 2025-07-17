// Portfolio Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY); // ✅ IMPORTANT

    // Initialize all functionality
    initNavigation();
    initThemeToggle();
    // initScrollAnimations(); 
    initSkillBars();
    initContactForm();
    // initMobileMenu();
});


// Navigation functionality
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    // Add scroll effect to navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update active navigation link
        updateActiveNavLink();
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }

            // Close mobile menu if open
            const navMenu = document.getElementById('nav-menu');
            const navToggle = document.getElementById('nav-toggle');
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Update active navigation link based on scroll position
    function updateActiveNavLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
}

// Theme toggle functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Set initial theme
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}

// Scroll animations
// function initScrollAnimations() {
//     const animatedElements = document.querySelectorAll('.section-header, .about-content, .project-card, .skill-category, .resume-content, .contact-content');
    
//     // Add fade-in class to elements
//     animatedElements.forEach(el => {
//         el.classList.add('fade-in');
//     });

//     // Intersection Observer for scroll animations
//     const observer = new IntersectionObserver((entries) => {
//         entries.forEach(entry => {
//             if (entry.isIntersecting) {
//                 entry.target.classList.add('visible');
//             }
//         });
//     }, {
//         threshold: 0.1,
//         rootMargin: '0px 0px -50px 0px'
//     });

//     animatedElements.forEach(el => {
//         observer.observe(el);
//     });

//     // Parallax effect for hero section
//     window.addEventListener('scroll', () => {
//         const scrolled = window.pageYOffset;
//         const hero = document.querySelector('.hero');
//         if (hero) {
//             hero.style.transform = `translateY(${scrolled * 0.5}px)`;
//         }
//     });
// }


// Skill bars animation
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const width = skillBar.getAttribute('data-width');
                setTimeout(() => {
                    skillBar.style.width = width + '%';
                }, 200);
            }
        });
    }, {
        threshold: 0.5
    });

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

// Contact form validation and handling
// Contact form validation and EmailJS handling
function initContactForm() {
    const form = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();

        let isValid = true;

        if (!validateName(nameInput.value)) {
            showError('name-error', 'Please enter a valid name (at least 2 characters)');
            isValid = false;
        }

        if (!validateEmail(emailInput.value)) {
            showError('email-error', 'Please enter a valid email address');
            isValid = false;
        }

        if (!validateMessage(messageInput.value)) {
            showError('message-error', 'Please enter a message (at least 10 characters)');
            isValid = false;
        }

        if (isValid) {
            emailjs.sendForm(
                EMAILJS_CONFIG.SERVICE_ID,
                EMAILJS_CONFIG.TEMPLATE_ID,
                form
            ).then(
                () => {
                    showSuccessMessage();
                    form.reset();
                },
                (error) => {
                    alert("Error sending message: " + error.text);
                }
            );
        }
    });

    // Realtime validation...
    nameInput.addEventListener('blur', () => {
        if (nameInput.value && !validateName(nameInput.value)) {
            showError('name-error', 'Please enter a valid name (at least 2 characters)');
        } else {
            clearError('name-error');
        }
    });

    emailInput.addEventListener('blur', () => {
        if (emailInput.value && !validateEmail(emailInput.value)) {
            showError('email-error', 'Please enter a valid email address');
        } else {
            clearError('email-error');
        }
    });

    messageInput.addEventListener('blur', () => {
        if (messageInput.value && !validateMessage(messageInput.value)) {
            showError('message-error', 'Please enter a message (at least 10 characters)');
        } else {
            clearError('message-error');
        }
    });

    function validateName(name) {
        return name.trim().length >= 2;
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validateMessage(message) {
        return message.trim().length >= 10;
    }

    function showError(errorId, message) {
        const errorElement = document.getElementById(errorId);
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    function clearError(errorId) {
        const errorElement = document.getElementById(errorId);
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }

    function clearErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
            element.style.display = 'none';
        });
    }

    function showSuccessMessage() {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = 'Message sent successfully!';
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 1rem 2rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
        `;
        document.body.appendChild(successDiv);

        requestAnimationFrame(() => {
            successDiv.style.opacity = 1;
        });

        setTimeout(() => {
            successDiv.style.opacity = 0;
            setTimeout(() => {
                document.body.removeChild(successDiv);
            }, 300);
        }, 3000);
    }
}
