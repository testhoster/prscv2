// Global Variables
let slideIndex = 0;
let slides;
let totalSlides;
let autoSlideInterval;

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the slider
    initializeSlider();
    
    // Initialize form toggle functionality
    initializeFormToggle();
    
    // Smooth scrolling for navigation links
    initializeSmoothScrolling();
    
    // Initialize FAQ accordion if present
    initializeFAQ();
});

// Slider Functionality
function initializeSlider() {
    // Get all slide elements
    slides = document.querySelectorAll('.slide');
    totalSlides = slides.length;
    
    if (totalSlides > 0) {
        // Hide all slides initially
        resetSlides();
        
        // Show the first slide
        showSlide(0);
        
        // Start automatic sliding
        startAutoSlide();
    }
}

function resetSlides() {
    for (let i = 0; i < totalSlides; i++) {
        slides[i].style.display = 'none';
    }
}

function showSlide(index) {
    resetSlides();
    slides[index].style.display = 'block';
}

function changeSlide(direction) {
    // Stop auto sliding when manual navigation is used
    stopAutoSlide();
    
    // Calculate new slide index
    slideIndex += direction;
    
    // Loop back to start or end if needed
    if (slideIndex >= totalSlides) {
        slideIndex = 0;
    } else if (slideIndex < 0) {
        slideIndex = totalSlides - 1;
    }
    
    // Show the new slide
    showSlide(slideIndex);
    
    // Restart auto sliding
    startAutoSlide();
}

function startAutoSlide() {
    // Change slides every 5 seconds
    autoSlideInterval = setInterval(function() {
        changeSlide(1);
    }, 5000);
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

// Form Toggle Functionality
function initializeFormToggle() {
    // Default to showing query form
    showAdmissionForm()
    
    // Add event listeners for buttons if they exist
    const queryButton = document.querySelector('#inquiry-type-selector button:first-child');
    const admissionButton = document.querySelector('#inquiry-type-selector button:last-child');
    
    if (queryButton && admissionButton) {
        queryButton.addEventListener('click', showQueryForm);
        admissionButton.addEventListener('click', showAdmissionForm);
    }
}

function showQueryForm() {
    const queryForm = document.getElementById('query-form');
    const admissionForm = document.getElementById('admission-form');
    
    if (queryForm && admissionForm) {
        queryForm.classList.remove('hidden');
        admissionForm.classList.add('hidden');
        
        // Update button active states
        updateButtonActiveStates('query');
    }
}

function showAdmissionForm() {
    const queryForm = document.getElementById('query-form');
    const admissionForm = document.getElementById('admission-form');
    
    if (queryForm && admissionForm) {
        admissionForm.classList.remove('hidden');
        queryForm.classList.add('hidden');
        
        // Update button active states
        updateButtonActiveStates('admission');
    }
}

function updateButtonActiveStates(activeForm) {
    const buttons = document.querySelectorAll('#inquiry-type-selector button');
    
    if (buttons.length >= 2) {
        // Remove active class from all buttons
        buttons.forEach(button => {
            button.classList.remove('active');
        });
        
        // Add active class to the correct button
        if (activeForm === 'query') {
            buttons[0].classList.add('active');
        } else {
            buttons[1].classList.add('active');
        }
    }
}

// Smooth Scrolling for Navigation
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('header nav ul li a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Get the target section id from the href
            const targetId = this.getAttribute('href');
            
            // Check if it's an internal link
            if (targetId.startsWith('#')) {
                e.preventDefault();
                
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Smooth scroll to the target section
                    window.scrollTo({
                        top: targetSection.offsetTop - 80, // Offset for header
                        behavior: 'smooth'
                    });
                    
                    // If on mobile, collapse the nav menu if expanded
                    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
                    if (mobileMenuToggle && mobileMenuToggle.classList.contains('active')) {
                        toggleMobileMenu();
                    }
                }
            }
        });
    });
}

// FAQ Accordion Functionality
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('h3');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            // Initially hide all answers
            answer.style.display = 'none';
            
            // Add click event to questions
            question.addEventListener('click', function() {
                // Toggle answer visibility
                if (answer.style.display === 'none') {
                    answer.style.display = 'block';
                    question.classList.add('active');
                } else {
                    answer.style.display = 'none';
                    question.classList.remove('active');
                }
            });
            
            // Add appropriate cursor style
            question.style.cursor = 'pointer';
        }
    });
}

// Mobile Menu Toggle Functionality
function initializeMobileMenu() {
    const menuToggle = document.createElement('div');
    menuToggle.className = 'mobile-menu-toggle';
    menuToggle.innerHTML = '<span></span><span></span><span></span>';
    
    const header = document.querySelector('header');
    const nav = document.querySelector('header nav');
    
    if (header && nav) {
        // Insert toggle button at the beginning of header
        header.insertBefore(menuToggle, header.firstChild);
        
        // Add click event to toggle button
        menuToggle.addEventListener('click', toggleMobileMenu);
    }
}

function toggleMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('header nav');
    
    if (menuToggle && nav) {
        menuToggle.classList.toggle('active');
        nav.classList.toggle('active');
    }
}

// Form Validation
function validateForm(formId) {
    const form = document.getElementById(formId);
    
    if (form) {
        form.addEventListener('submit', function(e) {
            let isValid = true;
            const inputs = form.querySelectorAll('input, select, textarea');
            
            inputs.forEach(input => {
                if (input.hasAttribute('required') && !input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
                
                // Email validation
                if (input.type === 'email' && input.value.trim()) {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(input.value)) {
                        isValid = false;
                        input.classList.add('error');
                    }
                }
                
                // Phone validation
                if (input.type === 'tel' && input.value.trim()) {
                    const phonePattern = /^\d{10}$/;
                    if (!phonePattern.test(input.value.replace(/\D/g, ''))) {
                        isValid = false;
                        input.classList.add('error');
                    }
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                alert('Please fill in all required fields correctly.');
            }
        });
    }
}

// Initialize form validation for both forms
validateForm('query-form');
validateForm('admission-form');