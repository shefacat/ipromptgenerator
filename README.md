# iPrompt Generator

AI-powered prompt generation tool for creating optimized prompts for ChatGPT, Claude, and other AI models.

## Quick Deployment to GitHub Pages

### Prerequisites
- A GitHub account
- Git installed on your computer

### Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right and select "New repository"
3. Name your repository: `ipromptgenerator` (or your preferred name)
4. Make sure it's set to **Public**
5. Do NOT initialize with README, .gitignore, or license
6. Click "Create repository"

### Step 2: Initialize and Push Your Code

Open your terminal in the project directory and run:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: iPrompt Generator website"

# Add your GitHub repository as remote (replace USERNAME with your GitHub username)
git remote add origin https://github.com/USERNAME/ipromptgenerator.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings" (top navigation)
3. Scroll down to "Pages" section (left sidebar)
4. Under "Source", select:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click "Save"
6. Wait 1-2 minutes for deployment
7. Your site will be live at: `https://USERNAME.github.io/ipromptgenerator/`

### Step 4: Custom Domain (Optional)

To use your custom domain `ipromptgenerator.com`:

1. In your domain registrar (where you bought the domain), add these DNS records:
   ```
   Type: A
   Name: @
   Value: 185.199.108.153

   Type: A
   Name: @
   Value: 185.199.109.153

   Type: A
   Name: @
   Value: 185.199.110.153

   Type: A
   Name: @
   Value: 185.199.111.153

   Type: CNAME
   Name: www
   Value: USERNAME.github.io
   ```

2. In GitHub Pages settings, enter your custom domain: `ipromptgenerator.com`
3. Check "Enforce HTTPS" (wait for SSL certificate to provision - may take 24 hours)

---

## API Integration Setup

The website currently uses mock data. To integrate with a real AI API:

### Option 1: OpenAI API (ChatGPT)

1. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)

2. Open `script.js` and replace the API configuration:

```javascript
const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const API_KEY = 'YOUR_OPENAI_API_KEY_HERE';

async function generatePrompt(userInput) {
    const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{
                role: 'system',
                content: 'You are a prompt engineering expert. Create an optimized, professional prompt based on the user\'s request.'
            }, {
                role: 'user',
                content: userInput
            }],
            temperature: 0.7,
            max_tokens: 500
        })
    });

    if (!response.ok) {
        throw new Error('API request failed');
    }

    const data = await response.json();
    return data.choices[0].message.content;
}
```

**Important:** Never expose API keys in client-side code in production. Use a backend server or serverless function.

### Option 2: Anthropic API (Claude)

1. Get your API key from [Anthropic Console](https://console.anthropic.com/)

2. Replace the API configuration in `script.js`:

```javascript
const API_ENDPOINT = 'https://api.anthropic.com/v1/messages';
const API_KEY = 'YOUR_ANTHROPIC_API_KEY_HERE';

async function generatePrompt(userInput) {
    const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            max_tokens: 1024,
            messages: [{
                role: 'user',
                content: `You are a prompt engineering expert. Create an optimized, professional prompt based on this request: ${userInput}`
            }]
        })
    });

    if (!response.ok) {
        throw new Error('API request failed');
    }

    const data = await response.json();
    return data.content[0].text;
}
```

### Option 3: Backend Proxy (Recommended for Production)

For security, create a backend API that handles AI API calls:

1. Create a serverless function (Vercel, Netlify, AWS Lambda)
2. Store API keys as environment variables
3. Update `script.js` to call your backend:

```javascript
const API_ENDPOINT = 'https://your-backend.vercel.app/api/generate-prompt';

async function generatePrompt(userInput) {
    const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userInput })
    });

    if (!response.ok) {
        throw new Error('API request failed');
    }

    const data = await response.json();
    return data.generatedPrompt;
}
```

---

## Google AdSense Setup

1. Apply for AdSense at [Google AdSense](https://www.google.com/adsense/)
2. Wait for approval (typically 1-2 weeks)
3. Get your AdSense code and ad unit IDs
4. In your HTML files, uncomment the AdSense placeholders and add your publisher ID:

```html
<!-- Replace ca-pub-XXXXXXXXXX with your AdSense publisher ID -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXXXXX"
     data-ad-slot="XXXXXXXXXX"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
```

5. Add the AdSense script to your `<head>` section:

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX"
     crossorigin="anonymous"></script>
```

---

## Contact Form Integration

To make the contact form functional, integrate with:

### Option 1: Formspree
1. Sign up at [Formspree](https://formspree.io/)
2. Create a new form
3. Update `script.js` with your Formspree endpoint

### Option 2: EmailJS
1. Sign up at [EmailJS](https://www.emailjs.com/)
2. Set up email template
3. Update contact form to use EmailJS SDK

### Option 3: Netlify Forms (if using Netlify)
1. Add `netlify` attribute to form
2. Forms automatically work with Netlify

---

## File Structure

```
ipromptgenerator.com/
├── index.html          # Main page with prompt generator
├── privacy.html        # Privacy policy (AdSense compliant)
├── terms.html          # Terms of service
├── contact.html        # Contact page with form
├── style.css           # All styles and responsive design
├── script.js           # All JavaScript functionality
├── README.md           # This file
└── (optional) favicon.ico
```

---

## Important Notes

### Security Best Practices
- Never commit API keys to GitHub
- Use environment variables for sensitive data
- Implement rate limiting on API calls
- Use a backend proxy for production

### Performance Optimization
- Minify CSS and JavaScript for production
- Optimize images before uploading
- Enable browser caching
- Use CDN for static assets (optional)

### SEO Checklist
- ✅ All meta tags are in place
- ✅ Structured data (Schema.org) implemented
- ✅ Semantic HTML5 markup
- ✅ Mobile-responsive design
- ⏳ Submit sitemap to Google Search Console after deployment
- ⏳ Add favicon.ico and other icons

### Next Steps After Deployment
1. Verify all pages load correctly
2. Test responsive design on multiple devices
3. Test all forms and functionality
4. Submit site to Google Search Console
5. Apply for Google AdSense (if not already approved)
6. Set up Google Analytics (optional)
7. Monitor for errors using browser console

---

## Support

For issues or questions:
- Check browser console for errors
- Ensure all file paths are correct
- Verify API credentials are valid
- Test on localhost before deploying

---

## License

This project is open source and available for personal and commercial use.

---

**Built with Claude**
