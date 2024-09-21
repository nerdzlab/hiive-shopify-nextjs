FROM arm64v8/node:20

WORKDIR /usr/src/app

RUN npm install pnpm@8

COPY . .

RUN pnpm install

ENV NODE_OPTIONS=--max-old-space-size=8192

RUN pnpm build

RUN pnpm install shopify

EXPOSE 3000

CMD ["sh", "/usr/src/app/entrypoint.sh"]
