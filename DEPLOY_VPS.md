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
API_PROXY_KEY=tu_clave_secreta_para_proteger_la_api
PORT=3000
```

## 4. Despliegue

1. Dale al botón **Deploy**.
2. Dokploy leerá el `nixpacks.toml` y arrancará el servidor usando Bun automáticamente.

## 5. Configurar Dominio (Opcional pero recomendado)

Para que tu API sea profesional (ej: `api.tu-dominio.com`):

1. En tu registrador de dominios (Cloudflare, GoDaddy, etc.):
   - Crea un registro **A** que apunte a la **IP de tu VPS**.
2. En Dokploy (dentro de tu aplicación):
   - Ve a la pestaña **Domains**.
   - Añade el dominio (ej: `ia.tu-negocio.com`).
   - Dokploy generará el certificado **SSL (HTTPS)** automáticamente.

## 6. Seguridad (Protección de Créditos)

He añadido una capa de seguridad para que nadie te use los créditos si descubren tu URL:
1. Asegúrate de poner algo en `API_PROXY_KEY` en Dokploy.
2. Cualquier petición (n8n, otros agentes) deberá llevar el header: 
   `Authorization: Bearer tu_clave_secreta`.
