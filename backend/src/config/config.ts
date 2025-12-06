import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const config = {
  server: {
    port: parseInt(process.env.PORT || '3001', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  openrouter: {
    apiKey: process.env.OPENROUTER_API_KEY || '',
    apiUrl: process.env.OPENROUTER_API_URL || 'https://openrouter.ai/api/v1',
    model: process.env.OPENROUTER_MODEL || 'gpt-4o-mini',
  },
  cors: {
    origins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5001', 'http://localhost:3000'],
  },
};

// Validate required configuration
if (!config.openrouter.apiKey) {
  console.warn('WARNING: OPENROUTER_API_KEY is not set. The API may not work correctly.');
}

export default config;
