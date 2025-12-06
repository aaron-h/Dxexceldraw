import express from 'express';
import cors from 'cors';
import config from './config/config';
import { configureRoutes } from './utils/routes';

// Create Express application
const app = express();

// Configure CORS
const corsOptions = {
  origin: '*', // Allow all origins for development, restrict in production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));

// Parse JSON requests
app.use(express.json());

// Parse URL-encoded requests
app.use(express.urlencoded({ extended: true }));

// Test direct route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'Excalidraw Mindmap Generator',
    },
  });
});

// Configure API routes
configureRoutes(app);

// Start the server
const PORT = config.server.port;
app.listen(PORT, () => {
  console.log(`\n🚀 Server is running on port ${PORT}`);
  console.log(`📝 Environment: ${config.server.nodeEnv}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`✅ Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📊 Mindmap Generator: http://localhost:${PORT}/api/mindmap/generate`);
  console.log(`\nPress Ctrl+C to stop the server`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});
