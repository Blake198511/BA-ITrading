import express from 'express';

const router = express.Router();

const NEWS_API_KEY = process.env.NEWS_API_KEY || '';

/**
 * GET /news/ping
 * Check news API connectivity
 */
router.get('/news/ping', async (req, res) => {
  try {
    const isConfigured = !!NEWS_API_KEY;

    res.json({
      timestamp: new Date().toISOString(),
      service: 'News API',
      status: isConfigured ? 'configured' : 'not_configured',
      configured: isConfigured,
      message: isConfigured 
        ? 'News API is configured and ready'
        : 'Set NEWS_API_KEY in .env to enable news feeds'
    });
  } catch (error) {
    console.error('News ping error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    });
  }
});

/**
 * GET /news/latest
 * Get latest trading news
 */
router.get('/news/latest', async (req, res) => {
  try {
    const { symbol, limit } = req.query;

    if (!NEWS_API_KEY) {
      return res.status(503).json({
        error: 'Service Unavailable',
        message: 'News API not configured. Set NEWS_API_KEY in .env'
      });
    }

    // Mock news - integrate with real API in production
    const mockNews = [
      {
        title: 'Market Analysis: Tech Stocks Rally',
        source: 'Financial Times',
        publishedAt: new Date().toISOString(),
        url: 'https://example.com/news/1',
        sentiment: 'positive'
      },
      {
        title: 'Fed Announces Interest Rate Decision',
        source: 'Bloomberg',
        publishedAt: new Date().toISOString(),
        url: 'https://example.com/news/2',
        sentiment: 'neutral'
      }
    ];

    res.json({
      timestamp: new Date().toISOString(),
      symbol: symbol || 'ALL',
      count: mockNews.length,
      news: mockNews.slice(0, limit || 10),
      note: 'Mock data. Configure NEWS_API_KEY for real news.'
    });
  } catch (error) {
    console.error('News latest error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    });
  }
});

export default router;
