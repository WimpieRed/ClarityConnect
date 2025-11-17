# ClarityConnect - Deployment Guide

## Deploy to GitHub → Netlify (Recommended)

This guide will help you deploy ClarityConnect to GitHub and then automatically deploy to Netlify using mock data (no backend required).

### Prerequisites

1. A GitHub account (sign up at https://github.com)
2. A Netlify account (sign up at https://www.netlify.com)
3. Git installed on your machine
4. Your code ready to deploy

### Step 1: Push to GitHub

1. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Repository name: `ClarityConnect` (or your preferred name)
   - Choose Public or Private
   - **Do NOT** initialize with README, .gitignore, or license (we already have these)
   - Click "Create repository"

2. **Push your code to GitHub:**
   ```bash
   cd /Users/wimpien/Documents/PlasmaMind/ClarityConnect
   git remote add origin https://github.com/YOUR_USERNAME/ClarityConnect.git
   git branch -M main
   git push -u origin main
   ```
   Replace `YOUR_USERNAME` with your GitHub username.

### Step 2: Deploy to Netlify from GitHub

1. **Log in to Netlify:**
   - Go to https://app.netlify.com
   - Sign in or create an account

2. **Import from Git:**
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub" (or GitLab/Bitbucket if you used those)
   - Authorize Netlify to access your repositories
   - Select your `ClarityConnect` repository

3. **Configure build settings:**
   Netlify should auto-detect from `netlify.toml`, but verify:
   - **Base directory:** `frontend`
   - **Build command:** `npm install && npm run build`
   - **Publish directory:** `frontend/build`

4. **Deploy:**
   - Click "Deploy site"
   - Netlify will build and deploy your site
   - Your site will be live at `https://random-name.netlify.app`

### Step 3: Customize Your Site (Optional)

1. **Change site name:**
   - Go to Site settings → General → Site details
   - Click "Change site name"
   - Enter your preferred name (e.g., `clarityconnect`)

2. **Set up custom domain:**
   - Go to Domain settings
   - Click "Add custom domain"
   - Follow DNS configuration instructions

### What Happens

- Netlify automatically detects your `netlify.toml` configuration
- Builds your React app in the `frontend` directory
- Publishes from `frontend/build`
- Since `USE_MOCK_DATA = true` in `api.ts`, no backend is needed
- All features work with mock data

### Continuous Deployment

Once connected to GitHub:
- **Automatic deploys:** Every push to `main` branch triggers a new deployment
- **Deploy previews:** Pull requests get preview URLs automatically
- **Branch deploys:** Deploy from any branch for testing

### Future Updates

Simply push to GitHub:
```bash
git add .
git commit -m "Your update message"
git push
```
Netlify will automatically build and deploy!

### Troubleshooting

**Build fails:**
- Make sure you're in the project root directory
- Check that `frontend/package.json` exists
- Verify Node.js version (18+ recommended)

**Site not loading:**
- Check the deploy logs in Netlify dashboard
- Verify the build completed successfully
- Check browser console for errors

**Routing issues:**
- The `_redirects` file should be in `frontend/public/`
- Verify `netlify.toml` exists in project root

### Configuration Files

The following files are configured for Netlify deployment:

- **`netlify.toml`** - Netlify configuration (auto-detected)
- **`frontend/public/_redirects`** - SPA routing redirects for React Router

### Mock Data Mode

The app is configured to use mock data by default:
- `USE_MOCK_DATA = true` in `frontend/src/services/api.ts`
- No backend required
- No environment variables needed
- All features work with mock data

### Custom Domain (Optional)

1. Go to Netlify Dashboard → Your site → Domain settings
2. Click "Add custom domain"
3. Follow DNS configuration instructions

### Continuous Deployment (Optional)

If you connect your Git repository:
- Netlify automatically deploys when you push to your main branch
- You can set up branch previews for pull requests
- Configure deploy contexts for different environments

### Useful Commands

```bash
# View site info
netlify status

# Open site in browser
netlify open:site

# View deploy logs
netlify logs

# List all sites
netlify sites:list
```

