import express from 'express';

const router = express.Router();

const MARKET_DATA_API_KEY = process.env.MARKET_DATA_API_KEY || '';
const TRADING_API_KEY = process.env.TRADING_API_KEY || '';

/**
 * GET /market/ping
 * Check market data API connectivity
 */
router.get('/market/ping', async (req, res) => {
  try {
    const isConfigured = !!(MARKET_DATA_API_KEY || TRADING_API_KEY);

    res.json({
      timestamp: new Date().toISOString(),
      service: 'Market Data API',
      status: isConfigured ? 'configured' : 'not_configured',
      configured: isConfigured,
      message: isConfigured 
        ? 'Market data API is configured and ready'
        : 'Set MARKET_DATA_API_KEY or TRADING_API_KEY in .env to enable market data',
      mockData: {
        symbol: 'AAPL',
        price: 175.43,
        change: 2.15,
        changePercent: 1.24,
        volume: 52847392,
        note: 'This is mock data. Real data requires API configuration.'
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
 * Get quote for a specific symbol
 */
router.get('/market/quote/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;

    if (!MARKET_DATA_API_KEY && !TRADING_API_KEY) {
      return res.status(503).json({
        error: 'Service Unavailable',
        message: 'Market data API not configured'
      });
    }

    // Mock quote - integrate with real API in production
    res.json({
      timestamp: new Date().toISOString(),
      symbol: symbol.toUpperCase(),
      price: Math.random() * 200 + 50,
      change: Math.random() * 10 - 5,
      changePercent: Math.random() * 5 - 2.5,
      volume: Math.floor(Math.random() * 100000000),
      note: 'Mock data. Configure API for real quotes.'
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
