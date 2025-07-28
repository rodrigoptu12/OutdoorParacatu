.PHONY: help build up down restart logs shell clean init reset setup quick-up

help:
	@echo "🏗️  Sistema de Aluguel de Outdoors - Comandos Docker"
	@echo "════════════════════════════════════════════════════"
	@echo "📦 Setup e Build:"
	@echo "  make setup     - Configuração inicial completa"
	@echo "  make build     - Construir todas as imagens"
	@echo ""
	@echo "🚀 Gerenciamento de Containers:"
	@echo "  make up        - Iniciar todos os serviços (com init)"
	@echo "  make quick-up  - Iniciar serviços sem init"
	@echo "  make down      - Parar todos os serviços"
	@echo "  make restart   - Reiniciar todos os serviços"
	@echo ""
	@echo "📊 Monitoramento:"
	@echo "  make status    - Ver status dos serviços"
	@echo "  make logs      - Ver logs de todos os serviços"
	@echo "  make log-back  - Ver logs apenas do backend"
	@echo "  make log-front - Ver logs apenas do frontend"
	@echo "  make log-db    - Ver logs apenas do banco"
	@echo ""
	@echo "🔧 Desenvolvimento:"
	@echo "  make shell-back  - Acessar shell do backend"
	@echo "  make shell-front - Acessar shell do frontend"
	@echo "  make psql        - Acessar PostgreSQL"
	@echo ""
	@echo "🗄️  Banco de Dados:"
	@echo "  make init      - Inicializar banco de dados"
	@echo "  make seed      - Executar seed no banco"
	@echo "  make reset     - Resetar banco de dados"
	@echo "  make backup    - Fazer backup do banco"
	@echo ""
	@echo "🧹 Limpeza:"
	@echo "  make clean     - Limpar volumes e imagens"
	@echo "  make reset-all - Resetar tudo (⚠️  cuidado!)"
	@echo ""
	@echo "🌐 Acesso aos Serviços:"
	@echo "  Frontend:     http://localhost:3000"
	@echo "  Backend:      http://localhost:3333"
	@echo "  pgAdmin:      http://localhost:5050"
	@echo "  Redis:        localhost:6379"

# Setup inicial completo
setup:
	@echo "🚀 Executando setup inicial..."
	@chmod +x ./scripts/*.sh
	@./scripts/setup.sh

# Build de todas as imagens
build:
	@echo "🏗️  Construindo imagens Docker..."
	docker-compose build --no-cache

# Subir todos os serviços COM inicialização
up:
	@echo "🚀 Iniciando serviços..."
	docker-compose up -d
	@echo "⏳ Aguardando serviços iniciarem..."
	@sleep 15
	@make init

# Subir serviços SEM inicialização (mais rápido)
quick-up:
	@echo "🚀 Iniciando serviços (modo rápido)..."
	docker-compose up -d

# Parar todos os serviços
down:
	@echo "🛑 Parando serviços..."
	docker-compose down

# Reiniciar serviços
restart:
	@echo "🔄 Reiniciando serviços..."
	docker-compose restart

# Ver logs de todos os serviços
logs:
	docker-compose logs -f

# Status dos serviços
status:
	@echo "📊 Status dos serviços:"
	@echo "════════════════════════"
	@docker-compose ps
	@echo ""
	@echo "🔍 Health checks:"
	@docker-compose exec -T postgres pg_isready -U outdoor_user -d outdoor_rental > /dev/null 2>&1 && echo "✅ PostgreSQL: OK" || echo "❌ PostgreSQL: ERRO"
	@curl -s http://localhost:3333/api/health > /dev/null 2>&1 && echo "✅ Backend: OK" || echo "❌ Backend: ERRO"
	@curl -s http://localhost:3000 > /dev/null 2>&1 && echo "✅ Frontend: OK" || echo "❌ Frontend: ERRO"

# Logs específicos
log-back:
	docker-compose logs -f backend

log-front:
	docker-compose logs -f frontend

log-db:
	docker-compose logs -f postgres

log-pgadmin:
	docker-compose logs -f pgadmin

# Shells
shell-back:
	docker-compose exec backend sh

shell-front:
	docker-compose exec frontend sh

psql:
	docker-compose exec postgres psql -U outdoor_user -d outdoor_rental

# Banco de dados - SEM LOOP
init:
	@echo "🗄️  Inicializando banco de dados..."
	@chmod +x ./scripts/init-database.sh
	@./scripts/init-database.sh

seed:
	@echo "🌱 Executando seed..."
	docker-compose exec backend npm run seed

reset:
	@echo "🔄 Resetando banco de dados..."
	@chmod +x ./scripts/reset-database.sh
	@./scripts/reset-database.sh

backup:
	@echo "💾 Fazendo backup..."
	@mkdir -p backups
	@docker-compose exec -T postgres pg_dump -U outdoor_user outdoor_rental | gzip > backups/outdoor_rental_$(shell date +%Y%m%d_%H%M%S).sql.gz
	@echo "✅ Backup criado em backups/"

# Limpeza
clean:
	@echo "🧹 Limpando volumes e imagens..."
	docker-compose down -v
	docker system prune -af

reset-all:
	@echo "⚠️  ATENÇÃO: Isso vai apagar TODOS os dados!"
	@echo "Pressione Ctrl+C para cancelar ou Enter para continuar..."
	@read
	@make clean
	@make setup

# Desenvolvimento
dev:
	@echo "👨‍💻 Modo desenvolvimento..."
	docker-compose up --build

# Instalar dependências
install-back:
	docker-compose exec backend npm install

install-front:
	docker-compose exec frontend npm install

# Testes
test-back:
	docker-compose exec backend npm test

test-front:
	docker-compose exec frontend npm test