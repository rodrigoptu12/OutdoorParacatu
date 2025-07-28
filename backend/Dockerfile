FROM node:18-alpine

# Instalar dependências do sistema
RUN apk add --no-cache python3 make g++

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production && \
    npm cache clean --force
RUN npm install -g nodemon
COPY scripts/wait-for.sh /app/scripts/wait-for.sh
RUN chmod +x /app/scripts/wait-for.sh


# Copiar código fonte
COPY . .

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Mudar propriedade dos arquivos
RUN chown -R nodejs:nodejs /app

# Usar usuário não-root
USER nodejs

# Expor porta
EXPOSE 3333

# Comando padrão
CMD ["node", "server.js"]

