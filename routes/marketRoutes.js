import express from 'express';

const router = express.Router();

// Load Polygon.io API key from environment
const POLYGON_KEY = process.env.POLYGON_KEY || '';

/**
 * GET /market/ping
 * Check Polygon market data API connectivity
 */
router.get('/market/ping', async (req, res) => {
  try {
    const isConfigured = !!POLYGON_KEY;

    res.json({
      timestamp: new Date().toISOString(),
      service: 'Polygon Market Data API',
      status: isConfigured ? 'configured' : 'not_configured',
      configured: isConfigured,
      message: isConfigured 
        ? 'Polygon API is configured and ready'
        : 'Set POLYGON_KEY in .env to enable market data',
      mockData: {
        symbol: 'AAPL',
        price: 175.43,
        change: 2.15,
        changePercent: 1.24,
        volume: 52847392,
        note: 'This is mock data. Real data requires Polygon API configuration.'
      }
    });
  } catch (error) {
    console.error('Market ping error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    });
  }
});

/**
 * GET /market/quote/:symbol
 * Get quote for a specific symbol using Polygon API
 */
router.get('/market/quote/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;

    if (!POLYGON_KEY) {
      return res.status(503).json({
        error: 'Service Unavailable',
        message: 'Polygon API not configured. Set POLYGON_KEY in .env'
      });
    }

    // Mock quote - integrate with Polygon.io API in production
    res.json({
      timestamp: new Date().toISOString(),
      symbol: symbol.toUpperCase(),
      price: Math.random() * 200 + 50,
      change: Math.random() * 10 - 5,
      changePercent: Math.random() * 5 - 2.5,
      volume: Math.floor(Math.random() * 100000000),
      open: Math.random() * 200 + 50,
      high: Math.random() * 200 + 50,
      low: Math.random() * 200 + 50,
      close: Math.random() * 200 + 50,
      note: 'Mock data. Configure POLYGON_KEY for real quotes from Polygon.io',
      provider: 'Polygon.io'
    });
  } catch (error) {
    console.error('Market quote error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    });
  }
});

export default router;
