import express from 'express';

const router = express.Router();

// Load ElevenLabs API credentials from environment
const ELEVEN_KEY = process.env.ELEVEN_KEY || '';
const ELEVEN_VOICE_ID = process.env.ELEVEN_VOICE_ID || '';

/**
 * POST /voice/speak
 * Evon AI text-to-speech endpoint using ElevenLabs
 */
router.post('/voice/speak', async (req, res) => {
  try {
    const { text, speed } = req.body;

    if (!text) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: 'Text is required' 
      });
    }

    // Check if ElevenLabs API is configured
    if (!ELEVEN_KEY) {
      return res.status(503).json({
        error: 'Service Unavailable',
        message: 'ElevenLabs API not configured. Please set ELEVEN_KEY in .env file'
      });
    }

    // Mock Evon voice response - in production, integrate with ElevenLabs API
    const response = {
      timestamp: new Date().toISOString(),
      text,
      voiceId: ELEVEN_VOICE_ID || 'default',
      speed: speed || 1.0,
      audioUrl: null,
      evonVoice: true,
      message: 'Evon voice synthesis would happen here using ElevenLabs API',
      note: `Configure ELEVEN_KEY and ELEVEN_VOICE_ID in .env for actual voice synthesis`,
      signature: 'Evon AI Voice',
      configured: !!ELEVEN_KEY
    };

    res.json(response);
  } catch (error) {
    console.error('Evon voice endpoint error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    });
  }
});

export default router;
