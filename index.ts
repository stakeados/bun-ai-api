import { groqService } from './services/groq';
import { cerebrasService } from './services/cerebras';
import { geminiService } from './services/gemini';
import { openRouterService } from './services/openrouter';
import { deepseekService } from './services/deepseek';
import type { AIService, ChatMessage } from './types';

const services: AIService[] = [
  groqService,
  cerebrasService,
  geminiService,
  openRouterService,
  deepseekService,
  // Google Gemini (Added!)
  // OpenRouter (Added!)
  // DeepSeek (Added!)
  // otro servicio incluso local
]
let currentServiceIndex = 0;

function getNextService() {
  const service = services[currentServiceIndex];
  currentServiceIndex = (currentServiceIndex + 1) % services.length;
  return service;
}

const server = Bun.serve({
  port: process.env.PORT ?? 3000,
  async fetch(req) {
    const { pathname } = new URL(req.url)

    // Simple Security Layer
    const proxyKey = process.env.API_PROXY_KEY;
    if (proxyKey) {
      const authHeader = req.headers.get('Authorization') || req.headers.get('X-API-Key');
      const providedKey = authHeader?.replace('Bearer ', '') || '';

      if (providedKey !== proxyKey) {
        return new Response("Unauthorized: Invalid API Key", { status: 401 });
      }
    }

    if (req.method === 'POST' && pathname === '/chat') {
      const { messages } = await req.json() as { messages: ChatMessage[] };
      const service = getNextService();

      console.log(`Using ${service?.name} service`);
      const stream = await service?.chat(messages)

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    if (req.method === 'POST' && pathname === '/completion') {
      const body = await req.json() as { messages?: ChatMessage[], prompt?: string };
      let messages: ChatMessage[] = [];

      if (body.messages) {
        messages = body.messages;
      } else if (body.prompt) {
        messages = [{ role: 'user', content: body.prompt }];
      } else {
        return new Response("Invalid request: messages or prompt required", { status: 400 });
      }

      const service = getNextService();
      console.log(`Using ${service?.name} service for completion`);
      const response = await service?.complete(messages);

      return new Response(JSON.stringify({ response }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response("Not found", { status: 404 });
  }
})

console.log(`Server is running on ${server.url}`);