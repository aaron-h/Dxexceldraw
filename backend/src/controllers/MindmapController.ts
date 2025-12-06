import { Request, Response } from 'express';
import MindmapService from '../services/MindmapService';
import ExcalidrawConversionService, { ExcalidrawElement } from '../services/ExcalidrawConversionService';

class MindmapController {
  /**
   * Generate a mindmap and convert it to Excalidraw elements
   * @param req Express request object
   * @param res Express response object
   */
  async generateMindmap(req: Request, res: Response): Promise<void> {
    try {
      // Extract request parameters
      const { topic, depth = 3, style = 'default' } = req.body;
      
      // Validate required parameters
      if (!topic || typeof topic !== 'string') {
        res.status(400).json({
          success: false,
          error: 'Invalid topic parameter. Topic must be a non-empty string.',
        });
        return;
      }
      
      if (typeof depth !== 'number' || depth < 1 || depth > 5) {
        res.status(400).json({
          success: false,
          error: 'Invalid depth parameter. Depth must be a number between 1 and 5.',
        });
        return;
      }
      
      console.log(`Generating mindmap for topic: "${topic}" with depth: ${depth}`);
      
      // Generate mindmap structure using AI
      const mindmap = await MindmapService.generateMindmap(topic, depth);
      
      // Convert mindmap to Excalidraw elements
      const excalidrawElements = ExcalidrawConversionService.convertToExcalidrawElements(mindmap);
      
      // Calculate statistics
      const nodeCount = MindmapService.calculateNodeCount(mindmap);
      const maxDepth = MindmapService.calculateMaxDepth(mindmap);
      
      // Prepare response
      res.status(200).json({
        success: true,
        data: {
          elements: excalidrawElements,
          statistics: {
            nodeCount,
            maxDepth,
            topic,
            depth,
            style,
          },
        },
      });
    } catch (error) {
      console.error('Error generating mindmap:', error);
      
      // Determine error type and status code
      let statusCode = 500;
      let errorMessage = 'Internal server error';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        if (errorMessage.includes('Invalid mindmap structure')) {
          statusCode = 502;
        } else if (errorMessage.includes('Invalid')) {
          statusCode = 400;
        }
      }
      
      res.status(statusCode).json({
        success: false,
        error: errorMessage,
      });
    }
  }

  /**
   * Health check endpoint
   * @param req Express request object
   * @param res Express response object
   */
  async healthCheck(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).json({
        success: true,
        data: {
          status: 'ok',
          timestamp: new Date().toISOString(),
          service: 'Excalidraw Mindmap Generator',
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Health check failed',
      });
    }
  }
}

export default new MindmapController();
