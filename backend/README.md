# Backend - Sistema de Aluguel de Outdoors

## 🚀 Tecnologias Utilizadas

- Node.js
- Express.js
- PostgreSQL
- JWT para autenticação
- Bcrypt para criptografia
- Express Validator
- Helmet para segurança
- CORS
- Morgan para logging

## 📋 Pré-requisitos

- Node.js >= 14.x
- PostgreSQL >= 12.x
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório:

```bash
git clone <seu-repositorio>
cd outdoor-rental-backend
```

2. Instale as dependências:

```bash
npm install
```

3. Configure o banco de dados PostgreSQL e crie o banco:

```bash
psql -U postgres
CREATE DATABASE outdoor_rental;
```

4. Execute o script SQL para criar as tabelas:

```bash
psql -U postgres -d outdoor_rental -f src/database/schema.sql
```

5. Configure as variáveis de ambiente criando um arquivo `.env`:

```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/outdoor_rental
JWT_SECRET=sua_chave_secreta_aqui_muito_segura_2024
PORT=3333
NODE_ENV=development
```

6. Execute o seed para popular o banco com dados iniciais:

```bash
npm run seed
```

7. Inicie o servidor:

```bash
npm run dev
```

## 📚 Documentação da API

### Autenticação

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@outdoors.com",
  "senha": "admin123"
}
```

#### Registro (Admin)

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "novo@admin.com",
  "senha": "senha123",
  "nome": "Novo Admin"
}
```

### Rotas Públicas

#### Listar Outdoors com Disponibilidade

```http
GET /api/public/outdoors?data_inicio=2024-01-01&data_fim=2024-01-31
```

Se não fornecer as datas, retorna os próximos 30 dias.

### Rotas Protegidas (Requer Token JWT)

#### Headers necessários:

```http
Authorization: Bearer <seu-token-jwt>
```

#### Outdoors

##### Listar todos os outdoors

```http
GET /api/outdoors
```

##### Buscar outdoor por ID

```http
GET /api/outdoors/:id
```

##### Verificar datas disponíveis de um outdoor

```http
GET /api/outdoors/:id/disponibilidade?data_inicio=2024-01-01&data_fim=2024-01-31
```

##### Criar outdoor

```http
POST /api/outdoors
Content-Type: application/json

{
  "nome": "Novo Outdoor",
  "localizacao": "Rua Example, 123",
  "dimensoes": "9x3 metros",
  "preco_mensal": 5000.00,
  "foto_url": "https://example.com/foto.jpg",
  "descricao": "Descrição do outdoor"
}
```

##### Atualizar outdoor

```http
PUT /api/outdoors/:id
Content-Type: application/json

{
  "nome": "Outdoor Atualizado",
  "localizacao": "Nova localização",
  "dimensoes": "10x4 metros",
  "preco_mensal": 6000.00,
  "foto_url": "https://example.com/nova-foto.jpg",
  "descricao": "Nova descrição",
  "ativo": true
}
```

##### Deletar outdoor

```http
DELETE /api/outdoors/:id
```

#### Disponibilidade

##### Verificar disponibilidade por período

```http
GET /api/disponibilidade?data_inicio=2024-01-01&data_fim=2024-01-31
```

##### Verificar disponibilidade de um outdoor

```http
GET /api/disponibilidade/outdoor/:outdoorId
```

##### Verificar se outdoor está disponível em período específico

```http
GET /api/disponibilidade/check/:outdoorId?data_inicio=2024-01-01&data_fim=2024-01-15
```

Retorno:
```json
{
  "disponivel": true,
  "conflitos": [],
  "mensagem": "Outdoor disponível para o período selecionado"
}
```

##### Criar reserva

```http
POST /api/disponibilidade/reservar
Content-Type: application/json

{
  "outdoor_id": 1,
  "data_inicio": "2024-01-01",
  "data_fim": "2024-01-15",
  "cliente_nome": "Nome do Cliente",
  "cliente_contato": "(11) 98765-4321",
  "cliente_email": "cliente@email.com",
  "observacoes": "Observações da reserva"
}
```

Retorno:
```json
{
  "message": "Reserva criada com sucesso",
  "reserva": {
    "id": 1,
    "outdoor_id": 1,
    "data_inicio": "2024-01-01",
    "data_fim": "2024-01-15",
    "cliente_nome": "Nome do Cliente",
    "valor_total": 2500.00,
    "dias": 15,
    "valor_diario": 166.67
  }
}
```

##### Cancelar reserva

```http
DELETE /api/disponibilidade/cancelar/:id
```

##### Relatório de ocupação

```http
GET /api/disponibilidade/relatorio?data_inicio=2024-01-01&data_fim=2024-12-31
```

Retorno:
```json
{
  "periodo": {
    "inicio": "2024-01-01",
    "fim": "2024-12-31"
  },
  "total_outdoors": 5,
  "total_dias_ocupados": 450,
  "total_dias_disponiveis": 1375,
  "taxa_ocupacao_media": 24.66,
  "detalhes_por_outdoor": [
    {
      "outdoor_id": 1,
      "outdoor_nome": "Outdoor Avenida Principal",
      "dias_ocupados": 120,
      "taxa_ocupacao": 32.88
    }
  ]
}
```

## 🛡️ Segurança

- Autenticação JWT em todas as rotas administrativas
- Senhas criptografadas com Bcrypt
- Validação de entrada com Express Validator
- Headers de segurança com Helmet
- CORS configurado

## 📁 Estrutura do Projeto

```
outdoor-rental-backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── outdoorController.js
│   │   └── disponibilidadeController.js
│   ├── database/
│   │   └── schema.sql
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── models/
│   │   ├── Disponibilidade.js
│   │   ├── Outdoor.js
│   │   └── Usuario.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── disponibilidadeRoutes.js
│   │   ├── index.js
│   │   ├── outdoorRoutes.js
│   │   └── publicRoutes.js
│   └── seeders/
│       └── seed.js
├── .env
├── .gitignore
├── package.json
├── README.md
└── server.js
```

## 💰 Sistema de Preços

O sistema calcula o valor do aluguel baseado em dias:
- O preço mensal do outdoor é dividido por 30 para obter o valor diário
- O valor total é calculado multiplicando o valor diário pelo número de dias
- Exemplo: Outdoor de R$ 5.000/mês = R$ 166,67/dia

## 🚀 Deploy

### Heroku

1. Instale o Heroku CLI
2. Crie um app no Heroku:

```bash
heroku create seu-app-outdoor-backend
```

3. Adicione o addon do PostgreSQL:

```bash
heroku addons:create heroku-postgresql:hobby-dev
```

4. Configure as variáveis de ambiente:

```bash
heroku config:set JWT_SECRET=sua_chave_secreta_producao
heroku config:set NODE_ENV=production
```

5. Deploy:

```bash
git push heroku main
```

6. Execute o seed em produção:

```bash
heroku run npm run seed
```

### Railway

1. Conecte seu repositório GitHub ao Railway
2. Adicione o serviço PostgreSQL
3. Configure as variáveis de ambiente
4. Deploy automático a cada push

## 🔍 Testes

Para testar a API, você pode usar:

- Postman
- Insomnia
- Thunder Client (VS Code)
- curl

Exemplo de teste com curl:

```bash
# Login
curl -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@outdoors.com","senha":"admin123"}'

# Listar outdoors (use o token retornado no login)
curl -X GET http://localhost:3333/api/outdoors \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# Verificar disponibilidade
curl -X GET "http://localhost:3333/api/disponibilidade/check/1?data_inicio=2024-02-01&data_fim=2024-02-15" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# Criar reserva
curl -X POST http://localhost:3333/api/disponibilidade/reservar \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "outdoor_id": 1,
    "data_inicio": "2024-02-01",
    "data_fim": "2024-02-15",
    "cliente_nome": "Empresa Teste",
    "cliente_contato": "(11) 98765-4321",
    "cliente_email": "teste@empresa.com"
  }'
```

## 📝 Licença

Este projeto está sob a licença MIT.
