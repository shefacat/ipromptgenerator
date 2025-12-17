// ================================================
// API CONFIGURATION
// ================================================

// TODO: Replace with your actual API endpoint
const API_ENDPOINT = 'https://promptgenerator.shiref-abouzaid.workers.dev/';

// Example API call structure (uncomment and modify when ready):

async function callAPI(userInput, type) {
    // Your Cloudflare Worker URL
    const WORKER_URL = API_ENDPOINT;
    try {
        const requestBody = { userInput: userInput };
        if (type) {
            requestBody.type = type;
        }

        const response = await fetch(WORKER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'API request failed');
        }

        const data = await response.json();
        return data.generatedPrompt;

    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}


// ================================================
// DOM ELEMENTS
// ================================================

const elements = {
    // Navigation
    navToggle: document.getElementById('navToggle'),
    navMenu: document.getElementById('navMenu'),
    header: document.getElementById('header'),

    // Form elements
    promptForm: document.getElementById('promptForm'),
    userInput: document.getElementById('userInput'),
    generateBtn: document.getElementById('generateBtn'),
    btnLoader: document.getElementById('btnLoader'),
    charCounter: document.getElementById('charCounter'),
    charCount: document.getElementById('charCount'),
    clearTextBtn: document.getElementById('clearTextBtn'),
    startGeneratingBtn: document.getElementById('startGeneratingBtn'),

    // Response elements
    responseSection: document.getElementById('responseSection'),
    responseContent: document.getElementById('responseContent'),
    copyBtn: document.getElementById('copyBtn'),
    generateAnotherBtn: document.getElementById('generateAnotherBtn')
};

// ================================================
// COOLDOWN STATE
// ================================================

let cooldownActive = false;
let cooldownTimer = null;
let cooldownSeconds = 0;
const COOLDOWN_DURATION = 15; // 15 seconds cooldown

// ================================================
// MOBILE NAVIGATION - TRANSFORM-BASED (NO OVERFLOW)
// ================================================

function initMobileNav() {
    const navToggle = elements.navToggle;
    const navMenu = elements.navMenu;

    if (!navToggle || !navMenu) return;

    // Toggle menu function
    function toggleMenu() {
        const isActive = navMenu.classList.contains('active');

        if (isActive) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    // Open menu
    function openMenu() {
        // Only proceed if on mobile
        if (window.innerWidth > 768) return;

        navMenu.classList.add('active');
        navToggle.classList.add('active');

        // Prevent body scroll (mobile only)
        document.body.classList.add('menu-open');

        // Store scroll position to prevent jump
        const scrollY = window.scrollY;
        document.body.style.top = `-${scrollY}px`;
    }

    // Close menu
    function closeMenu() {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');

        // Restore body scroll
        document.body.classList.remove('menu-open');

        // Restore scroll position
        const scrollY = document.body.style.top;
        document.body.style.top = '';
        if (scrollY) {
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
    }

    // Toggle button click
    navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Close menu when clicking on a non-dropdown link
    const navLinks = navMenu.querySelectorAll('.nav-link:not(.nav-dropdown-toggle)');
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking on a dropdown link
    const dropdownLinks = navMenu.querySelectorAll('.nav-dropdown-link');
    dropdownLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    // Handle window resize - close menu if window gets bigger
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                closeMenu();
            }
        }, 250);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) &&
            !navToggle.contains(e.target)) {
            closeMenu();
        }
    });
}

// ================================================
// DROPDOWN MENU FUNCTIONALITY
// ================================================

function initDropdownMenu() {
    const dropdownToggles = document.querySelectorAll('.nav-dropdown-toggle');

    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const dropdown = toggle.parentElement;
            const isActive = dropdown.classList.contains('active');

            // Close all other dropdowns
            document.querySelectorAll('.nav-dropdown.active').forEach(item => {
                if (item !== dropdown) {
                    item.classList.remove('active');
                }
            });

            // Toggle current dropdown
            if (isActive) {
                dropdown.classList.remove('active');
            } else {
                dropdown.classList.add('active');
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-dropdown')) {
            document.querySelectorAll('.nav-dropdown.active').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
}

// ================================================
// STICKY HEADER
// ================================================

function initStickyHeader() {
    if (elements.header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                elements.header.classList.add('scrolled');
            } else {
                elements.header.classList.remove('scrolled');
            }
        });
    }
}

// ================================================
// CHARACTER COUNTER
// ================================================

function initCharCounter() {
    if (elements.userInput && elements.charCount) {
        elements.userInput.addEventListener('input', () => {
            const count = elements.userInput.value.length;
            elements.charCount.textContent = count;

            // Optional: Change color based on length
            if (count > 500) {
                elements.charCounter.style.color = '#10B981'; // Green
            } else if (count > 250) {
                elements.charCounter.style.color = '#F59E0B'; // Warning
            } else {
                elements.charCounter.style.color = '#64748B'; // Muted
            }

            // Toggle clear button visibility
            toggleClearButton();
        });
    }
}

// ================================================
// CLEAR TEXTAREA BUTTON
// ================================================

function toggleClearButton() {
    if (elements.clearTextBtn && elements.userInput) {
        if (elements.userInput.value.length > 0) {
            elements.clearTextBtn.classList.add('visible');
        } else {
            elements.clearTextBtn.classList.remove('visible');
        }
    }
}

function clearTextarea() {
    if (elements.userInput) {
        elements.userInput.value = '';
        elements.charCount.textContent = '0';
        elements.charCounter.style.color = '#64748B'; // Reset to muted
        toggleClearButton();
        elements.userInput.focus();
    }
}

// ================================================
// FORM VALIDATION
// ================================================

function validateInput(input) {
    if (!input || input.trim().length === 0) {
        return {
            valid: false,
            message: 'Please enter a description of what you want to create a prompt for.'
        };
    }

    if (input.trim().length < 10) {
        return {
            valid: false,
            message: 'Please provide a more detailed description (at least 10 characters).'
        };
    }

    if (input.length > 2000) {
        return {
            valid: false,
            message: 'Your input is too long. Please keep it under 2000 characters.'
        };
    }

    return {
        valid: true,
        message: ''
    };
}

// ================================================
// MOCK PROMPT GENERATOR (Replace with actual API)
// ================================================

async function generatePrompt(userInput) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock generated prompt - replace this with actual API call
    const mockPrompt = `You are an expert assistant specialized in ${userInput.toLowerCase()}.

Your task is to provide comprehensive, well-structured, and actionable guidance on this topic. Please:

1. Break down complex concepts into clear, understandable explanations
2. Provide specific examples and practical applications
3. Consider different perspectives and approaches
4. Offer step-by-step guidance where applicable
5. Highlight important considerations, best practices, and potential pitfalls

Context: ${userInput}

Please provide detailed, high-quality output that directly addresses the user's needs with precision and clarity. Focus on practical value and actionable insights.`;

    return mockPrompt;
}

// ================================================
// COOLDOWN TIMER
// ================================================

function startCooldownTimer() {
    // Clear any existing timer
    if (cooldownTimer) {
        clearInterval(cooldownTimer);
    }

    // Set cooldown state
    cooldownActive = true;
    cooldownSeconds = COOLDOWN_DURATION;

    // Get the button text element
    const btnText = elements.generateBtn.querySelector('.btn-text');

    // Disable button and add cooldown class
    elements.generateBtn.disabled = true;
    elements.generateBtn.classList.add('cooldown');

    // Create or update countdown span
    let countdownSpan = btnText.querySelector('.countdown-timer');
    if (!countdownSpan) {
        countdownSpan = document.createElement('span');
        countdownSpan.className = 'countdown-timer';
        countdownSpan.style.cssText = 'font-size: 0.85em; margin-left: 0.5em; opacity: 0.8;';
        btnText.textContent = 'Generate Prompt ';
        btnText.appendChild(countdownSpan);
    }
    countdownSpan.textContent = `(${cooldownSeconds}s)`;

    // Start countdown
    cooldownTimer = setInterval(() => {
        cooldownSeconds--;

        if (cooldownSeconds > 0) {
            countdownSpan.textContent = `(${cooldownSeconds}s)`;
        } else {
            // Cooldown finished
            clearInterval(cooldownTimer);
            cooldownTimer = null;
            cooldownActive = false;

            // Re-enable button and remove countdown
            elements.generateBtn.disabled = false;
            elements.generateBtn.classList.remove('cooldown');
            btnText.textContent = 'Generate Prompt';
        }
    }, 1000);
}

// ================================================
// PROMPT GENERATION HANDLER
// ================================================

async function handlePromptGeneration(e) {
    e.preventDefault();

    // Check if cooldown is active
    if (cooldownActive) {
        showError(`Please wait ${cooldownSeconds} seconds before generating another prompt.`);
        return;
    }

    // Hide any previous error messages
    hideError();

    const userInput = elements.userInput.value;

    // Validate input
    const validation = validateInput(userInput);
    if (!validation.valid) {
        showError(validation.message);
        return;
    }

    try {
        // Show loading state
        setLoadingState(true);

        // Generate prompt
        // TODO: Replace generatePrompt with actual API call
        const generatedPrompt = await callAPI(userInput);

        // Display result
        displayResult(generatedPrompt);

        // Scroll to result
        scrollToResult();

        // Start cooldown timer after successful generation
        startCooldownTimer();

    } catch (error) {
        console.error('Error generating prompt:', error);
        showError('An error occurred while generating your prompt. Please try again.');
    } finally {
        // Hide loading state
        setLoadingState(false);
    }
}

// ================================================
// UI STATE MANAGEMENT
// ================================================

function setLoadingState(isLoading) {
    if (elements.generateBtn) {
        if (isLoading) {
            elements.generateBtn.classList.add('loading');
            elements.generateBtn.disabled = true;
        } else {
            elements.generateBtn.classList.remove('loading');
            // Only re-enable if cooldown is not active
            if (!cooldownActive) {
                elements.generateBtn.disabled = false;
            }
        }
    }
}

function displayResult(prompt) {
    if (elements.responseContent && elements.responseSection) {
        elements.responseContent.textContent = prompt;
        elements.responseSection.classList.add('visible');
    }
}

function hideResult() {
    if (elements.responseSection) {
        elements.responseSection.classList.remove('visible');
    }
}

function scrollToResult() {
    if (elements.responseSection) {
        setTimeout(() => {
            // Get the element position and scroll with offset for header
            const elementPosition = elements.responseSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - 100; // 100px offset for sticky header

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }, 400);
    }
}

// ================================================
// ERROR HANDLING
// ================================================

function showError(message) {
    // Check if error element exists, if not create it
    let errorElement = document.getElementById('errorMessage');

    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = 'errorMessage';
        errorElement.style.cssText = `
            background-color: rgba(239, 68, 68, 0.15);
            border: 2px solid #EF4444;
            color: #EF4444;
            padding: 1rem;
            border-radius: 0.5rem;
            margin-top: 1rem;
            font-size: 0.9rem;
            font-weight: 500;
            animation: fadeInUp 0.3s ease-out;
            text-align: center;
        `;
        // Insert after the generate button
        elements.generateBtn.parentElement.appendChild(errorElement);
    }

    errorElement.textContent = message;
    errorElement.style.display = 'block';

    // Error will remain visible until user clicks generate again
}

function hideError() {
    const errorElement = document.getElementById('errorMessage');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

// ================================================
// COPY TO CLIPBOARD
// ================================================

async function copyToClipboard() {
    const text = elements.responseContent.textContent;

    try {
        await navigator.clipboard.writeText(text);
        showCopySuccess();
        // Send Google Analytics event
        if (typeof gtagSendCopyEvent === 'function') {
            gtagSendCopyEvent();
        }
    } catch (err) {
        // Fallback for older browsers
        fallbackCopyToClipboard(text);
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showCopySuccess();
            // Send Google Analytics event
            if (typeof gtagSendCopyEvent === 'function') {
                gtagSendCopyEvent();
            }
        } else {
            showCopyError();
        }
    } catch (err) {
        showCopyError();
    }

    document.body.removeChild(textArea);
}

function showCopySuccess() {
    const copyText = elements.copyBtn.querySelector('.copy-text');
    const originalText = copyText.textContent;
    const successMessage = document.getElementById('copySuccessMessage');

    // Add copied class to button
    elements.copyBtn.classList.add('copied');
    copyText.textContent = 'Copied!';

    // Show success message
    if (successMessage) {
        successMessage.classList.add('visible');

        // Hide success message after 2 seconds
        setTimeout(() => {
            successMessage.classList.remove('visible');
        }, 2000);
    }

    // Reset button after 2 seconds
    setTimeout(() => {
        elements.copyBtn.classList.remove('copied');
        copyText.textContent = originalText;
    }, 2000);
}

function showCopyError() {
    const copyText = elements.copyBtn.querySelector('.copy-text');
    const originalText = copyText.textContent;

    copyText.textContent = 'Failed';

    setTimeout(() => {
        copyText.textContent = originalText;
    }, 2000);
}

// ================================================
// GENERATE ANOTHER HANDLER
// ================================================

function handleGenerateAnother() {
    // Clear the textarea
    elements.userInput.value = '';
    elements.charCount.textContent = '0';
    elements.charCounter.style.color = '#64748B'; // Reset to muted
    toggleClearButton();

    // Hide result section
    hideResult();

    // Scroll to form
    elements.userInput.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });

    // Focus on input
    setTimeout(() => {
        elements.userInput.focus();
    }, 500);
}

// ================================================
// EVENT LISTENERS
// ================================================

function initEventListeners() {
    // Form submission
    if (elements.promptForm) {
        elements.promptForm.addEventListener('submit', handlePromptGeneration);
    }

    // Copy button
    if (elements.copyBtn) {
        elements.copyBtn.addEventListener('click', copyToClipboard);
    }

    // Generate another button
    if (elements.generateAnotherBtn) {
        elements.generateAnotherBtn.addEventListener('click', handleGenerateAnother);
    }

    // Clear textarea button
    if (elements.clearTextBtn) {
        elements.clearTextBtn.addEventListener('click', clearTextarea);
    }

    // Support button - show message on click
    const supportBtn = document.getElementById('testBtn');
    const supportMessage = document.getElementById('supportMessage');
    if (supportBtn && supportMessage) {
        supportBtn.addEventListener('click', () => {
            supportMessage.style.display = 'block';
        });
    }

    // Keyboard shortcuts for textarea
    if (elements.userInput) {
        elements.userInput.addEventListener('keydown', (e) => {
            // Ctrl+Enter: Submit form
            if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                elements.promptForm.dispatchEvent(new Event('submit'));
            }
            // Escape: Clear textarea
            if (e.key === 'Escape') {
                e.preventDefault();
                clearTextarea();
            }
        });
    }
}

// ================================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ================================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// ================================================
// CONTACT FORM HANDLING
// ================================================

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const contactSubmitBtn = document.getElementById('contactSubmitBtn');
    const successMessage = document.getElementById('contactSuccessMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Get form data
            const formData = {
                name: document.getElementById('contactName').value,
                email: document.getElementById('contactEmail').value,
                subject: document.getElementById('contactSubject').value,
                message: document.getElementById('contactMessage').value
            };

            // Validate form
            if (!validateContactForm(formData)) {
                return;
            }

            try {
                // Show loading state
                if (contactSubmitBtn) {
                    contactSubmitBtn.classList.add('loading');
                    contactSubmitBtn.disabled = true;
                }

                // TODO: Replace with actual form submission endpoint
                // For now, simulate submission
                await simulateFormSubmission(formData);

                // Show success message
                if (successMessage) {
                    successMessage.classList.add('visible');
                }

                // Clear form
                contactForm.reset();

                // Hide success message after 5 seconds
                setTimeout(() => {
                    if (successMessage) {
                        successMessage.classList.remove('visible');
                    }
                }, 5000);

            } catch (error) {
                console.error('Error submitting form:', error);
                alert('An error occurred while sending your message. Please try again or email us directly at shiref.abouzaid@gmail.com');
            } finally {
                // Hide loading state
                if (contactSubmitBtn) {
                    contactSubmitBtn.classList.remove('loading');
                    contactSubmitBtn.disabled = false;
                }
            }
        });
    }
}

function validateContactForm(formData) {
    // Name validation
    if (!formData.name || formData.name.trim().length < 2) {
        alert('Please enter a valid name (at least 2 characters)');
        return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
        alert('Please enter a valid email address');
        return false;
    }

    // Subject validation
    if (!formData.subject || formData.subject.trim().length < 3) {
        alert('Please enter a subject (at least 3 characters)');
        return false;
    }

    // Message validation
    if (!formData.message || formData.message.trim().length < 10) {
        alert('Please enter a message (at least 10 characters)');
        return false;
    }

    return true;
}

async function simulateFormSubmission(formData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Log form data (remove in production)
    console.log('Contact form submitted:', formData);

    // TODO: Replace with actual API call
    /*
    const response = await fetch('YOUR_CONTACT_FORM_ENDPOINT', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });

    if (!response.ok) {
        throw new Error('Form submission failed');
    }

    return await response.json();
    */
}

// ================================================
// SCROLL TO GENERATOR CARD FUNCTIONALITY
// ================================================

function initScrollToTextarea() {
    const startBtn = elements.startGeneratingBtn;
    const generatorCard = document.querySelector('.generator-card');
    const textarea = elements.userInput;

    if (!startBtn || !generatorCard || !textarea) return;

    startBtn.addEventListener('click', () => {
        const cardPosition = generatorCard.getBoundingClientRect().top + window.pageYOffset;
        const offset = -100; // Scroll to 100px above the generator card
        window.scrollTo({
            top: cardPosition + offset,
            behavior: 'smooth'
        });
        
        // Focus on textarea after scroll animation completes
        setTimeout(() => {
            textarea.focus();
        }, 500); // Delay to allow smooth scroll to complete
    });
}

// ================================================
// INITIALIZE APP
// ================================================

function initApp() {
    // Initialize all features
    initMobileNav();
    initDropdownMenu();
    initStickyHeader();
    initCharCounter();
    initEventListeners();
    initSmoothScroll();
    initContactForm();
    initScrollToTextarea();

    // Log initialization
    console.log('iPrompt Generator initialized successfully');
    console.log('Remember to replace API_ENDPOINT with your actual API endpoint');
}

// ================================================
// DOM CONTENT LOADED
// ================================================

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    // DOM is already loaded
    initApp();
}

// ================================================
// GOOGLE ADSENSE INITIALIZATION (if needed)
// ================================================

// Uncomment when you add AdSense
/*
window.addEventListener('load', function() {
    if (typeof adsbygoogle !== 'undefined') {
        (adsbygoogle = window.adsbygoogle || []).push({});
    }
});
*/
