# 🚀 Evon AI Trading Platform

**Advanced Trading Intelligence System** - A fully integrated AI-powered trading platform ready to deploy to any platform or browser. Just load your API keys from the `.env` file!

## ✨ Features

- 🤖 **Evon AI Chat**: Intelligent trading assistant powered by OpenAI/Anthropic
- 🎤 **Evon Voice**: Text-to-speech responses for hands-free trading
- 📊 **Evon Market Scanner**: Real-time market analysis and quotes
- 📈 **Evon Options Flow**: Track unusual options activity
- 💭 **Evon Reddit Sentiment**: Social sentiment analysis from trading subreddits
- 📰 **Evon News Radar**: Latest market news curated by AI
- ⚙️ **Evon Settings**: Easy configuration and status monitoring
- 🌐 **Multi-Platform**: Deploy to Vercel, Netlify, Docker, or any Node.js platform
- 🔐 **Secure**: All API keys loaded from environment variables
- 💼 **Modern UI**: Beautiful, responsive web interface with dark mode
- 🔄 **Real-time**: Live market data and analysis

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- API keys for trading and AI services

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Blake198511/BA-ITrading.git
   cd BA-ITrading
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API keys:
   ```env
   # Evon AI Configuration
   OPENAI_API_KEY=your_openai_api_key_here
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   
   # Trading APIs
   TRADING_API_KEY=your_trading_api_key_here
   MARKET_DATA_API_KEY=your_market_data_api_key_here
   
   # Social & News
   REDDIT_CLIENT_ID=your_reddit_client_id_here
   REDDIT_CLIENT_SECRET=your_reddit_client_secret_here
   NEWS_API_KEY=your_news_api_key_here
   ```

4. **Start the application**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

   You'll see the Evon AI interface with:
   - **Evon Chat** - Chat with your AI trading assistant
   - **Evon Voice** - Hear Evon speak analysis aloud
   - **Market Scanner** - Real-time market data
   - **Options Flow** - Unusual options activity
   - **Reddit Sentiment** - Social trading sentiment
   - **News Radar** - Latest market news
   - **Settings** - Configuration and status

## 🔧 Configuration

All configuration is done through environment variables in the `.env` file:

### Required Variables (for full functionality)

- `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` - Powers Evon AI intelligence
- `TRADING_API_KEY` - Your trading platform API key (optional for demo)
- `MARKET_DATA_API_KEY` - Market data provider (optional for demo)

### Optional Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `NEWS_API_KEY` - News service API key
- `REDDIT_CLIENT_ID` + `REDDIT_CLIENT_SECRET` - Reddit API credentials
- `DATABASE_URL` - Database connection string
- `ELEVENLABS_API_KEY` - Text-to-speech API for Evon Voice

See `.env.example` for a complete list of available configuration options.

## 📦 Deployment

### Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Add your environment variables in the Vercel dashboard

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Blake198511/BA-ITrading)

### Deploy to Netlify

1. Install Netlify CLI: `npm i -g netlify-cli`
2. Run: `netlify deploy`
3. Add your environment variables in the Netlify dashboard

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Blake198511/BA-ITrading)

### Deploy with Docker

```bash
# Build the image
docker build -t ba-itrading .

# Run with environment file
docker run -p 3000:3000 --env-file .env ba-itrading
```

Or use Docker Compose:

```bash
docker-compose up -d
```

### Deploy to Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set TRADING_API_KEY=your_key
heroku config:set OPENAI_API_KEY=your_key

# Deploy
git push heroku main
```

### Deploy to Railway

1. Go to [Railway](https://railway.app)
2. Connect your GitHub repository
3. Add environment variables
4. Deploy automatically

### Deploy to Render

1. Go to [Render](https://render.com)
2. Create a new Web Service
3. Connect your repository
4. Add environment variables
5. Deploy

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run in development mode with auto-reload
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## 📚 API Documentation

### Health Check
```
GET /api/health
```
Returns Evon system health status.

### Configuration Status
```
GET /api/config/status
```
Returns configuration status for all Evon services.

### Evon AI Chat
```
POST /api/evon
Content-Type: application/json

{
  "prompt": "Analyze AAPL stock",
  "symbol": "AAPL"
}
```
Chat with Evon AI for trading insights and analysis.

### Evon Voice
```
POST /api/voice/speak
Content-Type: application/json

{
  "text": "Hello, I'm Evon",
  "speed": 1.0
}
```
Generate Evon voice responses.

### Market Scanner
```
GET /api/market/quote/:symbol
```
Get real-time market quotes analyzed by Evon.

### Reddit Sentiment
```
GET /api/reddit/sentiment/:subreddit
```
Analyze social sentiment from trading subreddits.

### News Radar
```
GET /api/news/latest?symbol=AAPL
```
Get latest market news curated by Evon.

### Database
```
GET  /api/db/read?key=mykey
POST /api/db/write
```
Read and write data to the database.

## 🔒 Security

- ✅ All API keys stored in environment variables
- ✅ No sensitive data in source code
- ✅ CORS enabled for browser access
- ✅ Input validation on all endpoints
- ✅ Production-ready error handling
- ✅ Secure session and JWT secrets

**Important**: Never commit your `.env` file to version control. It's already in `.gitignore`.

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## ⚠️ Disclaimer

This software is for educational purposes only. Evon AI provides analysis and insights but is not financial advice. Use at your own risk. Always do your own research before making any trading decisions.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Evon AI - Advanced Trading Intelligence** | Made with ❤️ for traders and developers 
