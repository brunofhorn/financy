#!/bin/sh
set -e

echo "Aguardando banco de dados..."
node <<'NODE'
const net = require("node:net");

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL não definida.");
  process.exit(1);
}

const url = new URL(databaseUrl);
const host = url.hostname;
const port = Number(url.port || 5432);
const deadline = Date.now() + 60_000;

function attempt() {
  const socket = net.createConnection({ host, port });
  socket.setTimeout(2_000);

  socket.on("connect", () => {
    socket.end();
    process.exit(0);
  });

  socket.on("timeout", () => {
    socket.destroy();
  });

  socket.on("error", retry);
  socket.on("close", retry);
}

let done = false;
function retry() {
  if (done) return;
  if (Date.now() > deadline) {
    done = true;
    console.error(`Banco indisponível em ${host}:${port}.`);
    process.exit(1);
  }
  setTimeout(attempt, 1_000);
}

attempt();
NODE

echo "Aplicando migrations..."
npx prisma migrate deploy

if [ "$RUN_SEED" = "true" ]; then
  echo "Executando seed..."
  npm run prisma:seed
fi

echo "Iniciando backend..."
npm start

