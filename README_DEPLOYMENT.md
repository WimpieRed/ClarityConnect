# ClarityConnect - Netlify Deployment Guide

## Frontend Deployment to Netlify (Mock Data)

This guide will help you deploy the ClarityConnect frontend to Netlify using mock data (no backend required).

### Prerequisites

1. A Netlify account (sign up at https://www.netlify.com)
2. Node.js installed on your machine
3. Your code ready to deploy

### Quick Deployment Steps (Netlify CLI)

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```
   This will open your browser to authenticate.

3. **Navigate to project root:**
   ```bash
   cd /path/to/ClarityConnect
   ```

4. **Initialize Netlify:**
   ```bash
   netlify init
   ```
   When prompted:
   - **Create & configure a new site** (choose this if it's your first deployment)
   - **Team:** Select your team
   - **Site name:** Enter a name (e.g., `clarityconnect`) or press Enter for a random name
   - **Build command:** `npm install && npm run build` (or just press Enter to use default)
   - **Directory to deploy:** `frontend/build` (or just press Enter to use default)

5. **Deploy to production:**
   ```bash
   netlify deploy --prod
   ```

   That's it! Your site will be live at `https://your-site-name.netlify.app`

### What Happens

- Netlify will run `npm install` and `npm run build` in the `frontend` directory
- The built files will be published from `frontend/build`
- Since `USE_MOCK_DATA = true` in `api.ts`, no backend is needed
- All features work with mock data

### Future Deployments

After the initial setup, you can deploy updates with:
```bash
netlify deploy --prod
```

Or test a draft deployment first:
```bash
netlify deploy
```
This creates a draft URL you can preview before going live.

### View Your Site

After deployment, Netlify will show you the live URL. You can also:
- Visit your Netlify dashboard: https://app.netlify.com
- Find your site and click to view it

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

