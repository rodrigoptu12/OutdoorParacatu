# 🐳 Docker Setup - Sistema de Aluguel de Outdoors

## Início Rápido

1. **Clone o repositório e navegue até a pasta:**

```bash
git clone <seu-repositorio>
cd outdoor-rental-backend
```

2. **Copie o arquivo de ambiente:**

```bash
cp .env.example .env
```

3. **Inicie os containers:**

```bash
docker-compose up -d
```

4. **Execute o seed (primeira vez):**

```bash
docker-compose exec backend npm run seed
```

5. **Acesse os serviços:**

- API Backend: http://localhost:3333
- pgAdmin: http://localhost:5050
- Redis Commander: http://localhost:8081 (se adicionar)

## Comandos Úteis

### Usando Make

```bash
make up        # Iniciar containers
make down      # Parar containers
make logs      # Ver logs
make shell     # Acessar shell do backend
make seed      # Executar seed
make psql      # Acessar PostgreSQL
```

### Usando Docker Compose diretamente

```bash
# Iniciar em modo desenvolvimento
docker-compose up -d

# Ver logs
docker-compose logs -f backend

# Reiniciar um serviço
docker-compose restart backend

# Executar comandos no container
docker-compose exec backend npm run seed

# Parar tudo
docker-compose down

# Limpar tudo (incluindo volumes)
docker-compose down -v
```

## Ambientes

### Desenvolvimento

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

### Produção

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Backup e Restore

### Fazer backup

```bash
./scripts/backup.sh
```

### Restaurar backup

```bash
./scripts/restore.sh backups/outdoor_rental_20240101_120000.sql.gz
```

## Troubleshooting

### Container não inicia

```bash
# Ver logs detalhados
docker-compose logs backend

# Reconstruir imagem
docker-compose build --no-cache backend
```

### Problemas de permissão

```bash
# Ajustar permissões
sudo chown -R $USER:$USER .
```

### Limpar tudo e recomeçar

```bash
docker-compose down -v
docker system prune -af
docker-compose up -d --build
```
