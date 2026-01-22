# 🚀 Bun AI API Proxy (Enhanced Fork)

¡Inteligencia Artificial con coste 0 y alto rendimiento! Este proyecto es una evolución del proxy de IA de @midudev, optimizado para ser un "todo en uno" de modelos de lenguaje usando **Bun**.

## ✨ Características Principales (Lo que hemos añadido)

- **🔄 Multi-Operador Inteligente**: Rotación automática entre 5 proveedores para maximizar límites gratuitos y velocidad.
- **🌐 Compatibilidad Oficial OpenAI**: Puedes usarlo como si fuera la API oficial de OpenAI en cualquier programa (Cursor, n8n, etc.).
- **⚡ Endpoint Simplificado**: `/completion` para recibir la respuesta de golpe (ideal para automatizaciones).
- **🔒 Seguridad Integrada**: Protegido por clave de acceso para evitar que otros usen tus créditos.
- **🐳 Despliegue en 1 Clic**: Preparado para **Dokploy** con soporte nativo de Nixpacks.

## 🛠️ Servicios Soportados

| Proveedor | Ventaja Principal | Estado |
| :--- | :--- | :--- |
| **Google Gemini** | Gran ventana de contexto y estabilidad | ✅ Añadido |
| **OpenRouter** | Acceso a 100+ modelos (GPT-4, Claude, etc.) | ✅ Añadido |
| **DeepSeek** | Rendimiento brutal a bajo coste | ✅ Añadido |
| **Groq** | Velocidad de respuesta instantánea | ✅ Nativo |
| **Cerebras** | Inferencia ultra-rápida | ✅ Nativo |

## 🚀 Inicio Rápido

1. **Instala Bun** (si aún no lo tienes):
   ```bash
   powershell -c "irm bun.sh/install.ps1 | iex"
   ```
2. **Configura tus llaves**:
   Copia `.env.example` a `.env` y rellena tus API Keys.
3. **¡A volar!**:
   ```bash
   bun dev
   ```

## 🔌 Integración

### Como API de OpenAI
Apunta tus programas a:
- **Base URL**: `http://tu-vps:3000/v1`
- **API Key**: Tu `API_PROXY_KEY` secreta.

### Con n8n (Sin código)
Usa el endpoint `/completion` para una integración directa sin lidiar con streams.

---

## 📚 Documentación Detallada
- [📖 Guía de Uso Completa](file:///HOW_TO_USE.md)
- [🤖 Guía para Agentes de IA](file:///AGENT_GUIDE.md)
- [☁️ Despliegue en VPS (Dokploy)](file:///DEPLOY_VPS.md)

---
*Hecho con ❤️ para mejorar la infraestructura de IA personal.*
