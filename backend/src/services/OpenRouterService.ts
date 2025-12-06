import axios, { AxiosInstance, AxiosResponse } from 'axios';
import config from '../config/config';

// Define types for OpenRouter API requests and responses
interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
}

interface OpenRouterChoice {
  index: number;
  message: {
    role: string;
    content: string;
  };
  finish_reason: string;
}

interface OpenRouterResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: OpenRouterChoice[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class OpenRouterService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: config.openrouter.apiUrl,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.openrouter.apiKey}`,
        'HTTP-Referer': `http://localhost:${config.server.port}`,
        'X-Title': 'Excalidraw Mindmap Generator',
      },
    });
  }

  /**
   * Send a request to the OpenRouter API
   * @param messages Array of messages to send to the API
   * @returns The response from the API
   */
  async generateText(messages: OpenRouterMessage[]): Promise<string> {
    try {
      const request: OpenRouterRequest = {
        model: config.openrouter.model,
        messages,
        temperature: 0.7,
        max_tokens: 2000,
        top_p: 1.0,
      };

      const response: AxiosResponse<OpenRouterResponse> = await this.axiosInstance.post(
        '/chat/completions',
        request
      );

      if (response.data.choices && response.data.choices.length > 0) {
        return response.data.choices[0].message.content;
      }

      throw new Error('No response from OpenRouter API');
    } catch (error) {
      console.error('Error calling OpenRouter API:', error);
      throw error;
    }
  }

  /**
   * Generate a mindmap structure from a given topic
   * @param topic The main topic for the mindmap
   * @param depth The depth of the mindmap
   * @returns The generated mindmap structure as a string
   */
  async generateMindmap(topic: string, depth: number = 3): Promise<string> {
    const systemPrompt = `You are a professional mindmap generator. Please generate a structured mindmap based on the given topic. The mindmap should have a clear hierarchy with the main topic at the center, followed by subtopics and their subtopics up to the specified depth. Use JSON format with the following structure:

{
  "topic": "Main Topic",
  "children": [
    {
      "topic": "Subtopic 1",
      "children": [
        {
          "topic": "Subtopic 1.1",
          "children": []
        }
      ]
    },
    {
      "topic": "Subtopic 2",
      "children": []
    }
  ]
}

Ensure that:
1. The JSON is valid and properly formatted
2. The mindmap has a logical structure
3. The topics are relevant to the main topic
4. The depth of the mindmap does not exceed the specified depth
5. Each node has a "topic" field and a "children" array
6. Do not include any explanations or additional text outside the JSON
`;

    const userPrompt = `Generate a mindmap for the topic: "${topic}" with a depth of ${depth}.`;

    const messages: OpenRouterMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    return await this.generateText(messages);
  }
}

export default new OpenRouterService();
