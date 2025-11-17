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

// Production environment check
const isProduction = process.env.NODE_ENV === 'production';

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${req.method} ${req.path} ${res.statusCode} ${duration}ms`;
    
    if (isProduction) {
      // In production, only log errors and slow requests
      if (res.statusCode >= 400 || duration > 1000) {
        console.log(logMessage);
      }
    } else {
      // In development, log all requests
      console.log(logMessage);
    }
  });
  next();
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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
    version: '1.0.0',
    uptime: process.uptime(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      unit: 'MB'
    }
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

// Production readiness check endpoint
app.get('/api/readiness', (req, res) => {
  const checks = {
    environment: {
      nodeEnv: process.env.NODE_ENV || 'development',
      isProduction: process.env.NODE_ENV === 'production',
      status: 'ok'
    },
    security: {
      passwordProtection: !!process.env.APP_PASSWORD,
      sessionSecret: !!process.env.SESSION_SECRET,
      jwtSecret: !!process.env.JWT_SECRET,
      status: process.env.NODE_ENV === 'production' 
        ? (process.env.APP_PASSWORD ? 'ok' : 'warning')
        : 'ok',
      warning: process.env.NODE_ENV === 'production' && !process.env.APP_PASSWORD
        ? 'APP_PASSWORD not set - app is not password protected'
        : null
    },
    apiKeys: {
      openai: !!process.env.OPENAI_KEY,
      elevenLabs: !!process.env.ELEVEN_KEY,
      mongodb: !!process.env.MONGODB_URI,
      polygon: !!process.env.POLYGON_KEY,
      news: !!process.env.NEWS_API_KEY,
      status: process.env.OPENAI_KEY ? 'ok' : 'error',
      error: !process.env.OPENAI_KEY ? 'OPENAI_KEY is required for core functionality' : null
    },
    system: {
      uptime: process.uptime(),
      memory: process.memoryUsage().heapUsed,
      nodeVersion: process.version,
      status: 'ok'
    }
  };

  const allOk = checks.environment.status === 'ok' &&
                checks.security.status !== 'error' &&
                checks.apiKeys.status !== 'error' &&
                checks.system.status === 'ok';

  const overallStatus = allOk ? 'ready' : 'not_ready';
  const httpStatus = checks.apiKeys.status === 'error' ? 500 : 200;

  res.status(httpStatus).json({
    status: overallStatus,
    timestamp: new Date().toISOString(),
    checks,
    recommendations: [
      !process.env.OPENAI_KEY && 'Add OPENAI_KEY for core AI functionality',
      process.env.NODE_ENV === 'production' && !process.env.APP_PASSWORD && 'Add APP_PASSWORD for production security',
      !process.env.SESSION_SECRET && 'Add SESSION_SECRET for secure sessions',
      !process.env.JWT_SECRET && 'Add JWT_SECRET for secure tokens'
    ].filter(Boolean)
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
  const timestamp = new Date().toISOString();
  const errorId = Math.random().toString(36).substring(7);
  
  // Log error details
  console.error(`[${timestamp}] Error ${errorId}:`, {
    message: err.message,
    stack: isProduction ? undefined : err.stack,
    path: req.path,
    method: req.method
  });
  
  // Send appropriate error response
  const statusCode = err.status || 500;
  const response = {
    error: isProduction ? 'An error occurred' : err.message,
    errorId,
    timestamp
  };
  
  // Include stack trace in development
  if (!isProduction && err.stack) {
    response.stack = err.stack;
  }
  
  res.status(statusCode).json(response);
});

export default app;
