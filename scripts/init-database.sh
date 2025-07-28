# scripts/init-database.sh (CORRIGIDO)
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
TABLE_COUNT=$(docker-compose exec -T postgres psql -U outdoor_user -d outdoor_rental -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null | xargs)

if [ "$TABLE_COUNT" = "0" ] || [ -z "$TABLE_COUNT" ]; then
  echo "📝 Criando tabelas do banco de dados..."
  if [ -f "./docker/init-db/01-schema.sql" ]; then
    docker-compose exec -T postgres psql -U outdoor_user -d outdoor_rental < ./docker/init-db/01-schema.sql
    echo "✅ Tabelas criadas com sucesso!"
  else
    echo "⚠️ Arquivo schema.sql não encontrado"
  fi
else
  echo "✅ Tabelas já existem!"
fi

# Executar seed apenas se não estivermos em um processo de reset
if [ "$SKIP_SEED" != "true" ]; then
  echo "🌱 Executando seed..."
  docker-compose exec backend npm run seed
fi

echo "🎉 Banco de dados inicializado com sucesso!"

# ==========================================

# scripts/reset-database.sh (CORRIGIDO)
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

echo "🗑️  Removendo volumes do PostgreSQL..."
# Tenta remover com diferentes nomes possíveis
docker volume rm outdoor_postgres_data 2>/dev/null || \
docker volume rm outdoor-rental-backend_postgres_data 2>/dev/null || \
docker volume rm outdoor_outdoor_postgres_data 2>/dev/null || \
echo "⚠️ Volume do PostgreSQL pode não existir"

echo "🚀 Iniciando containers novamente..."
docker-compose up -d

echo "⏳ Aguardando serviços iniciarem..."
sleep 15

echo "🔄 Inicializando banco de dados..."
# Definir variável para pular seed automático
export SKIP_SEED=true
./scripts/init-database.sh

# Agora executar seed manualmente
echo "🌱 Executando seed..."
docker-compose exec backend npm run seed

echo "✅ Banco de dados resetado com sucesso!"

# ==========================================

# scripts/setup.sh (NOVO)
#!/bin/bash
# Script para setup inicial completo

echo "🚀 Iniciando setup do projeto..."

# Verificar se o .env existe
if [ ! -f .env ]; then
  echo "📄 Criando arquivo .env..."
  if [ -f .env.example ]; then
    cp .env.example .env
    echo "✅ Arquivo .env criado baseado em .env.example"
  else
    echo "⚠️ Arquivo .env.example não encontrado"
  fi
fi

# Dar permissões aos scripts
echo "🔧 Configurando permissões dos scripts..."
chmod +x ./scripts/*.sh

# Build das imagens
echo "🏗️  Construindo imagens Docker..."
docker-compose build --no-cache

# Iniciar serviços
echo "🚀 Iniciando serviços..."
docker-compose up -d

echo "⏳ Aguardando serviços iniciarem..."
sleep 15

# Inicializar banco
echo "🗄️ Inicializando banco de dados..."
./scripts/init-database.sh

echo "✅ Setup concluído com sucesso!"
echo ""
echo "🌐 Serviços disponíveis:"
echo "  Frontend:     http://localhost:3000"
echo "  Backend:      http://localhost:3333"
echo "  pgAdmin:      http://localhost:5050"
echo ""
echo "📧 Credenciais de acesso:"
echo "  Email: admin@outdoors.com"
echo "  Senha: admin123"