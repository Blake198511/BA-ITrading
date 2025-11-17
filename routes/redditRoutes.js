import express from 'express';

const router = express.Router();

const REDDIT_CLIENT_ID = process.env.REDDIT_CLIENT_ID || '';
const REDDIT_CLIENT_SECRET = process.env.REDDIT_CLIENT_SECRET || '';

/**
 * GET /reddit/ping
 * Check Reddit API connectivity
 */
router.get('/reddit/ping', async (req, res) => {
  try {
    const isConfigured = !!(REDDIT_CLIENT_ID && REDDIT_CLIENT_SECRET);

    res.json({
      timestamp: new Date().toISOString(),
      service: 'Reddit API',
      status: isConfigured ? 'configured' : 'not_configured',
      configured: isConfigured,
      message: isConfigured 
        ? 'Reddit API is configured and ready'
        : 'Set REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET in .env to enable Reddit data'
    });
  } catch (error) {
    console.error('Reddit ping error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    });
  }
});

/**
 * GET /reddit/sentiment/:subreddit
 * Get sentiment from a subreddit
 */
router.get('/reddit/sentiment/:subreddit', async (req, res) => {
  try {
    const { subreddit } = req.params;

    if (!REDDIT_CLIENT_ID || !REDDIT_CLIENT_SECRET) {
      return res.status(503).json({
        error: 'Service Unavailable',
        message: 'Reddit API not configured'
      });
    }

    // Mock sentiment - integrate with real Reddit API in production
    res.json({
      timestamp: new Date().toISOString(),
      subreddit,
      sentiment: {
        overall: 'bullish',
        score: 0.65,
        positive: 45,
        neutral: 35,
        negative: 20
      },
      topMentions: [
        { symbol: 'AAPL', mentions: 127, sentiment: 'positive' },
        { symbol: 'TSLA', mentions: 98, sentiment: 'neutral' },
        { symbol: 'NVDA', mentions: 76, sentiment: 'positive' }
      ],
      note: 'Mock data. Configure Reddit API for real sentiment.'
    });
  } catch (error) {
    console.error('Reddit sentiment error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    });
  }
});

export default router;
