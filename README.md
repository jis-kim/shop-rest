# shop-rest

사용자의 유형에 따라 다른 금액으로 상품 데이터를 보내주는 REST api

## Quick Start

- .env 설정

  - .env.sample을 복사하여 .env 파일을 생성하고 아래 예시를 참고하여 환경변수를 설정합니다.

  ```
  # node environment 설정, production 또는 development
  NODE_ENV=production
  # 서버 포트, 기본값은 3000
  APP_PORT=3000

  # 데이터베이스 호스트 - docker-compose.yml에 설정한 database 컨테이너 이름으로 설정
  DB_HOST=shop-db # 현재 compose file에 설정된 컨테이너 이름
  # 데이터베이스 유저
  DB_USER=
  # 데이터베이스 비밀번호
  DB_PASSWORD=1234
  # 데이터베이스 포트
  DB_PORT=5432
  # 데이터베이스 이름
  DB_NAME=shop

  # jwt secret key
  ACCESS_TOKEN_SECRET=

  ```

- `docker compose up -d --build`

## docker 를 사용하지 않는 경우

- `pnpm install`
- `pnpm run build`
- `pnpm start:prod`

## DB table 생성

- `psql -h ${DB_HOST} -U ${DB_USER} -d ${DB_NAME} -f ./database/init.sql`
