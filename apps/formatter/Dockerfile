# Stage 1: Build Stage
FROM oven/bun:latest AS build

ARG TURBO_TEAM

ENV TURBO_TEAM=$TURBO_TEAM
ENV NODE_ENV=production

WORKDIR /app

COPY package.json ./
COPY bun.lockb ./

COPY apps/formatter/package.json ./apps/formatter/package.json

COPY . .

RUN --mount=type=secret,id=DATABASE_URL --mount=type=secret,id=TURBO_TOKEN \
    DATABASE_URL="$(cat /run/secrets/DATABASE_URL)" TURBO_TOKEN="$(cat /run/secrets/TURBO_TOKEN)" bun install

RUN --mount=type=secret,id=DATABASE_URL --mount=type=secret,id=TURBO_TOKEN \
    DATABASE_URL="$(cat /run/secrets/DATABASE_URL)" TURBO_TOKEN="$(cat /run/secrets/TURBO_TOKEN)" bun run build:formatter

# Stage 2: Final Stage
FROM oven/bun:latest

WORKDIR /app

COPY --from=build /app/apps/formatter/.output .output

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

EXPOSE 3000

CMD ["bun", "run", ".output/server/index.mjs"]
