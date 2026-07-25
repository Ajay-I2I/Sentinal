# 🚀 Vercel Deployment - Step-by-Step Guide

**Time Required**: 10 minutes  
**Difficulty**: Easy  
**Prerequisites**: GitHub account, OpenRouter API key

---

## ✅ Pre-Deployment Checklist

Before starting, verify:
- [ ] Code is pushed to GitHub: https://github.com/Ajay-I2I/Sentinal
- [ ] You have OpenRouter API key (starts with `sk-or-v1-`)
- [ ] Build works locally: `npm run build` ✅
- [ ] No TypeScript errors

---

## 🎯 Step-by-Step Deployment

### STEP 1: Go to Vercel Dashboard (1 minute)

1. Open browser
2. Go to: **https://vercel.com**
3. Click **"Sign In"** (top right)
4. Choose **"Continue with GitHub"**
5. Authorize Vercel to access your GitHub account
6. You're now in Vercel dashboard

**Expected**: You see "Dashboard" with "Add New" button

---

### STEP 2: Import Your GitHub Repository (2 minutes)

1. Click **"Add New"** button (top right)
2. From dropdown, click **"Project"**
3. Click **"Import Git Repository"**
4. In the search box, paste:
   ```
   https://github.com/Ajay-I2I/Sentinal
   ```
5. Click **"Import"**

**Expected**: See your repository appear with "Import" button

---

### STEP 3: Configure Project Settings (2 minutes)

After clicking Import, you'll see configuration options:

#### Framework
- **Framework Preset**: Should auto-detect as **Next.js** ✅
- If not, select **Next.js** from dropdown

#### Build Settings
- **Build Command**: `npm run build` (should auto-fill)
- **Output Directory**: `.next` (should auto-fill)
- **Install Command**: `npm install --legacy-peer-deps` (update this!)

#### Root Directory
- Should be set to: `sentinel-ai`
- If not, click "Edit" and set to `sentinel-ai`

**Click "Continue"**

---

### STEP 4: Add Environment Variables (3 minutes)

This is CRITICAL. You need to add your API key here.

#### In the "Environment Variables" section:

**Add Variable 1:**
- Name: `OPENROUTER_API_KEY`
- Value: `sk-or-v1-XXXXXXXXXXXXXXXXX` (your actual API key)
- Click "Add"

**Add Variable 2:**
- Name: `OPENROUTER_MODEL`
- Value: `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free`
- Click "Add"

**Add Variable 3:**
- Name: `API_TIMEOUT_MS`
- Value: `15000`
- Click "Add"

**Add Variable 4:**
- Name: `RESPONSE_WORD_LIMIT`
- Value: `40`
- Click "Add"

**Add Variable 5:**
- Name: `NEXT_PUBLIC_APP_URL`
- Value: Leave empty (Vercel will set it)
- Click "Add"

**Add Variable 6:**
- Name: `NEXT_PUBLIC_ENABLE_VOICE`
- Value: `false`
- Click "Add"

**Expected**: You see 6 environment variables listed

---

### STEP 5: Deploy! (1 minute)

1. Review all settings (should look correct)
2. Click **"Deploy"** button (bottom right)
3. **Wait 3-5 minutes** for deployment to complete

**Expected output**:
```
✓ Building...
✓ Uploading...
✓ Deployment Complete
```

---

## ✨ After Deployment

### STEP 6: Get Your Live URL (1 minute)

After deployment completes:

1. Click **"Visit"** button
2. Or look for URL like: `https://sentinal-ajay-i2i.vercel.app`
3. **SAVE THIS URL** - you need it for submission

### STEP 7: Test on Live URL (2 minutes)

Visit your live URL and test:

1. **Profile Creation**
   - Enter name, trusted person, activities
   - Submit
   - Should see chat interface

2. **Chat Message**
   - Type: "Hello"
   - Should get AI response within 5 seconds
   - No errors in console (F12)

3. **Crisis Test**
   - Type: "I'm drinking right now"
   - Should see response with:
     - ✅ Your real name (not "User A")
     - ✅ Trusted person's name
     - ✅ Call directive
     - ✅ Emergency numbers (988, 741741)

---

## ⚠️ Troubleshooting

### Problem: Build Fails

**Error**: "Build failed" or shows red X

**Solution**:
1. Go to **"Deployments"** tab
2. Click the failed deployment
3. Click **"Logs"** or **"Build Logs"**
4. Search for "error" in logs
5. Most common: Missing environment variable
6. Add missing env var and redeploy

**To redeploy**:
1. Go to **"Deployments"**
2. Click latest failed deployment
3. Click **"Redeploy"** button

---

### Problem: App Shows Error "Missing API Key"

**Cause**: OPENROUTER_API_KEY not set

**Solution**:
1. Go to **"Settings"**
2. Click **"Environment Variables"**
3. Check `OPENROUTER_API_KEY` is set
4. Verify it starts with `sk-or-v1-`
5. If missing, add it
6. Click **"Redeploy"** on Deployments tab

---

### Problem: "No Response from AI"

**Cause**: API key invalid or network issue

**Solution**:
1. Test API key with curl (in terminal):
   ```bash
   curl -X POST "https://openrouter.ai/api/v1/chat/completions" \
     -H "Authorization: Bearer sk-or-v1-YOUR-KEY" \
     -H "Content-Type: application/json" \
     -d '{"model":"nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free","messages":[{"role":"user","content":"test"}]}'
   ```
2. If error: API key invalid
3. If success: Check Vercel logs
4. Try on different network
5. Wait 30 seconds, try again

---

### Problem: "User A" in Response

**Cause**: Response validation not working or profile not saved

**Solution**:
1. Refresh page
2. Create new profile with real name
3. Make sure profile saves (you see chat interface)
4. Send message again
5. Should see real name

---

### Problem: Page Loads but Blank/White Screen

**Cause**: JavaScript error or build issue

**Solution**:
1. Press F12 (open DevTools)
2. Go to **Console** tab
3. Look for red error messages
4. Screenshot the error
5. Go back to Vercel
6. Check build logs
7. Redeploy if needed

---

## 🔄 Redeploying After Code Changes

If you make code changes and push to GitHub:

1. Vercel automatically detects push
2. Starts new deployment automatically
3. Wait 3-5 minutes
4. New version goes live
5. No manual action needed!

**To check deployment status**:
1. Go to Vercel dashboard
2. Click your project
3. Look at "Deployments" tab
4. See "Queued", "Building", or "Ready"

---

## 📊 Vercel Dashboard Tour

After deployment, explore these tabs:

### **Deployments**
- See all versions deployed
- Click to see logs
- Click to rollback to previous version

### **Settings**
- Environment variables
- Domains
- Build settings
- Team members

### **Analytics**
- Page load times
- Error rates
- Performance metrics

### **Logs**
- Real-time logs
- Function logs
- Build logs

---

## ✅ Verification Checklist

After deployment is live, verify:

- [ ] URL loads without 404
- [ ] Profile creation works
- [ ] Chat sends messages
- [ ] AI responds within 10 seconds
- [ ] Real names appear (not "User A")
- [ ] Crisis detection works
- [ ] No console errors (F12)
- [ ] Mobile responsive (toggle device toolbar)
- [ ] Can clear conversation
- [ ] Conversation persists after reload

**All pass?** → Ready to submit! 🎉

---

## 🎯 Your Deployment URLs

### Production URL (Live)
```
https://sentinal-ajay-i2i.vercel.app
```
(Replace with your actual URL)

### GitHub Repository
```
https://github.com/Ajay-I2I/Sentinal
```

### Project Settings
```
https://vercel.com/dashboard/project/sentinal
```

---

## 📝 Deployment Checklist

- [ ] Step 1: Go to Vercel ✅
- [ ] Step 2: Import GitHub repo ✅
- [ ] Step 3: Configure settings ✅
- [ ] Step 4: Add environment variables ✅
- [ ] Step 5: Click Deploy ✅
- [ ] Step 6: Get live URL ✅
- [ ] Step 7: Test on live URL ✅
- [ ] Verify all tests pass ✅
- [ ] Save deployment URLs ✅

---

## 🚀 You're Live!

Once deployment completes and tests pass:

1. ✅ Your app is live on the internet
2. ✅ Anyone can visit your URL
3. ✅ Vercel is hosting it for free
4. ✅ It scales automatically
5. ✅ HTTPS enabled automatically
6. ✅ Ready for submission!

---

## 📞 Need Help?

**Vercel Docs**: https://vercel.com/docs  
**Next.js Docs**: https://nextjs.org/docs  
**OpenRouter Docs**: https://openrouter.ai/docs  

---

## ⏱️ Time Summary

| Step | Time |
|------|------|
| Step 1: Dashboard | 1 min |
| Step 2: Import | 2 min |
| Step 3: Configure | 2 min |
| Step 4: Env vars | 3 min |
| Step 5: Deploy | 3-5 min |
| Step 6: Get URL | 1 min |
| Step 7: Test | 2 min |
| **TOTAL** | **15-20 min** |

---

## 🎉 Success!

Your Sentinel AI is now live on Vercel! 

**Next**: Proceed to submission with:
- ✅ Live URL
- ✅ GitHub link
- ✅ README.md
- ✅ ARCHITECTURE.md

---

**Created**: July 25, 2026  
**Version**: 1.0  
**Status**: Ready to Deploy  
**Estimated Success Rate**: 95%+

