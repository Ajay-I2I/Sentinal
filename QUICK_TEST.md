# ⚡ Quick Test Guide - Sentinel AI

Fast way to verify all critical functionality in 10 minutes.

---

## 🚀 Pre-Test Setup (1 minute)

```bash
cd sentinel-ai
npm install --legacy-peer-deps
npm run dev
# Visit http://localhost:3000
```

---

## 🎯 Critical Test Cases (9 minutes)

### Test 1: Profile Creation (1 min)
**What to do**:
1. Click "Create Profile" 
2. Enter:
   - Name: `TestUser`
   - Trusted Person: `Sarah`
   - Phone: `555-1234`
3. Submit

**What to verify**: ✅ See chat interface with welcome message

---

### Test 2: Regular Chat (1 min)
**What to do**:
1. Type: `Hello, how are you?`
2. Press Enter

**What to verify**:
- ✅ Message appears in chat
- ✅ "Thinking..." loading shows
- ✅ AI response appears
- ✅ No red errors in console (F12)

---

### Test 3: Tier 5 - Stable (1 min)
**What to do**:
1. Type: `Had a great day today!`
2. Press Enter

**What to verify**:
- ✅ Response is celebratory
- ✅ No tasks suggested
- ✅ No question at end
- ✅ Real names used

---

### Test 4: Tier 3 - Craving (1 min)
**What to do**:
1. Type: `I have a strong craving right now`
2. Press Enter

**What to verify**:
- ✅ Response is empathetic
- ✅ ONE activity suggested
- ✅ May end with question
- ✅ Under 40 words

---

### Test 5: Tier 1 - CRITICAL - Active Use (2 min)
**What to do**:
1. Type: `I'm drinking right now`
2. Press Enter

**What to verify**:
- ✅ Response includes user name "TestUser"
- ✅ Response includes trusted person "Sarah"
- ✅ Response says "Call Sarah"
- ✅ Response includes "988" or "741741"
- ✅ Response does NOT end with "?"
- ✅ Response is directive (not question)
- ⚠️ **CRITICAL**: NO "User A" in response
- ✅ Under 40 words

**If you see "User A"**: ❌ FAIL - Placeholder detection broken

---

### Test 6: Tier 2 - Imminent Use (1 min)
**What to do**:
1. Type: `I'm thinking about drinking today`
2. Press Enter

**What to verify**:
- ✅ Response urgency high
- ✅ Says "STOP" or similar
- ✅ Offers alternative
- ✅ No question at end

---

### Test 7: Tier 4 - Trigger Exposure (1 min)
**What to do**:
1. Type: `I just saw my old drinking friends`
2. Press Enter

**What to verify**:
- ✅ Response recognizes risk
- ✅ Offers preventative action
- ✅ Supportive tone
- ✅ Real names used

---

### Test 8: Conversation Persistence (1 min)
**What to do**:
1. Send a message
2. Reload page (F5)
3. Wait for load

**What to verify**:
- ✅ Profile still there (name shows)
- ✅ All previous messages still visible
- ✅ No data loss

---

### Test 9: Mobile Responsive (1 min)
**What to do**:
1. Press F12 (DevTools)
2. Click device toggle (mobile icon)
3. Select iPhone 12
4. Try sending message

**What to verify**:
- ✅ Layout adapts to mobile
- ✅ Chat readable
- ✅ Input field usable
- ✅ Buttons clickable
- ✅ Works on touch

---

## 📊 Quick Scoring

### Scoring Rubric (Adjust based on test results)

| Test | Status | Points |
|------|--------|--------|
| Profile Creation | ✅ / ❌ | __/10 |
| Regular Chat | ✅ / ❌ | __/10 |
| Tier 5 Stable | ✅ / ❌ | __/10 |
| Tier 3 Craving | ✅ / ❌ | __/10 |
| Tier 1 Active Use | ✅ / ❌ | __/20 |
| Tier 2 Imminent | ✅ / ❌ | __/10 |
| Tier 4 Trigger | ✅ / ❌ | __/10 |
| Persistence | ✅ / ❌ | __/10 |
| Mobile | ✅ / ❌ | __/10 |
| **TOTAL** | | **__/100** |

---

## ⚠️ What Could Go Wrong

### Issue: No AI Response (Blank)
**Cause**: API key invalid or API down
**Fix**:
1. Check `.env.local` has valid key
2. Check console for errors (F12)
3. Wait 10 seconds and retry

### Issue: "User A" in Response
**Cause**: Response validation failed
**Fix**:
1. This is a CRITICAL failure
2. Check `src/lib/responseValidator.ts`
3. Verify profile was saved
4. Try clearing browser storage

### Issue: Response Takes >15 seconds
**Cause**: API timeout or network slow
**Fix**:
1. Try again (might be network)
2. Check `API_TIMEOUT_MS` in `.env.local`
3. Check internet connection

### Issue: Console Shows Red Error
**Cause**: TypeScript error or API error
**Fix**:
1. Check error message (expand it)
2. Look for "OPENROUTER" or "API" errors
3. Check `.env.local` configuration

### Issue: Mobile Layout Broken
**Cause**: Responsive CSS issue
**Fix**:
1. Open DevTools
2. Toggle device mode
3. Reload page
4. Should auto-adjust

---

## ✅ Success Criteria

### All tests pass if:
- ✅ Profile creation works
- ✅ Chat sends/receives
- ✅ Crisis detection works
- ✅ Real names appear (no "User A")
- ✅ Conversation persists
- ✅ No console errors
- ✅ Mobile responsive
- ✅ All tiers work

### CRITICAL: If "User A" appears anywhere
- ❌ Response validation broken
- ❌ Stop and fix before deployment
- ❌ Do NOT submit with this issue

---

## 🚀 After Tests Pass

1. ✅ All 9 tests passing
2. ✅ Ready to deploy to Vercel
3. ✅ See `DEPLOY_NOW.md`
4. ✅ Deploy in 10 minutes
5. ✅ Ready to submit

---

## 📝 Testing Notes

### Test Date: ___________
### Tester: ___________
### Environment: [ ] Local [ ] Vercel

### Results:
- Profile Creation: [ ] PASS [ ] FAIL
- Regular Chat: [ ] PASS [ ] FAIL
- Tier 5 Stable: [ ] PASS [ ] FAIL
- Tier 3 Craving: [ ] PASS [ ] FAIL
- Tier 1 Active Use: [ ] PASS [ ] FAIL
- Tier 2 Imminent: [ ] PASS [ ] FAIL
- Tier 4 Trigger: [ ] PASS [ ] FAIL
- Persistence: [ ] PASS [ ] FAIL
- Mobile: [ ] PASS [ ] FAIL

### Issues Found:
_________________________________
_________________________________
_________________________________

### Notes:
_________________________________
_________________________________

---

## 🎯 Next Steps

**If all pass** ✅
→ Deploy to Vercel (see `DEPLOY_NOW.md`)

**If any fail** ❌
→ Check troubleshooting above
→ Check console errors (F12)
→ Review TEST_CASES.md for details

---

**Document**: QUICK_TEST.md  
**Time**: 10 minutes  
**Purpose**: Verify critical functionality  
**Status**: Ready

