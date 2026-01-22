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
      if (!service) {
        return new Response("No services available", { status: 503 });
      }

      console.log(`[Chat] ${service.name}: Processing stream request`);
      const stream = await service.chat(messages)

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
      if (!service) {
        return new Response("No services available", { status: 503 });
      }

      console.log(`[Completion] ${service.name}: Processing non-streaming request`);
      const response = await service.complete(messages);

      return new Response(JSON.stringify({ response }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'POST' && (pathname === '/v1/chat/completions' || pathname === '/chat/completions')) {
      const body = await req.json() as { messages: ChatMessage[], stream?: boolean, model?: string };
      const { messages, stream = false } = body;
      const service = getNextService();
      if (!service) {
        return new Response("No services available", { status: 503 });
      }

      const modelName = body.model || "gpt-3.5-turbo";

      console.log(`[OpenAI] ${service.name}: Processing request for ${modelName}`);

      if (stream) {
        const responseStream = await service.chat(messages);
        if (!responseStream) {
          return new Response("Service failed to start stream", { status: 500 });
        }

        const encoder = new TextEncoder();
        const readable = new ReadableStream({
          async start(controller) {
            const id = `chatcmpl-${Math.random().toString(36).substring(7)}`;
            try {
              for await (const chunk of responseStream) {
                const data = JSON.stringify({
                  id,
                  object: 'chat.completion.chunk',
                  created: Math.floor(Date.now() / 1000),
                  model: modelName,
                  choices: [{
                    index: 0,
                    delta: { content: chunk },
                    finish_reason: null
                  }]
                });
                controller.enqueue(encoder.encode(`data: ${data}\n\n`));
              }
              controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            } catch (e) {
              console.error("Stream error:", e);
              controller.enqueue(encoder.encode(`data: {"error": "${(e as Error).message}"}\n\n`));
            } finally {
              controller.close();
            }
          }
        });

        return new Response(readable, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        });
      } else {
        const responseText = await service.complete(messages);
        if (responseText === undefined) {
          return new Response("Service failed to complete request", { status: 500 });
        }

        const id = `chatcmpl-${Math.random().toString(36).substring(7)}`;

        const openAIResponse = {
          id,
          object: 'chat.completion',
          created: Math.floor(Date.now() / 1000),
          model: modelName,
          choices: [{
            index: 0,
            message: {
              role: 'assistant',
              content: responseText
            },
            finish_reason: 'stop'
          }],
          usage: {
            prompt_tokens: -1, // We don't track tokens yet
            completion_tokens: -1,
            total_tokens: -1
          }
        };

        return new Response(JSON.stringify(openAIResponse), {
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    if (req.method === 'POST' && (pathname === '/v1/responses' || pathname === '/responses')) {
      const body = await req.json() as {
        input: Array<{ type: string, text?: string, content?: string, role?: string }>,
        model?: string
      };

      const messages: ChatMessage[] = body.input.map(item => {
        if (item.type === 'message') {
          return {
            role: (item.role as any) || 'user',
            content: item.content || item.text || ''
          };
        }
        return {
          role: 'user',
          content: item.text || item.content || ''
        };
      });

      const service = getNextService();
      if (!service) {
        return new Response("No services available", { status: 503 });
      }

      console.log(`[Codex] ${service.name}: Processing responses request`);
      const responseText = await service.complete(messages);

      if (responseText === undefined) {
        return new Response("Service failed to complete request", { status: 500 });
      }

      const codexResponse = {
        content: responseText,
        type: 'text',
        model: body.model || 'gpt-5.2-codex' // Return what they expect
      };

      return new Response(JSON.stringify(codexResponse), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response("Not found", { status: 404 });
  }
})

console.log(`Server is running on ${server.url}`);