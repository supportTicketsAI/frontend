#!/bin/bash

# Script para ejecutar el frontend de VIVETORI AI Support Co-Pilot
# Autor: Esteban R.

echo "🚀 Iniciando Frontend AI Support Co-Pilot..."

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: Ejecuta este script desde el directorio frontend"
    exit 1
fi

# Verificar que existe el archivo .env
if [ ! -f ".env" ]; then
    echo "⚠️  Advertencia: Archivo .env no encontrado"
    echo "💡 Asegúrate de tener configuradas las variables de Supabase"
fi

# Verificar dependencias
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

# Ejecutar en modo desarrollo
echo "🔧 Ejecutando en modo desarrollo..."
echo "🌐 Frontend estará disponible en: http://localhost:5173"
echo "📋 Backend debe estar corriendo en: http://localhost:8000"
echo ""
echo "Presiona Ctrl+C para detener el servidor"
echo ""

npm run dev