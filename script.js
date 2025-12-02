// ================================================
// API CONFIGURATION
// ================================================

// TODO: Replace with your actual API endpoint
const API_ENDPOINT = 'YOUR_API_ENDPOINT_HERE';

// Example API call structure (uncomment and modify when ready):
/*
async function callAPI(userInput) {
    const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Add your API key or auth headers here
            // 'Authorization': 'Bearer YOUR_API_KEY'
        },
        body: JSON.stringify({
            prompt: userInput,
            // Add other required parameters
        })
    });

    if (!response.ok) {
        throw new Error('API request failed');
    }

    const data = await response.json();
    return data.generatedPrompt; // Adjust based on your API response structure
}
*/

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

    // Response elements
    responseSection: document.getElementById('responseSection'),
    responseContent: document.getElementById('responseContent'),
    copyBtn: document.getElementById('copyBtn'),
    generateAnotherBtn: document.getElementById('generateAnotherBtn')
};

// ================================================
// MOBILE NAVIGATION
// ================================================

function initMobileNav() {
    if (elements.navToggle && elements.navMenu) {
        elements.navToggle.addEventListener('click', () => {
            elements.navMenu.classList.toggle('active');

            // Animate hamburger icon
            const hamburger = elements.navToggle.querySelector('.hamburger');
            if (hamburger) {
                hamburger.style.transform = elements.navMenu.classList.contains('active')
                    ? 'rotate(45deg)'
                    : 'rotate(0)';
            }
        });

        // Close menu when clicking on a link
        const navLinks = elements.navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                elements.navMenu.classList.remove('active');
                const hamburger = elements.navToggle.querySelector('.hamburger');
                if (hamburger) {
                    hamburger.style.transform = 'rotate(0)';
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!elements.navToggle.contains(e.target) && !elements.navMenu.contains(e.target)) {
                elements.navMenu.classList.remove('active');
                const hamburger = elements.navToggle.querySelector('.hamburger');
                if (hamburger) {
                    hamburger.style.transform = 'rotate(0)';
                }
            }
        });
    }
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
        });
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
// PROMPT GENERATION HANDLER
// ================================================

async function handlePromptGeneration(e) {
    e.preventDefault();

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
        hideError();

        // Generate prompt
        // TODO: Replace generatePrompt with actual API call
        const generatedPrompt = await generatePrompt(userInput);

        // Display result
        displayResult(generatedPrompt);

        // Scroll to result
        scrollToResult();

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
            elements.generateBtn.disabled = false;
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
            elements.responseSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 300);
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
            background-color: rgba(239, 68, 68, 0.1);
            border: 1px solid #EF4444;
            color: #FEE2E2;
            padding: 1rem;
            border-radius: 0.5rem;
            margin-bottom: 1rem;
            font-size: 0.875rem;
            animation: fadeInUp 0.3s ease-out;
        `;
        elements.promptForm.insertBefore(errorElement, elements.promptForm.firstChild);
    }

    errorElement.textContent = message;
    errorElement.style.display = 'block';

    // Auto-hide after 5 seconds
    setTimeout(() => {
        hideError();
    }, 5000);
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

    elements.copyBtn.classList.add('copied');
    copyText.textContent = 'Copied!';

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

    // Prevent form submission on Enter in textarea (optional)
    if (elements.userInput) {
        elements.userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                elements.promptForm.dispatchEvent(new Event('submit'));
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
                alert('An error occurred while sending your message. Please try again or email us directly at support@ipromptgenerator.com');
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
// INITIALIZE APP
// ================================================

function initApp() {
    // Initialize all features
    initMobileNav();
    initStickyHeader();
    initCharCounter();
    initEventListeners();
    initSmoothScroll();
    initContactForm();

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
