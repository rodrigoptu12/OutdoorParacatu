.PHONY: help build up down restart logs shell clean init reset

help:
	@echo "Comandos disponíveis:"
	@echo "  make build    - Construir as imagens Docker"
	@echo "  make up       - Iniciar os containers"
	@echo "  make down     - Parar os containers"
	@echo "  make restart  - Reiniciar os containers"
	@echo "  make logs     - Ver logs dos containers"
	@echo "  make shell    - Acessar shell do backend"
	@echo "  make clean    - Limpar volumes e imagens"
	@echo "  make init     - Inicializar banco de dados"
	@echo "  make reset    - Resetar banco de dados"
	@echo "  make seed     - Executar seed no banco"
	@echo "  make psql     - Acessar PostgreSQL"

build:
	docker-compose build --no-cache

up:
	docker-compose up -d
	@echo "⏳ Aguardando serviços iniciarem..."
	@sleep 10
	@make init

down:
	docker-compose down

restart:
	docker-compose restart

logs:
	docker-compose logs -f

shell:
	docker-compose exec backend sh

clean:
	docker-compose down -v
	docker system prune -af

init:
	@chmod +x ./scripts/init-database.sh
	@./scripts/init-database.sh

reset:
	@chmod +x ./scripts/reset-database.sh
	@./scripts/reset-database.sh

seed:
	docker-compose exec backend npm run seed

psql:
	docker-compose exec postgres psql -U outdoor_user -d outdoor_rental

# Verificar status dos serviços
status:
	@echo "📊 Status dos serviços:"
	@docker-compose ps
	@echo "\n🔍 Health checks:"
	@docker-compose exec -T postgres pg_isready -U outdoor_user -d outdoor_rental && echo "✅ PostgreSQL: OK" || echo "❌ PostgreSQL: ERRO"
	@curl -s http://localhost:3333/api/health > /dev/null && echo "✅ Backend: OK" || echo "❌ Backend: ERRO"

# Ver logs específicos
log-db:
	docker-compose logs -f postgres

log-back:
	docker-compose logs -f backend

log-pgadmin:
	docker-compose logs -f pgadmin