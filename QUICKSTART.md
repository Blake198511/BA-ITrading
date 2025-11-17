# 🚀 Evon AI - Quick Start Guide

Welcome to **Evon AI**, your advanced trading intelligence platform!

## What is Evon AI?

Evon AI is a fully integrated AI-powered trading platform that provides:
- 🤖 Intelligent AI chat assistant
- 🎤 Voice-enabled responses
- 📊 Real-time market scanning
- 📈 Options flow analysis
- 💭 Reddit sentiment tracking
- 📰 News aggregation
- ⚙️ Easy configuration management

## 🎯 Getting Started in 3 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Your API Keys
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your API keys
# Minimum required: OPENAI_API_KEY or ANTHROPIC_API_KEY
```

Example `.env` file:
```env
# Required for Evon AI to work
OPENAI_API_KEY=sk-your-openai-key-here

# Optional but recommended
TRADING_API_KEY=your_trading_api_key
MARKET_DATA_API_KEY=your_market_data_key
NEWS_API_KEY=your_news_api_key
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
```

### Step 3: Start Evon
```bash
npm start
```

Visit: **http://localhost:3000**

## 🎨 Evon AI Features

### 💬 Evon Chat
Ask Evon anything about trading, markets, or get AI-powered analysis:
- "Analyze AAPL stock"
- "What's the market sentiment today?"
- "Should I buy TSLA?"

### 🎤 Evon Voice
Hear Evon speak analysis and insights aloud (configure TTS API for real voice).

### 📊 Market Scanner
Get real-time quotes and market data for any symbol.

### 📈 Options Flow
Monitor unusual options activity and trading signals.

### 💭 Reddit Sentiment
Analyze social sentiment from r/wallstreetbets, r/stocks, and more.

### 📰 News Radar
Stay updated with the latest market news curated by Evon.

### ⚙️ Settings
Check your API configuration status and Evon's readiness.

## 📦 Deployment Options

### Vercel (Recommended)
```bash
vercel
```
Add environment variables in Vercel dashboard.

### Netlify
```bash
netlify deploy --prod
```
Add environment variables in Netlify dashboard.

### Docker
```bash
docker-compose up -d
```

### Heroku
```bash
heroku create
heroku config:set OPENAI_API_KEY=your_key
git push heroku main
```

## 🔧 Configuration

### Minimum Configuration (Demo Mode)
Just add one of these:
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`

Evon will work with mock data for other features.

### Full Configuration (Production)
Add all API keys in `.env`:
- AI: OpenAI or Anthropic
- Trading: Your broker's API
- Market Data: Real-time quotes
- News: News aggregation service
- Reddit: Social sentiment
- Voice: Text-to-speech (optional)

## 🌐 API Endpoints

- `GET /api/health` - System health
- `GET /api/config/status` - Configuration status
- `POST /api/evon` - Chat with Evon AI
- `POST /api/voice/speak` - Evon voice synthesis
- `GET /api/market/quote/:symbol` - Market quotes
- `GET /api/reddit/sentiment/:subreddit` - Reddit sentiment
- `GET /api/news/latest` - Latest news

## 🎯 Pro Tips

1. **Start Small**: Begin with just OpenAI API key to test Evon
2. **Add Gradually**: Add more API keys as you need more features
3. **Check Status**: Always check Settings to see what's configured
4. **Demo Mode**: Works great with mock data for testing
5. **Deploy Early**: Deploy to Vercel/Netlify for easy cloud access

## 🆘 Troubleshooting

**Evon won't start?**
- Check that Node.js 18+ is installed
- Run `npm install` again
- Check for error messages in console

**Evon says "not configured"?**
- Check `.env` file exists
- Verify API keys are correct
- Restart the server after adding keys

**Features not working?**
- Check Settings page for configuration status
- Some features need specific API keys
- Demo mode shows mock data

## 🎉 You're Ready!

Evon AI is now running and ready to assist with your trading decisions!

Remember: Evon is for educational purposes. Always do your own research before making trading decisions.

---

**Need help?** Check README.md or open an issue on GitHub.

**Evon AI - Advanced Trading Intelligence** 🚀
