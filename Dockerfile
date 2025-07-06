# 빌드 스테이지
FROM node:20-alpine3.20 AS build

# [해결책] 기존 npm을 완전히 삭제하고 최신 버전으로 재설치
RUN rm -rf /usr/local/lib/node_modules/npm && \
    npm install -g npm@latest

WORKDIR /app

# 나머지 패키지 설치
RUN apk update && \
    apk upgrade && \
    apk add --no-cache curl

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .
RUN npm run build

FROM gcr.io/distroless/static-debian12:latest

COPY --from=build /app/dist /app
COPY --from=busybox:1.36.1-uclibc /bin/busybox /bin/busybox

WORKDIR /app
EXPOSE 80
USER nonroot
ENTRYPOINT ["/bin/busybox", "httpd", "-f", "-p", "80"]