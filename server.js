import app from './app.js';

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log('');
  console.log('🚀 BA-ITrading Server Started');
  console.log('================================');
  console.log(`📍 URL: http://${HOST}:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('');
  console.log('API Endpoints:');
  console.log('  Health & Config:');
  console.log('    GET  /api/health');
  console.log('    GET  /api/config/status');
  console.log('    GET  /api/readiness');
  console.log('');
  console.log('  AI & Trading:');
  console.log('    POST /api/evon');
  console.log('    POST /api/trading/analyze');
  console.log('    POST /api/trading/quick-pick');
  console.log('');
  console.log('  Voice:');
  console.log('    POST /api/voice/speak');
  console.log('');
  console.log('  Database:');
  console.log('    GET  /api/db/read');
  console.log('    POST /api/db/write');
  console.log('');
  console.log('  Market Data:');
  console.log('    GET  /api/market/ping');
  console.log('    GET  /api/market/quote/:symbol');
  console.log('');
  console.log('  News:');
  console.log('    GET  /api/news/ping');
  console.log('    GET  /api/news/latest');
  console.log('');
  console.log('  Reddit:');
  console.log('    GET  /api/reddit/ping');
  console.log('    GET  /api/reddit/sentiment/:subreddit');
  console.log('');
  console.log('💡 Tip: Copy .env.example to .env and add your API keys');
  console.log('================================');
  console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default server;
