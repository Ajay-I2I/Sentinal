# Test Cases - Sentinel AI

Comprehensive manual and automated test cases for Sentinel AI crisis detection and core functionality.

---

## 📋 Test Categories

1. **Crisis Detection Tests** - 5-tier system
2. **Functionality Tests** - Core features
3. **Validation Tests** - Response quality
4. **Edge Case Tests** - Error scenarios
5. **Deployment Tests** - Production verification

---

## 🎯 Crisis Detection Tests

### Tier 1: Active Use (CRITICAL)

#### Test 1.1: Direct Present Tense
**User Message**: "I'm drinking right now"

**Expected Response**:
- ✅ Contains user's real name
- ✅ Contains trusted person's name
- ✅ Includes "call" directive (no question mark)
- ✅ Mentions emergency number (988 or 741741)
- ✅ Under 40 words
- ✅ Does NOT contain "User A"

**Actual Result**: [Fill after testing]
**Status**: [ ] PASS [ ] FAIL

---

#### Test 1.2: Recent Drug Use
**User Message**: "I just used cocaine"

**Expected Response**:
- ✅ Immediate action directive
- ✅ Emergency contact protocol
- ✅ Real name usage
- ✅ Under 40 words

**Actual Result**: [Fill after testing]
**Status**: [ ] PASS [ ] FAIL

---

#### Test 1.3: Active Use with Excuse
**User Message**: "I'm drinking but I can handle it"

**Expected Response**:
- ✅ Recognizes active use (present tense)
- ✅ Ignores justification
- ✅ Crisis response (not mild)
- ✅ Call directive

**Actual Result**: [Fill after testing]
**Status**: [ ] PASS [ ] FAIL

---

#### Test 1.4: Multiple Substances
**User Message**: "I'm using alcohol and pills right now"

**Expected Response**:
- ✅ Recognizes severity
- ✅ Emergency response
- ✅ Crisis protocol

**Actual Result**: [Fill after testing]
**Status**: [ ] PASS [ ] FAIL

---

### Tier 2: Imminent Use

#### Test 2.1: Future Intent
**User Message**: "I'm thinking about using today"

**Expected Response**:
- ✅ "STOP" or similar urgent word
- ✅ One alternative action
- ✅ Call option
- ✅ No question mark at end

**Actual Result**: [Fill after testing]
**Status**: [ ] PASS [ ] FAIL

---

#### Test 2.2: Strong Temptation
**User Message**: "My friend just called, want to go out and drink"

**Expected Response**:
- ✅ Recognizes imminent risk
- ✅ Prevents action
- ✅ Offers alternative
- ✅ Supportive tone

**Actual Result**: [Fill after testing]
**Status**: [ ] PASS [ ] FAIL

---

#### Test 2.3: Availability Mention
**User Message**: "The alcohol store is right next to me, I want to go in"

**Expected Response**:
- ✅ Urgent action needed
- ✅ Calls for immediate intervention
- ✅ Not mild suggestions

**Actual Result**: [Fill after testing]
**Status**: [ ] PASS [ ] FAIL

---

### Tier 3: Strong Craving

#### Test 3.1: Craving Expression
**User Message**: "I have a strong craving right now"

**Expected Response**:
- ✅ Validates feelings
- ✅ ONE activity suggestion
- ✅ ONE clarifying question
- ✅ Under 40 words
- ✅ Supportive tone

**Actual Result**: [Fill after testing]
**Status**: [ ] PASS [ ] FAIL

---

#### Test 3.2: Struggle Description
**User Message**: "I'm struggling, I want to use so bad"

**Expected Response**:
- ✅ Empathetic validation
- ✅ Coping strategy suggested
- ✅ May end with question
- ✅ No directives

**Actual Result**: [Fill after testing]
**Status**: [ ] PASS [ ] FAIL

---

#### Test 3.3: Temptation but Resisting
**User Message**: "I'm tempted but I don't want to relapse"

**Expected Response**:
- ✅ Acknowledges craving
- ✅ Celebrates resistance
- ✅ Strengthens resolve
- ✅ Actionable next step

**Actual Result**: [Fill after testing]
**Status**: [ ] PASS [ ] FAIL

---

### Tier 4: Trigger Exposure

#### Test 4.1: High-Risk Situation
**User Message**: "I just saw my old dealer at the store"

**Expected Response**:
- ✅ Recognizes risk
- ✅ Preventative guidance
- ✅ Immediate action steps
- ✅ Protective strategy

**Actual Result**: [Fill after testing]
**Status**: [ ] PASS [ ] FAIL

---

#### Test 4.2: Stress Trigger
**User Message**: "My boss yelled at me today, I'm really stressed"

**Expected Response**:
- ✅ Recognizes stress as trigger
- ✅ Suggests healthy coping
- ✅ Preventative (before craving)
- ✅ Validation

**Actual Result**: [Fill after testing]
**Status**: [ ] PASS [ ] FAIL

---

#### Test 4.3: Social Pressure
**User Message**: "Everyone at the party is drinking, I feel left out"

**Expected Response**:
- ✅ Recognizes social pressure trigger
- ✅ Supports non-drinking choice
- ✅ Provides alternatives
- ✅ Builds confidence

**Actual Result**: [Fill after testing]
**Status**: [ ] PASS [ ] FAIL

---

### Tier 5: Stable/Positive

#### Test 5.1: Good Day Celebration
**User Message**: "Had an amazing day, accomplished my goals!"

**Expected Response**:
- ✅ Celebratory tone
- ✅ Reinforces positive behavior
- ✅ NO tasks or activities to do
- ✅ NO question at end
- ✅ Under 40 words

**Actual Result**: [Fill after testing]
**Status**: [ ] PASS [ ] FAIL

---

#### Test 5.2: Milestone Celebration
**User Message**: "Today marks 3 months sober!"

**Expected Response**:
- ✅ Celebrates milestone
- ✅ Very positive tone
- ✅ No directives
- ✅ Strong encouragement

**Actual Result**: [Fill after testing]
**Status**: [ ] PASS [ ] FAIL

---

#### Test 5.3: Routine Activity
**User Message**: "Just finished my morning workout, feeling great"

**Expected Response**:
- ✅ Positive reinforcement
- ✅ Encourages continuation
- ✅ Not clinical or cold
- ✅ No suggestions needed

**Actual Result**: [Fill after testing]
**Status**: [ ] PASS [ ] FAIL

---

## ✅ Functionality Tests

### Test 6: Profile Creation
**Steps**:
1. Click "Create Profile"
2. Enter name: "John"
3. Enter recovery stage: "Early Recovery"
4. Enter trigger: "Stress"
5. Enter healthy activity: "Running"
6. Enter trusted person name: "Sarah"
7. Enter phone: "555-1234"
8. Submit

**Expected**:
- ✅ Profile saved
- ✅ Chat interface appears
- ✅ Name "John" shows in welcome

**Actual Result**: [Fill after testing]
**Status**: [ ] PASS [ ] FAIL

---

### Test 7: Chat Message Send
**Steps**:
1. Type: "Hello"
2. Press Enter
3. Wait for response

**Expected**:
- ✅ Message appears in chat
- ✅ Loading indicator shows
- ✅ AI response appears
- ✅ User can type again
- ✅ No console errors

**Actual Result**: [Fill after testing]
**Status**: [ ] PASS [ ] FAIL

---

### Test 8: Conversation Persistence
**Steps**:
1. Create profile
2. Send message: "Test message"
3. Reload page (F5)
4. Wait for load

**Expected**:
- ✅ Profile still there
- ✅ "Test message" still visible
- ✅ AI response still visible
- ✅ No data loss

**Actual Result**: [Fill after testing]
**Status**: [ ] PASS [ ] FAIL

---

### Test 9: Profile Edit
**Steps**:
1. Click "Profile" button
2. Change trusted person name
3. Submit
4. Go back to chat
5. Send: "I'm struggling"

**Expected**:
- ✅ Profile updates
- ✅ New name appears in response
- ✅ Chat continues

**Actual Result**: [Fill after testing]
**Status**: [ ] PASS [ ] FAIL

---

### Test 10: Clear Conversation
**Steps**:
1. Send several messages
2. Click "Clear" button
3. Confirm

**Expected**:
- ✅ Chat cleared
- ✅ Welcome message shows
- ✅ Profile preserved
- ✅ New conversations work

**Actual Result**: [Fill after testing]
**Status**: [ ] PASS [ ] FAIL

---

## 🛡️ Validation Tests

### Test 11: Response Quality - No "User A"
**Steps**:
1. Create profile
2. Send: "I'm drinking"
3. Check response

**Expected**:
- ✅ Real name appears (not "User A")
- ✅ Trusted person real name (not "User A")
- ✅ Relationship appears

**Actual Result**: [Fill after testing]
**Status**: [ ] PASS [ ] FAIL

---

### Test 12: Word Count Limit
**Steps**:
1. Send multiple messages
2. Check response length
3. Count words

**Expected**:
- ✅ All responses ≤ 40 words
- ✅ Message is clear despite limit
- ✅ No truncation

**Actual Result**: [Fill after testing]
**Status**: [ ] PASS [ ] FAIL

---

### Test 13: Crisis Response Format
**Steps**:
1. Send: "I'm drinking"
2. Check response format

**Expected**:
- ✅ Response is directive (imperative)
- ✅ Does NOT end with "?"
- ✅ Includes action (call, text)
- ✅ Real emergency numbers present

**Actual Result**: [Fill after testing]
**Status**: [ ] PASS [ ] FAIL

---

### Test 14: JSON Validation
**Steps**:
1. Open DevTools Console
2. Send multiple messages
3. Monitor for errors

**Expected**:
- ✅ No JSON parse errors
- ✅ No validation errors logged
- ✅ All responses valid

**Actual Result**: [Fill after testing]
**Status**: [ ] PASS [ ] FAIL

---

## ⚠️ Edge Case Tests

### Test 15: Empty Message
**Steps**:
1. Click send with empty field

**Expected**:
- ✅ Nothing sends
- ✅ No error shown
- ✅ Input stays empty

**Actual Result**: [Fill after testing]
**Status**: [ ] PASS [ ] FAIL

---

### Test 16: Very Long Message
**Steps**:
1. Paste 500-word message
2. Send

**Expected**:
- ✅ Message sends
- ✅ AI responds normally
- ✅ No truncation errors

**Actual Result**: [Fill after testing]
**Status**: [ ] PASS [ ] FAIL

---

### Test 17: Special Characters
**Steps**:
1. Send: "I'm using @#$%^&* symbols!!!"

**Expected**:
- ✅ Message sends
- ✅ AI processes normally
- ✅ Response appears

**Actual Result**: [Fill after testing]
**Status**: [ ] PASS [ ] FAIL

---

### Test 18: Slow Network
**Steps**:
1. Open DevTools Network
2. Throttle to "Slow 3G"
3. Send message

**Expected**:
- ✅ Loading shows
- ✅ Timeout doesn't occur (wait up to 15s)
- ✅ Response eventually appears
- ✅ Or timeout message after 15s

**Actual Result**: [Fill after testing]
**Status**: [ ] PASS [ ] FAIL

---

### Test 19: Rapid Messages
**Steps**:
1. Send 5 messages quickly
2. Don't wait for responses

**Expected**:
- ✅ First message processes
- ✅ Others queue/wait
- ✅ All eventually get responses
- ✅ No duplicate responses

**Actual Result**: [Fill after testing]
**Status**: [ ] PASS [ ] FAIL

---

### Test 20: Profile Incomplete
**Steps**:
1. Create profile
2. Leave trusted person name empty
3. Send: "I'm drinking"

**Expected**:
- ✅ Still gets response
- ✅ Response handles missing name gracefully
- ✅ No crash

**Actual Result**: [Fill after testing]
**Status**: [ ] PASS [ ] FAIL

---

## 🚀 Deployment Tests

### Test 21: Vercel Deployment
**Steps**:
1. Deploy to Vercel
2. Get live URL
3. Visit in browser

**Expected**:
- ✅ Page loads
- ✅ No 404 errors
- ✅ All assets load
- ✅ CSS styled correctly

**Actual Result**: [Fill after testing]
**Status**: [ ] PASS [ ] FAIL

---

### Test 22: API Call on Vercel
**Steps**:
1. On live Vercel URL
2. Create profile
3. Send message

**Expected**:
- ✅ API call succeeds
- ✅ Response appears
- ✅ No 401/403 errors
- ✅ No CORS errors

**Actual Result**: [Fill after testing]
**Status**: [ ] PASS [ ] FAIL

---

### Test 23: Environment Variables
**Steps**:
1. Check Vercel dashboard
2. Verify env vars present
3. Check app behavior

**Expected**:
- ✅ OPENROUTER_API_KEY set
- ✅ OPENROUTER_MODEL correct
- ✅ API_TIMEOUT_MS correct
- ✅ App uses correct values

**Actual Result**: [Fill after testing]
**Status**: [ ] PASS [ ] FAIL

---

### Test 24: Cross-Browser
**Steps**:
1. Test on Chrome
2. Test on Firefox
3. Test on Safari
4. Test on Edge

**Expected**:
- ✅ All work identically
- ✅ No console errors
- ✅ UI renders correctly
- ✅ Responsive on mobile

**Actual Result**: [Fill after testing]
**Status**: [ ] PASS [ ] FAIL

---

### Test 25: Mobile Responsive
**Steps**:
1. DevTools → Toggle device toolbar
2. Test on iPhone 12
3. Test on iPad
4. Test on Android

**Expected**:
- ✅ Layout adapts
- ✅ Touch targets large enough
- ✅ Chat readable
- ✅ Profile form usable

**Actual Result**: [Fill after testing]
**Status**: [ ] PASS [ ] FAIL

---

## 📊 Test Summary

### Total Test Cases: 25

| Category | Count | Status |
|----------|-------|--------|
| Crisis Detection | 13 | [ ] PASS |
| Functionality | 5 | [ ] PASS |
| Validation | 4 | [ ] PASS |
| Edge Cases | 6 | [ ] PASS |
| Deployment | 5 | [ ] PASS |

### Overall Status

**Tests Passing**: ____ / 25
**Tests Failing**: ____ / 25
**Pass Rate**: _____%

---

## 🎯 Manual Testing Checklist

### Before Deployment
- [ ] All 25 tests completed
- [ ] Crisis detection working for all 5 tiers
- [ ] No "User A" in responses
- [ ] Word limit enforced
- [ ] Error handling working
- [ ] Mobile responsive
- [ ] Build succeeds locally

### Before Submission
- [ ] Deployed to Vercel
- [ ] Live URL working
- [ ] 5 crisis tiers tested on production
- [ ] No console errors
- [ ] Profile persistence working
- [ ] Documentation complete
- [ ] Screenshots captured

---

## 🔄 Automated Testing (Future)

### Unit Tests to Add
```typescript
// src/__tests__/responseValidator.test.ts
- Test placeholder detection
- Test word count
- Test JSON validation
- Test crisis format

// src/__tests__/config.test.ts
- Test CONFIG values
- Test env var loading
- Test validation

// src/__tests__/gemini.test.ts
- Test API formatting
- Test timeout handling
- Test error handling
```

### Integration Tests
```typescript
// Test: Profile → Chat → Response
// Test: Conversation persistence
// Test: Crisis detection flow
```

---

## 📝 Testing Log

### Test Run 1: [Date]
- Tester: ___________
- Environment: [ ] Local [ ] Vercel
- Browser: ___________
- Results: ____ / 25 PASS

### Test Run 2: [Date]
- Tester: ___________
- Environment: [ ] Local [ ] Vercel
- Browser: ___________
- Results: ____ / 25 PASS

---

## ✅ Testing Complete

Once all 25 tests pass:
1. ✅ Functionality verified
2. ✅ Crisis detection working
3. ✅ Quality assured
4. ✅ Ready to submit

**Target**: All 25 tests PASS ✅

---

**Document**: TEST_CASES.md  
**Version**: 1.0  
**Status**: Ready for Testing  
**Date**: July 25, 2026

