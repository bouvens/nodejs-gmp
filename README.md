# Node.js Sample Project

With Express, TypeScript, Docker, logging, error handling, and 3-layer architecture

## Bulletproof Architecture

Source: https://softwareontheroad.com/ideal-nodejs-project-structure/

## How To Run

```bash
git clone https://github.com/bouvens/nodejs-gmp.git
cd nodejs-gmp
npm install
```

Create a `.env` file with at least one parameter: `DB_URI` for connecting to PostgreSQL.

```bash
npm run start
```

## Docker
Execute the next commands:
```bash
docker build . -t <your username>/nodejs-gmp
docker run --env-file <path to the project>/.env -p <desired local port>:3000 -d <your username>/nodejs-gmp
```

or

```bash
docker-compose build
docker-compose up
```
