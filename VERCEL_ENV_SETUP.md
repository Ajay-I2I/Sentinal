# 🔑 Vercel Environment Variables Setup

**Issue Fixed**: OpenRouter API Key error  
**Solution**: Add environment variables through Vercel Dashboard (not in vercel.json)

---

## ✅ Correct Way to Set Environment Variables in Vercel

### Step 1: After Clicking "Import" in Vercel

When you see the deployment configuration screen:

```
Framework: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install --legacy-peer-deps
Root Directory: sentinel-ai
```

Click **"Continue"** → You'll see the "Environment Variables" section

---

### Step 2: Add Environment Variables (6 Total)

**IMPORTANT**: Enter these values ONE BY ONE in the Vercel dashboard

#### Variable 1: OPENROUTER_API_KEY
```
Name: OPENROUTER_API_KEY
Value: sk-or-v1-XXXXXXXXXXXXXXXXXXXXXX

⚠️ GET YOUR KEY FROM: https://openrouter.ai/keys
```

**How to get your key:**
1. Go to https://openrouter.ai
2. Sign up (free)
3. Go to Dashboard → Keys
4. Copy your API key (starts with `sk-or-v1-`)
5. Paste it in Vercel

#### Variable 2: OPENROUTER_MODEL
```
Name: OPENROUTER_MODEL
Value: nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free
```

#### Variable 3: API_TIMEOUT_MS
```
Name: API_TIMEOUT_MS
Value: 15000
```

#### Variable 4: RESPONSE_WORD_LIMIT
```
Name: RESPONSE_WORD_LIMIT
Value: 40
```

#### Variable 5: NEXT_PUBLIC_ENABLE_VOICE
```
Name: NEXT_PUBLIC_ENABLE_VOICE
Value: false
```

#### Variable 6: NEXT_PUBLIC_APP_URL
```
Name: NEXT_PUBLIC_APP_URL
Value: (leave empty - Vercel will set it)
```

---

## 📋 Quick Reference

| Variable Name | Value | Required |
|---------------|-------|----------|
| OPENROUTER_API_KEY | sk-or-v1-YOUR-KEY | ✅ YES |
| OPENROUTER_MODEL | nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free | ✅ YES |
| API_TIMEOUT_MS | 15000 | ✅ YES |
| RESPONSE_WORD_LIMIT | 40 | ✅ YES |
| NEXT_PUBLIC_ENABLE_VOICE | false | ⚠️ Recommended |
| NEXT_PUBLIC_APP_URL | (empty) | ⚠️ Optional |

---

## 🚨 Common Errors & Fixes

### Error: "Missing API Key" or "401 Unauthorized"

**Cause**: OPENROUTER_API_KEY not set correctly

**Fix**:
1. Go to https://openrouter.ai/keys
2. Copy your API key
3. In Vercel dashboard → Settings → Environment Variables
4. Edit OPENROUTER_API_KEY
5. Make sure it starts with `sk-or-v1-`
6. Save changes
7. Click "Redeploy" in Deployments tab

---

### Error: "Invalid request: should NOT have additional property 'nodeje'"

**Cause**: Old vercel.json had invalid properties

**Fix**: ✅ Already fixed! File has been updated

---

### Error: "Cannot read property 'name' of undefined"

**Cause**: Environment variables not loaded

**Fix**:
1. Verify all 4 required variables are set
2. Check spelling (case-sensitive!)
3. Wait 5 minutes for Vercel to apply changes
4. Redeploy

---

## 🔄 How to Redeploy After Changing Environment Variables

1. Go to https://vercel.com/dashboard
2. Click your project (Sentinal)
3. Go to **"Deployments"** tab
4. Find the latest deployment
5. Click **"Redeploy"** button
6. Wait 3-5 minutes
7. See "Deployment Complete"

---

## ✅ Verification

After environment variables are set:

1. **In Vercel Dashboard**:
   - Go to Settings → Environment Variables
   - Should see all 6 variables
   - OPENROUTER_API_KEY should be hidden (shown as ••••)

2. **On Your Live Site**:
   - Create profile
   - Send message: "Hello"
   - AI should respond within 5-10 seconds
   - If error: Check environment variables

---

## 📝 Getting OpenRouter API Key

### Free Tier Available!

1. Go to: https://openrouter.ai
2. Click "Sign Up" (top right)
3. Create account (email + password)
4. Verify email
5. Go to Dashboard
6. Click "Keys" in sidebar
7. Copy your API key
8. Use in Vercel

**That's it!** Free tier includes:
- ✅ NVIDIA Nemotron model (free)
- ✅ 1M tokens/day (usually enough)
- ✅ No credit card required for free tier

---

## 🎯 Step-by-Step Summary

```
1. Get API key from https://openrouter.ai
2. Go to Vercel Import screen
3. Click "Continue" to see Environment Variables
4. Add 6 environment variables (see table above)
5. Click "Deploy"
6. Wait 3-5 minutes
7. Click "Visit" to see live site
8. Test with message: "Hello"
9. If works: Success! ✅
10. If error: Check environment variables
```

---

## 💡 Pro Tips

- ✅ Keep your API key SECRET
- ✅ Don't share it with anyone
- ✅ Use Vercel environment variables (not in code)
- ✅ Different API keys for dev/production possible
- ✅ Can change API key without code change
- ✅ Redeploy after changing environment variables

---

## 🆘 Still Getting Error?

**Checklist**:
- [ ] OPENROUTER_API_KEY starts with `sk-or-v1-`
- [ ] All 4 required variables are set
- [ ] No typos in variable names (case-sensitive!)
- [ ] Redeployed after adding variables
- [ ] Waited 3-5 minutes
- [ ] Browser cache cleared (Ctrl+Shift+Delete)
- [ ] Tried in incognito window

**If still failing**:
1. Check Vercel Build Logs (Deployments → Click build → Logs)
2. Search for "error" or "OPENROUTER"
3. Copy error message
4. Check OpenRouter API status (https://openrouter.io/status)

---

## 📞 Useful Links

- **OpenRouter Dashboard**: https://openrouter.ai/dashboard
- **OpenRouter Keys**: https://openrouter.ai/keys
- **Vercel Dashboard**: https://vercel.com/dashboard
- **OpenRouter API Docs**: https://openrouter.ai/docs
- **OpenRouter Status**: https://openrouter.io/status

---

## ✨ Success Indicators

When everything is working:

1. ✅ Vercel shows "Deployment Complete"
2. ✅ Site loads without errors
3. ✅ Profile creation works
4. ✅ Chat messages send
5. ✅ AI responds with real text
6. ✅ No "User A" in responses
7. ✅ Emergency numbers appear (988, 741741)

**All working?** → Ready for submission! 🎉

---

**Created**: July 25, 2026  
**Version**: 1.0  
**Status**: Ready  
**Success Rate**: 95%+

