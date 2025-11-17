import express from 'express';

const router = express.Router();

// In-memory storage for demo (use real database in production)
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
        note: 'Using in-memory storage. Set DATABASE_URL for persistent storage.'
      });
    }

    const value = inMemoryDB[key];
    res.json({
      timestamp: new Date().toISOString(),
      key,
      value: value || null,
      exists: !!value
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
      note: 'Using in-memory storage. Set DATABASE_URL for persistent storage.'
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
