import type { AIService, ChatMessage } from '../types';

export const openRouterService: AIService = {
    name: 'OpenRouter',
    async chat(messages: ChatMessage[]) {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "google/gemini-flash-1.5", // Modelo por defecto, se puede cambiar
                "messages": messages,
                "stream": true
            })
        });

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        return (async function* () {
            if (!reader) return;
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value);
                const lines = chunk.split('\n').filter(line => line.trim() !== '');
                for (const line of lines) {
                    if (line.includes('[DONE]')) break;
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            yield data.choices[0]?.delta?.content || '';
                        } catch (e) {
                            // Ignorar errores de parseo de chunks incompletos
                        }
                    }
                }
            }
        })();
    },
    async complete(messages: ChatMessage[]) {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "google/gemini-flash-1.5",
                "messages": messages
            })
        });

        const data = await response.json();
        return (data as any).choices[0]?.message?.content || '';
    }
}
