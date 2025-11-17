import express from 'express';

const router = express.Router();

// Load MongoDB URI from environment
const MONGODB_URI = process.env.MONGODB_URI || '';

// In-memory storage for demo (use MongoDB in production)
const inMemoryDB = {};

/**
 * GET /db/read
 * Read data from database
 */
router.get('/db/read', async (req, res) => {
  try {
    const { key } = req.query;

    if (!key) {
      // Return all data
      return res.json({
        timestamp: new Date().toISOString(),
        data: inMemoryDB,
        note: MONGODB_URI 
          ? 'MongoDB configured. In production, this would query MongoDB.' 
          : 'Using in-memory storage. Set MONGODB_URI for persistent storage.',
        dbConfigured: !!MONGODB_URI
      });
    }

    const value = inMemoryDB[key];
    res.json({
      timestamp: new Date().toISOString(),
      key,
      value: value || null,
      exists: !!value,
      note: MONGODB_URI 
        ? 'MongoDB configured. In production, this would query MongoDB.' 
        : 'Using in-memory storage. Set MONGODB_URI for persistent storage.',
      dbConfigured: !!MONGODB_URI
    });
  } catch (error) {
    console.error('DB read error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    });
  }
});

/**
 * POST /db/write
 * Write data to database
 */
router.post('/db/write', async (req, res) => {
  try {
    const { key, value } = req.body;

    if (!key) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: 'Key is required' 
      });
    }

    inMemoryDB[key] = value;

    res.json({
      timestamp: new Date().toISOString(),
      key,
      value,
      success: true,
      note: MONGODB_URI 
        ? 'MongoDB configured. In production, this would write to MongoDB.' 
        : 'Using in-memory storage. Set MONGODB_URI for persistent storage.',
      dbConfigured: !!MONGODB_URI
    });
  } catch (error) {
    console.error('DB write error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    });
  }
});

export default router;
