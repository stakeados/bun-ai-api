import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AIService, ChatMessage } from '../types';

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const geminiService: AIService = {
  name: 'Gemini',
  async chat(messages: ChatMessage[]) {
    const history = messages.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const lastMessage = messages[messages.length - 1].content;

    const chat = model.startChat({
      history,
    });

    const result = await chat.sendMessageStream(lastMessage);

    return (async function* () {
      for await (const chunk of result.stream) {
        yield chunk.text();
      }
    })()
  },
  async complete(messages: ChatMessage[]) {
    if (!messages || messages.length === 0) return '';

    const history = messages.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const lastMessage = messages[messages.length - 1].content;

    const chat = model.startChat({
      history,
    });

    const result = await chat.sendMessage(lastMessage);
    return result.response.text();
  }
}
