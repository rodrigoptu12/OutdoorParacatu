#!/bin/bash
# Script para restaurar backup do banco de dados

if [ -z "$1" ]; then
    echo "Uso: ./restore.sh <arquivo-backup.sql.gz>"
    exit 1
fi

BACKUP_FILE=$1

# Descomprimir se necessário
if [[ $BACKUP_FILE == *.gz ]]; then
    gunzip -c $BACKUP_FILE | docker-compose exec -T postgres psql -U outdoor_user outdoor_rental
else
    docker-compose exec -T postgres psql -U outdoor_user outdoor_rental < $BACKUP_FILE
fi

echo "Backup restaurado de: $BACKUP_FILE"