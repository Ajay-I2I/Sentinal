# Deployment Guide - Sentinel AI

Complete guide for deploying Sentinel AI to production on Vercel.

## Prerequisites

- GitHub account with repository created
- Vercel account (free tier available)
- OpenRouter API key (free tier available)
- Node.js 18+ for local testing

## Step-by-Step Deployment

### Phase 1: Prepare Local Code (5 minutes)

#### 1.1 Verify Build Works Locally
```bash
cd sentinel-ai
npm install --legacy-peer-deps
npm run build
```

Expected output:
```
✓ Compiled successfully
✓ Finished TypeScript
✓ Generating static pages
```

If build fails, check:
- Node.js version is 18+
- All dependencies installed
- No TypeScript errors: `npm run lint`

#### 1.2 Test Locally
```bash
npm run dev
```

Visit `http://localhost:3000` and test:
- [ ] Profile creation works
- [ ] Chat sends messages
- [ ] Responses appear within 5 seconds
- [ ] No console errors (F12)
- [ ] Conversation persists after reload

#### 1.3 Verify Environment Variables
```bash
# Check .env.local exists
cat .env.local

# Should show:
# OPENROUTER_API_KEY=sk-or-v1-...
# OPENROUTER_MODEL=nvidia/...
# API_TIMEOUT_MS=15000
# etc.
```

### Phase 2: Push to GitHub (5 minutes)

#### 2.1 Create GitHub Repository
1. Go to [github.com/new](https://github.com/new)
2. Repository name: `sentinel-ai`
3. Description: "AI Recovery Coach - Hackathon Project"
4. **Make Public** (judges need to view code)
5. Add `.gitignore` for Node
6. Click "Create repository"

#### 2.2 Push Local Code
```bash
cd sentinel-ai

# Configure git if needed
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Add remote and push
git remote add origin https://github.com/YOUR-USERNAME/sentinel-ai.git
git branch -M main
git push -u origin main
```

Expected output:
```
Enumerating objects: 50, done.
Counting objects: 100% (50/50), done.
Writing objects: 100% (50/50), done.

Total 50 (delta 10), reused 0 (delta 0), pack-reused 0
To https://github.com/YOUR-USERNAME/sentinel-ai.git
 * [new branch]      main -> main
```

#### 2.3 Verify Repository
- Visit `https://github.com/YOUR-USERNAME/sentinel-ai`
- Verify all files present
- Check `.env.local` is in `.gitignore` (sensitive data)
- Repository size should be < 10MB

### Phase 3: Deploy to Vercel (10 minutes)

#### 3.1 Import Project to Vercel
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Click "Import Git Repository"
4. Paste: `https://github.com/YOUR-USERNAME/sentinel-ai`
5. Click "Import"

#### 3.2 Configure Project Settings
1. **Framework Preset**: Next.js (should auto-detect)
2. **Build Command**: `npm run build` (should auto-fill)
3. **Output Directory**: `.next` (should auto-fill)
4. **Install Command**: `npm install --legacy-peer-deps`

Click "Continue"

#### 3.3 Add Environment Variables
In the "Environment Variables" section, add:

```
OPENROUTER_API_KEY = sk-or-v1-your-actual-key-here
OPENROUTER_MODEL = nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free
API_TIMEOUT_MS = 15000
RESPONSE_WORD_LIMIT = 40
NEXT_PUBLIC_APP_URL = https://sentinel-ai-YOUR-USERNAME.vercel.app
NEXT_PUBLIC_ENABLE_VOICE = false
```

**IMPORTANT**: 
- Use your actual OpenRouter API key
- For `NEXT_PUBLIC_APP_URL`, use the Vercel preview URL format
- All variables are case-sensitive

#### 3.4 Deploy
1. Click "Deploy"
2. Wait 2-5 minutes for build
3. See "✓ Deployment Complete"
4. Click "Visit" to go to your live site

Expected build output:
```
✓ Compiled successfully
✓ Deployment complete
```

### Phase 4: Verify Deployment (10 minutes)

#### 4.1 Test Deployed App
1. Visit your Vercel URL (e.g., `https://sentinel-ai-johndoe.vercel.app`)
2. Test the following:
   - [ ] Page loads without errors
   - [ ] Profile form appears
   - [ ] Can create profile
   - [ ] Chat interface appears
   - [ ] Can send message
   - [ ] AI responds within 10 seconds
   - [ ] Response contains actual names (not "User A")
   - [ ] No console errors (F12 → Console)

#### 4.2 Crisis Response Test
In the chat, type:
```
I'm drinking right now
```

Expected response should include:
- ✓ User's actual name
- ✓ Trusted person's actual name
- ✓ "Call [Name]" (not a question)
- ✓ "988" or "741741" emergency numbers
- ✓ Under 40 words

Example:
```
"I hear you, [Name]. Call [Trusted Person] now. If unavailable, 
call 988 or text HELLO to 741741. You're not alone."
```

#### 4.3 Check Vercel Logs
1. In Vercel dashboard
2. Click your project
3. Go to "Logs" or "Deployments"
4. Check for:
   - ✓ No build errors
   - ✓ No runtime errors
   - ✓ API calls completing
   - ✓ No environment variable warnings

### Phase 5: Production Hardening (5 minutes)

#### 5.1 Add Security Headers
Already included in `next.config.ts`:
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block

#### 5.2 Configure Vercel Settings
In Vercel dashboard:

1. **Project Settings** → **Domains**
   - Add custom domain if available
   - Note the preview URL

2. **Project Settings** → **Git**
   - Verify GitHub connection
   - Set deployment branch to `main`
   - Enable automatic deployments

3. **Project Settings** → **Environment**
   - Verify all env vars present
   - Check production/preview separation

#### 5.3 Set Up Monitoring
Optional but recommended:

1. **Vercel Analytics**
   - Dashboard → Analytics
   - Monitor page performance
   - Track API response times

2. **Error Reporting**
   - Check Vercel logs regularly
   - Set up email notifications
   - Monitor for failed deployments

---

## Troubleshooting

### Build Fails on Vercel

**Problem**: Build works locally but fails on Vercel

**Solutions**:
1. Check environment variables in Vercel dashboard
2. Verify `.env.local` is in `.gitignore`
3. Check Node.js version matches
4. Look at Vercel build logs for specific error
5. Try redeploying: Dashboard → Your Project → Redeploy

### App Loads But No Responses

**Problem**: Can create profile, send chat, but AI doesn't respond

**Solutions**:
1. Check `OPENROUTER_API_KEY` in Vercel env vars
2. Verify API key is valid (test with curl or Postman)
3. Check error logs in Vercel (F12 → Console on deployed app)
4. Verify `API_TIMEOUT_MS` is not too short
5. Try incognito browser (clears cached issues)

### "User A" Appears in Response

**Problem**: AI returning placeholder names instead of real names

**Solutions**:
1. Check profile was saved correctly
2. Verify trusted person name is set
3. Test on Vercel (not localhost)
4. Clear browser cache
5. Check system prompt in `src/prompts/system.ts`

### Environment Variables Not Working

**Problem**: App uses default values, not env vars

**Solutions**:
1. Verify variable names exactly in Vercel dashboard
2. Check for typos in `config.ts`
3. Make sure `NEXT_PUBLIC_` prefix for client variables
4. Redeploy after adding variables
5. Check Vercel logs for warnings

### API Timeout Errors

**Problem**: Requests timeout after few seconds

**Solutions**:
1. Increase `API_TIMEOUT_MS` in env vars (try 30000)
2. Check OpenRouter API status
3. Verify API key rate limits not exceeded
4. Try from different network/region
5. Check Vercel regional selection

---

## Rollback & Recovery

### If Deployment Breaks

1. **Immediate**: Vercel auto-keeps previous working deployment
   - Dashboard → Your Project → Deployments
   - Click previous working deployment
   - Click "Rollback" button
   - Site reverts instantly

2. **Git Rollback**:
   ```bash
   git log --oneline
   git revert <commit-hash>
   git push
   # Vercel auto-redeploys
   ```

### Disaster Recovery

If git repo is corrupted:

```bash
# Clone fresh
git clone https://github.com/YOUR-USERNAME/sentinel-ai.git
cd sentinel-ai

# Check out previous commit
git log --oneline
git checkout <previous-good-commit>

# Push
git push --force-with-lease origin main
```

---

## Post-Deployment Maintenance

### Weekly Checks
- [ ] Check Vercel analytics for errors
- [ ] Monitor API response times
- [ ] Review logs for warnings
- [ ] Test crisis flow once

### Monthly Checks
- [ ] Update dependencies: `npm update`
- [ ] Run security audit: `npm audit fix`
- [ ] Test on latest browsers
- [ ] Verify OpenRouter API still working

### Before Hackathon Submission
- [ ] Test all crisis tiers
- [ ] Verify <10MB git repo
- [ ] Confirm LIVE URL works
- [ ] Check all env vars present
- [ ] No console errors in deployment
- [ ] README complete and accurate
- [ ] Contact info visible

---

## Quick Reference

### Important URLs
- **GitHub**: `https://github.com/YOUR-USERNAME/sentinel-ai`
- **Live App**: `https://sentinel-ai-YOUR-USERNAME.vercel.app`
- **Vercel Dashboard**: `https://vercel.com/dashboard`
- **OpenRouter Docs**: `https://openrouter.ai/docs`

### Important Files
- `vercel.json` - Deployment configuration
- `.env.local` - Local environment variables
- `.gitignore` - Files not pushed to GitHub
- `next.config.ts` - Next.js configuration
- `.env.example` - Template for new devs

### Critical Commands
```bash
# Build locally
npm run build

# Test locally  
npm run dev

# Lint code
npm run lint

# Push to GitHub
git push

# View git history
git log --oneline
```

---

## Support

### Before Asking for Help
1. Check Vercel dashboard logs
2. Review browser console errors (F12)
3. Verify all env vars set correctly
4. Test on new incognito window
5. Try on different network

### Getting Help
- GitHub Issues: Ask in your repo
- Vercel Support: Dashboard → Help
- OpenRouter Docs: https://openrouter.ai/docs

---

**Version**: 1.0  
**Last Updated**: July 25, 2026  
**Status**: Ready for Hackathon Submission

