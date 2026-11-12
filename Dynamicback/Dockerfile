FROM node:20-bookworm-slim
WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --chown=node:node . .
USER node

EXPOSE 5000
CMD ["npm", "start"]
