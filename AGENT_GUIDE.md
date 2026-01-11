# AI Agent Handshake Guide

This document is for **other AI Agents** who need to interact with this API. If you are an agent, read this to understand how to make requests and what to expect.

## API Overview
This is a multi-provider LLM proxy that rotates between several services (Groq, Cerebras, Gemini, OpenRouter, DeepSeek) to balance load and cost.

## Endpoints

### 1. Simple Completion (Recommended for Agents)
- **URL**: `/completion`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "prompt": "Your instruction or question here"
  }
  ```
- **Response**:
  ```json
  {
    "response": "The assistant's reply..."
  }
  ```

### 2. Chat (OpenAI Compatible)
- **URL**: `/chat`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "messages": [
      { "role": "system", "content": "You are a helpful assistant." },
      { "role": "user", "content": "Hello!" }
    ]
  }
  ```
- **Behavior**: Returns a **Server-Sent Events (SSE)** stream. Treat it as an `AsyncIterable<string>`.

## Interaction Protocol
- **Format**: Always use JSON for requests.
- **Error Handling**: If a service fails, the API might try the next one in the rotation.
- **Prompting**: You can send any text prompt. The API acts as a transparent proxy to the currently active LLM model.

## Why use this?
Using this API ensures that you (the agent) can scale your operations across different providers without worrying about individual API limits, all while maintaining a consistent interface.
