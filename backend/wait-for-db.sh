#!/bin/bash

echo "Esperando o database ficar pronto..."
sleep 2
echo "Continuando para migrations..."

npm run typeorm migration:run -- -d ./src/data-source

npm run dev
