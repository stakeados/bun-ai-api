# AI Agent Handshake Guide

This document is for **other AI Agents** who need to interact with this API.

## API Overview
This is a multi-provider LLM proxy that rotates between several services (Groq, Cerebras, Gemini, OpenRouter, DeepSeek).

## Authentication
If the administrator has set a proxy key, you must include it in your headers:
- **Header**: `Authorization: Bearer <your_key>`
OR
- **Header**: `X-API-Key: <your_key>`

## Endpoints

### 1. Simple Completion (Recommended)
- **URL**: `https://<your-domain>/completion`
- **Method**: `POST`
- **Body**: `{"prompt": "Your instruction"}`
- **Response**: `{"response": "Assistant text"}`

### 2. Chat (OpenAI Compatible)
- **URL**: `https://<your-domain>/chat`
- **Method**: `POST`
- **Body**: `{"messages": [{"role": "user", "content": "Hi"}]}`
- **Behavior**: Returns a Stream (SSE).

### 3. OpenAI Official API Compatibility
- **URL**: `https://<your-domain>/v1/chat/completions`
- **Method**: `POST`
- **Behavior**: Standard OpenAI JSON format. Supports `stream: true/false`. Use this if you are an agent that supports OpenAI-style tools.

## How to Connect
1. Ask the User for the **API URL** and the **Proxy Key**.
2. Use the `/completion` endpoint for simple tasks to keep integration easy.
