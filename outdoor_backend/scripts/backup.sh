#!/bin/bash
# Script para backup do banco de dados

BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/outdoor_rental_$TIMESTAMP.sql"

# Criar diretório de backup se não existir
mkdir -p $BACKUP_DIR

# Executar backup
docker-compose exec -T postgres pg_dump -U outdoor_user outdoor_rental > $BACKUP_FILE

# Comprimir backup
gzip $BACKUP_FILE

echo "Backup criado: $BACKUP_FILE.gz"

# Limpar backups antigos (manter apenas os últimos 7 dias)
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete