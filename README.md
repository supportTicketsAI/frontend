# 🎨 AI Support Co-Pilot - Frontend Dashboard

Dashboard interactivo de React + TypeScript para monitorear y gestionar tickets de soporte con IA en tiempo real.

## 🎯 Características Principales

- ✅ **Dashboard en Tiempo Real** - Visualización de tickets con Supabase Realtime
- ✅ **Interfaz Moderna** - React 19 + TypeScript + Tailwind CSS
- ✅ **Integración IA** - Comunicación directa con backend Python/FastAPI
- ✅ **Categorización Visual** - Colores y iconos para cada tipo de ticket
- ✅ **Análisis de Sentimiento** - Indicadores visuales de sentimientos
- ✅ **Notificaciones** - Toast notifications para acciones del usuario
- ✅ **Panel de Pruebas** - Crear tickets de prueba para demostrar funcionalidad

## 🚀 Ejecución Rápida

### 1. Configurar Variables de Entorno
```bash
# El archivo .env ya está configurado con Supabase
# Verifica que las URLs sean correctas
cat .env
```

### 2. Instalar Dependencias
```bash
npm install
# O con bun (más rápido)
bun install
```

### 3. Ejecutar con Script Automático
```bash
# Método 1: Script automático
./run.sh

# Método 2: Comando directo
npm run dev
```

### 4. Verificar Conexión
- 🌐 **Frontend**: http://localhost:5173
- 🔗 **Backend requerido**: http://localhost:8000
- 📚 **Docs Backend**: http://localhost:8000/docs

## 🎨 Componentes Principales

### `DashboardPage.tsx`
- Layout principal con navegación
- Header con estado del sistema
- Panel de control principal

### `TicketList.tsx`
- Lista de tickets con Supabase Realtime
- Actualización automática sin refresh
- Skeleton loading states

### `TicketCard.tsx`
- Visualización individual de cada ticket
- Botón "Procesar con IA" integrado
- Indicadores de estado y confianza

### `TestTicketCreator.tsx`
- Panel para crear tickets de prueba
- Verificar conectividad del backend
- Demostración de funcionalidad

## 🔗 Integración con Backend

### API Endpoints Utilizados
```typescript
const API_CONFIG = {
    BASE_URL: 'http://localhost:8000/api/v1',
    ENDPOINTS: {
        PROCESS_TICKET: '/process-ticket',    // Procesar con IA
        GET_TICKETS: '/tickets',              // Obtener tickets
        HEALTH: '/health',                    // Health check
        WEBSOCKET: '/ws'                      // WebSocket en tiempo real
    }
}
```

### Flujo de Datos
1. **Usuario crea ticket** → TestTicketCreator
2. **Frontend envía a backend** → `/process-ticket`
3. **Backend procesa con IA** → Gemini/OpenAI
4. **Backend actualiza Supabase** → Tabla tickets
5. **Frontend recibe actualización** → Supabase Realtime
6. **UI se actualiza automáticamente** → TicketCard

## 🧪 Testing en Desarrollo

### Panel de Pruebas Incluido
- ✅ Crear ticket aleatorio con un clic
- ✅ Verificar conectividad del backend  
- ✅ Ver proceso completo end-to-end
- ✅ Notificaciones de éxito/error

### Tickets de Ejemplo
```javascript
const testTickets = [
    "Mi aplicación se cuelga constantemente, esto es muy frustrante",
    "¿Podrían ayudarme con la configuración de mi cuenta? Gracias", 
    "Excelente servicio, muchas gracias por la ayuda rápida",
    "Necesito cancelar mi suscripción, el cobro fue duplicado"
];
```

## 🚀 Despliegue

### Variables de Producción
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_key
VITE_API_BASE_URL=https://your-backend-api.com/api/v1
```

### Build para Producción
```bash
npm run build
# Archivos en dist/
```

---

**Desarrollado para VIVETORI** - Frontend que demuestra integración completa con IA y tiempo real.
