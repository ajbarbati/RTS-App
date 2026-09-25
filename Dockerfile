FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# prisma.config.ts requires DATABASE_URL even though generate doesn't connect
RUN DATABASE_URL=postgresql://build:build@localhost:5432/build npm run build
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
