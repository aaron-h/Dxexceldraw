# AI Mindmap Generator Backend

A backend service for generating mindmaps using AI and converting them to Excalidraw-compatible elements.

## Features

- **AI-Powered Mindmap Generation**: Uses OpenRouter API to generate structured mindmaps from user topics
- **Excalidraw Integration**: Converts generated mindmaps to Excalidraw-compatible elements
- **RESTful API**: Simple and intuitive API interface
- **TypeScript**: Built with TypeScript for type safety
- **Environment Configuration**: Easy configuration with environment variables

## Installation

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Steps

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies
4. Configure environment variables
5. Build and run the server

```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env file with your configuration

# Build the project
npm run build

# Run the server
npm start

# Or run in development mode
npm run dev
```

## Configuration

### Environment Variables

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `PORT` | Server port | 3002 |
| `NODE_ENV` | Environment mode | development |
| `OPENROUTER_API_KEY` | OpenRouter API key | - |
| `OPENROUTER_API_URL` | OpenRouter API endpoint | https://openrouter.ai/api/v1 |
| `OPENROUTER_MODEL` | AI model to use | gpt-4o-mini |
| `CORS_ORIGINS` | Allowed CORS origins | http://localhost:5001,http://localhost:3000 |

## API Endpoints

### Health Check

- **URL**: `GET /api/health`
- **Description**: Check if the server is running
- **Response**: JSON with server status

**Example Response**:
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2025-12-06T03:05:26.441Z",
    "service": "Excalidraw Mindmap Generator"
  }
}
```

### Generate Mindmap

- **URL**: `POST /api/mindmap/generate`
- **Description**: Generate a mindmap from a given topic and convert it to Excalidraw elements
- **Request Body**:
  - `topic` (required): The main topic for the mindmap (string)
  - `depth` (optional): The depth of the mindmap (number, 1-5, default: 3)
  - `style` (optional): The style of the mindmap (string, default: "default")

**Request Example**:
```json
{
  "topic": "人工智能",
  "depth": 2,
  "style": "default"
}
```

**Response**:
- Success: JSON with Excalidraw elements
- Error: JSON with error message

**Success Response Example**:
```json
{
  "success": true,
  "data": {
    "elements": [
      {
        "id": "abc123",
        "type": "rectangle",
        "x": 500,
        "y": 200,
        "width": 200,
        "height": 60,
        "text": "人工智能",
        // ... other Excalidraw element properties
      },
      // ... more elements and arrows
    ],
    "statistics": {
      "nodeCount": 10,
      "maxDepth": 2,
      "topic": "人工智能",
      "depth": 2,
      "style": "default"
    }
  }
}
```

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # API controllers
│   ├── services/        # Business logic services
│   ├── utils/           # Utility functions
│   └── index.ts         # Application entry point
├── dist/                # Compiled JavaScript files
├── .env                 # Environment variables
├── .env.example         # Environment variables example
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── README.md            # This file
```

## Services

### OpenRouterService

Handles communication with the OpenRouter API for AI text generation.

### MindmapService

Manages mindmap generation, parsing, and validation.

### ExcalidrawConversionService

Converts mindmap structures to Excalidraw-compatible elements with proper positioning and styling.

## Development

### Build

```bash
npm run build
```

### Run in Development Mode

```bash
npm run dev
```

### Linting and Formatting

The project uses ESLint for linting and Prettier for formatting. These tools can be configured as needed.

## Deployment

### Docker

A Dockerfile can be added to containerize the application. Example Dockerfile:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY dist ./dist
COPY .env ./

EXPOSE 3002

CMD ["node", "dist/index.js"]
```

### Environment Variables for Production

- Use a secure OpenRouter API key
- Set `NODE_ENV` to `production`
- Configure appropriate CORS origins
- Use HTTPS in production

## Usage with Excalidraw

The generated Excalidraw elements can be directly imported into Excalidraw using the Excalidraw API or by adding them to the scene.

Example usage in Excalidraw:

```javascript
// Assuming you have the Excalidraw app instance
const response = await fetch('http://localhost:3002/api/mindmap/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ topic: '人工智能', depth: 2 }),
});

const data = await response.json();
if (data.success) {
  // Add elements to Excalidraw scene
  excalidrawAPI.updateScene({
    elements: data.data.elements,
    appState: {
      // Optional: Update app state if needed
    },
  });
}
```

## Error Handling

The API returns appropriate HTTP status codes and error messages for different scenarios:

- `400`: Bad request (invalid parameters)
- `401`: Unauthorized (invalid API key)
- `500`: Internal server error
- `502`: Bad gateway (AI API error)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
