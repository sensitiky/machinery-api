# Usar la imagen oficial de Bun
FROM oven/bun:latest

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar package.json y bun.lockb primero para aprovechar el cache de Docker
COPY package.json bun.lockb /app/

# Copiar variables de entorno
COPY .env /app

# Instalar dependencias utilizando Bun
RUN bun install

# Copiar el resto de los archivos
COPY . /app

# Exponer el puerto en el que corre la aplicación NestJS
EXPOSE 3000

# Comando para correr la aplicación en modo de desarrollo
CMD ["bun", "run", "start:dev"]
