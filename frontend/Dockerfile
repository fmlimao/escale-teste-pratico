FROM node:20-alpine

# Diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o resto dos arquivos
COPY . .

# Expõe a porta 5173
EXPOSE 5173

# Inicia o servidor de desenvolvimento
CMD ["npm", "run", "dev"]
