#!/bin/bash
# Script para inicializar o banco de dados

echo "🔄 Aguardando PostgreSQL iniciar..."

# Aguardar o PostgreSQL estar pronto
until docker-compose exec -T postgres pg_isready -U outdoor_user -d outdoor_rental; do
  echo "⏳ PostgreSQL ainda não está pronto - aguardando..."
  sleep 2
done

echo "✅ PostgreSQL está pronto!"

# Verificar se as tabelas existem
TABLE_COUNT=$(docker-compose exec -T postgres psql -U outdoor_user -d outdoor_rental -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")

if [ "$TABLE_COUNT" -eq "0" ]; then
  echo "📝 Criando tabelas do banco de dados..."
  docker-compose exec -T postgres psql -U outdoor_user -d outdoor_rental -f /docker-entrypoint-initdb.d/01-schema.sql
  echo "✅ Tabelas criadas com sucesso!"
else
  echo "✅ Tabelas já existem!"
fi

# Executar seed
echo "🌱 Executando seed..."
docker-compose exec backend npm run seed

echo "🎉 Banco de dados inicializado com sucesso!"

# scripts/reset-database.sh
#!/bin/bash
# Script para resetar completamente o banco de dados

echo "⚠️  ATENÇÃO: Isso irá DELETAR todos os dados do banco!"
echo "Deseja continuar? (s/N)"
read -r resposta

if [ "$resposta" != "s" ]; then
  echo "Operação cancelada."
  exit 0
fi

echo "🔄 Parando containers..."
docker-compose down

echo "🗑️  Removendo volume do PostgreSQL..."
docker volume rm outdoor-rental-backend_postgres_data 2>/dev/null || true

echo "🚀 Iniciando containers novamente..."
docker-compose up -d

echo "⏳ Aguardando serviços iniciarem..."
sleep 10

echo "🔄 Inicializando banco de dados..."
./scripts/init-database.sh

echo "✅ Banco de dados resetado com sucesso!"