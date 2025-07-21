#!/bin/sh
# wait-for-postgres.sh

set -e

host="$1"
shift
cmd="$@"

until PGPASSWORD=$DB_PASSWORD psql -h "$host" -U "$DB_USER" -d "$DB_NAME" -c '\q'; do
  >&2 echo "Postgres está indisponível - aguardando"
  sleep 1
done

>&2 echo "Postgres está pronto - executando comando"
exec $cmd