# Despliegue en VPS con Dokploy

Tu proyecto ya está preparado para **Dokploy** porque incluye un archivo `nixpacks.toml`. Sigue estos pasos para tenerlo corriendo en tu VPS en minutos.

## 1. Preparación en Dokploy

1. Entra en tu panel de Dokploy.
2. Crea un nuevo **Project**.
3. Crea un nuevo **Service** de tipo **Application**.

## 2. Configuración del Repositorio

1. Conecta tu repositorio de GitHub (o pega la URL pública).
2. En la pestaña **General**:
   - **Build Type**: Elige `Nixpacks` (lo detectará automáticamente por el archivo `nixpacks.toml`).
   - El puerto por defecto será el `3000`.

## 3. Variables de Entorno (Crucial)

Ve a la pestaña **Environment** y añade las siguientes llaves (usa tus valores reales):

```env
GROQ_API_KEY=tu_llave
CEREBRAS_API_KEY=tu_llave
GOOGLE_GENERATIVE_AI_API_KEY=tu_llave
OPENROUTER_API_KEY=tu_llave
DEEPSEEK_API_KEY=tu_llave
PORT=3000
```

## 4. Despliegue

1. Dale al botón **Deploy**.
2. Dokploy leerá el `nixpacks.toml` y arrancará el servidor usando Bun automáticamente.
3. Una vez termine, tendrás una URL pública (si has configurado un dominio) o podrás acceder vía IP en el puerto 3000.

---

> [!TIP]
> **¿Por qué Nixpacks?**
> He incluido un archivo `nixpacks.toml` que le dice a Dokploy exactamente cómo instalar Bun y arrancar tu API sin que tengas que configurar Docker manualmente.
