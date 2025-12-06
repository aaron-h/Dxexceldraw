import { Express } from 'express';
import MindmapController from '../controllers/MindmapController';

/**
 * Configure API routes for the application
 * @param app Express application instance
 */
export const configureRoutes = (app: Express): void => {
  // API version prefix
  const apiPrefix = '/api';
  
  // Health check endpoint
  app.get(`${apiPrefix}/health`, MindmapController.healthCheck);
  
  // Mindmap endpoints
  app.post(`${apiPrefix}/mindmap/generate`, MindmapController.generateMindmap);
  
  // Add more routes here as needed
};
