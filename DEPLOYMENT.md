# Deployment Guide

This guide covers deploying BA-ITrading to various platforms.

## Table of Contents

1. [Vercel](#vercel)
2. [Netlify](#netlify)
3. [Docker](#docker)
4. [Heroku](#heroku)
5. [Railway](#railway)
6. [Render](#render)
7. [DigitalOcean](#digitalocean)
8. [AWS](#aws)

## Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Blake198511/BA-ITrading)

### Manual Deploy

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Add environment variables:
   - Go to your project settings on Vercel
   - Navigate to "Environment Variables"
   - Add all variables from `.env.example`

5. Redeploy:
   ```bash
   vercel --prod
   ```

## Netlify

### One-Click Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Blake198511/BA-ITrading)

### Manual Deploy

1. Install Netlify CLI:
   ```bash
   npm i -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Initialize:
   ```bash
   netlify init
   ```

4. Deploy:
   ```bash
   netlify deploy --prod
   ```

5. Add environment variables:
   - Go to Site settings → Build & deploy → Environment
   - Add all variables from `.env.example`

## Docker

### Build and Run Locally

```bash
# Build the image
docker build -t ba-itrading .

# Run the container
docker run -p 3000:3000 --env-file .env ba-itrading
```

### Using Docker Compose

```bash
# Start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

### Deploy to Docker Hub

```bash
# Tag the image
docker tag ba-itrading yourusername/ba-itrading:latest

# Push to Docker Hub
docker push yourusername/ba-itrading:latest
```

## Heroku

1. Install Heroku CLI:
   ```bash
   npm install -g heroku
   ```

2. Login:
   ```bash
   heroku login
   ```

3. Create app:
   ```bash
   heroku create your-app-name
   ```

4. Set environment variables:
   ```bash
   heroku config:set TRADING_API_KEY=your_key
   heroku config:set OPENAI_API_KEY=your_key
   # ... add all other variables
   ```

5. Deploy:
   ```bash
   git push heroku main
   ```

6. Open app:
   ```bash
   heroku open
   ```

## Railway

1. Go to [Railway](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your BA-ITrading repository
5. Add environment variables:
   - Click on your service
   - Go to "Variables" tab
   - Add all variables from `.env.example`
6. Railway will automatically deploy your app

## Render

1. Go to [Render](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - Name: ba-itrading
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variables:
   - Scroll to "Environment Variables"
   - Add all variables from `.env.example`
6. Click "Create Web Service"

## DigitalOcean

### Using App Platform

1. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Click "Create App"
3. Connect your GitHub repository
4. Configure:
   - Select Node.js as the environment
   - Build Command: `npm install`
   - Run Command: `npm start`
5. Add environment variables
6. Deploy

### Using Droplet

1. Create a Ubuntu droplet
2. SSH into your droplet
3. Install Node.js:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
4. Clone your repository:
   ```bash
   git clone https://github.com/Blake198511/BA-ITrading.git
   cd BA-ITrading
   ```
5. Install dependencies:
   ```bash
   npm install
   ```
6. Create `.env` file and add your API keys
7. Install PM2:
   ```bash
   sudo npm install -g pm2
   ```
8. Start the app:
   ```bash
   pm2 start server.js --name ba-itrading
   pm2 save
   pm2 startup
   ```

## AWS

### Using Elastic Beanstalk

1. Install EB CLI:
   ```bash
   pip install awsebcli
   ```

2. Initialize:
   ```bash
   eb init
   ```

3. Create environment:
   ```bash
   eb create ba-itrading-env
   ```

4. Set environment variables:
   ```bash
   eb setenv TRADING_API_KEY=your_key OPENAI_API_KEY=your_key
   ```

5. Deploy:
   ```bash
   eb deploy
   ```

### Using EC2

1. Launch an EC2 instance (Ubuntu)
2. SSH into the instance
3. Follow the same steps as DigitalOcean Droplet above

## Environment Variables

For all platforms, you need to set these environment variables:

### Required
- `TRADING_API_KEY`
- `TRADING_API_SECRET`
- `OPENAI_API_KEY` or `ANTHROPIC_API_KEY`

### Optional
- `PORT` (default: 3000)
- `NODE_ENV` (set to 'production' for production)
- `MARKET_DATA_API_KEY`
- `NEWS_API_KEY`
- `SESSION_SECRET`
- `JWT_SECRET`
- `DATABASE_URL`

## Post-Deployment

After deploying to any platform:

1. Visit your app URL
2. Check the Configuration Status section
3. Verify all required API keys are configured
4. Test the Trading Analysis feature
5. Test the Quick Pick feature
6. Monitor logs for any errors

## Troubleshooting

### Application not starting
- Check that all required environment variables are set
- Verify Node.js version is 18 or higher
- Check application logs

### API calls failing
- Verify API keys are correct
- Check API key permissions
- Ensure network access to external APIs

### Configuration warnings
- Review the Configuration Status page
- Add missing API keys
- Restart the application after adding keys

## Security Checklist

- [ ] All API keys are in environment variables
- [ ] `.env` file is not committed to git
- [ ] SESSION_SECRET is changed from default
- [ ] JWT_SECRET is changed from default
- [ ] HTTPS is enabled in production
- [ ] CORS is properly configured
- [ ] Rate limiting is considered for production

## Need Help?

Open an issue on GitHub or check the main README for support options.
