# Sentinel AI - Recovery Coach

A modern AI-powered recovery coaching application designed to support individuals in their substance use disorder recovery journey. Built with Next.js and powered by NVIDIA Nemotron reasoning model via OpenRouter API.

## 🎯 Problem Statement

Substance Use Disorder (SUD) recovery is challenging and often requires consistent support to prevent relapse. Traditional recovery coaching relies on periodic human contact, which can be expensive and unavailable during critical moments. **Sentinel AI provides 24/7 personalized coaching**, understanding each person's unique triggers, activities, and support network.

### Key Problems Addressed
- **Immediate Support Gap**: No immediate assistance during crisis moments
- **Personalized Guidance**: Generic recovery advice doesn't address individual circumstances
- **Activity Diversion**: Users need specific activity suggestions tailored to their profile
- **Emergency Protocols**: Crisis detection must trigger appropriate emergency response

---

## ✨ Features

### 1. **Intelligent Crisis Detection**
Sentinel AI detects five recovery tiers and responds accordingly:
- **Tier 1 (Active Use)**: Immediate directive response with emergency contacts
- **Tier 2 (Imminent Use)**: Stop, call trusted person, provide one alternative
- **Tier 3 (Strong Craving)**: Validate feelings, suggest healthy activity, ask clarifying question
- **Tier 4 (Trigger Exposure)**: Preventative guidance before cravings start
- **Tier 5 (Stable)**: Celebrate progress, no directives, support positive momentum

### 2. **Personalized Profile**
Users create a recovery profile including:
- Personal information and recovery stage
- Triggers (situations, people, emotions that increase risk)
- Healthy activities and coping strategies
- Trusted emergency contact (person, phone number, relationship)
- Emergency communication preferences

### 3. **Smart Conversation Management**
- Multi-turn conversation history with localStorage persistence
- Context-aware responses based on user's profile and conversation history
- Response validation ensuring AI uses real names (never placeholders)
- Word-limited responses (default: 40 words) for clarity and urgency

### 4. **Modern UI/UX**
- ChatGPT-style interface with gradient aesthetics
- Bright, accessible color scheme (emerald, cyan, blue, orange)
- Mobile-responsive design
- Real-time guidance panel showing recovery status

### 5. **Data Privacy**
- All conversation data stored locally in browser (localStorage)
- No cloud storage of personal recovery information
- Users maintain complete data control

---

## 🔧 Technical Stack

- **Frontend**: React 19 + Next.js 16 (TypeScript)
- **Styling**: Tailwind CSS v4
- **UI Components**: Lucide React icons
- **AI Services**: NVIDIA Nemotron 3 Nano Omni via OpenRouter API
- **Deployment**: Vercel
- **Configuration**: Environment variables for all parameters

### AI Model Choice

**NVIDIA Nemotron 3 Nano Omni 30B with Reasoning**
- ✅ Free tier available (critical for hackathon)
- ✅ Reasoning capabilities for complex recovery scenarios
- ✅ Good performance with JSON output (required for structured responses)
- ✅ OpenAI-compatible API (via OpenRouter)
- ✅ Optimized for instruction following

**Why OpenRouter?**
- Unified API for multiple models
- Free tier support
- No authentication complexity
- Fallback capability to other models if needed

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- OpenRouter API key (free tier available)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/sentinel-ai.git
cd sentinel-ai

# Install dependencies
npm install --legacy-peer-deps

# Configure environment variables
cp .env.local.example .env.local
# Edit .env.local and add your OPENROUTER_API_KEY
```

### Configuration

**`.env.local` file:**
```env
# Required: OpenRouter API credentials
OPENROUTER_API_KEY=sk-or-v1-your-key-here
OPENROUTER_MODEL=nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free

# Optional: Timeouts and response limits (all have defaults)
API_TIMEOUT_MS=15000
RESPONSE_WORD_LIMIT=40
VOICE_PAUSE_THRESHOLD_MS=5000

# App configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENABLE_VOICE=false
```

### Running Locally

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

Visit `http://localhost:3000` in your browser.

---

## 📋 How It Works

### 1. **User Onboarding**
- User creates profile with recovery information
- Specifies triggers, healthy activities, and emergency contact
- Data persisted in localStorage for future sessions

### 2. **Chat Interaction**
- User types messages naturally about their current state
- Sentinel AI analyzes conversation context and profile
- System prompt applies crisis detection protocols
- Response validated for quality (no placeholders, proper format)

### 3. **Crisis Detection Flow**
```
User Message
    ↓
Pattern Matching (AI detects keywords like "drinking", "using", etc.)
    ↓
Context Analysis (considers conversation history and profile)
    ↓
Tier Classification (one of 5 recovery states)
    ↓
Response Generation (matching protocol for that tier)
    ↓
Validation (check for real names, proper format, word count)
    ↓
Response to User
```

### 4. **Example Responses**

**User says: "I'm thinking about drinking right now"**
- Tier: Immediate Support (Imminent Use)
- Response: "Call [Trusted Person Name] now. If unable, call 988 or text HELLO to 741741."

**User says: "Had a great workout today!"**
- Tier: Stable
- Response: "That's awesome! Keep that momentum going. You're doing great."

---

## 🏗️ Architecture

### Core Components

#### `src/lib/config.ts`
Centralized configuration management using environment variables. No hardcoded values.

```typescript
export const CONFIG = {
  OPENROUTER_MODEL: process.env.OPENROUTER_MODEL || "...",
  API_TIMEOUT_MS: parseInt(process.env.API_TIMEOUT_MS || "15000", 10),
  RESPONSE_WORD_LIMIT: parseInt(process.env.RESPONSE_WORD_LIMIT || "40", 10),
  // ... all other configurable parameters
};
```

#### `src/lib/responseValidator.ts`
Validates AI responses before returning to user:
- Checks for placeholder names ("User A")
- Validates JSON structure
- Ensures crisis responses are directives, not questions
- Logs validation details in development

#### `src/lib/gemini.ts`
OpenRouter API client with error handling:
- Uses NVIDIA Nemotron model
- Implements request timeout
- Parses and validates responses
- Structured error messaging

#### `src/prompts/system.ts`
System prompt implementing 5-tier crisis detection protocol:
- Keyword detection ("drinking", "using", "craving", etc.)
- Tense-based analysis (present = active use)
- Context-aware response generation

#### `src/components/guidance/ChatInterface.tsx`
Main chat UI with:
- Gradient styling and modern design
- Message persistence (localStorage)
- Auto-focus on input field
- Loading states and error handling

#### `src/components/ErrorBoundary.tsx`
React error boundary to prevent app crashes:
- Catches rendering errors
- Shows user-friendly error message
- Provides recovery action (reload)

---

## 🔐 Security & Privacy

### Data Protection
- All personal data stays in user's browser
- No server-side storage of recovery information
- localStorage only persists conversation history locally
- Profile data cleared if user deletes browser data

### API Security
- OpenRouter API key stored in server environment only
- Never exposed to client-side code
- Environment variables managed by Vercel secrets
- API calls validate input parameters

### Responsible AI
- Response validation catches AI failures
- Placeholder detection prevents "User A" embarrassment
- Crisis responses always provide real emergency contacts (988, 741741)
- Word limits prevent overwhelming messages

---

## 📊 Configuration Parameters

All application parameters are configurable via environment variables:

| Parameter | Default | Purpose |
|-----------|---------|---------|
| `OPENROUTER_API_KEY` | - | API authentication (required) |
| `OPENROUTER_MODEL` | `nvidia/nemotron-...` | AI model selection |
| `API_TIMEOUT_MS` | 15000 | API request timeout (ms) |
| `RESPONSE_WORD_LIMIT` | 40 | Max words in AI response |
| `VOICE_PAUSE_THRESHOLD_MS` | 5000 | Voice input pause detection (ms) |
| `NEXT_PUBLIC_APP_URL` | localhost | App URL for referrer header |
| `NEXT_PUBLIC_ENABLE_VOICE` | false | Enable voice input (experimental) |

---

## 🚀 Deployment

### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Select your GitHub repository
   - Framework: Next.js (auto-detected)

3. **Configure Environment Variables**
   - In Vercel Project Settings → Environment Variables
   - Add `OPENROUTER_API_KEY` with your API key
   - Other variables auto-load from `vercel.json`

4. **Deploy**
   - Click "Deploy"
   - Vercel automatically builds and deploys
   - Get public URL (e.g., `sentinel-ai.vercel.app`)

### Production Checklist

- [ ] Environment variables configured in Vercel
- [ ] API key from OpenRouter
- [ ] Build succeeds locally (`npm run build`)
- [ ] No console errors in production build
- [ ] All hardcoded values removed
- [ ] Crisis flow tested on deployed version

---

## 🧪 Testing

### Manual Testing Checklist

```bash
# 1. Local Testing
npm run dev

# Test flows:
# - Profile creation
# - Chat message sending
# - Crisis detection (say "I'm drinking")
# - Conversation persistence (reload page)
# - Error handling (disconnect network)

# 2. Production Build
npm run build
npm start

# 3. Deployed Testing
# Visit Vercel URL
# Repeat all flows above
```

### Crisis Response Examples

Test these messages to verify crisis detection:

| Message | Expected Tier | Response Should Include |
|---------|---------------|----------------------|
| "I'm drinking right now" | Active Use | Real name, call command, 988, no "?" |
| "I might use today" | Imminent Use | Call command, one alternative |
| "I want to use but..." | Strong Craving | Validate feelings, activity, question |
| "I saw my dealer" | Trigger Exposure | Preventative guidance |
| "Had a great day!" | Stable | Celebration, no directives |

---

## 📞 Support

### Emergency Contacts
- **National Suicide Prevention Lifeline**: 988 (US)
- **Crisis Text Line**: Text HELLO to 741741
- **SAMHSA National Helpline**: 1-800-662-4357

### Getting Help
- Check `.env.local` configuration
- Review console errors (development mode)
- Verify OpenRouter API key is valid
- Check Vercel deployment logs

---

## 🔄 Future Roadmap

- [ ] **Voice Input**: Real-time voice transcription with 5-second pause detection
- [ ] **Caregiver Dashboard**: Trusted person alerts and progress tracking
- [ ] **Backend Database**: Optional persistent cloud storage
- [ ] **Mobile App**: React Native version for iOS/Android
- [ ] **Multiple Models**: Support for other AI models via OpenRouter
- [ ] **Offline Support**: Fallback guidance when API unavailable
- [ ] **Evidence-Based Protocols**: Integration with SAMHSA treatment guidelines

---

## 📜 License

MIT License - See LICENSE file for details

---

## 🙏 Acknowledgments

- OpenRouter for free tier API access
- NVIDIA for Nemotron reasoning model
- Vercel for Next.js hosting
- Recovery community for feedback and requirements

---

## 📧 Contact

For questions or feedback about Sentinel AI:
- Open an issue on GitHub
- Contact the development team
- Visit our documentation

---

**Last Updated**: July 25, 2026  
**Status**: Hackathon Submission  
**Version**: 1.0.0-alpha

