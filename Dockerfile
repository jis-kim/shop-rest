FROM node:20.10-alpine AS base
WORKDIR /usr/app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS prod-deps
COPY package.json .
COPY pnpm-lock.yaml .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM base
ENV NODE_ENV=production
COPY --from=prod-deps /usr/app/node_modules /usr/app/node_modules
COPY --from=build /usr/app/dist /usr/app/dist

# 애플리케이션 디렉토리의 소유권을 node 사용자로 변경
RUN chown -R node:node /usr/app

# node 사용자로 전환
USER node

# 애플리케이션 실행
CMD ["node", "dist/main"]
