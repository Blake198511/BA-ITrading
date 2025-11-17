import express from 'express';

const router = express.Router();

// Load OpenAI/Anthropic API key from environment
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';

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

    // Check if AI API keys are configured
    if (!OPENAI_API_KEY && !ANTHROPIC_API_KEY) {
      return res.status(503).json({
        error: 'Service Unavailable',
        message: 'AI API keys not configured. Please set OPENAI_API_KEY or ANTHROPIC_API_KEY in .env file'
      });
    }

    // Mock Evon AI response - in production, integrate with OpenAI or Anthropic API
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
        aiProvider: OPENAI_API_KEY ? 'OpenAI' : 'Anthropic',
        signature: '- Evon AI'
      },
      note: 'This is a demo response from Evon. In production, this would use the configured AI API.'
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
