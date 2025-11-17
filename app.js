import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Import routes
import evonRoutes from './routes/evonRoutes.js';
import voiceRoutes from './routes/voiceRoutes.js';
import dbRoutes from './routes/dbRoutes.js';
import marketRoutes from './routes/marketRoutes.js';
import newsRoutes from './routes/newsRoutes.js';
import redditRoutes from './routes/redditRoutes.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple session middleware for password protection
const sessions = new Map();

// Password authentication endpoint
app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;
  const appPassword = process.env.APP_PASSWORD;

  // If no password is set in env, allow access
  if (!appPassword) {
    const sessionId = Math.random().toString(36).substring(7);
    res.json({ success: true, sessionId, message: 'No password required' });
    return;
  }

  if (password === appPassword) {
    const sessionId = Math.random().toString(36).substring(7);
    sessions.set(sessionId, { authenticated: true, timestamp: Date.now() });
    res.json({ success: true, sessionId });
  } else {
    res.status(401).json({ success: false, message: 'Invalid password' });
  }
});

// Password verification endpoint
app.post('/api/auth/verify', (req, res) => {
  const { sessionId } = req.body;
  const appPassword = process.env.APP_PASSWORD;

  // If no password is set in env, allow access
  if (!appPassword) {
    res.json({ authenticated: true });
    return;
  }

  const session = sessions.get(sessionId);
  if (session && session.authenticated) {
    // Session valid for 24 hours
    if (Date.now() - session.timestamp < 24 * 60 * 60 * 1000) {
      res.json({ authenticated: true });
      return;
    } else {
      sessions.delete(sessionId);
    }
  }

  res.json({ authenticated: false });
});

// Serve static files from public directory
app.use(express.static(join(__dirname, 'public')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// Configuration status endpoint
app.get('/api/config/status', (req, res) => {
  const configStatus = {
    ai: {
      openai: !!process.env.OPENAI_KEY,
      configured: !!process.env.OPENAI_KEY
    },
    voice: {
      elevenLabs: !!process.env.ELEVEN_KEY,
      voiceId: !!process.env.ELEVEN_VOICE_ID,
      configured: !!(process.env.ELEVEN_KEY && process.env.ELEVEN_VOICE_ID)
    },
    database: {
      mongodb: !!process.env.MONGODB_URI,
      configured: !!process.env.MONGODB_URI
    },
    market: {
      polygon: !!process.env.POLYGON_KEY,
      configured: !!process.env.POLYGON_KEY
    },
    services: {
      news: !!process.env.NEWS_API_KEY
    }
  };

  const ready = configStatus.ai.configured;

  res.json({
    status: 'ok',
    configuration: configStatus,
    ready,
    timestamp: new Date().toISOString()
  });
});

// Mount route handlers
app.use('/api', evonRoutes);
app.use('/api', voiceRoutes);
app.use('/api', dbRoutes);
app.use('/api', marketRoutes);
app.use('/api', newsRoutes);
app.use('/api', redditRoutes);

// Legacy endpoints for backward compatibility
app.post('/api/trading/analyze', async (req, res) => {
  try {
    const { symbol, timeframe } = req.body;
    
    if (!symbol) {
      return res.status(400).json({ error: 'Symbol is required' });
    }

    const analysis = {
      symbol,
      timeframe: timeframe || '1h',
      timestamp: new Date().toISOString(),
      recommendation: 'HOLD',
      confidence: 0.75,
      signals: {
        technical: 'NEUTRAL',
        sentiment: 'POSITIVE',
        volume: 'MODERATE'
      },
      reasons: [
        'Market showing consolidation pattern',
        'Volume within normal range',
        'Sentiment indicators neutral to positive'
      ],
      nextAction: 'Wait for breakout confirmation',
      note: 'This is a demo response. Configure AI API keys for real analysis.'
    };

    res.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Analysis failed', message: error.message });
  }
});

app.post('/api/trading/quick-pick', async (req, res) => {
  try {
    const { market, riskLevel } = req.body;

    const quickPick = {
      timestamp: new Date().toISOString(),
      market: market || 'stocks',
      riskLevel: riskLevel || 'medium',
      picks: [
        {
          symbol: 'AAPL',
          action: 'BUY',
          confidence: 0.82,
          reason: 'Strong technical indicators and positive momentum'
        },
        {
          symbol: 'MSFT',
          action: 'HOLD',
          confidence: 0.68,
          reason: 'Consolidating near resistance, wait for breakout'
        },
        {
          symbol: 'GOOGL',
          action: 'BUY',
          confidence: 0.75,
          reason: 'Favorable market conditions and strong fundamentals'
        }
      ],
      note: 'This is a demo response. Configure AI API keys for real quick picks.'
    };

    res.json(quickPick);
  } catch (error) {
    console.error('Quick pick error:', error);
    res.status(500).json({ error: 'Quick pick failed', message: error.message });
  }
});

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString()
  });
});

export default app;
