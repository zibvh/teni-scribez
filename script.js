// Main JavaScript for Teni Scribes Website

// DOM Elements
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
const themeToggle = document.getElementById('themeToggle');
const darkModeStyle = document.getElementById('dark-mode-style');
const videoShareBtn = document.getElementById('video-share');
const currentYearSpan = document.getElementById('currentYear');

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
    
    // Initialize mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Initialize dark mode toggle
    if (themeToggle) {
        // Check for saved theme preference or respect OS preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            enableDarkMode();
        }
        
        themeToggle.addEventListener('click', toggleDarkMode);
    }
    
    // Initialize forms - NEW: Handle both newsletter and contact forms
    const newsletterForm = document.querySelector('form[name="newsletter"]');
    const contactForm = document.querySelector('form[name="contact"]');
    
    // Initialize newsletter form if it exists
    if (newsletterForm) {
        // Remove any existing event listeners to prevent duplicates
        newsletterForm.removeEventListener('submit', handleNewsletterSubmit);
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
    
    // Initialize contact form if it exists
    if (contactForm) {
        // Remove any existing event listeners to prevent duplicates
        contactForm.removeEventListener('submit', handleContactSubmit);
        contactForm.addEventListener('submit', handleContactSubmit);
    }
    
    // Initialize video share button
    if (videoShareBtn) {
        videoShareBtn.addEventListener('click', shareVideo);
    }
    
    // Close mobile menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });
    
    // Add active class to current page in navigation
    highlightCurrentPage();
    
    // Initialize lazy loading for images
    initLazyLoading();
    
    // Add scroll effect to header
    window.addEventListener('scroll', handleHeaderScroll);
});

// Mobile Menu Toggle
function toggleMobileMenu() {
    menuToggle.classList.toggle('active');
    mainNav.classList.toggle('active');
    
    // Animate hamburger menu
    const spans = menuToggle.querySelectorAll('span');
    if (menuToggle.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
}

// Dark Mode Toggle
function toggleDarkMode() {
    if (document.body.classList.contains('dark-mode')) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
}

function enableDarkMode() {
    document.body.classList.add('dark-mode');
    darkModeStyle.disabled = false;
    localStorage.setItem('theme', 'dark');
}

function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    darkModeStyle.disabled = true;
    localStorage.setItem('theme', 'light');
}

// Newsletter Form Handler - UPDATED
function handleNewsletterSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const form = e.target;
    const formData = new FormData(form);
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
    submitBtn.disabled = true;
    
    // For demo/fallback purposes
    console.log('Newsletter signup data:', Object.fromEntries(formData));
    
    // In a real Netlify deployment, the form will submit automatically
    // We're just adding some visual feedback here
    
    // Simulate submission delay for better UX
    setTimeout(() => {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success message if we have one on the page
        const successMessage = form.nextElementSibling;
        if (successMessage && successMessage.classList.contains('form-success')) {
            form.style.display = 'none';
            successMessage.style.display = 'flex';
        }
        
        // Clear form
        form.reset();
        
        // Log for debugging
        console.log('Newsletter subscription processed');
        
        // Netlify will handle the actual submission
        // No need to prevent default since Netlify forms work with normal form submission
        
    }, 1500);
}

// Contact Form Handler - NEW FUNCTION
function handleContactSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const form = e.target;
    const formData = new FormData(form);
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // For demo/fallback purposes
    console.log('Contact form data:', Object.fromEntries(formData));
    
    // Simulate submission delay for better UX
    setTimeout(() => {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Create success message if not present
        let successMessage = form.nextElementSibling;
        if (!successMessage || !successMessage.classList.contains('form-success')) {
            successMessage = document.createElement('div');
            successMessage.className = 'form-success';
            successMessage.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <p>Thank you for your message! I'll get back to you soon.</p>
            `;
            form.parentNode.insertBefore(successMessage, form.nextSibling);
        }
        
        // Show success message
        successMessage.style.display = 'flex';
        
        // Clear form
        form.reset();
        
        // Log for debugging
        console.log('Contact form submission processed');
        
        // Scroll to show success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
    }, 1500);
}

// Video Share Functionality
function shareVideo() {
    const videoTitle = document.getElementById('video-title').textContent;
    const pageUrl = window.location.href;
    
    if (navigator.share) {
        // Use Web Share API if available
        navigator.share({
            title: videoTitle,
            text: `Check out this video from Teni Scribes: ${videoTitle}`,
            url: pageUrl,
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing:', error));
    } else {
        // Fallback: copy to clipboard
        const shareText = `${videoTitle} - ${pageUrl}`;
        navigator.clipboard.writeText(shareText)
            .then(() => {
                // Show a temporary notification
                const originalText = videoShareBtn.innerHTML;
                videoShareBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                videoShareBtn.classList.add('btn-success');
                setTimeout(() => {
                    videoShareBtn.innerHTML = originalText;
                    videoShareBtn.classList.remove('btn-success');
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                // Fallback to opening a new window with share URLs
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(videoTitle)}&url=${encodeURIComponent(pageUrl)}`, '_blank');
            });
    }
}

// Highlight Current Page in Navigation
function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        
        // Remove active class from all links
        link.classList.remove('active');
        
        // Check if this link matches the current page
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html') ||
            (linkHref.includes(currentPage.replace('.html', '')) && !linkHref.startsWith('#'))) {
            link.classList.add('active');
        }
    });
}

// Lazy Loading for Images
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

// Header Scroll Effect
function handleHeaderScroll() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// Add CSS for scrolled header and other dynamic styles
const style = document.createElement('style');
style.textContent = `
    .header.scrolled {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    img[data-src] {
        opacity: 0;
        transition: opacity 0.3s;
    }
    
    img.loaded {
        opacity: 1;
    }
    
    .btn-success {
        background-color: var(--color-secondary) !important;
        border-color: var(--color-secondary) !important;
        color: white !important;
    }
    
    .fa-spinner {
        margin-right: 8px;
    }
    
    .form-success {
        display: none;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: var(--space-xl) var(--space-md);
        color: var(--color-secondary);
        background-color: rgba(46, 139, 87, 0.1);
        border-radius: var(--radius-lg);
        margin-top: var(--space-md);
    }
    
    .form-success i {
        font-size: 3rem;
        margin-bottom: var(--space-md);
    }
    
    .form-success p {
        font-size: 1.1rem;
        margin-bottom: 0;
    }
    
    .dark-mode .form-success {
        background-color: rgba(46, 139, 87, 0.2);
        color: #2E8B57;
    }
    
    /* Animation for form success */
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .form-success {
        animation: fadeIn 0.5s ease;
    }
`;
document.head.appendChild(style);