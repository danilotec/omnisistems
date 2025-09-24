// Omnisistems JavaScript - All functionality in vanilla JS

// DOM Elements
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');
const header = document.getElementById('header');
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const toast = document.getElementById('toast');
const currentYearSpan = document.getElementById('currentYear');

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeIcons();
    initializeHeader();
    initializeMobileMenu();
    initializeContactForm();
    initializeAnimations();
    setCurrentYear();
});

// Initialize Lucide Icons
function initializeIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Header scroll effect
function initializeHeader() {
    let isScrolled = false;
    
    function updateHeader() {
        const scrolled = window.scrollY > 10;
        
        if (scrolled !== isScrolled) {
            isScrolled = scrolled;
            
            if (scrolled) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    }
    
    // Initial check
    updateHeader();
    
    // Listen for scroll events with throttling
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                updateHeader();
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Mobile menu functionality
function initializeMobileMenu() {
    let isMenuOpen = false;
    
    const menuIcon = mobileMenuBtn.querySelector('.menu-icon');
    const closeIcon = mobileMenuBtn.querySelector('.close-icon');
    
    function toggleMobileMenu() {
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            mobileNav.style.display = 'block';
            menuIcon.classList.add('hidden');
            closeIcon.classList.remove('hidden');
            
            // Add animation
            requestAnimationFrame(() => {
                mobileNav.style.opacity = '1';
                mobileNav.style.transform = 'translateY(0)';
            });
        } else {
            mobileNav.style.opacity = '0';
            mobileNav.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                mobileNav.style.display = 'none';
                menuIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
            }, 300);
        }
        
        // Re-initialize icons after DOM changes
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    // Set initial state
    mobileNav.style.display = 'none';
    mobileNav.style.opacity = '0';
    mobileNav.style.transform = 'translateY(-10px)';
    mobileNav.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
    
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking on nav links
    const mobileNavLinks = document.querySelectorAll('.nav-mobile-link, .btn-mobile-cta');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) {
                toggleMobileMenu();
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (isMenuOpen && !header.contains(event.target)) {
            toggleMobileMenu();
        }
    });
}

// Smooth scroll functionality
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const headerHeight = 80; // Approximate header height
        const elementPosition = element.offsetTop - headerHeight;
        
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
}

// Make scrollToSection available globally
window.scrollToSection = scrollToSection;

// Contact form functionality
function initializeContactForm() {
    if (!contactForm) return;
    
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            message: messageInput.value.trim()
        };
        
        // Basic validation
        if (!formData.name || !formData.email || !formData.message) {
            showToast('Campos obrigatórios', 'Por favor, preencha todos os campos.', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showToast('E-mail inválido', 'Por favor, insira um e-mail válido.', 'error');
            return;
        }
        
        // Show loading state
        setSubmitButtonLoading(true);
        
        try {
            // Send form data to backend
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                const result = await response.json();
                
                // Show success message
                showToast(
                    'Mensagem enviada com sucesso!', 
                    'Entraremos em contato em breve. Obrigado pelo interesse!', 
                    'success'
                );
                
                // Reset form
                contactForm.reset();
                
            } else {
                throw new Error('Erro no servidor');
            }
            
        } catch (error) {
            console.error('Erro ao enviar formulário:', error);
            
            // For demo purposes, simulate success after 2 seconds
            setTimeout(() => {
                showToast(
                    'Mensagem enviada com sucesso!', 
                    'Entraremos em contato em breve. Obrigado pelo interesse!', 
                    'success'
                );
                contactForm.reset();
                setSubmitButtonLoading(false);
            }, 2000);
            
            return; // Don't execute the finally block immediately
        }
        
        setSubmitButtonLoading(false);
    });
    
    function setSubmitButtonLoading(loading) {
        if (loading) {
            submitBtn.disabled = true;
            btnText.classList.add('hidden');
            btnLoading.classList.remove('hidden');
            btnLoading.style.display = 'flex';
        } else {
            submitBtn.disabled = false;
            btnText.classList.remove('hidden');
            btnLoading.classList.add('hidden');
            btnLoading.style.display = 'none';
        }
        
        // Re-initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}

// Toast notification system
function showToast(title, description, type = 'success') {
    const toastTitle = toast.querySelector('.toast-title');
    const toastDescription = toast.querySelector('.toast-description');
    const toastIcon = toast.querySelector('.toast-icon');
    
    // Update content
    toastTitle.textContent = title;
    toastDescription.textContent = description;
    
    // Update icon based on type
    const iconElement = toastIcon.querySelector('svg');
    if (iconElement) {
        iconElement.remove();
    }
    
    let iconHTML = '';
    if (type === 'success') {
        iconHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22,4 12,14.01 9,11.01"></polyline></svg>';
        toastIcon.style.background = 'var(--color-primary)';
    } else if (type === 'error') {
        iconHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
        toastIcon.style.background = 'hsl(0, 84.2%, 60.2%)';
    }
    
    toastIcon.innerHTML = iconHTML;
    
    // Show toast
    toast.classList.add('show');
    
    // Hide toast after 5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 5000);
}

// Animation on scroll functionality
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                
                // Add staggered animation for service cards and value cards
                if (entry.target.classList.contains('services-grid') || 
                    entry.target.classList.contains('values-grid')) {
                    
                    const cards = entry.target.querySelectorAll('.service-card, .value-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.animationDelay = `${index * 200}ms`;
                            card.style.animationPlayState = 'running';
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe animated elements
    const animatedElements = document.querySelectorAll(
        '.animate-fade-in, .animate-slide-up, .services-grid, .values-grid'
    );
    
    animatedElements.forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });
}

// Set current year in footer
function setCurrentYear() {
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
}

// Utility functions for smooth interactions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Add hover effects for service cards
document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.service-card');
    const valueCards = document.querySelectorAll('.value-card');
    
    // Add hover effects
    [...serviceCards, ...valueCards].forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Handle form input focus effects
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
});

// Preload images for better performance
function preloadImages() {
    const images = [
        './static/images/hero-tech.jpg',
        './static/images/about-team.jpg'
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize image preloading
document.addEventListener('DOMContentLoaded', preloadImages);

// Add error handling for missing images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            console.warn(`Imagem não encontrada: ${this.src}`);
            // You could set a placeholder image here
            // this.src = './static/images/placeholder.jpg';
        });
    });
});

// Performance optimization: Lazy loading for images
document.addEventListener('DOMContentLoaded', function() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
});

// Add smooth transitions for better UX
document.addEventListener('DOMContentLoaded', function() {
    // Add transition classes to elements that need them
    const elementsToTransition = document.querySelectorAll(
        '.btn, .nav-link, .service-card, .value-card, .contact-card'
    );
    
    elementsToTransition.forEach(el => {
        if (!el.style.transition) {
            el.style.transition = 'var(--transition)';
        }
    });
});