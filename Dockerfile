# Soul-D. website + CMS — ek hi container me (koi dependency nahi)
FROM node:20-alpine
WORKDIR /app
COPY . .
ENV PORT=8000
EXPOSE 8000
CMD ["node", "server/server.js"]
