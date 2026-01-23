# Stage 1: Build
FROM oven/bun:1-alpine as build

WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build arguments for ALL required environment variables
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY  
ARG VITE_API_BASE_URL

# Set environment variables for build
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Debug: Show what variables we received
RUN echo "🔍 Build-time Environment Variables:"
RUN echo "VITE_SUPABASE_URL: ${VITE_SUPABASE_URL:0:30}..."
RUN echo "VITE_SUPABASE_ANON_KEY: ${VITE_SUPABASE_ANON_KEY:+DEFINED}"
RUN echo "VITE_API_BASE_URL: ${VITE_API_BASE_URL}"

# Build the application
RUN bun run build

# Stage 2: Production
FROM nginx:alpine

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Create nginx config template
RUN echo 'server { \
    listen $PORT; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf.template

# Copy startup script
COPY <<'EOF' /docker-entrypoint.sh
#!/bin/sh
set -e
envsubst '$$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf
exec nginx -g 'daemon off;'
EOF

RUN chmod +x /docker-entrypoint.sh

EXPOSE $PORT

CMD ["/docker-entrypoint.sh"]