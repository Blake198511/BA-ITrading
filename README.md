# 🚀 BA-ITrading

**Quick Pick A.I Trading System** - A fully integrated AI-powered trading application ready to deploy to any platform or browser.

## ✨ Features

- 🤖 **AI-Powered Analysis**: Intelligent trading recommendations using AI
- ⚡ **Quick Pick System**: Get instant trading suggestions
- 📊 **Market Analysis**: Comprehensive technical and sentiment analysis
- 🌐 **Multi-Platform**: Deploy to Vercel, Netlify, Docker, or any Node.js platform
- 🔐 **Secure Configuration**: All API keys loaded from environment variables
- 💼 **Modern UI**: Beautiful, responsive web interface
- 🔄 **Real-time Updates**: Live market data and analysis

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
   TRADING_API_KEY=your_trading_api_key_here
   TRADING_API_SECRET=your_trading_api_secret_here
   OPENAI_API_KEY=your_openai_api_key_here
   # ... add other keys as needed
   ```

4. **Start the application**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

All configuration is done through environment variables in the `.env` file:

### Required Variables (for full functionality)

- `TRADING_API_KEY` - Your trading platform API key
- `TRADING_API_SECRET` - Your trading platform API secret
- `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` - AI service API key

### Optional Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `MARKET_DATA_API_KEY` - Market data provider API key
- `NEWS_API_KEY` - News service API key
- `DATABASE_URL` - Database connection string (if needed)

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
Returns server health status.

### Configuration Status
```
GET /api/config/status
```
Returns configuration status for all services.

### Trading Analysis
```
POST /api/trading/analyze
Content-Type: application/json

{
  "symbol": "AAPL",
  "timeframe": "1d"
}
```
Returns AI-powered trading analysis for the specified symbol.

### Quick Pick
```
POST /api/trading/quick-pick
Content-Type: application/json

{
  "market": "stocks",
  "riskLevel": "medium"
}
```
Returns AI-suggested trading picks based on market and risk level.

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

This software is for educational purposes only. It is not financial advice. Use at your own risk. Always do your own research before making any trading decisions.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Made with ❤️ for traders and developers** 
