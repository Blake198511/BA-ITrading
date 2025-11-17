import express from 'express';

const router = express.Router();

// Load OpenAI API key from environment
const OPENAI_KEY = process.env.OPENAI_KEY || '';

/**
 * POST /evon
 * Main Evon AI endpoint for trading analysis and recommendations
 */
router.post('/evon', async (req, res) => {
  try {
    const { prompt, symbol, market, riskLevel } = req.body;

    if (!prompt && !symbol) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: 'Either prompt or symbol is required' 
      });
    }

    // Check if AI API key is configured
    if (!OPENAI_KEY) {
      return res.status(503).json({
        error: 'Service Unavailable',
        message: 'AI API key not configured. Please set OPENAI_KEY in .env file'
      });
    }

    // Mock Evon AI response - in production, integrate with OpenAI API
    const response = {
      timestamp: new Date().toISOString(),
      query: prompt || `Analyze ${symbol}`,
      evonResponse: {
        greeting: "Hi, I'm Evon, your AI trading assistant.",
        recommendation: 'HOLD',
        confidence: 0.75,
        analysis: {
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
        voiceMessage: 'Based on my analysis, I recommend holding your position and waiting for a clear breakout signal.',
        aiProvider: 'OpenAI',
        signature: '- Evon AI'
      },
      note: 'This is a demo response from Evon. In production, this would use the configured OpenAI API.'
    };

    res.json(response);
  } catch (error) {
    console.error('AI endpoint error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    });
  }
});

export default router;
